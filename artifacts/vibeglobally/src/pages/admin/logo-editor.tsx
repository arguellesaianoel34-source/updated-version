import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Upload, X, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LogoContent {
  logoUrl?: string;
  logoText?: string;
  logoAccentText?: string;
}

const DEFAULT: LogoContent = {
  logoUrl: "",
  logoText: "Vibe",
  logoAccentText: "Globally",
};

export default function LogoEditor() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState<LogoContent>(DEFAULT);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useGetSiteContent("logo", {
    query: { queryKey: getGetSiteContentQueryKey("logo") },
  });

  const updateMutation = useUpdateSiteContent();

  useEffect(() => {
    if (data?.content) {
      const c = data.content as Partial<LogoContent>;
      const merged = { ...DEFAULT, ...c };
      setForm(merged);
      if (merged.logoUrl) {
        setImagePreview(merged.logoUrl);
      }
    }
  }, [data]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({ title: "Please upload an image file", variant: "destructive" });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "Image must be less than 2MB", variant: "destructive" });
      return;
    }

    setUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setForm({ ...form, logoUrl: base64String });
      setUploading(false);
    };
    reader.onerror = () => {
      toast({ title: "Failed to read image", variant: "destructive" });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setForm({ ...form, logoUrl: "" });
  };

  const handleSave = () => {
    updateMutation.mutate(
      { section: "logo", data: form as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("logo") });
          toast({ title: "Logo saved successfully" });
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
          <h1 className="text-3xl font-bold text-foreground">Logo Settings</h1>
          <p className="text-muted-foreground mt-1">Upload a custom logo or use text-based branding for your website.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => window.open("/", "_blank")}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview Site
          </Button>
          <Button onClick={handleSave} disabled={updateMutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Logo Image</CardTitle>
            <p className="text-sm text-muted-foreground">Upload a custom logo image (PNG, JPG, SVG). The logo will be displayed as a circle. Recommended: square image for best results. Max 2MB. The site name will appear next to your logo.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {imagePreview ? (
              <div className="space-y-4">
                <div className="relative inline-block">
                  <div className="p-4 bg-background border border-border rounded-lg">
                    <img 
                      src={imagePreview} 
                      alt="Logo preview" 
                      className="h-16 w-16 object-cover rounded-full"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor="logo-upload" className="cursor-pointer">
                    <Button variant="outline" asChild>
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Change Image
                      </span>
                    </Button>
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">Click to upload logo image</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, SVG up to 2MB</p>
                  </div>
                </Label>
                <Input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base">Text Logo (Fallback)</CardTitle>
            <p className="text-sm text-muted-foreground">If no image is uploaded, the site will display a text-based logo.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Logo Text (Normal)</Label>
              <Input 
                className="bg-background" 
                value={form.logoText} 
                onChange={(e) => setForm({ ...form, logoText: e.target.value })} 
                placeholder="Vibe"
              />
            </div>
            <div className="space-y-2">
              <Label>Logo Text (Accent)</Label>
              <Input 
                className="bg-background" 
                value={form.logoAccentText} 
                onChange={(e) => setForm({ ...form, logoAccentText: e.target.value })} 
                placeholder="Globally"
              />
            </div>
            <div className="p-4 bg-background border border-border rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Preview:</p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-xl">
                  {form.logoText?.charAt(0) || "V"}
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">
                  {form.logoText || "Vibe"}<span className="text-primary">{form.logoAccentText || "Globally"}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
