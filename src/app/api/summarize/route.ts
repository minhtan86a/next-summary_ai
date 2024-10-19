import { NextRequest } from "next/server";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { getAuthToken } from "@/data/services/get-token";

import { fetchTranscript } from "@/lib/youtube-transcript";

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

export async function POST(req: NextRequest) {
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

  console.log("FROM OUR ROUTE HANDLER:", req.body);
  const body = await req.json();
  const videoId = body.videoId;

  let transcript: Awaited<ReturnType<typeof fetchTranscript>>;

  try {
    transcript = await fetchTranscript(videoId);
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }

  const transformedData = transformData(transcript);
  console.log("Transcript:", transformedData);

  try {
    return new Response(
      JSON.stringify({ data: "return from our handler", error: null }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    if (error instanceof Error)
      return new Response(JSON.stringify({ error: error }));
    return new Response(JSON.stringify({ error: "Unknown error" }));
  }
}
