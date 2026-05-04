import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useGetSiteContent, useUpdateSiteContent, getGetSiteContentQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, Save, Send, TestTube } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  smtpHost: z.string().min(1, "SMTP Host is required"),
  smtpPort: z.string().min(1, "SMTP Port is required"),
  smtpUser: z.string().min(1, "SMTP Username is required"),
  smtpPassword: z.string().min(1, "SMTP Password is required"),
  fromEmail: z.string().email("Invalid email address"),
  fromName: z.string().min(1, "From Name is required"),
});

const testEmailSchema = z.object({
  testEmail: z.string().email("Invalid email address"),
  testSubject: z.string().min(1, "Subject is required"),
  testMessage: z.string().min(1, "Message is required"),
});

export default function SMTPSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTesting, setIsTesting] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showTestEmail, setShowTestEmail] = useState(false);

  const { data: settingsData, isLoading } = useGetSiteContent("smtp", {
    query: { queryKey: getGetSiteContentQueryKey("smtp") },
  });

  const updateMutation = useUpdateSiteContent();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      smtpHost: "smtp-relay.brevo.com",
      smtpPort: "587",
      smtpUser: "",
      smtpPassword: "",
      fromEmail: "lyndon@vibeglobally.ph",
      fromName: "VibeGlobally",
    },
  });

  // Load settings from database when data is available
  useEffect(() => {
    if (settingsData?.content) {
      const settings = settingsData.content as Record<string, string>;
      form.reset({
        smtpHost: settings.smtpHost || "smtp-relay.brevo.com",
        smtpPort: settings.smtpPort || "587",
        smtpUser: settings.smtpUser || "",
        smtpPassword: settings.smtpPassword || "",
        fromEmail: settings.fromEmail || "lyndon@vibeglobally.ph",
        fromName: settings.fromName || "VibeGlobally",
      });
    }
  }, [settingsData, form]);

  const testEmailForm = useForm<z.infer<typeof testEmailSchema>>({
    resolver: zodResolver(testEmailSchema),
    defaultValues: {
      testEmail: "lyndon@vibeglobally.ph",
      testSubject: "Test Email from VibeGlobally",
      testMessage: "This is a test email to verify your Brevo SMTP configuration is working correctly.",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateMutation.mutate(
      { section: "smtp", data: values as unknown as Record<string, unknown> },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetSiteContentQueryKey("smtp") });
          
          toast({
            title: "Settings Saved",
            description: "Brevo SMTP settings have been saved successfully to the database.",
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to save SMTP settings.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const testConnection = async () => {
    setIsTesting(true);
    try {
      const config = form.getValues();
      
      console.log('Testing connection with config:', {
        host: config.smtpHost,
        port: config.smtpPort,
        user: config.smtpUser,
        hasPassword: !!config.smtpPassword
      });
      
      const response = await fetch('/api/email/test-connection', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify(config),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error(`Server error (${response.status}): ${responseText || 'No response from server'}`);
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || `Server error: ${response.status}`);
      }

      toast({
        title: "Connection Successful",
        description: result.message || "SMTP connection test passed!",
      });
    } catch (error: any) {
      console.error('Test connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to SMTP server. Please check your settings.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const sendTestEmail = async (values: z.infer<typeof testEmailSchema>) => {
    setIsSendingTest(true);
    try {
      const config = form.getValues();
      
      const response = await fetch('/api/email/send-test', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          ...config,
          to: values.testEmail,
          subject: values.testSubject,
          text: values.testMessage,
        }),
      });

      const responseText = await response.text();
      let result;
      
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error(`Server error: ${responseText || 'No response from server'}`);
      }

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to send email');
      }

      toast({
        title: "Test Email Sent",
        description: result.message || `Test email sent successfully to ${values.testEmail}. Check your inbox!`,
      });
      setShowTestEmail(false);
    } catch (error: any) {
      console.error('Send test email error:', error);
      toast({
        title: "Failed to Send",
        description: error.message || "Could not send test email. Please check your SMTP settings and ensure your sender email is verified in Brevo.",
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <AdminLayout>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Mail className="w-8 h-8 text-primary" />
              SMTP Settings
            </h1>
            <p className="text-muted-foreground mt-1">Configure Brevo SMTP for email notifications</p>
          </div>

      <Alert className="mb-6 bg-primary/5 border-primary/20">
        <Mail className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>Brevo SMTP Configuration:</strong> Get your SMTP credentials from your Brevo account at{" "}
          <a 
            href="https://app.brevo.com/settings/keys/smtp" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Brevo SMTP Settings
          </a>
        </AlertDescription>
      </Alert>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Email Configuration</CardTitle>
          <CardDescription>
            Configure your Brevo SMTP settings to send emails from contact forms and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="smtpHost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Host</FormLabel>
                      <FormControl>
                        <Input placeholder="smtp-relay.brevo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        Brevo SMTP server address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="smtpPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMTP Port</FormLabel>
                      <FormControl>
                        <Input placeholder="587" {...field} />
                      </FormControl>
                      <FormDescription>
                        Usually 587 for TLS or 465 for SSL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="smtpUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Brevo login email" {...field} />
                    </FormControl>
                    <FormDescription>
                      Your Brevo account email address
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smtpPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SMTP Password / API Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Your Brevo SMTP key" {...field} />
                    </FormControl>
                    <FormDescription>
                      Get this from Brevo → Settings → SMTP & API
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Sender Information</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="lyndon@vibeglobally.ph" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email address that appears as sender
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fromName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Name</FormLabel>
                        <FormControl>
                          <Input placeholder="VibeGlobally" {...field} />
                        </FormControl>
                        <FormDescription>
                          Name that appears as sender
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={updateMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="outline"
                  onClick={testConnection}
                  disabled={isTesting}
                >
                  {isTesting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Test Connection
                    </>
                  )}
                </Button>

                <Button 
                  type="button"
                  variant="secondary"
                  onClick={() => setShowTestEmail(!showTestEmail)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  {showTestEmail ? "Hide" : "Send"} Test Email
                </Button>
              </div>
            </form>
          </Form>

          {showTestEmail && (
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-lg font-semibold mb-4">Send Test Email</h3>
              <Form {...testEmailForm}>
                <form onSubmit={testEmailForm.handleSubmit(sendTestEmail)} className="space-y-4">
                  <FormField
                    control={testEmailForm.control}
                    name="testEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="lyndon@vibeglobally.ph" {...field} />
                        </FormControl>
                        <FormDescription>
                          Email address to send the test to
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={testEmailForm.control}
                    name="testSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Test Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={testEmailForm.control}
                    name="testMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Test message content" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={isSendingTest}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isSendingTest ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 bg-muted/30 border-border">
        <CardHeader>
          <CardTitle className="text-base">Quick Setup Guide</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <ol className="list-decimal list-inside space-y-2">
            <li>Log in to your Brevo account at <a href="https://app.brevo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">app.brevo.com</a></li>
            <li>Go to Settings → SMTP & API</li>
            <li>Generate a new SMTP key if you don't have one</li>
            <li>Copy your SMTP credentials and paste them above</li>
            <li>Click "Test Connection" to verify your settings</li>
            <li>Save your settings when the test is successful</li>
          </ol>
        </CardContent>
      </Card>
        </>
      )}
    </AdminLayout>
  );
}
