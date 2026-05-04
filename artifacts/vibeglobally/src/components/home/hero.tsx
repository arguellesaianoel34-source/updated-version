import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Calendar, Headphones } from "lucide-react";
import heroImg from "@/assets/images/hero.png";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

const StatIcons = [Phone, Calendar, Headphones];

interface HeroContent {
  badgeText?: string;
  headline?: string;
  headlineAccent?: string;
  subheadline?: string;
  tagline?: string;
  stats?: { value: string; label: string }[];
}

export function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const { data } = useGetSiteContent("hero", {
    query: { queryKey: getGetSiteContentQueryKey("hero"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as HeroContent;
  const badgeText = content.badgeText ?? "#VibeAlong - Telemarketing & Virtual Assistance Agency";
  const headline = content.headline ?? "Why";
  const headlineAccent = (content.headlineAccent ?? "US").endsWith("?") 
    ? (content.headlineAccent ?? "US") 
    : `${(content.headlineAccent ?? "US")}?`;
  const subheadline = content.subheadline ?? "VibeGlobally is a full-service outsourcing agency providing experts in telemarketing, customer support, virtual assistance, SEO, email marketing, social media management, data entry, and more so you can focus on growing your business while we handle execution, support, and sales.";
  const tagline = content.tagline ?? "Your hub for seamless connections between business leaders and potential partners. Join us on a journey where connections thrive and business possibilities unfold.";
  const stats = content.stats || [
    { value: "200+", label: "Calls Per Agent / Day" },
    { value: "40%+", label: "Avg. Conversion Lift" },
    { value: "3+", label: "Years of Operations" },
  ];

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[95vh] flex flex-col justify-center pt-20 overflow-hidden bg-background">
      {/* Background Parallax */}
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        style={{ y, opacity }}
      >
        <img
          src={heroImg}
          alt="Operations Center"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/95 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      </motion.div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-16">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-sm font-medium mb-6"
          >
            <Phone size={14} />
            <span>{badgeText}</span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-foreground leading-[1.05] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {headline} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
              {headlineAccent}
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {subheadline}
          </motion.p>

          <motion.p
            className="text-base text-muted-foreground/70 max-w-xl mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            {tagline}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 h-14 px-8 text-lg font-semibold group"
              onClick={scrollToContact}
              data-testid="button-contact-agency"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 px-8 text-lg font-semibold border-border hover:bg-card hover:text-primary transition-colors"
              onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
              data-testid="button-explore-services"
            >
              Explore Services
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
