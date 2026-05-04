import { motion } from "framer-motion";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

interface ToolsContent {
  sectionTitle?: string;
  toolsTitle?: string;
  toolsDescription?: string;
  industriesTitle?: string;
  industriesDescription?: string;
  tools?: string[];
  industries?: string[];
}

const DEFAULT_TOOLS = [
  "Monday.com", "Intercom", "LiveAgent", "Talkdesk", "Vonage Business", 
  "CloudTalk", "Grasshopper", "ActiveCampaign", "Mailchimp", "Klaviyo", 
  "Zapier", "Calendly"
];
const DEFAULT_INDUSTRIES = ["Real Estate", "Property Management", "Insurance", "Mortgage", "Cleaning", "Cybersecurity", "SAAS", "Financial", "Advertising", "Solar", "Home Improvement", "Coaching", "SEO", "Website Building", "Digital Marketing", "B2B and B2C Campaigns"];

export function Tools() {
  const { data } = useGetSiteContent("tools", {
    query: { queryKey: getGetSiteContentQueryKey("tools"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as ToolsContent;
  const sectionTitle = content.sectionTitle ?? "Built for Your Stack & Industry";
  const toolsTitle = content.toolsTitle ?? "CRMs & Tools We've Handled";
  const toolsDescription = content.toolsDescription ?? "Our agents plug into your existing tech stack from day one — no ramp-up lag.";
  const industriesTitle = content.industriesTitle ?? "Industries We've Worked With";
  const industriesDescription = content.industriesDescription ?? "Deep domain knowledge means we understand your prospect's pain points before the first call.";
  
  const toolsData = content.tools || [];
  const tools = (toolsData.length > 0) ? toolsData : DEFAULT_TOOLS;
  const industries = content.industries || DEFAULT_INDUSTRIES;

  return (
    <section id="tools" className="py-24 bg-card border-y border-border overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Our Experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            {sectionTitle}
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16">

          {/* CRMs & Tools */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold mb-3 flex items-center gap-3"
            >
              <span className="w-8 h-1 bg-primary rounded-full" />
              {toolsTitle}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground mb-6"
            >
              {toolsDescription}
            </motion.p>
            <div className="flex flex-wrap gap-2">
              {tools.map((tool, i) => (
                <motion.div
                  key={tool}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  onClick={scrollToContact}
                  className="px-4 py-2 rounded-full bg-background border border-border text-sm font-medium text-foreground hover:border-primary hover:text-primary hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                >
                  {tool}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xl font-bold mb-3 flex items-center gap-3"
            >
              <span className="w-8 h-1 bg-accent rounded-full" />
              {industriesTitle}
            </motion.h3>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground mb-6"
            >
              {industriesDescription}
            </motion.p>
            <div className="grid grid-cols-2 gap-2">
              {industries.map((ind, i) => (
                <motion.div
                  key={ind}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onClick={scrollToContact}
                  className="px-3 py-2.5 rounded-lg bg-background border border-border flex items-center gap-2 group hover:border-accent hover:-translate-y-0.5 transition-all duration-150 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent shrink-0 transition-colors" />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{ind}</span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
