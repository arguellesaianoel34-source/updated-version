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

interface PrivacyPolicyContent {
  title: string;
  lastUpdated: string;
  content: string;
}

const DEFAULT: PrivacyPolicyContent = {
  title: "Privacy Policy",
  lastUpdated: new Date().toLocaleDateString(),
  content: `<h2>1. Information We Collect</h2>
<p>We collect information you provide directly to us when you use our services, including your name, email address, phone number, and company information.</p>

<h2>2. How We Use Your Information</h2>
<p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to comply with legal obligations.</p>

<h2>3. Information Sharing</h2>
<p>We do not sell or share your personal information with third parties except as necessary to provide our services or as required by law.</p>

<h2>4. Data Security</h2>
<p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, or destruction.</p>

<h2>5. Your Rights</h2>
<p>You have the right to access, correct, or delete your personal information. Contact us at <a href="mailto:lyndon@vibeglobally.ph" style="color: #f5c518; text-decoration: underline;">lyndon@vibeglobally.ph</a> to exercise these rights.</p>

<h2>6. Contact Us</h2>
<p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:lyndon@vibeglobally.ph" style="color: #f5c518; text-decoration: underline;">lyndon@vibeglobally.ph</a>.</p>`,
};

export default function PrivacyEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<PrivacyPolicyContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("privacy", {
    query: { queryKey: getGetSiteContentQueryKey("privacy") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<PrivacyPolicyContent>;
      setForm({ ...DEFAULT, ...c });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "privacy", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("privacy") });
          toast({ title: "Privacy Policy saved successfully" });
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
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy Editor</h1>
          <p className="text-muted-foreground mt-1">Edit the privacy policy content displayed on your website.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.open("/privacy-policy", "_blank")}
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
