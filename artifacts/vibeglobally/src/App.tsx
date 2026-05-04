import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import AdminLogin from "@/pages/admin/login";
import Dashboard from "@/pages/admin/dashboard";
import Contacts from "@/pages/admin/contacts";
import Testimonials from "@/pages/admin/testimonials";
import SMTPSettings from "@/pages/admin/smtp-settings";
import HeroEditor from "@/pages/admin/hero-editor";
import ServicesEditor from "@/pages/admin/services-editor";
import ResultsEditor from "@/pages/admin/results-editor";
import ToolsEditor from "@/pages/admin/tools-editor";
import ClientsEditor from "@/pages/admin/clients-editor";
import ValuesEditor from "@/pages/admin/values-editor";
import ContactEditor from "@/pages/admin/contact-editor";
import TeamEditor from "@/pages/admin/team-editor";
import FAQEditor from "@/pages/admin/faq-editor";
import PrivacyEditor from "@/pages/admin/privacy-editor";
import TermsEditor from "@/pages/admin/terms-editor";
import LogoEditor from "@/pages/admin/logo-editor";
import FacebookReviewEditor from "@/pages/admin/facebook-review-editor";
import SampleCallsEditor from "@/pages/admin/sample-calls-editor";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      staleTime: 0,
    }
  }
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/contacts" component={Contacts} />
      <Route path="/admin/testimonials" component={Testimonials} />
      <Route path="/admin/smtp-settings" component={SMTPSettings} />

      {/* Content Editors */}
      <Route path="/admin/edit-hero" component={HeroEditor} />
      <Route path="/admin/edit-services" component={ServicesEditor} />
      <Route path="/admin/edit-results" component={ResultsEditor} />
      <Route path="/admin/edit-tools" component={ToolsEditor} />
      <Route path="/admin/edit-clients" component={ClientsEditor} />
      <Route path="/admin/edit-values" component={ValuesEditor} />
      <Route path="/admin/edit-contact" component={ContactEditor} />
      <Route path="/admin/edit-team" component={TeamEditor} />
      <Route path="/admin/edit-faq" component={FAQEditor} />
      <Route path="/admin/edit-privacy" component={PrivacyEditor} />
      <Route path="/admin/edit-terms" component={TermsEditor} />
      <Route path="/admin/edit-logo" component={LogoEditor} />
      <Route path="/admin/edit-facebook-review" component={FacebookReviewEditor} />
      <Route path="/admin/edit-sample-calls" component={SampleCallsEditor} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
