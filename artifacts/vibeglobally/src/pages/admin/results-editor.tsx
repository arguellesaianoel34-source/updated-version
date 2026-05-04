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

interface Metric {
  value: string;
  label: string;
}

interface WorkHistoryItem {
  title: string;
  period: string;
  earned: string;
  rate: string;
  hours: string;
}

interface ResultsContent {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  metrics: Metric[];
  workHistory: WorkHistoryItem[];
}

const DEFAULT: ResultsContent = {
  sectionLabel: "Track Record",
  sectionTitle: "Work History",
  sectionDescription: "Real numbers from real client engagements. This is what we bring to every project.",
  metrics: [],
  workHistory: [],
};

export default function ResultsEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ResultsContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("results", {
    query: { queryKey: getGetSiteContentQueryKey("results") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as any;
      setForm({
        ...DEFAULT,
        ...(data.content as unknown as ResultsContent),
        metrics: c.metrics || DEFAULT.metrics,
        workHistory: c.workHistory || DEFAULT.workHistory,
      });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "results", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("results") });
          toast({ title: "Results section saved successfully" });
        },
        onError: () => {
          toast({ title: "Failed to save", variant: "destructive" });
        },
      }
    );
  };

  const updateMetric = (index: number, field: keyof Metric, value: string) => {
    const updated = [...form.metrics];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, metrics: updated });
  };

  const addMetric = () => {
    setForm({ ...form, metrics: [...form.metrics, { value: "", label: "" }] });
  };

  const removeMetric = (index: number) => {
    setForm({ ...form, metrics: form.metrics.filter((_, i) => i !== index) });
  };

  const updateJob = (index: number, field: keyof WorkHistoryItem, value: string) => {
    const updated = [...form.workHistory];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, workHistory: updated });
  };

  const addJob = () => {
    setForm({
      ...form,
      workHistory: [...form.workHistory, { title: "", period: "", earned: "", rate: "", hours: "" }],
    });
  };

  const removeJob = (index: number) => {
    setForm({ ...form, workHistory: form.workHistory.filter((_, i) => i !== index) });
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
          <h1 className="text-3xl font-bold text-foreground">Results & Work History</h1>
          <p className="text-muted-foreground mt-1">Edit metrics and work history entries shown on your landing page.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Section Label</Label>
              <Input
                className="bg-background"
                value={form.sectionLabel}
                onChange={(e) => setForm({ ...form, sectionLabel: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input
                className="bg-background"
                value={form.sectionTitle}
                onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}
              />
            </div>
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
        <h2 className="text-lg font-semibold text-foreground">Key Metrics ({form.metrics.length})</h2>
        <Button variant="outline" size="sm" onClick={addMetric}>
          <Plus className="w-4 h-4 mr-1" /> Add Metric
        </Button>
      </div>

      <div className="space-y-3 mb-8">
        {form.metrics.map((metric, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <Label>Value</Label>
                  <Input
                    className="bg-background"
                    value={metric.value}
                    onChange={(e) => updateMetric(i, "value", e.target.value)}
                    placeholder="e.g. 1,200+"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Label</Label>
                  <Input
                    className="bg-background"
                    value={metric.label}
                    onChange={(e) => updateMetric(i, "label", e.target.value)}
                    placeholder="e.g. Hours of Billed Work"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive mb-0.5"
                  onClick={() => removeMetric(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {form.metrics.length === 0 && (
          <div className="text-center py-8 bg-card rounded-xl border border-border text-muted-foreground">
            No metrics yet. Click "Add Metric" to get started.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">Work History ({form.workHistory.length})</h2>
        <Button variant="outline" size="sm" onClick={addJob}>
          <Plus className="w-4 h-4 mr-1" /> Add Job
        </Button>
      </div>

      <div className="space-y-4">
        {form.workHistory.map((job, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{job.title || `Job ${i + 1}`}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => removeJob(i)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Job Title</Label>
                  <Input
                    className="bg-background"
                    value={job.title}
                    onChange={(e) => updateJob(i, "title", e.target.value)}
                    placeholder="e.g. Appointment Setter"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Input
                    className="bg-background"
                    value={job.period}
                    onChange={(e) => updateJob(i, "period", e.target.value)}
                    placeholder="e.g. Jan 2024 – Present"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Total Earned</Label>
                  <Input
                    className="bg-background"
                    value={job.earned}
                    onChange={(e) => updateJob(i, "earned", e.target.value)}
                    placeholder="e.g. $1,189.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hourly Rate</Label>
                  <Input
                    className="bg-background"
                    value={job.rate}
                    onChange={(e) => updateJob(i, "rate", e.target.value)}
                    placeholder="e.g. $14.16 / hr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Hours Worked</Label>
                  <Input
                    className="bg-background"
                    value={job.hours}
                    onChange={(e) => updateJob(i, "hours", e.target.value)}
                    placeholder="e.g. 198 hours"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {form.workHistory.length === 0 && (
          <div className="text-center py-8 bg-card rounded-xl border border-border text-muted-foreground">
            No work history yet. Click "Add Job" to get started.
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
