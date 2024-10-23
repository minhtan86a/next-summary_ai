import Link from "next/link";
import { getSummaries } from "@/data/loaders";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaginationComponent } from "@/components/custom/PaginationComponent ";
import { Search } from "@/components/custom/Search";

interface LinkCardProps {
  id: string;
  title: string;
  summary: string;
  documentId: string;
}

function LinkCard({ title, summary, documentId }: Readonly<LinkCardProps>) {
  return (
    <Link href={`/dashboard/summaries/${documentId}`}>
      <Card className="relative">
        <CardHeader>
          <CardTitle className="leading-8 text-pink-500">
            {title || "Video Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="w-full mb-4 leading-7">
            {summary.slice(0, 164) + " [read more]"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}

interface SearchParamsProps {
  searchParams?: {
    query?: string;
    page?: string;
  };
}
export default async function SummariesRoute({
  searchParams,
}: Readonly<SearchParamsProps>) {
  // this will gran our search params from the URL that we will pass to our getSummaries function
  const query = searchParams?.query ?? "";
  const currentPage = Number(searchParams?.page) || 1;
  const { data, meta } = await getSummaries(query, currentPage);
  const pageCount = meta.pagination.pageCount;

  //console.log(data);
  if (!data) return null;
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      <Search />
      <span>Query: {query}</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data.map((item: LinkCardProps) => (
          <LinkCard key={item.id} {...item} />
        ))}
      </div>
      <PaginationComponent pageCount={pageCount} />
    </div>
  );
}
