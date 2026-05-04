import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, X, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface SampleCall {
  title: string;
  description: string;
  duration?: string;
  caller?: string;
  audioUrl?: string;
  category?: string;
}

interface SampleCallsContent {
  headline: string;
  headlineAccent: string;
  description: string;
  calls: SampleCall[];
}

const DEFAULT: SampleCallsContent = {
  headline: "Sample Calls",
  headlineAccent: "Hear the Difference",
  description: "Listen to real examples of our virtual assistants in action. Experience the professionalism and expertise that sets us apart.",
  calls: [
    {
      title: "Customer Support Excellence",
      description: "Professional handling of customer inquiries with empathy and efficiency",
      duration: "3:45",
      caller: "Sarah - Customer Support VA",
      category: "Customer Service",
    },
    {
      title: "Sales Qualification Call",
      description: "Expert lead qualification and appointment setting demonstration",
      duration: "5:20",
      caller: "Mike - Sales VA",
      category: "Sales",
    },
    {
      title: "Technical Support Session",
      description: "Clear technical troubleshooting and problem resolution",
      duration: "4:15",
      caller: "Alex - Tech Support VA",
      category: "Technical",
    },
  ],
};

export default function SampleCallsEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<SampleCallsContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("sampleCalls", {
    query: { queryKey: getGetSiteContentQueryKey("sampleCalls") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as any;
      setForm({
        ...DEFAULT,
        ...(data.content as unknown as SampleCallsContent),
        calls: c.calls || DEFAULT.calls,
      });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "sampleCalls", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("sampleCalls") });
          toast({ title: "Sample Calls section saved successfully" });
        },
        onError: () => {
          toast({ title: "Failed to save", variant: "destructive" });
        },
      }
    );
  };

  const addCall = () => {
    setForm({
      ...form,
      calls: [
        ...form.calls,
        {
          title: "New Sample Call",
          description: "Description of the call",
          duration: "0:00",
          caller: "VA Name",
          category: "Category",
        },
      ],
    });
  };

  const updateCall = (index: number, field: keyof SampleCall, value: string) => {
    const updated = [...form.calls];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, calls: updated });
  };

  const removeCall = (index: number) => {
    setForm({ ...form, calls: form.calls.filter((_, i) => i !== index) });
  };

  const handleAudioUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast({ title: "Please upload an audio file", variant: "destructive" });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Audio file must be less than 10MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const audioUrl = event.target?.result as string;
      updateCall(index, "audioUrl", audioUrl);
      toast({ title: "Audio uploaded successfully" });
    };
    reader.readAsDataURL(file);
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
          <h1 className="text-3xl font-bold text-foreground">Sample Calls</h1>
          <p className="text-muted-foreground mt-1">Manage the sample calls section on the landing page.</p>
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

      {/* Section Header */}
      <Card className="bg-card border-border mb-6">
        <CardHeader>
          <CardTitle className="text-base">Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                className="bg-background"
                value={form.headline}
                onChange={(e) => setForm({ ...form, headline: e.target.value })}
                placeholder="e.g. Sample Calls"
              />
            </div>
            <div className="space-y-2">
              <Label>Headline Accent (colored text)</Label>
              <Input
                className="bg-background"
                value={form.headlineAccent}
                onChange={(e) => setForm({ ...form, headlineAccent: e.target.value })}
                placeholder="e.g. Hear the Difference"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              className="bg-background"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Section description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Sample Calls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Sample Calls</h2>
        <Button onClick={addCall} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Call
        </Button>
      </div>

      <div className="space-y-4">
        {form.calls.map((call, index) => (
          <Card key={index} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-base">Call #{index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeCall(index)}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    className="bg-background"
                    value={call.title}
                    onChange={(e) => updateCall(index, "title", e.target.value)}
                    placeholder="Call title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    className="bg-background"
                    value={call.category || ""}
                    onChange={(e) => updateCall(index, "category", e.target.value)}
                    placeholder="e.g. Customer Service, Sales, Technical"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  className="bg-background"
                  value={call.description}
                  onChange={(e) => updateCall(index, "description", e.target.value)}
                  placeholder="Brief description of the call"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Duration (e.g. 3:45)</Label>
                  <Input
                    className="bg-background"
                    value={call.duration || ""}
                    onChange={(e) => updateCall(index, "duration", e.target.value)}
                    placeholder="0:00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Caller Name</Label>
                  <Input
                    className="bg-background"
                    value={call.caller || ""}
                    onChange={(e) => updateCall(index, "caller", e.target.value)}
                    placeholder="e.g. Sarah - Customer Support VA"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Audio File (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleAudioUpload(index, e)}
                    className="bg-background"
                  />
                  {call.audioUrl && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => updateCall(index, "audioUrl", "")}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {call.audioUrl && (
                  <div className="mt-2">
                    <audio src={call.audioUrl} controls className="w-full" />
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Upload an audio file (max 10MB). Supported formats: MP3, WAV, OGG, etc.
                </p>
              </div>
            </CardContent>
          </Card>
        ))}

        {form.calls.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No sample calls added yet.</p>
              <Button onClick={addCall} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Call
              </Button>
            </CardContent>
          </Card>
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
