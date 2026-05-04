import { motion } from "framer-motion";
import { useListTestimonials } from "@workspace/api-client-react";
import { useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { Star, Quote, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Extract Facebook post ID from various Facebook URL formats
function extractFacebookPostUrl(url: string): string | null {
  try {
    // If it's already an embed URL, extract the href parameter
    if (url.includes('facebook.com/plugins/post.php')) {
      const match = url.match(/href=([^&]+)/);
      if (match) {
        return decodeURIComponent(match[1]);
      }
    }
    return url;
  } catch {
    return null;
  }
}

// Generate Facebook embed iframe URL
function getFacebookEmbedUrl(postUrl: string): string {
  const encodedUrl = encodeURIComponent(postUrl);
  return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
}

interface FacebookReviewContent {
  facebookReviewUrl?: string;
  callToActionHeading?: string;
  callToActionDescription?: string;
  buttonText?: string;
}

export function TestimonialsSection() {
  const { data, isLoading } = useListTestimonials();
  
  const { data: reviewData } = useGetSiteContent("facebookReview", {
    query: { queryKey: getGetSiteContentQueryKey("facebookReview"), refetchInterval: 15000 },
  });

  const reviewContent = (reviewData?.content ?? {}) as FacebookReviewContent;
  const facebookReviewUrl = reviewContent.facebookReviewUrl ?? "https://www.facebook.com/VibeGloballyVirtualAssistance/reviews";
  const callToActionHeading = reviewContent.callToActionHeading ?? "Have you worked with us?";
  const callToActionDescription = reviewContent.callToActionDescription ?? "Share your experience and help others discover the quality of our services";
  const buttonText = reviewContent.buttonText ?? "Leave us a review on Facebook";

  const testimonials = data?.testimonials || [];

  return (
    <section id="testimonials" className={`py-24 bg-muted/30 relative z-10 ${(!isLoading && testimonials.length === 0) ? 'hidden' : ''}`}>
      <div className="container mx-auto px-4 md:px-6">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-primary font-semibold uppercase tracking-widest text-sm mb-3"
          >
            Client Reviews
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-foreground mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground"
          >
            Real feedback from businesses we've helped grow
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))
            : testimonials.map((t, i) => {
                const facebookPostUrl = t.facebookUrl ? extractFacebookPostUrl(t.facebookUrl) : null;
                const showEmbed = facebookPostUrl && (
                  facebookPostUrl.includes('facebook.com/permalink.php') ||
                  facebookPostUrl.includes('facebook.com/') && facebookPostUrl.includes('/posts/')
                );

                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    {showEmbed ? (
                      // Facebook Embed Card with Rating Inside
                      <Card className="h-full bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
                        <CardContent className="p-0 flex-1 flex items-center justify-center">
                          <iframe
                            src={getFacebookEmbedUrl(facebookPostUrl)}
                            width="100%"
                            height="100%"
                            style={{ border: 'none', overflow: 'hidden', minHeight: '400px', maxHeight: '600px' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                            loading="lazy"
                            className="w-full"
                          />
                        </CardContent>
                        {/* Rating Stars Inside Card with Facebook Link */}
                        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-t border-primary/20">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: t.rating }).map((_, j) => (
                                <Star key={j} className="w-4 h-4 fill-primary text-primary drop-shadow-sm" />
                              ))}
                              {Array.from({ length: 5 - t.rating }).map((_, j) => (
                                <Star key={`empty-${j}`} className="w-4 h-4 text-muted-foreground/20" />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.rating}.0</span>
                            <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
                              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                              Verified
                            </span>
                          </div>
                          {/* Facebook Link */}
                          <a
                            href={facebookPostUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 transition-colors font-semibold group/fb px-2 py-1 rounded-md hover:bg-primary/5"
                          >
                            <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="hidden sm:inline">View on Facebook</span>
                            <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover/fb:opacity-100 group-hover/fb:translate-x-0 transition-all duration-300" />
                          </a>
                        </div>
                      </Card>
                    ) : (
                      // Regular Testimonial Card
                      <Card className="h-full bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                        {/* Top accent bar */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />

                        {/* Decorative gradient blob */}
                        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

                        {/* Quote Icon Background */}
                        <div className="absolute top-5 right-5 opacity-[0.07] group-hover:opacity-15 group-hover:scale-110 transition-all duration-500">
                          <Quote className="w-20 h-20 text-primary fill-primary" />
                        </div>

                        <CardContent className="p-7 flex flex-col gap-5 h-full relative z-10">
                          {/* Star Rating */}
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {Array.from({ length: t.rating }).map((_, j) => (
                                <Star key={j} className="w-4 h-4 fill-primary text-primary drop-shadow-sm" />
                              ))}
                              {Array.from({ length: 5 - t.rating }).map((_, j) => (
                                <Star key={`empty-${j}`} className="w-4 h-4 text-muted-foreground/20" />
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-primary/80">{t.rating}.0</span>
                          </div>

                          {/* Review Content */}
                          <p className="text-foreground/80 text-[15px] leading-relaxed flex-1 relative">
                            <span className="text-primary/40 font-serif text-2xl leading-none mr-0.5">“</span>
                            {t.content}
                            <span className="text-primary/40 font-serif text-2xl leading-none ml-0.5">”</span>
                          </p>

                          {/* Facebook Link (for non-embeddable URLs) */}
                          {t.facebookUrl && !showEmbed && (
                            <a
                              href={t.facebookUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors font-medium group/fb w-fit"
                            >
                              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                              </svg>
                              <span>View on Facebook</span>
                              <ExternalLink className="w-3 h-3 opacity-0 -translate-x-1 group-hover/fb:opacity-100 group-hover/fb:translate-x-0 transition-all" />
                            </a>
                          )}

                          {/* Client Info */}
                          <div className="flex items-center gap-3 border-t border-border/60 pt-4 mt-auto">
                            {/* Avatar Circle with Initials */}
                            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0 shadow-md ring-2 ring-background">
                              <span className="text-primary-foreground font-bold text-sm">
                                {t.clientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm truncate leading-tight">{t.clientName}</p>
                              {t.company && (
                                <p className="text-xs text-muted-foreground truncate mt-0.5">{t.company}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
