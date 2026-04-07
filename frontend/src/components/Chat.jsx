import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { io } from 'socket.io-client';
import baseUrl from '../utils/api';
import toast from 'react-hot-toast';

const Chat = ({ 
  bookingId, 
  userId, 
  userName, 
  userRole, 
  vendorName,
  onClose 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch existing messages and connect to Socket.io
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/chat/${bookingId}`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Connect to Socket.io
    socketRef.current = io(baseUrl);
    socketRef.current.emit('join-chat', bookingId);

    // Listen for incoming messages
    socketRef.current.on('receive-message', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now(),
        bookingId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderRole: data.senderRole,
        message: data.message,
        createdAt: data.timestamp || new Date(),
        isRead: false
      }]);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-chat', bookingId);
        socketRef.current.disconnect();
      }
    };
  }, [bookingId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) {
      toast.error('Message cannot be empty');
      return;
    }

    try {
      // Save to database
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          senderId: userId,
          senderName: userName,
          senderRole: userRole,
          message: inputMessage
        })
      });

      if (response.ok) {
        // Emit via Socket.io for real-time update
        socketRef.current.emit('send-message', {
          bookingId,
          senderId: userId,
          senderName: userName,
          senderRole: userRole,
          message: inputMessage
        });

        setInputMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#b14e79]"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0d14] rounded-2xl border dark:border-white/10 border-gray-200 flex flex-col h-screen md:h-96 transition-colors">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#b14e79] to-[#8e3e61] p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center gap-3 text-white">
          <MessageCircle size={20} />
          <div>
            <p className="font-bold text-sm">Chat with {userRole === 'user' ? vendorName : 'Client'}</p>
            <p className="text-xs opacity-90">Connected</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white dark:bg-[#05070a]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p className="text-center">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index}
              className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs px-4 py-2 rounded-xl ${
                  msg.senderId === userId
                    ? 'bg-gradient-to-r from-[#b14e79] to-[#8e3e61] text-white rounded-br-none'
                    : 'dark:bg-[#111622] bg-gray-100 dark:text-white text-gray-900 rounded-bl-none'
                }`}
              >
                <p className="text-xs font-bold opacity-80 mb-1">{msg.senderName}</p>
                <p className="break-words">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${msg.senderId === userId ? 'opacity-70' : 'opacity-60'}`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t dark:border-white/5 border-gray-200 p-4 bg-white dark:bg-[#0a0d14]">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 dark:bg-[#111622] bg-gray-50 border dark:border-white/10 border-gray-200 dark:text-white text-gray-900 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#b14e79] placeholder-gray-400 dark:placeholder-gray-500 transition"
          />
          <button 
            type="submit"
            className="bg-gradient-to-r from-[#b14e79] to-[#8e3e61] hover:from-[#8e3e61] hover:to-[#6b2f4a] text-white p-2 rounded-xl transition flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
