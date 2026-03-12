import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/LanguageContext";
import type { Lang } from "@/i18n/translations";

const languages: Lang[] = ["EN", "ET", "RU", "LV"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { label: t("navAbout"), href: "#about" },
    { label: t("navServices"), href: "#services" },
    { label: t("navContact"), href: "#contact" },
  ];

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <span className="font-heading text-lg font-bold text-primary tracking-tight">
          CoolGas Trading
        </span>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-1 ml-4 border-l pl-4">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card border-b px-4 pb-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
            >
              {link.label}
            </button>
          ))}
          <div className="flex items-center gap-1 pt-2 border-t">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs font-semibold px-2 py-1 rounded transition-colors ${
                  lang === l
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
