import { motion } from "framer-motion";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { Star, Award, ShieldCheck } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  jobSuccess: number;
  badge: "top-rated-plus" | "top-rated" | "none";
  initials: string;
  profileUrl?: string;
}

interface TeamContent {
  sectionLabel?: string;
  sectionTitle?: string;
  sectionDescription?: string;
  members?: TeamMember[];
}

const DEFAULT_MEMBERS: TeamMember[] = [
  { name: "Lyndon A.", role: "Business Manager", jobSuccess: 100, badge: "top-rated", initials: "LA", profileUrl: "https://www.upwork.com/o/profiles/users/~0147d83a33fb9155fd/" },
  { name: "Sarah Joy L.", role: "Senior VA & Appointment Setter", jobSuccess: 100, badge: "top-rated", initials: "SL", profileUrl: "https://www.upwork.com/o/profiles/users/~01fcc3998a8bf35240/" },
  { name: "Allysa L.", role: "Virtual Assistant", jobSuccess: 100, badge: "top-rated-plus", initials: "AL", profileUrl: "https://www.upwork.com/o/profiles/users/~01cf62faf0e8812f57/" },
  { name: "Georgette T.", role: "Virtual Assistant", jobSuccess: 100, badge: "top-rated", initials: "GT", profileUrl: "https://www.upwork.com/o/profiles/users/~015cc0bbf3dc75cd8e/" },
];

function BadgeIcon({ badge }: { badge: TeamMember["badge"] }) {
  if (badge === "top-rated-plus") {
    return (
      <div
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg"
        title="Top Rated Plus"
      >
        <ShieldCheck className="w-4 h-4 text-accent-foreground" />
      </div>
    );
  }
  if (badge === "top-rated") {
    return (
      <div
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
        title="Top Rated"
      >
        <Award className="w-4 h-4 text-primary-foreground" />
      </div>
    );
  }
  return null;
}

function BadgeLabel({ badge }: { badge: TeamMember["badge"] }) {
  if (badge === "top-rated-plus") {
    return (
      <div className="flex items-center justify-center gap-1.5 bg-accent/10 rounded-lg px-4 py-2">
        <ShieldCheck className="w-4 h-4 text-accent" />
        <span className="text-sm font-semibold text-accent">Top Rated Plus</span>
      </div>
    );
  }
  if (badge === "top-rated") {
    return (
      <div className="flex items-center justify-center gap-1.5 bg-primary/10 rounded-lg px-4 py-2">
        <Award className="w-4 h-4 text-primary" />
        <span className="text-sm font-semibold text-primary">Top Rated</span>
      </div>
    );
  }
  return null;
}

export function Team() {
  const { data } = useGetSiteContent("team", {
    query: { queryKey: getGetSiteContentQueryKey("team"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as TeamContent;
  const sectionLabel = content.sectionLabel ?? "The People Behind the Results";
  const sectionTitle = content.sectionTitle ?? "Meet the Team";
  const sectionDescription =
    content.sectionDescription ??
    "Verified on Upwork with 100% Job Success Scores — our team brings the professionalism and drive that keeps clients coming back.";
  const members =
    content.members && content.members.length > 0 ? content.members : DEFAULT_MEMBERS;

  return (
    <section id="team" className="py-24 bg-card relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            {sectionLabel}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">{sectionTitle}</h2>
          <p className="text-lg text-muted-foreground">{sectionDescription}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {members.map((member, i) => (
            <motion.div
              key={i}
              onClick={() => window.open(member.profileUrl ?? "https://www.upwork.com/agencies/1308148050642456576/", "_blank", "noopener,noreferrer")}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-background border border-border rounded-2xl p-6 flex flex-col items-center text-center hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className="relative mb-5">
                <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border-2 border-primary/20 flex items-center justify-center text-xl font-bold text-primary group-hover:border-primary/50 transition-colors">
                  {member.initials}
                </div>
                <BadgeIcon badge={member.badge} />
              </div>

              <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">{member.role}</p>

              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between bg-muted/40 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="text-xs font-medium text-foreground">Job Success</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{member.jobSuccess}%</span>
                </div>
                <BadgeLabel badge={member.badge} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
