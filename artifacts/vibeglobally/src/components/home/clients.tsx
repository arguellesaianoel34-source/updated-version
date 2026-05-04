import { useState } from "react";
import { motion } from "framer-motion";
import globalArt from "@/assets/images/global-business.png";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";

const UPWORK_URL = "https://www.upwork.com/agencies/1308148050642456576/";

interface ClientItem {
  name: string;
  domain?: string;
  link?: string;
  logoUrl?: string; // Custom uploaded logo URL
}

interface ClientsContent {
  headline?: string;
  headlineAccent?: string;
  description?: string;
  clients?: (string | ClientItem)[];
}

const DEFAULT_CLIENTS: ClientItem[] = [
  { name: "Gaywellness", domain: "gaywellness.com", link: "https://gaywellness.com" },
  { name: "ListGlobally", domain: "listglobally.com", link: "https://listglobally.com" },
  { name: "BC Media", domain: "bcmedia.tv", link: "https://bcmedia.tv" },
  { name: "Allstate Insurance", domain: "allstate.com", link: "https://allstate.com" },
  { name: "Velsoft - Canada", domain: "velsoft.com", link: "https://velsoft.com" },
  { name: "Brantley Solutions, LLC" },
  { name: "Family First Life Insurance", domain: "familyfirstlife.com", link: "https://familyfirstlife.com" },
  { name: "Spacer - Australia", domain: "spacer.com.au", link: "https://spacer.com.au" },
  { name: "Simply Wealth - Australia", domain: "simplywealthgroup.com.au", link: "https://simplywealthgroup.com.au" },
  { name: "IndoorMedia", domain: "indoormedia.com", link: "https://indoormedia.com" },
];

function resolveClientLink(client: ClientItem): string {
  if (client.link && client.link.trim()) {
    const raw = client.link.trim();
    return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  }
  if (client.domain) {
    return `https://${client.domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
  }
  return UPWORK_URL;
}

// Vite picks up every PNG dropped into src/assets/images/clients/ at build time.
// Filenames must match the slug derived from the domain (see slugify below).
// Run `pnpm --filter @workspace/vibeglobally logos` to (re)download them.
const LOCAL_LOGOS = import.meta.glob<{ default: string }>(
  "@/assets/images/clients/*.{png,svg,jpg,webp}",
  { eager: true },
);

const LOCAL_LOGO_BY_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(LOCAL_LOGOS).map(([path, mod]) => {
    const slug = path.split("/").pop()!.replace(/\.[^.]+$/, "");
    return [slug, mod.default];
  }),
);

function slugifyDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\.(com|net|org|io|co|tv|au|us|biz)(\..+)?$/, "")
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
}

function normalizeClient(c: string | ClientItem): ClientItem {
  return typeof c === "string" ? { name: c } : c;
}

function remoteLogoUrl(domain: string): string {
  return `https://logo.clearbit.com/${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
}

function resolveLogoSrc(client: ClientItem): string | null {
  // Priority: custom uploaded logo > local logo > clearbit API
  if (client.logoUrl) return client.logoUrl;
  if (!client.domain) return null;
  const slug = slugifyDomain(client.domain);
  return LOCAL_LOGO_BY_SLUG[slug] ?? remoteLogoUrl(client.domain);
}

function ClientLogo({ client }: { client: ClientItem }) {
  const [errored, setErrored] = useState(false);
  const src = resolveLogoSrc(client);
  const showLogo = src && !errored;
  return (
    <>
      {showLogo ? (
        <img
          src={src!}
          alt={client.name}
          loading="lazy"
          onError={() => setErrored(true)}
          className="h-full w-full object-cover rounded-full"
        />
      ) : (
        <span className="font-bold text-xl text-center font-serif tracking-wide">
          {client.name}
        </span>
      )}
    </>
  );
}

export function Clients() {
  const { data } = useGetSiteContent("clients", {
    query: { queryKey: getGetSiteContentQueryKey("clients"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as ClientsContent;
  const headline = content.headline ?? "Trusted by";
  const headlineAccent = (content.headlineAccent ?? "Global Clients").replace(/^\s*\d+\+\s*/, "");
  const description = content.description ?? "From emerging startups to established enterprise companies across the US, Canada, and Australia — we provide the operational backbone that powers growth.";
  const clients = (content.clients && content.clients.length > 0 ? content.clients : DEFAULT_CLIENTS).map(normalizeClient);

  // Duplicate clients for seamless infinite scroll
  const duplicatedClients = [...clients, ...clients];

  return (
    <section id="clients" className="py-24 bg-background relative z-10 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
        <img src={globalArt} alt="Global network" className="w-full h-full object-cover [mask-image:linear-gradient(to_left,black,transparent)]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          className="max-w-2xl mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            {headline} <span className="text-primary">{headlineAccent}</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            {description}
          </p>
        </motion.div>

        {/* Infinite Scrolling Logo Container */}
        <div className="relative overflow-hidden">
          {/* Gradient overlays for fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div className="flex gap-12 animate-scroll">
            {duplicatedClients.map((client, i) => {
              const href = resolveClientLink(client);
              return (
                <a
                  key={`${client.name}-${i}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${client.name} — ${href}`}
                  className="group flex-shrink-0 h-40 w-40 rounded-full flex items-center justify-center p-6 relative transition-all duration-500 cursor-pointer"
                >
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                  
                  {/* Ring border */}
                  <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-primary/30 transition-all duration-500" />
                  
                  {/* Logo container with enhanced effects */}
                  <div className="relative z-10 h-full w-full flex items-center justify-center grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-lg group-hover:drop-shadow-2xl">
                    <ClientLogo client={client} />
                  </div>
                  
                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
