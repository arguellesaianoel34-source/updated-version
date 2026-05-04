import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FacebookReviewContent {
  facebookReviewUrl?: string;
  callToActionHeading?: string;
  callToActionDescription?: string;
  buttonText?: string;
}

const DEFAULT: FacebookReviewContent = {
  facebookReviewUrl: "https://www.facebook.com/VibeGloballyVirtualAssistance/reviews",
  callToActionHeading: "Have you worked with us?",
  callToActionDescription: "Share your experience and help others discover the quality of our services",
  buttonText: "Leave us a review on Facebook",
};

export default function FacebookReviewEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<FacebookReviewContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("facebookReview", {
    query: { queryKey: getGetSiteContentQueryKey("facebookReview") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<FacebookReviewContent>;
      setForm({ ...DEFAULT, ...c });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "facebookReview", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("facebookReview") });
          toast({ title: "Facebook review settings saved successfully" });
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
          <h1 className="text-3xl font-bold text-foreground">Facebook Review Settings</h1>
          <p className="text-muted-foreground mt-1">Configure the "Leave a Review" call-to-action shown below testimonials.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Instructions Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Use This Feature
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This section appears below your testimonials on the landing page, encouraging visitors to leave reviews on Facebook.</p>
              <div className="mt-4 space-y-2">
                <p className="font-medium text-foreground">📍 How to find your Facebook Review URL:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Go to your Facebook Business Page</li>
                  <li>Click on the "Reviews" tab in the left sidebar</li>
                  <li>Copy the URL from your browser's address bar</li>
                  <li>Paste it in the field below</li>
                </ol>
              </div>
              <div className="mt-4 space-y-2">
                <p className="font-medium text-foreground">💡 Tips:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Keep the heading short and engaging</li>
                  <li>Make the description clear about what you're asking</li>
                  <li>Use action-oriented button text</li>
                  <li>Test the link after saving to ensure it works</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Facebook Review Link</CardTitle>
            <p className="text-sm text-muted-foreground">The URL where visitors will be directed to leave a review.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Facebook Review Page URL</Label>
              <Input 
                className="bg-background font-mono text-sm" 
                value={form.facebookReviewUrl} 
                onChange={(e) => setForm({ ...form, facebookReviewUrl: e.target.value })} 
                placeholder="https://www.facebook.com/YourPage/reviews"
              />
              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <p className="text-xs font-medium text-foreground">Common Facebook Review URL formats:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• <code className="bg-background px-1 py-0.5 rounded">https://www.facebook.com/YourPageName/reviews</code></li>
                  <li>• <code className="bg-background px-1 py-0.5 rounded">https://www.facebook.com/profile.php?id=123456789&sk=reviews</code></li>
                  <li>• <code className="bg-background px-1 py-0.5 rounded">https://www.facebook.com/pg/YourPageName/reviews</code></li>
                </ul>
              </div>
            </div>
            
            {form.facebookReviewUrl && (
              <a 
                href={form.facebookReviewUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Test link (opens in new tab)
              </a>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Call-to-Action Text</CardTitle>
            <p className="text-sm text-muted-foreground">Customize the text shown in the review call-to-action section.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input 
                className="bg-background" 
                value={form.callToActionHeading} 
                onChange={(e) => setForm({ ...form, callToActionHeading: e.target.value })} 
                placeholder="Have you worked with us?"
              />
              <p className="text-xs text-muted-foreground">
                Keep it short and engaging (e.g., "Love our service?", "Worked with us?")
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Input 
                className="bg-background" 
                value={form.callToActionDescription} 
                onChange={(e) => setForm({ ...form, callToActionDescription: e.target.value })} 
                placeholder="Share your experience and help others discover the quality of our services"
              />
              <p className="text-xs text-muted-foreground">
                Explain why they should leave a review (max 100 characters recommended)
              </p>
            </div>
            
            <div className="space-y-2">
              <Label>Button Text</Label>
              <Input 
                className="bg-background" 
                value={form.buttonText} 
                onChange={(e) => setForm({ ...form, buttonText: e.target.value })} 
                placeholder="Leave us a review on Facebook"
              />
              <p className="text-xs text-muted-foreground">
                Use action words (e.g., "Leave a Review", "Share Your Experience", "Write a Review")
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Live Preview
            </CardTitle>
            <p className="text-sm text-muted-foreground">See how it will look on your landing page</p>
          </CardHeader>
          <CardContent>
            <div className="inline-flex flex-col items-center gap-4 p-8 bg-background border-2 border-primary/20 rounded-2xl w-full">
              <p className="text-lg font-semibold text-foreground">
                {form.callToActionHeading || "Have you worked with us?"}
              </p>
              <p className="text-muted-foreground text-center max-w-md">
                {form.callToActionDescription || "Share your experience and help others discover the quality of our services"}
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#1877F2] text-white font-semibold rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>{form.buttonText || "Leave us a review on Facebook"}</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted/50 rounded-md">
              <p className="text-xs text-muted-foreground">
                💡 This section appears below all testimonial cards on your landing page, encouraging visitors to leave their own reviews.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
