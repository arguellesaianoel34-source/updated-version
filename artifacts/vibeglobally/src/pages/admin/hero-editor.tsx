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

interface HeroStat {
  value: string;
  label: string;
}

interface HeroContent {
  badgeText: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  tagline: string;
  stats: HeroStat[];
}

const DEFAULT: HeroContent = {
  badgeText: "#VibeAlong - Telemarketing & Virtual Assistance Agency",
  headline: "Why",
  headlineAccent: "US?",
  subheadline: "VibeGlobally is a full-service outsourcing agency providing experts in telemarketing, customer support, virtual assistance, SEO, email marketing, social media management, data entry, and more so you can focus on growing your business while we handle execution, support, and sales.",
  tagline: "Your hub for seamless connections between business leaders and potential partners. Join us on a journey where connections thrive and business possibilities unfold.",
  stats: [
    { value: "200+", label: "Calls Per Agent / Day" },
    { value: "40%+", label: "Avg. Conversion Lift" },
    { value: "3+", label: "Years of Operations" },
  ],
};

export default function HeroEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<HeroContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("hero", {
    query: { queryKey: getGetSiteContentQueryKey("hero") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      setForm({
        ...DEFAULT,
        ...(data.content as unknown as HeroContent),
        stats: (data.content as any).stats || DEFAULT.stats,
      });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "hero", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("hero") });
          toast({ title: "Hero section saved successfully" });
        },
        onError: () => {
          toast({ title: "Failed to save", variant: "destructive" });
        },
      }
    );
  };

  const updateStat = (index: number, field: keyof HeroStat, value: string) => {
    const updated = [...form.stats];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, stats: updated });
  };

  const addStat = () => {
    setForm({ ...form, stats: [...form.stats, { value: "", label: "" }] });
  };

  const removeStat = (index: number) => {
    setForm({ ...form, stats: form.stats.filter((_, i) => i !== index) });
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
          <h1 className="text-3xl font-bold text-foreground">Hero Section</h1>
          <p className="text-muted-foreground mt-1">Edit the main banner content shown at the top of your landing page.</p>
        </div>
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Badge & Headlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Badge Text</Label>
              <Input
                className="bg-background"
                value={form.badgeText}
                onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                placeholder="e.g. #VibeAlong — Agency tagline"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Main Headline</Label>
                <Input
                  className="bg-background"
                  value={form.headline}
                  onChange={(e) => setForm({ ...form, headline: e.target.value })}
                  placeholder="e.g. Your Sales Pipeline,"
                />
              </div>
              <div className="space-y-2">
                <Label>Accent Headline (highlighted in color)</Label>
                <Input
                  className="bg-background"
                  value={form.headlineAccent}
                  onChange={(e) => setForm({ ...form, headlineAccent: e.target.value })}
                  placeholder="e.g. Filled Daily."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sub-headline</Label>
              <Textarea
                className="bg-background resize-none min-h-[80px]"
                value={form.subheadline}
                onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline (smaller text below)</Label>
              <Textarea
                className="bg-background resize-none"
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Stats Bar</CardTitle>
            <Button variant="outline" size="sm" onClick={addStat}>
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.stats.map((stat, i) => (
              <div key={i} className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Value</Label>
                  <Input
                    className="bg-background"
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="e.g. 200+"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Label</Label>
                  <Input
                    className="bg-background"
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="e.g. Calls Per Agent / Day"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive mb-0.5"
                  onClick={() => removeStat(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {form.stats.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No stats. Click "Add Stat" to add one.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </AdminLayout>
  );
}
