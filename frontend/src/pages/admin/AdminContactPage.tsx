import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Mail, Trash2, Eye, Calendar, User, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { useAdminAuth } from "@/contexts/AdminAuthContext";
import { contactAPI } from "@/lib/api";

interface Contact {
  _id: string;
  fullName: string;
  emailAddress: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { getAuthHeaders } = useAdminAuth();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { Authorization } = getAuthHeaders();
      const data = await contactAPI.getAllContacts(Authorization);
      setContacts(data);
    } catch (error) {
      console.error('Fetch contacts error:', error);
      toast.error('Failed to fetch contact messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact message?')) {
      return;
    }

    try {
      const { Authorization } = getAuthHeaders();
      await contactAPI.deleteContact(contactId, Authorization);
      toast.success('Contact message deleted successfully');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete contact message');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contact Messages</h1>
          <p className="text-gray-600">View and manage messages from the contact form</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {contacts.length} messages
        </Badge>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <Card key={contact._id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{contact.fullName}</h3>
                      <Badge variant="outline" className="text-xs">
                        {contact.emailAddress}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">Subject:</span> {contact.subject}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>Received: {formatDate(contact.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Contact Message Details</DialogTitle>
                        <DialogDescription>
                          Message from {contact.fullName}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedContact && (
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-xl font-semibold">{selectedContact.fullName}</h3>
                              <p className="text-gray-600">{selectedContact.emailAddress}</p>
                              <p className="text-sm text-gray-500">
                                Sent on {formatDate(selectedContact.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="font-medium">Subject</label>
                            <p className="text-gray-600 mt-1">{selectedContact.subject}</p>
                          </div>
                          
                          <div>
                            <label className="font-medium">Message</label>
                            <p className="text-gray-600 mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(`mailto:${selectedContact.emailAddress}?subject=Re: ${selectedContact.subject}`, '_blank')}
                            >
                              <Mail className="h-4 w-4 mr-2" />
                              Reply via Email
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteContact(contact._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {contacts.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No contact messages found</p>
            <p className="text-sm text-gray-400">Messages from the contact form will appear here</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
