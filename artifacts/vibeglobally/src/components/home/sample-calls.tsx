import { motion } from "framer-motion";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { Play, Phone, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface SampleCall {
  title: string;
  description: string;
  duration?: string;
  caller?: string;
  audioUrl?: string;
  category?: string;
}

interface SampleCallsContent {
  headline?: string;
  headlineAccent?: string;
  description?: string;
  calls?: SampleCall[];
}

const DEFAULT_CALLS: SampleCall[] = [
  {
    title: "Customer Support Excellence",
    description: "Professional handling of customer inquiries with empathy and efficiency",
    duration: "3:45",
    caller: "Sarah - Customer Support VA",
    category: "Customer Service",
  },
  {
    title: "Sales Qualification Call",
    description: "Expert lead qualification and appointment setting demonstration",
    duration: "5:20",
    caller: "Mike - Sales VA",
    category: "Sales",
  },
  {
    title: "Technical Support Session",
    description: "Clear technical troubleshooting and problem resolution",
    duration: "4:15",
    caller: "Alex - Tech Support VA",
    category: "Technical",
  },
];

export function SampleCalls() {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const { data, isLoading } = useGetSiteContent("sampleCalls", {
    query: { queryKey: getGetSiteContentQueryKey("sampleCalls"), refetchInterval: 15000 },
  });

  const content = (data?.content ?? {}) as SampleCallsContent;
  const headline = content.headline ?? "Sample Calls";
  const headlineAccent = content.headlineAccent ?? "Hear the Difference";
  const description = content.description ?? "Listen to real examples of our virtual assistants in action. Experience the professionalism and expertise that sets us apart.";
  const calls = (content.calls && content.calls.length > 0 ? content.calls : DEFAULT_CALLS);

  const handlePlay = (index: number) => {
    setPlayingIndex(playingIndex === index ? null : index);
  };

  return (
    <section id="sample-calls" className="py-24 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Quality You Can Hear
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            {headline} <span className="text-primary">{headlineAccent}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            {description}
          </motion.p>
        </div>

        {/* Sample Calls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))
            : calls.map((call, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-gradient-to-br from-card to-card/80 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 flex flex-col gap-4 h-full">
                      
                      {/* Category Badge */}
                      {call.category && (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                          <Phone className="w-3 h-3" />
                          {call.category}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {call.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                        {call.description}
                      </p>

                      {/* Call Details */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-4">
                        {call.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{call.duration}</span>
                          </div>
                        )}
                        {call.caller && (
                          <div className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span className="truncate">{call.caller}</span>
                          </div>
                        )}
                      </div>

                      {/* Play Button */}
                      <button
                        onClick={() => handlePlay(i)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-300 ${
                          playingIndex === i
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        <Play className={`w-4 h-4 ${playingIndex === i ? "animate-pulse" : ""}`} />
                        <span>{playingIndex === i ? "Playing..." : "Listen to Call"}</span>
                      </button>

                      {/* Audio Player (if audioUrl exists) */}
                      {call.audioUrl && playingIndex === i && (
                        <audio
                          src={call.audioUrl}
                          controls
                          autoPlay
                          className="w-full mt-2"
                          onEnded={() => setPlayingIndex(null)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground mb-4">
            Want to hear more examples or discuss your specific needs?
          </p>
          <button
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all duration-300 hover:scale-105"
          >
            <Phone className="w-4 h-4" />
            Schedule a Discovery Call
          </button>
        </motion.div>
      </div>
    </section>
  );
}
