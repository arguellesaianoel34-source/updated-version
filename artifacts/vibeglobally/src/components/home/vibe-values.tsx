import { motion } from "framer-motion";
import valuesArt from "@/assets/images/values-art.png";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

interface ValueItem {
  letter: string;
  word: string;
  desc: string;
}

interface ValuesContent {
  headline?: string;
  headlineAccent?: string;
  description?: string;
  values?: ValueItem[];
}

const DEFAULT_VALUES: ValueItem[] = [
  { letter: "V", word: "Versatility", desc: "Adapting instantly to your tech stack, your processes, and your changing business needs." },
  { letter: "I", word: "Intensity", desc: "Operating with urgency and drive. We attack quotas and SLA targets relentlessly." },
  { letter: "B", word: "Brilliance", desc: "Smart problem solving. We don't just follow scripts; we optimize workflows." },
  { letter: "E", word: "Enthusiasm", desc: "High energy, positive culture. A team you actually enjoy working with every day." },
];

export function VibeValues() {
  const { data } = useGetSiteContent("values", {
    query: { queryKey: getGetSiteContentQueryKey("values"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as ValuesContent;
  const headline = content.headline ?? "The";
  const headlineAccent = content.headlineAccent ?? "VIBE";
  const description = content.description ?? "We aren't just order-takers. We are a proactive extension of your company, built on a foundation of four core principles that ensure high performance. VibeGlobally is a full-service outsourcing agency providing experts in telemarketing, customer support, virtual assistance, SEO, email marketing, social media management, data entry, and more so you can focus on growing your business while we handle execution, support, and sales.";
  const values = content.values && content.values.length > 0 ? content.values : DEFAULT_VALUES;

  return (
    <section id="values" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {headline} <span className="text-primary">{headlineAccent}</span> Framework
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              {description}
            </p>

            <div className="space-y-8">
              {values.map((v, i) => (
                <motion.div 
                  key={i}
                  className="flex gap-6 cursor-pointer group"
                  onClick={scrollToContact}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-card border border-border flex items-center justify-center text-3xl font-bold text-primary shadow-[0_0_15px_rgba(245,197,24,0.1)] group-hover:border-primary group-hover:shadow-[0_0_25px_rgba(245,197,24,0.2)] transition-all duration-200">
                    {v.letter}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">{v.word}</h3>
                    <p className="text-muted-foreground">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
            <img 
              src={valuesArt} 
              alt="Vibe Values Art" 
              className="relative z-10 w-full rounded-2xl border border-white/10 shadow-2xl object-cover aspect-square"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
