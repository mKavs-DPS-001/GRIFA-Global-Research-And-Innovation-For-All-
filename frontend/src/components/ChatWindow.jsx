import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ChatWindow({ enquiryId, participantName }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { currentUser, isAdmin } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!enquiryId) return;

    const q = query(
      collection(db, 'chats', enquiryId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [enquiryId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const msgText = newMessage.trim();
    setNewMessage('');

    try {
      await addDoc(collection(db, 'chats', enquiryId, 'messages'), {
        text: msgText,
        senderId: currentUser.uid,
        senderRole: isAdmin ? 'admin' : 'user',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message", error);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-neutral-white rounded-3xl shadow-sm border border-neutral-border/50 overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-neutral-white p-4">
        <h3 className="font-playfair font-bold text-lg flex items-center gap-2">
          Chat with {isAdmin ? participantName : 'GRIFA Admin'}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-neutral-offwhite space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-gray text-sm">
            No messages yet. Send a message to start the conversation.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.uid;
            return (
              <div 
                key={msg.id} 
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                    isMe 
                      ? 'bg-accent text-neutral-white rounded-tr-none' 
                      : 'bg-neutral-white border border-neutral-border text-neutral-dark rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                  <div className={`text-[10px] mt-1 opacity-60 text-right`}>
                    {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Sending...'}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-neutral-white border-t border-neutral-border/50 flex gap-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-xl bg-neutral-offwhite border border-neutral-border focus:outline-none focus:border-accent"
        />
        <button 
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-accent text-neutral-white p-2 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
