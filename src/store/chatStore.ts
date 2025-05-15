import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatStatus, ChatSender } from '../types';

interface ChatState {
  messages: ChatMessage[];
  isTyping: boolean;
  chatStatus: ChatStatus;
  preferredAgent: ChatSender;
  notificationsEnabled: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setPreferredAgent: (agent: ChatSender) => void;
  requestHumanAgent: () => Promise<void>;
  enableNotifications: () => Promise<boolean>;
}

// Generate AI response based on keywords
const generateAIResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('website') || messageLower.includes('web') || messageLower.includes('site')) {
    return "Let's break down your website project. What kind of website are you looking to create? Is it for a business, personal portfolio, e-commerce, or something else? What specific features would you like to include?";
  } else if (messageLower.includes('blog')) {
    return "For your blog section, we'll need to consider a few components. Do you need categories, comments, search functionality? How many blog posts do you anticipate having? Would you like to include featured images?";
  } else if (messageLower.includes('design')) {
    return "Let's talk about the design. What aesthetic are you going for? Do you have brand colors or a style guide? Are there any websites you like the design of that we could use as inspiration?";
  } else if (messageLower.includes('logo') || messageLower.includes('brand')) {
    return "For your branding needs, can you describe your brand's personality? What feelings do you want your logo to evoke? Do you have any color preferences or specific symbols you'd like to incorporate?";
  } else if (messageLower.includes('marketing') || messageLower.includes('ad')) {
    return "For your marketing campaign, let's define your target audience first. Which platforms would be most effective for reaching them? What's the key message you want to communicate?";
  } else {
    return "Could you provide more details about your project? What specific goals are you trying to achieve? The more details you provide, the better I can help break this down into manageable tasks.";
  }
};

// Simulate human agent responses
const simulateHumanAgent = async (message: string): Promise<string> => {
  // Simulate network delay (longer to be realistic)
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
  
  return `Thank you for your message. I'm reviewing your request about "${message.slice(0, 30)}..." and will help you break this down into manageable tasks. Could you tell me more about your timeline and budget for this project?`;
};

// Send browser notification
const sendNotification = (title: string, body: string) => {
  if (!("Notification" in window)) return;
  
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
};

const useChat = create<ChatState>((set, get) => ({
  messages: [
    {
      id: uuidv4(),
      sender: 'ai',
      content: 'Hello! I\'m your project assistant. Tell me about your project and I\'ll help you break it down into manageable tasks.',
      timestamp: new Date().toISOString(),
    },
  ],
  isTyping: false,
  chatStatus: 'idle',
  preferredAgent: 'ai',
  notificationsEnabled: false,
  
  enableNotifications: async () => {
    if (!("Notification" in window)) return false;
    
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      set({ notificationsEnabled: permission === "granted" });
      return permission === "granted";
    }
    
    set({ notificationsEnabled: Notification.permission === "granted" });
    return Notification.permission === "granted";
  },
  
  setPreferredAgent: (agent: ChatSender) => {
    set({ preferredAgent: agent });
  },
  
  requestHumanAgent: async () => {
    set({ chatStatus: 'waiting' });
    
    // Simulate agent connection delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const agentMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'agent',
      content: 'Hi there! I\'m Sarah, your design project manager. I\'ll be helping you plan and organize your project today. What can I help you with?',
      timestamp: new Date().toISOString(),
    };
    
    set(state => ({
      messages: [...state.messages, agentMessage],
      chatStatus: 'connected',
      preferredAgent: 'agent',
    }));
    
    // Send notification when agent connects
    if (get().notificationsEnabled) {
      sendNotification('Agent Connected', 'Sarah is ready to help you with your project.');
    }
  },
  
  sendMessage: async (content: string) => {
    const { preferredAgent, chatStatus, notificationsEnabled } = get();
    
    // Add user message
    const userMessage: ChatMessage = {
      id: uuidv4(),
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    
    set(state => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));
    
    // Generate response based on preferred agent
    try {
      let response: string;
      
      if (preferredAgent === 'agent' && chatStatus === 'connected') {
        response = await simulateHumanAgent(content);
      } else {
        response = await generateAIResponse(content);
      }
      
      const responseMessage: ChatMessage = {
        id: uuidv4(),
        sender: preferredAgent,
        content: response,
        timestamp: new Date().toISOString(),
      };
      
      set(state => ({
        messages: [...state.messages, responseMessage],
        isTyping: false,
      }));
      
      // Send notification for agent responses when tab is not focused
      if (notificationsEnabled && preferredAgent === 'agent' && document.hidden) {
        sendNotification('New Message from Sarah', response.slice(0, 100));
      }
    } catch (error) {
      set({ isTyping: false });
    }
  },
  
  clearChat: () => {
    set({
      messages: [
        {
          id: uuidv4(),
          sender: 'ai',
          content: 'Hello! I\'m your project assistant. Tell me about your project and I\'ll help you break it down into manageable tasks.',
          timestamp: new Date().toISOString(),
        },
      ],
      chatStatus: 'idle',
      preferredAgent: 'ai',
    });
  },
}));

export default useChat;