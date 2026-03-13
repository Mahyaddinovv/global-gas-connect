import { useLanguage } from "@/i18n/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t bg-card py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <span>&copy; {new Date().getFullYear()} CoolGas Trading. {t("footerRights")}</span>
        <div className="flex gap-6">
          <a href="#about" className="hover:text-foreground transition-colors">{t("navAbout")}</a>
          <a href="#services" className="hover:text-foreground transition-colors">{t("navServices")}</a>
          <a href="#contact" className="hover:text-foreground transition-colors">{t("navContact")}</a>
        </div>
      </div>
      <div className="mt-6 py-3 bg-muted/60 text-center text-xs text-muted-foreground">
        Built in AI Web Session 2026 | ClearContent CMS | Student: Mahammad Mahyaddinov | Team: TeamMaga
      </div>
    </footer>
  );
};

export default Footer;
