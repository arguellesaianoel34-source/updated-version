import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

const UPWORK_URL = "https://www.upwork.com/agencies/1308148050642456576/";

interface Metric { value: string; label: string; }
interface WorkHistoryItem { title: string; period: string; earned: string; rate: string; hours: string; }
interface ResultsContent {
  sectionLabel?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  metrics?: Metric[];
  workHistory?: WorkHistoryItem[];
}

const DEFAULT_METRICS: Metric[] = [
  { value: "1,200+", label: "Hours of Billed Work" },
  { value: "983", label: "Telemarketing Hours Logged" },
  { value: "$8,600+", label: "Earned Across Projects" },
  { value: "4.9 / 5", label: "Average Client Rating" },
];

const DEFAULT_WORK_HISTORY: WorkHistoryItem[] = [
  { title: "Appointment Setter", period: "Jan 2024 – Present", earned: "$1,189.00", rate: "$14.16 / hr", hours: "198 hours" },
  { title: "Appointment Setting for Final Expense", period: "Oct 2023 – Present", earned: "$385.33", rate: "$10.21 / hr", hours: "46 hours" },
  { title: "Assistant or Telemarketer", period: "Apr 2025 – Present", earned: "$7,085.65", rate: "$8.52 / hr", hours: "983 hours" },
];

export function Results() {
  const { data } = useGetSiteContent("results", {
    query: { queryKey: getGetSiteContentQueryKey("results"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as ResultsContent;
  const sectionLabel = content.sectionLabel ?? "Track Record";
  const sectionTitle = content.sectionTitle ?? "Work History";
  const sectionDescription = content.sectionDescription ?? "Real numbers from real client engagements. This is what we bring to every project.";
  const metrics = content.metrics || DEFAULT_METRICS;
  const workHistory = content.workHistory || DEFAULT_WORK_HISTORY;

  return (
    <section className="py-24 bg-background border-t border-border relative z-10">
      <div className="container mx-auto px-4 md:px-6">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: Metrics */}
          <div>
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
              className="text-3xl md:text-5xl font-bold text-foreground mb-4"
            >
              {sectionTitle}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground text-lg mb-10"
            >
              {sectionDescription}
            </motion.p>

            <div className="grid grid-cols-2 gap-4">
              {metrics.map((m, i) => (
                <motion.div
                  key={i}
                  onClick={() => window.open(UPWORK_URL, "_blank", "noopener,noreferrer")}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-5 rounded-xl bg-card border border-border hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                >
                  <div className="text-3xl font-bold text-primary mb-1 group-hover:text-primary/80 transition-colors">{m.value}</div>
                  <div className="text-sm text-muted-foreground">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Work History */}
          <div className="space-y-4">
            {workHistory.map((job, i) => (
              <motion.div
                key={i}
                onClick={() => window.open(UPWORK_URL, "_blank", "noopener,noreferrer")}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="p-6 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{job.title}</h3>
                  <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">{job.period}</p>
                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-lg font-bold text-accent">{job.earned}</div>
                    <div className="text-xs text-muted-foreground">Total Earned</div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <div className="text-lg font-bold text-foreground">{job.rate}</div>
                    <div className="text-xs text-muted-foreground">Hourly Rate</div>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div>
                    <div className="text-lg font-bold text-foreground">{job.hours}</div>
                    <div className="text-xs text-muted-foreground">Hours Worked</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground text-center pt-2"
            >
              VibeGlobally has completed more projects.{" "}
              <button
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors"
              >
                Contact us to learn more.
              </button>
            </motion.p>
          </div>

        </div>
      </div>
    </section>
  );
}
