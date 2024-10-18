import { getHomePageData } from "@/data/loaders";

import { HeroSection } from "@/components/custom/hero-section";
import { FeatureSection } from "@/components/custom/features-section";

const blockComponents = {
  "layout.hero-section": HeroSection,
  "layout.features-section": FeatureSection,
};

function blockRenderer(block: any) {
  //console.log(block.__component as keyof typeof blockComponents);
  const Component =
    blockComponents[block.__component as keyof typeof blockComponents];
  //console.log(Component);
  return Component ? <Component key={block.id} data={block} /> : null;
}

export default async function Home() {
  const strapiData = await getHomePageData();

  //console.dir(strapiData, { depth: null });

  const { blocks } = strapiData?.data || [];

  return <main>{blocks.map(blockRenderer)}</main>;
}
