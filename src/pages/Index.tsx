import { useEffect, type CSSProperties } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { mergeBlocks, useBlocks, type CmsBlockRow, type CmsBlockSection } from "@/integrations/supabase/cmsBlocks";
import { useHomeSeo } from "@/integrations/supabase/cmsSeo";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

const Index = () => {
  const { t } = useLanguage();
  const { data } = useHomeSeo();
  const { data: blockRows } = useBlocks();

  useEffect(() => {
    const fallbackTitle = "CoolGas Trading - " + t("heroTitle");
    const title = data?.title ?? fallbackTitle;
    const desc = data?.meta_description ?? t("heroText");

    document.title = title;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", desc);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", desc);
    }
  }, [data, t]);

  const blocks = mergeBlocks(blockRows);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        {blocks.filter((block) => block.visible).map((block) => (
          <PageBlock key={block.section} block={block} />
        ))}
      </main>
      <Footer />
    </div>
  );
};

const sectionAlignmentClass: Record<CmsBlockRow["alignment"], string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const PageBlock = ({ block }: { block: CmsBlockRow }) => {
  const style: CSSProperties = {
    background: block.bg_value,
    paddingTop: `${block.padding}px`,
    paddingBottom: `${block.padding}px`,
  };

  const contentClassName = cn(sectionAlignmentClass[block.alignment]);

  const componentMap: Record<CmsBlockSection, JSX.Element> = {
    hero: <HeroSection style={style} contentClassName={contentClassName} />,
    about: <AboutSection style={style} contentClassName={contentClassName} />,
    offers: <ServicesSection style={style} contentClassName={contentClassName} />,
    contact: <ContactSection style={style} contentClassName={contentClassName} />,
  };

  return componentMap[block.section];
};

export default Index;
