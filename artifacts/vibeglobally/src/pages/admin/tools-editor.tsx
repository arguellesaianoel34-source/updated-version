import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ToolsContent {
  sectionTitle: string;
  toolsTitle: string;
  toolsDescription: string;
  industriesTitle: string;
  industriesDescription: string;
  tools: string[];
  industries: string[];
}

const DEFAULT: ToolsContent = {
  sectionTitle: "Built for Your Stack & Industry",
  toolsTitle: "CRMs & Tools We've Handled",
  toolsDescription: "Our agents plug into your existing tech stack from day one — no ramp-up lag.",
  industriesTitle: "Industries We've Worked With",
  industriesDescription: "Deep domain knowledge means we understand your prospect's pain points before the first call.",
  tools: [],
  industries: [],
};

const DEFAULT_TOOLS = [
  "Monday.com", "Intercom", "LiveAgent", "Talkdesk", "Vonage Business", 
  "CloudTalk", "Grasshopper", "ActiveCampaign", "Mailchimp", "Klaviyo", 
  "Zapier", "Calendly"
];

export default function ToolsEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<ToolsContent>(DEFAULT);
  const [newTool, setNewTool] = useState("");
  const [newIndustry, setNewIndustry] = useState("");

  const { data, isLoading } = useGetSiteContent("tools", {
    query: { queryKey: getGetSiteContentQueryKey("tools") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as any;
      setForm({
        ...DEFAULT,
        ...(data.content as unknown as ToolsContent),
        tools: c.tools || DEFAULT.tools,
        industries: c.industries || DEFAULT.industries,
      });
    }
  }, [data]);

  const addRequestedTools = () => {
    const updatedTools = Array.from(new Set([...form.tools, ...DEFAULT_TOOLS]));
    setForm({ ...form, tools: updatedTools });
    toast({ title: "Requested tools added to the list" });
  };

  const handleSave = () => {
    updateMutation.mutate(
      { section: "tools", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("tools") });
          toast({ title: "Tools & Industries section saved successfully" });
        },
        onError: () => {
          toast({ title: "Failed to save", variant: "destructive" });
        },
      }
    );
  };

  const addTool = () => {
    const trimmed = newTool.trim();
    if (!trimmed || form.tools.includes(trimmed)) return;
    setForm({ ...form, tools: [...form.tools, trimmed] });
    setNewTool("");
  };

  const removeTool = (tool: string) => {
    setForm({ ...form, tools: form.tools.filter((t) => t !== tool) });
  };

  const addIndustry = () => {
    const trimmed = newIndustry.trim();
    if (!trimmed || form.industries.includes(trimmed)) return;
    setForm({ ...form, industries: [...form.industries, trimmed] });
    setNewIndustry("");
  };

  const removeIndustry = (industry: string) => {
    setForm({ ...form, industries: form.industries.filter((ind) => ind !== industry) });
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
          <h1 className="text-3xl font-bold text-foreground">Tools & Industries</h1>
          <p className="text-muted-foreground mt-1">Manage the tools and industries shown in the experience section.</p>
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
          <CardTitle className="text-base">Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Main Section Title</Label>
            <Input
              className="bg-background"
              value={form.sectionTitle}
              onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })}
              placeholder="e.g. Built for Your Stack & Industry"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">CRMs & Tools</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                className="bg-background"
                value={form.toolsTitle}
                onChange={(e) => setForm({ ...form, toolsTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Column Description</Label>
              <Input
                className="bg-background"
                value={form.toolsDescription}
                onChange={(e) => setForm({ ...form, toolsDescription: e.target.value })}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Add Tool</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-xs text-primary hover:text-primary hover:bg-primary/10"
                  onClick={addRequestedTools}
                >
                  Add Presets
                </Button>
              </div>
              <div className="flex gap-2">
                <Input
                  className="bg-background"
                  value={newTool}
                  onChange={(e) => setNewTool(e.target.value)}
                  placeholder="e.g. Hubspot"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTool(); } }}
                />
                <Button variant="outline" size="icon" onClick={addTool}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-background border border-border">
              {form.tools.length === 0 && (
                <span className="text-sm text-muted-foreground">No tools added yet.</span>
              )}
              {form.tools.map((tool) => (
                <Badge
                  key={tool}
                  variant="secondary"
                  className="flex items-center gap-1 pl-3 pr-1 py-1 text-sm"
                >
                  {tool}
                  <button
                    onClick={() => removeTool(tool)}
                    className="ml-1 rounded-full hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Industries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Column Title</Label>
              <Input
                className="bg-background"
                value={form.industriesTitle}
                onChange={(e) => setForm({ ...form, industriesTitle: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Column Description</Label>
              <Input
                className="bg-background"
                value={form.industriesDescription}
                onChange={(e) => setForm({ ...form, industriesDescription: e.target.value })}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label>Add Industry</Label>
              <div className="flex gap-2">
                <Input
                  className="bg-background"
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="e.g. Real Estate"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIndustry(); } }}
                />
                <Button variant="outline" size="icon" onClick={addIndustry}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[48px] p-3 rounded-lg bg-background border border-border">
              {form.industries.length === 0 && (
                <span className="text-sm text-muted-foreground">No industries added yet.</span>
              )}
              {form.industries.map((ind) => (
                <Badge
                  key={ind}
                  variant="outline"
                  className="flex items-center gap-1 pl-3 pr-1 py-1 text-sm"
                >
                  {ind}
                  <button
                    onClick={() => removeIndustry(ind)}
                    className="ml-1 rounded-full hover:text-destructive transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
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
