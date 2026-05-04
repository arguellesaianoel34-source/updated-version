import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TermsOfServiceContent {
  title: string;
  lastUpdated: string;
  content: string;
}

const DEFAULT: TermsOfServiceContent = {
  title: "Terms of Service",
  lastUpdated: new Date().toLocaleDateString(),
  content: `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using VibeGlobally's services, you accept and agree to be bound by these Terms of Service.</p>

<h2>2. Services Description</h2>
<p>VibeGlobally provides virtual assistance, telemarketing, lead generation, and related business process outsourcing services.</p>

<h2>3. User Obligations</h2>
<p>You agree to provide accurate information, maintain the confidentiality of your account, and use our services in compliance with all applicable laws.</p>

<h2>4. Payment Terms</h2>
<p>Payment terms will be specified in your service agreement. All fees are non-refundable unless otherwise stated in writing.</p>

<h2>5. Intellectual Property</h2>
<p>All content, trademarks, and intellectual property on this site are owned by VibeGlobally or its licensors.</p>

<h2>6. Limitation of Liability</h2>
<p>VibeGlobally shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.</p>

<h2>7. Termination</h2>
<p>We reserve the right to terminate or suspend access to our services at our discretion, with or without notice.</p>

<h2>8. Contact Information</h2>
<p>For questions about these Terms of Service, contact us at <a href="mailto:lyndon@vibeglobally.ph" style="color: #f5c518; text-decoration: underline;">lyndon@vibeglobally.ph</a>.</p>`,
};

export default function TermsEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<TermsOfServiceContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("terms", {
    query: { queryKey: getGetSiteContentQueryKey("terms") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<TermsOfServiceContent>;
      setForm({ ...DEFAULT, ...c });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "terms", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("terms") });
          toast({ title: "Terms of Service saved successfully" });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

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
          <h1 className="text-3xl font-bold text-foreground">Terms of Service Editor</h1>
          <p className="text-muted-foreground mt-1">Edit the terms of service content displayed on your website.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.open("/terms-of-service", "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Page Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input 
                className="bg-background" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Last Updated Date</Label>
              <Input 
                className="bg-background" 
                value={form.lastUpdated} 
                onChange={(e) => setForm({ ...form, lastUpdated: e.target.value })} 
                placeholder="e.g., January 1, 2024"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Content (HTML)</CardTitle>
            <p className="text-sm text-muted-foreground">Use HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt; to format your content.</p>
          </CardHeader>
          <CardContent>
            <Textarea 
              className="bg-background resize-none min-h-[500px] font-mono text-sm" 
              value={form.content} 
              onChange={(e) => setForm({ ...form, content: e.target.value })} 
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
