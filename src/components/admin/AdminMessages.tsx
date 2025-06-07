
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  message: string;
  status: string;
  created_at: string;
}

interface AdminMessagesProps {
  onStatsUpdate: () => void;
}

const AdminMessages = ({ onStatsUpdate }: AdminMessagesProps) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;

      toast({
        title: "Message Marked as Read",
        description: "Message status updated successfully.",
      });

      fetchMessages();
      onStatsUpdate();
    } catch (error) {
      console.error('Error updating message status:', error);
      toast({
        title: "Error",
        description: "Failed to update message status.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <Badge className="bg-green-500 text-white">Read</Badge>;
      case 'new':
      default:
        return <Badge className="bg-blue-500 text-white">New</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gold/20">
        <CardContent className="p-6">
          <div className="text-center text-gray-300">Loading messages...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <Card className="bg-gray-800 border-gold/20">
          <CardContent className="p-6 text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300">No messages found.</p>
          </CardContent>
        </Card>
      ) : (
        messages.map((message) => (
          <Card key={message.id} className="bg-gray-800 border-gold/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <div className="flex items-center text-white mb-2">
                      <User className="h-4 w-4 mr-2 text-coral" />
                      <span className="font-semibold">{message.name}</span>
                    </div>
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{message.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {getStatusBadge(message.status)}
                  <div className="flex items-center text-gray-400 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(new Date(message.created_at), 'MMM dd, HH:mm')}
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg mb-4">
                <p className="text-white">{message.message}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                    onClick={() => window.open(`tel:${message.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                    onClick={() => window.open(`https://wa.me/${message.phone.replace(/[^0-9]/g, '')}`)}
                  >
                    WhatsApp
                  </Button>
                </div>

                {message.status === 'new' && (
                  <Button
                    size="sm"
                    onClick={() => markAsRead(message.id)}
                    className="bg-coral hover:bg-coral/90 text-black"
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AdminMessages;
