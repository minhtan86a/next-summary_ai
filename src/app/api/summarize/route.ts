import { NextRequest } from "next/server";

//import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import { fetchTranscript } from "@/lib/youtube-transcript";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

function transformData(data: any[]) {
  let text = "";

  data.forEach((item) => {
    text += item.text + " ";
  });

  return {
    data: data,
    text: text.trim(),
  };
}

// const TEMPLATE = `
// INSTRUCTIONS:
//   For the this {text} complete the following steps.
//   Generate the title based on the content provided
//   Summarize the following content and include 5 key topics, writing in first person using normal tone of voice.

//   Write a youtube video description
//     - Include heading and sections.
//     - Incorporate keywords and key takeaways

//   Generate bulleted list of key points and benefits

//   Return possible and best recommended key words
// `;

//Version vietnamese
const TEMPLATE = `
Hướng dẫn: 
  Cho cái này {text} hoàn thành theo các bước sau.
  Tạo một tiêu đề dựa trên nội dung được cung cấp
  Tóm tắt nội dung sau và đưa vào 5 chủ đề chính, viết ở ngôi thứ nhất sử dụng giọng điệu bình thường.

  Viết mô tả video trên youtube
  - Bao gồm tiêu đề và các phần.
  - Kết hợp các từ khóa và nội dung chính

  Tạo danh sách các điểm chính và lợi ích theo dạng dấu đầu dòng

  Trả về các từ khóa có thể và được đề xuất tốt nhất
`;

async function generateSummary(content: string, template: string) {
  const prompt = PromptTemplate.fromTemplate(template);

  //OpenAI not work
  // const model = new ChatOpenAI({
  //   openAIApiKey: process.env.OPENAI_API_KEY,
  //   modelName: process.env.OPENAI_MODEL ?? "gpt-4-turbo-preview",
  //   temperature: process.env.OPENAI_TEMPERATURE
  //     ? parseFloat(process.env.OPENAI_TEMPERATURE)
  //     : 0.7,
  //   maxTokens: process.env.OPENAI_MAX_TOKENS
  //     ? parseInt(process.env.OPENAI_MAX_TOKENS)
  //     : 4000,
  // });
  // const outputParser = new StringOutputParser();
  // const chain = prompt.pipe(model).pipe(outputParser);

  //GoogleAI get GOOGLE_API_KEY from https://aistudio.google.com/app/apikey
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-pro",
    maxOutputTokens: 2048,
  });
  const outputParser = new StringOutputParser(); //get best string
  const chain = prompt.pipe(model).pipe(outputParser);

  try {
    // GoogleAI
    //const summary = await model.invoke([["human", content]]); //without chain
    const summary = await chain.invoke({ text: content }); //use chain
    return summary;
  } catch (error) {
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error.message }));
    return new Response(
      JSON.stringify({ error: "Failed to generate summary." })
    );
  }
}

export async function POST(req: NextRequest) {
  //console.log("FROM OUR ROUTE HANDLER:", req.body);

  const user = await getUserMeLoader();
  const token = await getAuthToken();

  if (!user.ok || !token)
    return new Response(
      JSON.stringify({ data: null, error: "Not authenticated" }),
      { status: 401 }
    );

  if (user.data.credits < 1)
    return new Response(
      JSON.stringify({
        data: null,
        error: "Insufficient credits",
      }),
      { status: 402 }
    );

  const body = await req.json();
  const { videoId } = body;

  let transcript: Awaited<ReturnType<typeof fetchTranscript>>;

  try {
    transcript = await fetchTranscript(videoId);

    const transformedData = transformData(transcript);
    //console.log("Transcript:", transformedData.text);

    //Use GoogleAi to summary
    let summary: Awaited<ReturnType<typeof generateSummary>>;
    summary = await generateSummary(transformedData.text, TEMPLATE);
    //console.log("GoogleAI :", summary);
    return new Response(JSON.stringify({ data: summary, error: null }));

    //Use this if AI not work
    // return new Response(
    //   JSON.stringify({ data: transformedData.text, error: null })
    // );
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }
}
