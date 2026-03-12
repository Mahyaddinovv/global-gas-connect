const Footer = () => (
  <footer className="border-t bg-card py-8">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>&copy; {new Date().getFullYear()} CoolGas Trading. All rights reserved.</span>
      <div className="flex gap-6">
        <a href="#about" className="hover:text-foreground transition-colors">About</a>
        <a href="#services" className="hover:text-foreground transition-colors">Services</a>
        <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
