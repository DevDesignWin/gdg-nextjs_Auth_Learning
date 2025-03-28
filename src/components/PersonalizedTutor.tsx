'use client';

import { motion } from 'framer-motion';
import { FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { useState, useRef, ChangeEvent, useEffect } from 'react';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
  isAttachment?: boolean;
  attachmentType?: 'file' | 'image';
  attachmentUrl?: string;
}

interface PersonalizedTutorProps {
  onClose: () => void;
  selectedModule: {
    id: number;
    title: string;
    progress: number;
    content: string;
  } | null;
}

export default function PersonalizedTutor({ onClose, selectedModule }: PersonalizedTutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'assistant', 
      content: selectedModule 
        ? `Let's discuss ${selectedModule.title}.\n\n${selectedModule.content}\n\nWhere would you like to start?`
        : 'Hello! I\'m your personalized trading tutor. How can I help you with your trading strategies today?'
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file attachment
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileType = file.type.split('/')[0];
      const isImage = fileType === 'image';

      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setMessages([...messages, {
            sender: 'user',
            content: '',
            isAttachment: true,
            attachmentType: 'image',
            attachmentUrl: event.target?.result as string
          }]);
        };
        reader.readAsDataURL(file);
      } else {
        setMessages([...messages, {
          sender: 'user',
          content: `Attachment: ${file.name}`,
          isAttachment: true,
          attachmentType: 'file'
        }]);
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const input = e.currentTarget.querySelector('input');
    if (input && input instanceof HTMLInputElement && input.value.trim()) {
      const newMessage: Message = {
        sender: 'user',
        content: input.value
      };
      setMessages([...messages, newMessage]);
      input.value = '';
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'assistant',
          content: getTutorResponse(input.value, selectedModule?.title)
        }]);
      }, 1000);
    }
  };

  const getTutorResponse = (query: string, moduleTitle?: string): string => {
    const responses = moduleTitle 
      ? [
          `For ${moduleTitle}, based on your question, I recommend...`,
          `When working with ${moduleTitle}, consider these key points...`,
          `Regarding ${moduleTitle}, many traders find that...`,
          `For your ${moduleTitle} strategy, I suggest...`
        ]
      : [
          "Based on your trading style and experience, I would recommend...",
          "For your specific situation, consider these factors...",
          "Looking at your previous trades, I suggest...",
          "To improve your strategy, I'd advise...",
          "Given your risk tolerance, you might want to..."
        ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {selectedModule ? `Tutor: ${selectedModule.title}` : 'Personalized Tutor'}
        </h2>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Online</span>
          <button 
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-4 h-64 overflow-y-auto pr-2 custom-scrollbar">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.isAttachment ? (
              message.attachmentType === 'image' ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-600/70 to-blue-800/70 rounded-2xl rounded-br-none p-2 max-w-xs md:max-w-md"
                >
                  <div className="relative w-full h-48">
                    <img
                      src={message.attachmentUrl || ''}
                      alt="Uploaded chart"
                      className="object-contain rounded-lg w-full h-full"
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-600/70 to-blue-800/70 rounded-2xl rounded-br-none p-4 max-w-xs md:max-w-md"
                >
                  <div className="flex items-center gap-2">
                    <FiPaperclip />
                    <p>{message.content}</p>
                  </div>
                </motion.div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl p-4 max-w-xs md:max-w-md ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-blue-600/70 to-blue-800/70 rounded-br-none' 
                    : 'bg-gray-700/70 rounded-bl-none'
                }`}
              >
                <p className="whitespace-pre-line">{message.content}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="mt-6 relative">
        <div className="flex items-center bg-gray-700/50 rounded-full px-4 py-2">
          <button 
            type="button"
            className="p-2 text-gray-400 hover:text-white transition"
            onClick={handleAttachmentClick}
          >
            <FiPaperclip size={20} />
          </button>
          <input
            type="text"
            placeholder={selectedModule ? `Ask about ${selectedModule.title}...` : "Ask about trading strategies..."}
            className="flex-1 bg-transparent border-none focus:outline-none px-3 py-2 text-sm"
          />
          <button 
            type="submit"
            className="p-2 text-blue-400 hover:text-blue-300 transition"
          >
            <FiSend size={20} />
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        />
      </form>
    </div>
  );
}