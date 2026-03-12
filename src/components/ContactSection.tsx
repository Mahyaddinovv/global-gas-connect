import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const ContactSection = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 max-w-xl">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
          Contact
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Interested in working with us? Fill out the form below and our team will get back to
          you within one business day to discuss your refrigerant supply needs.
        </p>

        {submitted ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-lg font-medium text-foreground">
              Thank you for your message. We will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-foreground mb-1.5">
                Company Name
              </label>
              <Input id="company" required placeholder="Your company" />
            </div>
            <div>
              <label htmlFor="contact-person" className="block text-sm font-medium text-foreground mb-1.5">
                Contact Person
              </label>
              <Input id="contact-person" required placeholder="Full name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <Input id="email" type="email" required placeholder="you@company.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">
                Message
              </label>
              <Textarea id="message" required placeholder="Tell us about your requirements…" rows={4} />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="consent" required />
              <label htmlFor="consent" className="text-sm text-muted-foreground leading-snug cursor-pointer">
                I agree to the processing of my personal data for the purpose of handling this inquiry.
              </label>
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send Request
            </Button>
          </form>
        )}
      </div>
    </section>
  );
};

export default ContactSection;
