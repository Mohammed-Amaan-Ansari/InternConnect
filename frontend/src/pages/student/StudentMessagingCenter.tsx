import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Send, Building2 } from 'lucide-react';
import { useState, useEffect, FormEvent, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function StudentMessagingCenter() {
  const [messages, setMessages] = useState<any[]>([]);
  const [partners, setPartners] = useState<{id: number, name: string}[]>([]);
  const [activePartnerId, setActivePartnerId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchParams] = useSearchParams();
  const companyIdParam = searchParams.get('companyId');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.sub ? parseInt(payload.sub) : null);
      } catch (e) {
        console.error("Failed to parse token", e);
      }
    }
  }, []);

  const fetchMessages = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios.get("http://127.0.0.1:8000/student/dashboard/communication/inbox", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const msgs = res.data.reverse();
        setMessages(msgs);
        
        const uniquePartners = new Map();
        msgs.forEach((m: any) => {
           let isSender = m.senderId === currentUserId;
           let partnerId = isSender ? m.receiverId : m.senderId;
           let partnerName = isSender ? m.receiverName : m.senderName;
           if (!uniquePartners.has(partnerId)) {
               uniquePartners.set(partnerId, partnerName || `Company #${partnerId}`);
           }
        });

        if (companyIdParam) {
           const cId = parseInt(companyIdParam);
           if (!uniquePartners.has(cId)) {
               const companyNameParam = searchParams.get('name');
               uniquePartners.set(cId, companyNameParam || `Company #${cId}`);
           }
           if (!activePartnerId) setActivePartnerId(cId);
        } else if (uniquePartners.size > 0 && !activePartnerId) {
           setActivePartnerId(Array.from(uniquePartners.keys())[0]);
        }

        setPartners(Array.from(uniquePartners.entries()).map(([id, name]) => ({id, name})));
      })
      .catch(err => {
        console.error("Error fetching messages", err);
      });
  };

  useEffect(() => {
    if (currentUserId) fetchMessages();
  }, [currentUserId, companyIdParam]);

  useEffect(() => {
     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePartnerId]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activePartnerId) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/student/dashboard/communication/send", {
         receiver_id: activePartnerId,
         subject: "Message from Student",
         message: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const newMsgObj = {
          id: Date.now(),
          senderId: currentUserId,
          receiverId: activePartnerId,
          message: newMessage,
          sentAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, newMsgObj]);
      setNewMessage('');
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const activeMessages = messages.filter(m => 
      (m.senderId === currentUserId && m.receiverId === activePartnerId) ||
      (m.receiverId === currentUserId && m.senderId === activePartnerId)
  );

  const activePartnerName = partners.find(p => p.id === activePartnerId)?.name || 'Select a conversation';

  return (
    <DashboardLayout role="student">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <h1 className="text-3xl text-gray-900 mb-8 flex-none">Messages</h1>
        <div className="grid lg:grid-cols-3 gap-6 flex-1 min-h-0">
          <Card className="border-none shadow-sm lg:col-span-1 flex flex-col min-h-0">
            <CardContent className="p-6 flex flex-col h-full min-h-0">
              <h2 className="text-lg text-gray-900 mb-4 flex-none">Conversations</h2>
              <div className="space-y-3 overflow-y-auto flex-1 pr-2">
                {partners.length === 0 ? (
                    <p className="text-sm text-gray-500">No conversations yet</p>
                ) : partners.map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => setActivePartnerId(p.id)}
                    className={`p-3 rounded-lg cursor-pointer flex items-center gap-3 transition-colors ${activePartnerId === p.id ? 'bg-[#1E40AF]/10 border border-[#1E40AF]/20' : 'bg-[#F8FAFC] hover:bg-gray-100'}`}
                  >
                    <Building2 className="w-8 h-8 text-gray-400" />
                    <div>
                        <p className={`text-sm ${activePartnerId === p.id ? 'font-medium text-[#1E40AF]' : 'text-gray-900'}`}>{p.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm lg:col-span-2 flex flex-col min-h-0">
            <CardContent className="p-6 flex flex-col h-full min-h-0">
              {activePartnerId ? (
                <>
                  <h2 className="text-lg text-gray-900 mb-4 border-b pb-4 flex-none">Chat with {activePartnerName}</h2>
                  <div className="flex-1 bg-[#F8FAFC] rounded-lg p-4 mb-4 overflow-y-auto flex flex-col gap-3">
                    {activeMessages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-sm text-gray-500">No messages yet. Say hi!</p>
                        </div>
                    ) : activeMessages.map(msg => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] p-3 rounded-lg ${isMe ? 'bg-[#1E40AF] text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                    <p className={`text-[10px] mt-1 text-right block ${isMe ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {new Date(msg.sentAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="flex gap-2 flex-none mt-auto">
                    <input 
                      type="text" 
                      placeholder="Type your message..." 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]" 
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                    />
                    <Button type="submit" className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 px-6">
                      <Send className="w-4 h-4 mr-2" /> Send
                    </Button>
                  </form>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">Select a conversation to start messaging</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
