import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useListContacts, useUpdateContact, useDeleteContact, getListContactsQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Loader2, Trash2, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function Contacts() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const queryParams = statusFilter !== "all" ? { status: statusFilter as any } : undefined;
  
  const { data, isLoading } = useListContacts(queryParams, {
    query: {
      queryKey: getListContactsQueryKey(queryParams)
    }
  });

  const updateStatus = useUpdateContact();
  const deleteContact = useDeleteContact();

  const handleStatusChange = (id: string, newStatus: "new" | "read" | "responded") => {
    updateStatus.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        // Optimistically patch cache
        queryClient.invalidateQueries({ queryKey: getListContactsQueryKey(queryParams) });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
        toast({ title: "Status updated" });
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteContact.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListContactsQueryKey(queryParams) });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
        setSelectedContact(null);
        toast({ title: "Contact deleted" });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return <Badge className="bg-accent/20 text-accent hover:bg-accent/30 border-0">New</Badge>;
      case 'read': return <Badge variant="secondary" className="border-0">Read</Badge>;
      case 'responded': return <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-0">Responded</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredContacts = (data?.contacts || []).filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
    (c.service && c.service.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leads & Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage your inbound operational inquiries.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 bg-background/50">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, email, or company..." 
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-background">
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => {
                      setSelectedContact(contact);
                      if (contact.status === 'new') handleStatusChange(contact.id, 'read');
                    }}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{contact.name}</span>
                          <span className="text-xs text-muted-foreground font-normal">{contact.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>{contact.company || '-'}</TableCell>
                      <TableCell>
                        <span className="truncate max-w-[150px] inline-block">{contact.service || '-'}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(contact.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(contact.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <Select 
                          value={contact.status} 
                          onValueChange={(val: any) => handleStatusChange(contact.id, val)}
                        >
                          <SelectTrigger className="w-[130px] ml-auto h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Mark New</SelectItem>
                            <SelectItem value="read">Mark Read</SelectItem>
                            <SelectItem value="responded">Mark Responded</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      No contacts found matching your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={(o) => !o && setSelectedContact(null)}>
        {selectedContact && (
          <DialogContent className="max-w-2xl bg-card border-border">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <DialogTitle className="text-2xl">{selectedContact.name}</DialogTitle>
                {getStatusBadge(selectedContact.status)}
              </div>
              <DialogDescription>
                Received on {format(new Date(selectedContact.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-6 my-6">
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Email</span>
                <p className="font-medium">
                  <a href={`mailto:${selectedContact.email}`} className="text-primary hover:underline">{selectedContact.email}</a>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Phone</span>
                <p className="font-medium">{selectedContact.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Company</span>
                <p className="font-medium">{selectedContact.company || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm font-medium text-muted-foreground">Service Interest</span>
                <p className="font-medium">{selectedContact.service || 'Not specified'}</p>
              </div>
            </div>

            <div className="bg-background p-4 rounded-lg border border-border mb-6">
              <span className="text-sm font-medium text-muted-foreground block mb-2">Message</span>
              <p className="whitespace-pre-wrap">{selectedContact.message}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the contact
                      from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => handleDelete(selectedContact.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setSelectedContact(null)}>Close</Button>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    if (selectedContact.status !== 'responded') {
                      handleStatusChange(selectedContact.id, 'responded');
                    }
                    setSelectedContact(null);
                  }}
                >
                  Mark as Responded
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </AdminLayout>
  );
}
