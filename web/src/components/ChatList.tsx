import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, User } from "lucide-react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Conversation {
  id: string;
  other_user_id: string;
  other_first_name: string;
  other_last_name: string;
  other_photo: string | null;
  last_message: string | null;
  last_message_at: string;
}

const ChatList = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await api.get('/chat/conversations');
      setConversations(data);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
        <MessageCircle className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Conversations Yet</h2>
        <p className="text-muted-foreground mb-4">Start swiping to find matches and chat!</p>
        <Button onClick={() => navigate('/browse')}>Browse Profiles</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Messages</h1>

      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/chat/${conversation.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={conversation.other_photo || undefined} />
                  <AvatarFallback>
                    <User className="w-6 h-6" />
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg truncate">
                      {conversation.other_first_name} {conversation.other_last_name}
                    </h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                      {formatTime(conversation.last_message_at)}
                    </span>
                  </div>

                  {conversation.last_message && (
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.last_message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
