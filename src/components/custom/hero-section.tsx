import Link from "next/link";
import { getUserMeLoader } from "@/data/services/get-user-me-loader";
import { StrapiImage } from "./strapi-image";

interface Image {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
}

interface Link {
  id: number;
  url: string;
  text: string;
}

interface HeroSectionProps {
  id: number;
  documentId: string;
  __component: string;
  heading: string;
  subHeading: string;
  image: Image;
  link: Link;
}
export async function HeroSection({
  data,
}: {
  readonly data: HeroSectionProps;
}) {
  //console.dir(data, { depth: null });
  const user = await getUserMeLoader();
  const { heading, subHeading, image, link } = data;

  const userLoggedIn = user.ok;
  const linkUrl = userLoggedIn ? "/dashboard" : link.url;

  return (
    <header className="relative h-[600px] overflow-hidden">
      <StrapiImage
        alt="Background"
        className="absolute inset-0 object-cover w-full h-full"
        height={1080}
        src={image.url}
        width={1920}
      />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black bg-opacity-20">
        <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
          {heading}
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl">{subHeading}</p>
        <Link
          className="mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100"
          href={linkUrl}
        >
          {userLoggedIn ? "Dashboard" : link.text}
        </Link>
      </div>
    </header>
  );
}
