import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ProcessStep {
  title: string;
  description: string;
}

interface ContactContent {
  headline: string;
  subheadline: string;
  steps: ProcessStep[];
  email: string;
  phone: string;
  address: string;
  submitButtonText: string;
  successTitle: string;
  successMessage: string;
}

const DEFAULT: ContactContent = {
  headline: "Ready to Scale?",
  subheadline: "Tell us about your operational needs. We'll build a custom plan and contact us to get started.",
  steps: [
    { title: "Discovery Call", description: "We analyze your workflows and identify the exact profiles you need." },
    { title: "Team Selection", description: "We vet, train, and present candidates that fit your VIBE." },
    { title: "Deployment", description: "Seamless integration into your tech stack. Immediate results." },
  ],
  email: "lyndon@vibeglobally.ph",
  phone: "+63 917 279 8754",
  address: "General Trias, Cavite, Philippines",
  submitButtonText: "Contact Us",
  successTitle: "Request Received",
  successMessage: "Our operations team will be in touch shortly to schedule your discovery call.",
};

export default function ContactEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ContactContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("contact", {
    query: { queryKey: getGetSiteContentQueryKey("contact") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<ContactContent>;
      setForm({ ...DEFAULT, ...c, steps: c.steps ?? DEFAULT.steps });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "contact", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("contact") });
          toast({ title: "Contact section saved successfully" });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const updateStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = [...form.steps];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, steps: updated });
  };

  const addStep = () => setForm({ ...form, steps: [...form.steps, { title: "", description: "" }] });
  const removeStep = (index: number) => setForm({ ...form, steps: form.steps.filter((_, i) => i !== index) });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contact Section</h1>
          <p className="text-muted-foreground mt-1">Edit the contact section heading, process steps, and contact details. The submission form fields stay the same.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Heading</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input className="bg-background" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Subheadline</Label>
              <Textarea className="bg-background resize-none min-h-[80px]" value={form.subheadline} onChange={(e) => setForm({ ...form, subheadline: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Process Steps</CardTitle>
            <Button variant="outline" size="sm" onClick={addStep}>
              <Plus className="w-4 h-4 mr-1" /> Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.steps.map((step, i) => (
              <div key={i} className="border border-border rounded-lg p-4 space-y-3 bg-background/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Step {i + 1}</span>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeStep(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input className="bg-background" value={step.title} onChange={(e) => updateStep(i, "title", e.target.value)} placeholder="e.g. Discovery Call" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea className="bg-background resize-none min-h-[60px]" value={step.description} onChange={(e) => updateStep(i, "description", e.target.value)} />
                </div>
              </div>
            ))}
            {form.steps.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No steps. Click "Add Step" to add one.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Contact Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" className="bg-background" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input type="tel" className="bg-background" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input className="bg-background" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Form Labels</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Submit Button Text</Label>
              <Input className="bg-background" value={form.submitButtonText} onChange={(e) => setForm({ ...form, submitButtonText: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Success Title</Label>
              <Input className="bg-background" value={form.successTitle} onChange={(e) => setForm({ ...form, successTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Success Message</Label>
              <Textarea className="bg-background resize-none min-h-[80px]" value={form.successMessage} onChange={(e) => setForm({ ...form, successMessage: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </AdminLayout>
  );
}
