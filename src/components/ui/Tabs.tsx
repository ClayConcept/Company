import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  orientation = 'horizontal',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<string>(defaultTabId || tabs[0]?.id || '');

  if (tabs.length === 0) return null;

  const isHorizontal = orientation === 'horizontal';
  
  return (
    <div className={`${className} ${isHorizontal ? '' : 'flex'}`}>
      <div className={`
        ${isHorizontal 
          ? 'flex border-b-2 border-black overflow-x-auto'
          : 'flex flex-col border-r-2 border-black'}
      `}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              font-mono text-sm font-bold uppercase p-3 min-w-max transition-colors
              ${activeTab === tab.id
                ? 'bg-black text-white' 
                : 'bg-white text-black hover:bg-gray-100'}
            `}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;