import { motion } from "framer-motion";
import { PhoneCall, Users, LayoutTemplate, Database, MessageSquare, HeadphonesIcon, CalendarCheck, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

const SERVICE_ICONS = [PhoneCall, CalendarCheck, HeadphonesIcon, Users, TrendingUp, Database, MessageSquare, LayoutTemplate];

interface ServiceItem {
  title: string;
  description: string;
  color: string;
  bg: string;
  highlight: boolean;
}

interface ServicesContent {
  sectionLabel?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  items?: ServiceItem[];
}

const DEFAULT_ITEMS: ServiceItem[] = [
  { title: "Lead Generation & Telemarketing", description: "Contacting, qualifying, canvassing and nurturing prospective customers using SMS, email and telecommunications. High-volume outbound dialing that fills your pipeline daily.", color: "text-blue-400", bg: "bg-blue-400/10", highlight: true },
  { title: "Appointment Setting", description: "We book qualified meetings directly onto your sales team's calendar. Vetted, confirmed, and briefed — so you close, not chase.", color: "text-primary", bg: "bg-primary/10", highlight: true },
  { title: "Customer Service & Support", description: "Inbound and outbound omnichannel support via phone, email, and live chat. Fast resolution times, high CSAT scores, and a team that represents your brand with pride.", color: "text-orange-400", bg: "bg-orange-400/10", highlight: false },
  { title: "Virtual Assistance", description: "Administrative services including scheduling appointments, making phone calls, travel arrangements, and managing email accounts — all handled seamlessly.", color: "text-green-400", bg: "bg-green-400/10", highlight: false },
  { title: "Digital Marketing", description: "Create, automate and send strategic marketing emails to help amplify our clients' presence. B2B and B2C campaign execution across every major channel.", color: "text-purple-400", bg: "bg-purple-400/10", highlight: false },
  { title: "Data Entry & Transcription", description: "Accurate, rapid data handling, CRM hygiene, list building, and complex spreadsheet management. Clean data means sharper targeting.", color: "text-cyan-400", bg: "bg-cyan-400/10", highlight: false },
  { title: "Social Media Management", description: "Content scheduling, community engagement, and brand voice consistency across all channels. We keep your audience warm while your team closes deals.", color: "text-pink-400", bg: "bg-pink-400/10", highlight: false },
  { title: "SEO & Website Services", description: "On-page SEO optimization, website building, and digital presence management. We handle the visibility so prospects can find you.", color: "text-yellow-400", bg: "bg-yellow-400/10", highlight: false },
];

function scrollToContact() {
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 22 } },
};

export function Services() {
  const { data } = useGetSiteContent("services", {
    query: { queryKey: getGetSiteContentQueryKey("services"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as ServicesContent;
  const sectionLabel = content.sectionLabel ?? "What We Do";
  const sectionTitle = content.sectionTitle ?? "Services";
  const sectionDescription = content.sectionDescription ?? "We embed specialized talent directly into your workflows. From top-of-funnel outreach to back-office administration, we handle the execution so you can focus on closing.";
  const services = content.items || DEFAULT_ITEMS;

  return (
    <section id="services" className="py-24 bg-card relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-accent font-semibold uppercase tracking-widest text-sm mb-3"
          >
            {sectionLabel}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-6 text-foreground"
          >
            {sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {sectionDescription}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          {services.map((service, index) => {
            const Icon = SERVICE_ICONS[index % SERVICE_ICONS.length];
            return (
              <motion.div key={index} variants={item}>
                <Card
                  onClick={scrollToContact}
                  className={`h-full border transition-all duration-300 group cursor-pointer hover:-translate-y-1 ${
                    service.highlight
                      ? "bg-background border-primary/30 hover:border-primary hover:shadow-[0_0_30px_rgba(245,197,24,0.15)]"
                      : "bg-background/50 border-border hover:border-primary/40"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-3 ${service.bg} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${service.color}`} />
                    </div>
                    <CardTitle className="text-base leading-snug group-hover:text-primary transition-colors duration-200">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </CardDescription>
                    <p className="text-xs text-primary/70 mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Get started →
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
