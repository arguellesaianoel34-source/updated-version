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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Badge = "top-rated-plus" | "top-rated" | "none";

interface TeamMember {
  name: string;
  role: string;
  jobSuccess: number;
  badge: Badge;
  initials: string;
}

interface TeamContent {
  sectionLabel: string;
  sectionTitle: string;
  sectionDescription: string;
  members: TeamMember[];
}

const DEFAULT: TeamContent = {
  sectionLabel: "The People Behind the Results",
  sectionTitle: "Meet the Team",
  sectionDescription: "Verified on Upwork with 100% Job Success Scores — our team brings the professionalism and drive that keeps clients coming back.",
  members: [
    { name: "Lyndon A.", role: "Business Manager", jobSuccess: 100, badge: "top-rated", initials: "LA" },
    { name: "Sarah Joy L.", role: "Senior VA & Appointment Setter", jobSuccess: 100, badge: "top-rated", initials: "SL" },
    { name: "Allysa L.", role: "Virtual Assistant", jobSuccess: 100, badge: "top-rated-plus", initials: "AL" },
    { name: "Georgette T.", role: "Virtual Assistant", jobSuccess: 100, badge: "top-rated", initials: "GT" },
  ],
};

export default function TeamEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<TeamContent>(DEFAULT);

  const { data, isLoading } = useGetSiteContent("team", {
    query: { queryKey: getGetSiteContentQueryKey("team") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<TeamContent>;
      setForm({ ...DEFAULT, ...c, members: c.members ?? DEFAULT.members });
    }
  }, [data]);

  const handleSave = () => {
    updateMutation.mutate(
      { section: "team", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("team") });
          toast({ title: "Team section saved successfully" });
        },
        onError: () => toast({ title: "Failed to save", variant: "destructive" }),
      }
    );
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string | number) => {
    const updated = [...form.members];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, members: updated });
  };

  const addMember = () =>
    setForm({
      ...form,
      members: [...form.members, { name: "", role: "", jobSuccess: 100, badge: "top-rated", initials: "" }],
    });

  const removeMember = (index: number) =>
    setForm({ ...form, members: form.members.filter((_, i) => i !== index) });

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
          <h1 className="text-3xl font-bold text-foreground">Team Section</h1>
          <p className="text-muted-foreground mt-1">Manage the team members shown on the landing page.</p>
        </div>
        <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-base">Section Heading</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Section Label (small text above title)</Label>
              <Input className="bg-background" value={form.sectionLabel} onChange={(e) => setForm({ ...form, sectionLabel: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Section Title</Label>
              <Input className="bg-background" value={form.sectionTitle} onChange={(e) => setForm({ ...form, sectionTitle: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea className="bg-background resize-none min-h-[80px]" value={form.sectionDescription} onChange={(e) => setForm({ ...form, sectionDescription: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Team Members</CardTitle>
            <Button variant="outline" size="sm" onClick={addMember}>
              <Plus className="w-4 h-4 mr-1" /> Add Member
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {form.members.map((member, i) => (
              <div key={i} className="border border-border rounded-lg p-4 space-y-3 bg-background/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-muted-foreground">Member {i + 1}</span>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeMember(i)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input className="bg-background" value={member.name} onChange={(e) => updateMember(i, "name", e.target.value)} placeholder="e.g. Lyndon A." />
                  </div>
                  <div className="space-y-2">
                    <Label>Initials (shown in avatar)</Label>
                    <Input className="bg-background" maxLength={3} value={member.initials} onChange={(e) => updateMember(i, "initials", e.target.value.toUpperCase())} placeholder="e.g. LA" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Role / Title</Label>
                  <Input className="bg-background" value={member.role} onChange={(e) => updateMember(i, "role", e.target.value)} placeholder="e.g. Business Manager" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Job Success Score (%)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      className="bg-background"
                      value={member.jobSuccess}
                      onChange={(e) => updateMember(i, "jobSuccess", Math.min(100, Math.max(0, Number(e.target.value))))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Upwork Badge</Label>
                    <Select value={member.badge} onValueChange={(val) => updateMember(i, "badge", val)}>
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-rated-plus">Top Rated Plus</SelectItem>
                        <SelectItem value="top-rated">Top Rated</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            ))}
            {form.members.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No members. Click "Add Member" to add one.</p>
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
