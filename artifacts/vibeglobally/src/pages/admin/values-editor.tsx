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

interface ValueItem {
  letter: string;
  word: string;
  desc: string;
}

interface ValuesContent {
  headline: string;
  headlineAccent: string;
  description: string;
  values: ValueItem[];
}

const DEFAULT: ValuesContent = {
  headline: "The",
  headlineAccent: "VIBE",
  description: "We aren't just order-takers. We are a proactive extension of your company, built on a foundation of four core principles that ensure high performance. VibeGlobally is a full-service outsourcing agency providing experts in telemarketing, customer support, virtual assistance, SEO, email marketing, social media management, data entry, and more so you can focus on growing your business while we handle execution, support, and sales.",
  values: [
    { letter: "V", word: "Versatility", desc: "Adapting instantly to your tech stack, your processes, and your changing business needs." },
    { letter: "I", word: "Intensity", desc: "Operating with urgency and drive. We attack quotas and SLA targets relentlessly." },
    { letter: "B", word: "Brilliance", desc: "Smart problem solving. We don't just follow scripts; we optimize workflows." },
    { letter: "E", word: "Enthusiasm", desc: "High energy, positive culture. A team you actually enjoy working with every day." },
  ],
};

export default function ValuesEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ValuesContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("values", {
    query: { queryKey: getGetSiteContentQueryKey("values") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<ValuesContent>;
      setForm({ ...DEFAULT, ...c, values: c.values ?? DEFAULT.values });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "values", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("values") });
          toast({ title: "Values section saved successfully" });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const updateValue = (index: number, field: keyof ValueItem, value: string) => {
    const updated = [...form.values];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, values: updated });
  };

  const addValue = () => setForm({ ...form, values: [...form.values, { letter: "", word: "", desc: "" }] });
  const removeValue = (index: number) => setForm({ ...form, values: form.values.filter((_, i) => i !== index) });

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
          <h1 className="text-3xl font-bold text-foreground">VIBE Values Section</h1>
          <p className="text-muted-foreground mt-1">Edit the framework heading and the four (or more) value pillars.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Headline (rendered as: "The X Framework")</Label>
                <Input className="bg-background" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Headline Accent (highlighted)</Label>
                <Input className="bg-background" value={form.headlineAccent} onChange={(e) => setForm({ ...form, headlineAccent: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea className="bg-background resize-none min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Value Pillars</CardTitle>
            <Button variant="outline" size="sm" onClick={addValue}>
              <Plus className="w-4 h-4 mr-1" /> Add Pillar
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.values.map((v, i) => (
              <div key={i} className="border border-border rounded-lg p-4 space-y-3 bg-background/50">
                <div className="grid grid-cols-1 md:grid-cols-[100px_1fr_auto] gap-3 items-end">
                  <div className="space-y-2">
                    <Label>Letter</Label>
                    <Input className="bg-background text-center" maxLength={2} value={v.letter} onChange={(e) => updateValue(i, "letter", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Word</Label>
                    <Input className="bg-background" value={v.word} onChange={(e) => updateValue(i, "word", e.target.value)} placeholder="e.g. Versatility" />
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeValue(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea className="bg-background resize-none min-h-[60px]" value={v.desc} onChange={(e) => updateValue(i, "desc", e.target.value)} />
                </div>
              </div>
            ))}
            {form.values.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No values. Click "Add Pillar" to add one.</p>
            )}
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
