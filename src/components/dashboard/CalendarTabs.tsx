import React from 'react';
import Tabs from '../ui/Tabs';
import KanbanBoard from './KanbanBoard';
import GanttChart from './GanttChart';

const CalendarTabs: React.FC = () => {
  const tabs = [
    {
      id: 'kanban',
      label: 'Kanban Board',
      content: <KanbanBoard />
    },
    {
      id: 'gantt',
      label: 'Gantt Chart',
      content: <GanttChart />
    }
  ];
  
  return (
    <div className="h-full overflow-hidden">
      <Tabs 
        tabs={tabs} 
        defaultTabId="kanban"
        className="h-full"
      />
    </div>
  );
};

export default CalendarTabs;