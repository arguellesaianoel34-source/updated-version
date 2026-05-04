import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  sectionTitle: string;
  sectionDescription: string;
  items: FAQItem[];
}

const DEFAULT: FAQContent = {
  sectionTitle: "Frequently Asked Questions",
  sectionDescription: "Get answers to common questions about our virtual staffing and outsourcing services",
  items: [],
};

export default function FAQEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<FAQContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("faq", {
    query: { queryKey: getGetSiteContentQueryKey("faq") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      setForm({
        ...DEFAULT,
        ...(data.content as unknown as FAQContent),
        items: (data.content as any).items || DEFAULT.items,
      });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "faq", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("faq") });
          toast({ title: "FAQ section saved successfully" });
        },
        onError: () => {
          toast({ title: "Failed to save", variant: "destructive" });
        },
      }
    );
  };

  const updateItem = (index: number, field: keyof FAQItem, value: string) => {
    const updated = [...form.items];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, items: updated });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { question: "New question?", answer: "Answer goes here." }],
    });
  };

  const removeItem = (index: number) => {
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const moveItem = (from: number, to: number) => {
    const updated = [...form.items];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    setForm({ ...form, items: updated });
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
          <h1 className="text-3xl font-bold text-foreground">FAQ Section</h1>
          <p className="text-muted-foreground mt-1">Manage the frequently asked questions on your landing page.</p>
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

      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-base">Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Section Title</Label>
            <Input
              className="bg-background"
              value={form.sectionTitle}
              onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}
              placeholder="e.g. Frequently Asked Questions"
            />
          </div>
          <div className="space-y-2">
            <Label>Section Description</Label>
            <Textarea
              className="bg-background resize-none"
              value={form.sectionDescription}
              onChange={(e) => setForm({ ...form, sectionDescription: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">FAQ Items ({form.items.length})</h2>
        <Button variant="outline" size="sm" onClick={addItem}>
          <Plus className="w-4 h-4 mr-1" /> Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {form.items.map((item, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground"
                    disabled={i === 0}
                    onClick={() => moveItem(i, i - 1)}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground"
                    disabled={i === form.items.length - 1}
                    onClick={() => moveItem(i, i + 1)}
                  >
                    ↓
                  </Button>
                </div>
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-foreground flex-1 truncate">{item.question || `FAQ ${i + 1}`}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Question</Label>
                <Input
                  className="bg-background"
                  value={item.question}
                  onChange={(e) => updateItem(i, "question", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea
                  className="bg-background resize-none min-h-[100px]"
                  value={item.answer}
                  onChange={(e) => updateItem(i, "answer", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {form.items.length === 0 && (
          <div className="text-center py-12 bg-card rounded-xl border border-border text-muted-foreground">
            No FAQs yet. Click "Add FAQ" to get started.
          </div>
        )}
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
