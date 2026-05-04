import { Link, useLocation } from "wouter";
import { useGetAuthMe, useAdminLogout } from "@workspace/api-client-react";
import { LayoutDashboard, Users, MessageSquareQuote, LogOut, Loader2, Sparkles, Wrench, BarChart2, Settings, Building2, Heart, UserCircle2, HelpCircle, Image, Facebook, Phone, Mail, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const { data: auth, isLoading } = useGetAuthMe({
    query: {
      retry: false,
      queryKey: ["/api/auth/me"],
    }
  });

  const logout = useAdminLogout();
  const [contentOpen, setContentOpen] = useState(
    location.startsWith("/admin/edit-")
  );

  useEffect(() => {
    if (!isLoading && (!auth || !auth.authenticated)) {
      setLocation("/admin/login");
    }
  }, [auth, isLoading, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.clear();
        setLocation("/admin/login");
      }
    });
  };

  if (isLoading || !auth?.authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/contacts", label: "Contacts", icon: Users },
    { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
    { href: "/admin/smtp-settings", label: "SMTP Settings", icon: Server },
  ];

  const contentEditors = [
    { href: "/admin/edit-logo", label: "Logo & Branding", icon: Image },
    { href: "/admin/edit-hero", label: "Hero Section", icon: Sparkles },
    { href: "/admin/edit-services", label: "Services", icon: Settings },
    { href: "/admin/edit-results", label: "Results & History", icon: BarChart2 },
    { href: "/admin/edit-tools", label: "Tools & Industries", icon: Wrench },
    { href: "/admin/edit-sample-calls", label: "Sample Calls", icon: Phone },
    { href: "/admin/edit-clients", label: "Clients", icon: Building2 },
    { href: "/admin/edit-values", label: "VIBE Values", icon: Heart },
    { href: "/admin/edit-team", label: "Team", icon: UserCircle2 },
    { href: "/admin/edit-contact", label: "Contact Section", icon: Mail },
    { href: "/admin/edit-faq", label: "FAQ", icon: HelpCircle },
    { href: "/admin/edit-facebook-review", label: "Facebook Reviews CTA", icon: Facebook },
    { href: "/admin/edit-privacy", label: "Privacy Policy", icon: Settings },
    { href: "/admin/edit-terms", label: "Terms of Service", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
              V
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Admin<span className="text-primary">Panel</span>
            </span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}>
                  <item.icon size={18} />
                  {item.label}
                </div>
              </Link>
            );
          })}

          <Collapsible open={contentOpen} onOpenChange={setContentOpen}>
            <CollapsibleTrigger asChild>
              <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground`}>
                <Settings size={18} />
                <span className="flex-1 text-left">Content Editor</span>
                <ChevronDown size={14} className={`transition-transform ${contentOpen ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4 space-y-1 mt-1">
              {contentEditors.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}>
                      <item.icon size={15} />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </nav>

        <div className="p-4 border-t border-border">
          <div className="mb-4 px-4 py-2 bg-muted/50 rounded-md flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {auth.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-sm">
              <p className="font-medium text-foreground">{auth.username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-border"
            onClick={handleLogout}
            disabled={logout.isPending}
          >
            {logout.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <LogOut className="w-4 h-4 mr-2" />}
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:hidden">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold text-sm">
              V
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Admin
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </Button>
        </header>

        <div className="flex-1 overflow-auto bg-background p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
