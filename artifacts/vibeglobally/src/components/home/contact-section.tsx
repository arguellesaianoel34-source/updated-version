import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateContact, useGetSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

interface ProcessStep {
  title: string;
  description: string;
}

interface ContactContent {
  headline?: string;
  subheadline?: string;
  steps?: ProcessStep[];
  email?: string;
  phone?: string;
  address?: string;
  submitButtonText?: string;
  successTitle?: string;
  successMessage?: string;
}

const DEFAULT_STEPS: ProcessStep[] = [
  { title: "Discovery Call", description: "We analyze your workflows and identify the exact profiles you need." },
  { title: "Team Selection", description: "We vet, train, and present candidates that fit your VIBE." },
  { title: "Deployment", description: "Seamless integration into your tech stack. Immediate results." },
];

export function ContactSection() {
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const createContact = useCreateContact();

  const { data: contentData } = useGetSiteContent("contact", {
    query: { queryKey: getGetSiteContentQueryKey("contact"), refetchInterval: 15000 },
  });

  const content = (contentData?.content ?? {}) as ContactContent;
  const headline = content.headline ?? "Ready to Scale?";
  const subheadline = content.subheadline ?? "Tell us about your operational needs. We'll build a custom plan and contact us to get started.";
  const steps = content.steps && content.steps.length > 0 ? content.steps : DEFAULT_STEPS;
  const submitButtonText = "Submit"; // Force "Submit" - ignore database value
  const successTitle = content.successTitle ?? "Request Received";
  const successMessage = content.successMessage ?? "Our operations team will be in touch shortly to schedule your discovery call.";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createContact.mutate({ data: values }, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        toast({
          title: "Message Sent",
          description: "Thank you for contacting us. We'll get back to you soon!",
        });
      },
      onError: () => {
        toast({
          title: "Error submitting form",
          description: "Please try again later or contact us directly at lyndon@vibeglobally.ph",
          variant: "destructive"
        });
      }
    });
  };

  return (
    <section id="contact" className="py-24 bg-card relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{headline}</h2>
            <p className="text-xl text-muted-foreground mb-8">
              {subheadline}
            </p>
            
            <div className="space-y-6">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${i === steps.length - 1 ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"} flex items-center justify-center shrink-0`}>
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-8 border border-border shadow-xl"
          >
            {isSuccess ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold">{successTitle}</h3>
                <p className="text-muted-foreground">{successMessage}</p>
                <Button variant="outline" onClick={() => setIsSuccess(false)} className="mt-4">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="" className="bg-card" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="" className="bg-card" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="" className="bg-card" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="" className="bg-card" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Interest</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-card">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="lead-gen">Lead Generation & Telemarketing</SelectItem>
                            <SelectItem value="va">Virtual Assistance</SelectItem>
                            <SelectItem value="marketing">Digital Marketing</SelectItem>
                            <SelectItem value="data">Data Entry</SelectItem>
                            <SelectItem value="social">Social Media Management</SelectItem>
                            <SelectItem value="support">Customer Service</SelectItem>
                            <SelectItem value="other">Other / Multiple</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can we help? *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="" 
                            className="min-h-[120px] bg-card resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-lg font-bold mt-4"
                    disabled={createContact.isPending}
                  >
                    {createContact.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : submitButtonText}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
