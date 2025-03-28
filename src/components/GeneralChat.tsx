'use client';

import { motion } from 'framer-motion';
import { FiPaperclip, FiSend, FiX } from 'react-icons/fi';
import { useState, useRef, ChangeEvent } from 'react';

interface Message {
  sender: 'user' | 'assistant';
  content: string;
  isAttachment?: boolean;
  attachmentType?: 'file' | 'image';
  attachmentUrl?: string;
}

export default function GeneralChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      sender: 'assistant', 
      content: 'Welcome to the general trading discussion! Feel free to ask any questions about trading concepts.' 
    },
  ]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          content: getCommunityResponse(input.value)
        }]);
      }, 1000);
    }
  };

  const getCommunityResponse = (query: string): string => {
    const responses = [
      "That's a great question for the community! Many traders find that...",
      "In general trading discussions, we often see that...",
      "The community consensus on this tends to be...",
      "From what I've seen in general trading forums...",
      "Most traders approach this by..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-md rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">General Chat</h2>
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
                <p>{message.content}</p>
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
            placeholder="Ask about trading concepts..."
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