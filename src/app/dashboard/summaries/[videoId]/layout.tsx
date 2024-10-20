import dynamic from "next/dynamic";
import { extractYouTubeID } from "@/lib/utils";
import { getSummaryById } from "@/data/loaders";
import { notFound } from "next/navigation";

const NoSSR = dynamic(() => import("@/components/custom/YouTubePlayer"), {
  ssr: false,
});

export default async function SummarySingleRoute({
  params,
  children,
}: {
  readonly params: any;
  readonly children: React.ReactNode;
}) {
  const data = await getSummaryById(params.videoId);
  console.log(data); //no data 404
  if (data?.error?.status === 404) return notFound();
  const videoId = extractYouTubeID(data.videoId);

  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">{children}</div>
        <div className="col-span-2">
          <div>
            {/* <YouTubePlayer videoId={videoId} /> */}
            <NoSSR videoId={videoId} />
          </div>
        </div>
      </div>
    </div>
  );
}
