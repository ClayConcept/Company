import React, { useState, useRef, useEffect } from 'react';
import { Send, UserCircle2, Bot, Loader2, Bell } from 'lucide-react';
import useChat from '../../store/chatStore';
import Button from '../ui/Button';
import Card from '../ui/Card';

const ChatMessage: React.FC<{
  message: { sender: string; content: string };
  isLast: boolean;
}> = ({ message, isLast }) => {
  const isUser = message.sender === 'user';
  const isAgent = message.sender === 'agent';
  
  return (
    <div 
      className={`mb-4 ${isUser ? 'flex justify-end' : ''}`}
      id={isLast ? 'last-message' : undefined}
    >
      <div 
        className={`
          max-w-[80%] p-3 font-mono text-sm flex items-start gap-2
          ${isUser 
            ? 'bg-white text-black border border-black flex-row-reverse' 
            : 'bg-black text-white border border-black'}
        `}
      >
        {isAgent ? (
          <UserCircle2 size={16} className="mt-1" />
        ) : !isUser ? (
          <Bot size={16} className="mt-1" />
        ) : null}
        <div>{message.content}</div>
      </div>
    </div>
  );
};

const ChatInterface: React.FC = () => {
  const [input, setInput] = useState('');
  const { 
    messages, 
    isTyping, 
    chatStatus,
    preferredAgent,
    notificationsEnabled,
    sendMessage,
    requestHumanAgent,
    setPreferredAgent,
    enableNotifications
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    await sendMessage(input);
    setInput('');
  };
  
  const handleAgentRequest = async () => {
    if (!notificationsEnabled) {
      const enabled = await enableNotifications();
      if (!enabled) {
        // Proceed anyway, but notifications won't work
        console.log('Notifications not enabled');
      }
    }
    await requestHumanAgent();
  };
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b-2 border-black py-3 px-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold uppercase">Project Chat</h2>
            <p className="text-xs">Discuss your project and break it down into tasks</p>
          </div>
          
          {chatStatus === 'idle' && (
            <Button
              onClick={handleAgentRequest}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              <UserCircle2 size={16} />
              Request Human Agent
            </Button>
          )}
          
          {chatStatus === 'waiting' && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 size={16} className="animate-spin" />
              Connecting to agent...
            </div>
          )}
          
          {chatStatus === 'connected' && (
            <div className="flex items-center gap-2">
              <div className="text-sm font-bold text-green-600 flex items-center gap-2">
                <UserCircle2 size={16} />
                Agent Connected
              </div>
              {!notificationsEnabled && (
                <Button
                  onClick={enableNotifications}
                  size="sm"
                  variant="outline"
                  className="ml-2"
                >
                  <Bell size={16} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        
        {isTyping && (
          <div className="mb-4">
            <div className="max-w-[80%] p-3 font-mono text-sm bg-black text-white border border-black flex items-center gap-2">
              {preferredAgent === 'agent' ? (
                <UserCircle2 size={16} />
              ) : (
                <Bot size={16} />
              )}
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="h-2 w-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t-2 border-black p-4">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={chatStatus === 'waiting' ? 'Waiting for agent...' : 'Type your request...'}
            className="flex-1 font-mono text-sm border-2 border-black p-2 focus:outline-none"
            disabled={isTyping || chatStatus === 'waiting'}
          />
          <Button
            type="submit"
            className="ml-2"
            disabled={isTyping || chatStatus === 'waiting' || !input.trim()}
          >
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;