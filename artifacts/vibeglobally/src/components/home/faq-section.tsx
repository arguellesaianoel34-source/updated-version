import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useGetSiteContent } from "@workspace/api-client-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  sectionTitle?: string;
  sectionDescription?: string;
  items?: FAQItem[];
}

const DEFAULT_FAQ: FAQContent = {
  sectionTitle: "Frequently Asked Questions",
  sectionDescription: "Get answers to common questions about our virtual staffing and outsourcing services",
  items: [
    {
      question: "What is Vibeglobally?",
      answer: "Vibeglobally is a virtual staffing and outsourcing company that provides trained remote professionals to support businesses across customer service, telemarketing, appointment setting, chat support, data entry, email marketing, SEO, and more."
    },
    {
      question: "What services do you offer?",
      answer: "We provide a wide range of remote business support services, including customer service support, telemarketing and outbound calling, appointment setting, live chat support, data entry and admin tasks, email marketing support, SEO and basic digital marketing assistance, and custom virtual assistant solutions."
    },
    {
      question: "Who can benefit from Vibeglobally's services?",
      answer: "We work with startups, small businesses, agencies, and established companies that want to scale operations, reduce costs, and access trained remote talent without the overhead of hiring in-house staff."
    },
    {
      question: "Where are your virtual staff based?",
      answer: "Our team members are primarily based in the Philippines, known for strong English communication skills, customer service experience, and adaptability to global business operations."
    },
    {
      question: "Are your virtual assistants trained?",
      answer: "Yes. All our virtual staff undergo training based on the specific role they will handle, whether it's customer service, outbound calling, admin work, or marketing support. We also align them with your processes and systems."
    },
    {
      question: "Can I hire for multiple roles at once?",
      answer: "Yes. You can build a full remote team with different roles under one setup. For example, a mix of customer support agents, appointment setters, and admin assistants."
    },
    {
      question: "Do you provide full-time or part-time staff?",
      answer: "We offer flexible arrangements depending on your needs. You can scale from part-time support to full-time dedicated virtual staff."
    },
    {
      question: "How do you ensure quality of work?",
      answer: "We focus on training, clear SOPs (standard operating procedures), and alignment with your business goals. We also recommend regular performance feedback to ensure consistent quality."
    },
    {
      question: "Can your team work in my systems and tools?",
      answer: "Yes. Our virtual staff are trained to work with common tools such as CRMs, email platforms, helpdesk systems, spreadsheets, and project management tools."
    },
    {
      question: "How fast can I get started?",
      answer: "Once we understand your requirements, we can typically match and onboard virtual staff within a few days, depending on role complexity and training needs."
    },
    {
      question: "How is pricing structured?",
      answer: "Pricing depends on the role, skill level, and number of staff required. We offer flexible monthly packages designed to fit different business sizes and scaling needs."
    },
    {
      question: "Why choose Vibeglobally over hiring directly?",
      answer: "Hiring through Vibeglobally removes the complexity of recruitment, training, and management. You get pre-vetted, trained professionals who are ready to support your business while you focus on growth."
    },
    {
      question: "Can I work with the freelancer directly and pay them directly?",
      answer: "No.\n\nVibeGlobally operates as a managed agency, meaning all engagements and payments must go through the company to ensure proper coordination, accountability, and service quality.\n\nUnder Philippine contract law (Civil Code Article 1306), agreements between parties are binding as long as they are not contrary to law, morals, public order, or public policy. This means contractual arrangements such as working exclusively through an agency are generally enforceable when clearly agreed upon.\n\nAllowing direct engagement outside the agency would bypass the agreed terms and the operational structure of the service.\n\nIf you wish to work directly with a freelancer from our team, we offer a buyout option for $1,000 USD."
    },
    {
      question: "How do I know you're legit and not a scam?",
      answer: "We're a verified, Top Rated agency on Upwork, one of the largest freelance marketplaces in the world.\n\nOur profile reflects 40,000+ hours of completed work and over $500K in earnings, all independently tracked and verified by the platform.\n\nYou can review our full profile, client history, and feedback here: https://www.upwork.com/agencies/1308148050642456576/"
    }
  ]
};

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

export function FAQSection() {
  const { data, isLoading } = useGetSiteContent("faq");

  const apiContent = data?.content as unknown as FAQContent | undefined;
  const content = apiContent ?? DEFAULT_FAQ;
  // Use database items if they exist, otherwise fallback to defaults
  const apiItems = apiContent?.items || [];
  const faqItems = (apiItems.length > 0 && !isLoading) ? apiItems : (DEFAULT_FAQ.items || []);

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <motion.h2 variants={item} className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {content.sectionTitle ?? DEFAULT_FAQ.sectionTitle}
          </motion.h2>
          <motion.p variants={item} className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {content.sectionDescription ?? DEFAULT_FAQ.sectionDescription}
          </motion.p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid md:grid-cols-2 gap-x-12 lg:gap-x-16"
        >
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.slice(0, Math.ceil(faqItems.length / 2)).map((faq: FAQItem, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index}`} className="border-b border-border/50 transition-all duration-300 hover:border-primary/30">
                    <AccordionTrigger className="text-left text-base font-medium py-5 hover:no-underline hover:text-primary transition-all duration-300 tracking-wide group" style={{ fontWeight: 500, letterSpacing: '0.01em' }}>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-[1.8] pb-5 font-light tracking-wide" style={{ fontSize: '15px', letterSpacing: '0.01em' }}>
                      {faq.answer.split('\n\n').map((paragraph, i) => (
                        <p key={i} className={i > 0 ? 'mt-4' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {faqItems.slice(Math.ceil(faqItems.length / 2)).map((faq: FAQItem, index: number) => (
                <motion.div
                  key={index + Math.ceil(faqItems.length / 2)}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index + Math.ceil(faqItems.length / 2)}`} className="border-b border-border/50 transition-all duration-300 hover:border-primary/30">
                    <AccordionTrigger className="text-left text-base font-medium py-5 hover:no-underline hover:text-primary transition-all duration-300 tracking-wide group" style={{ fontWeight: 500, letterSpacing: '0.01em' }}>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-[1.8] pb-5 font-light tracking-wide" style={{ fontSize: '15px', letterSpacing: '0.01em' }}>
                      {faq.answer.split('\n\n').map((paragraph, i) => (
                        <p key={i} className={i > 0 ? 'mt-4' : ''}>
                          {paragraph}
                        </p>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}