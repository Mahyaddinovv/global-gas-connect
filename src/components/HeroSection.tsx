import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
      style={{ background: "var(--hero-gradient)" }}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
        backgroundSize: "40px 40px"
      }} />

      <div className="relative container mx-auto px-4 py-20 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
          Reliable Refrigerant Gas Trading Partner
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/85 mb-10 leading-relaxed">
          We supply high-quality refrigerant gases for HVAC, refrigeration, and industrial
          applications, working with partners across international markets.
        </p>
        <Button variant="hero" size="lg" onClick={scrollToContact} className="text-base px-8 py-6">
          Contact Us
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
