import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { AboutModal } from "@/components/home/about-modal";

const NAV_LINKS = [
  { label: "Services", id: "services" },
  { label: "Tools", id: "tools" },
  { label: "Sample Calls", id: "sample-calls" },
  { label: "Clients", id: "clients" },
  { label: "Reviews", id: "testimonials" },
];

interface LogoContent {
  logoUrl?: string;
  logoText?: string;
  logoAccentText?: string;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  const { data: logoData, isError } = useGetSiteContent("logo", {
    query: { 
      queryKey: getGetSiteContentQueryKey("logo"), 
      refetchInterval: 15000,
      retry: false,
    },
  });

  const logoContent = (logoData?.content ?? {}) as LogoContent;
  const logoUrl = logoContent.logoUrl;
  const logoText = logoContent.logoText || "Vibe";
  const logoAccentText = logoContent.logoAccentText || "Globally";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setAboutModalOpen(true);
    setMobileMenuOpen(false);
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setMobileMenuOpen(false);
          }}
        >
          {logoUrl ? (
            <>
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="h-12 w-12 md:h-14 md:w-14 object-cover rounded-full group-hover:opacity-90 transition-opacity"
              />
              <span className="font-bold text-xl md:text-2xl tracking-tight text-foreground">
                {logoText}<span className="text-primary">{logoAccentText}</span>
              </span>
            </>
          ) : (
            <span className="font-bold text-2xl md:text-3xl tracking-tight text-foreground group-hover:text-primary transition-colors">
              {logoText}<span className="text-primary">{logoAccentText}</span>
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a
            href="#about"
            onClick={handleAboutClick}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            About
          </a>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Button
            onClick={handleContact}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-6"
          >
            Contact Us
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-1 shadow-xl"
        >
          <a
            href="#about"
            onClick={handleAboutClick}
            className="text-sm font-medium px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors cursor-pointer"
          >
            About
          </a>
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleNavClick(e, link.id)}
              className="text-sm font-medium px-3 py-2.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 mt-1 border-t border-border">
            <Button
              onClick={handleContact}
              className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
            >
              Contact Us
            </Button>
          </div>
        </motion.div>
      )}

      <AboutModal open={aboutModalOpen} onOpenChange={setAboutModalOpen} />
    </motion.header>
  );
}
