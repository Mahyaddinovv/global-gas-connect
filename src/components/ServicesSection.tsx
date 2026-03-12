import { CheckCircle } from "lucide-react";

const services = [
  "Wholesale supply of HFC, HFO, and natural refrigerant gases",
  "Sourcing and procurement of R-410A, R-134a, R-32, R-404A and more",
  "Cross-border logistics and customs-compliant delivery",
  "F-Gas quota management and regulatory compliance support",
  "Bulk and cylinder packaging tailored to client needs",
  "Long-term supply agreements with competitive pricing",
  "Technical consultation on refrigerant selection and transition",
];

const ServicesSection = () => (
  <section id="services" className="py-20 md:py-28 section-alt">
    <div className="container mx-auto px-4 max-w-3xl">
      <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-8">
        What We Offer
      </h2>
      <ul className="space-y-4">
        {services.map((service) => (
          <li key={service} className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <span className="text-muted-foreground leading-relaxed">{service}</span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default ServicesSection;
