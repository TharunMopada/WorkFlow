import React from 'react';
import { User, Bot, AlertCircle } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../../types/workflow';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const getIcon = () => {
    switch (message.type) {
      case 'user':
        return <User className="w-5 h-5" />;
      case 'assistant':
        return <Bot className="w-5 h-5" />;
      case 'system':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  const getMessageStyle = () => {
    switch (message.type) {
      case 'user':
        return 'bg-blue-500 text-white ml-12';
      case 'assistant':
        return 'bg-gray-100 text-gray-900 mr-12';
      case 'system':
        return 'bg-yellow-50 text-yellow-800 border border-yellow-200 mx-12';
      default:
        return 'bg-gray-100 text-gray-900 mr-12';
    }
  };

  const getAvatarStyle = () => {
    switch (message.type) {
      case 'user':
        return 'bg-blue-500 text-white ml-auto order-2';
      case 'assistant':
        return 'bg-gray-600 text-white';
      case 'system':
        return 'bg-yellow-500 text-white mx-auto';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
      {message.type !== 'user' && (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getAvatarStyle()}`}>
          {getIcon()}
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${getMessageStyle()}`}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        <p className={`text-xs mt-2 opacity-70`}>
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
      
      {message.type === 'user' && (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getAvatarStyle()}`}>
          {getIcon()}
        </div>
      )}
    </div>
  );
};