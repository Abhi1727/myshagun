import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, User } from "lucide-react";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
  sender_first_name: string;
  sender_last_name: string;
}

const ChatMessages = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [otherUser, setOtherUser] = useState<{ id: string; name: string; photo: string | null }>({
    id: "",
    name: "",
    photo: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchUserAndMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll for new messages every 3s
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchUserAndMessages = async () => {
    try {
      const { data: userData } = await api.get('/auth');
      setCurrentUserId(userData.id);
      await fetchMessages();
    } catch (error) {
      console.error('Error fetching user:', error);
      navigate('/dashboard');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(`/chat/messages/${conversationId}`);
      setMessages(data);

      if (data.length > 0 && !otherUser.name) {
        const firstMsg = data[0];
        const otherId = firstMsg.sender_id === currentUserId ? firstMsg.receiver_id : firstMsg.sender_id;
        setOtherUser({
          id: otherId,
          name: firstMsg.sender_id === currentUserId
            ? `User ${otherId.substring(0, 8)}`
            : `${firstMsg.sender_first_name} ${firstMsg.sender_last_name}`,
          photo: null
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !otherUser.id) return;

    setSending(true);
    try {
      await api.post('/chat/send', {
        receiverId: otherUser.id,
        message: newMessage.trim()
      });

      setNewMessage("");
      await fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.msg || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <Card className="rounded-b-none border-b">
        <CardHeader className="p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/messages')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <Avatar className="w-10 h-10">
              <AvatarImage src={otherUser.photo || undefined} />
              <AvatarFallback>
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold">{otherUser.name}</h2>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <Card className="flex-1 rounded-none border-x overflow-hidden">
        <CardContent className="h-full p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwnMessage = message.sender_id === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="break-words">{message.message}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {new Date(message.created_at).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input Area */}
      <Card className="rounded-t-none border-t">
        <CardContent className="p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatMessages;
