import React, { useState, useEffect } from 'react';
import { format, addDays, differenceInCalendarDays, addBusinessDays } from 'date-fns';
import useTaskStore from '../../store/taskStore';
import { formatTime, calculateTimeFromTokens } from '../../utils/token-calculator';

const today = new Date();
today.setHours(0, 0, 0, 0);

const GanttChart: React.FC = () => {
  const { taskGroups } = useTaskStore();
  const [days, setDays] = useState<Date[]>([]);
  const [startDate] = useState<Date>(today);
  
  // Generate days for the chart (next 30 days)
  useEffect(() => {
    const generatedDays = [];
    for (let i = 0; i < 30; i++) {
      generatedDays.push(addDays(startDate, i));
    }
    setDays(generatedDays);
  }, [startDate]);
  
  // Get all approved tasks
  const getApprovedTasks = () => {
    return taskGroups
      .flatMap(group => group.tasks)
      .filter(task => task.approvedAt)
      .sort((a, b) => new Date(a.approvedAt!).getTime() - new Date(b.approvedAt!).getTime());
  };
  
  // Calculate start and end dates for gantt tasks
  const calculateGanttTasks = () => {
    const approvedTasks = getApprovedTasks();
    let currentDate = startDate;
    
    return approvedTasks.map(task => {
      const { hours } = calculateTimeFromTokens(task.tokens);
      const duration = Math.max(1, Math.ceil(hours / 2)); // Number of days needed (max 2 tokens per day)
      
      const taskStartDate = new Date(currentDate);
      const taskEndDate = addBusinessDays(currentDate, duration - 1);
      
      // Move to next day for the next task
      currentDate = addBusinessDays(taskEndDate, 1);
      
      return {
        ...task,
        startDay: differenceInCalendarDays(taskStartDate, startDate),
        duration,
        totalDays: differenceInCalendarDays(taskEndDate, startDate) + 1,
      };
    });
  };
  
  const ganttTasks = calculateGanttTasks();
  
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="border-b-2 border-black py-3 px-4">
        <h2 className="text-lg font-bold uppercase">Gantt Chart</h2>
        <p className="text-xs">Timeline view of approved tasks</p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="min-w-max">
          {/* Header with dates */}
          <div className="flex">
            <div className="w-48 shrink-0 py-2 px-3 bg-black text-white font-bold text-sm">
              Task
            </div>
            {days.slice(0, 14).map((day, index) => (
              <div 
                key={index} 
                className={`w-12 shrink-0 py-2 text-center text-xs font-mono border-r border-black
                  ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-gray-200' : 'bg-white'}`}
              >
                <div>{format(day, 'dd')}</div>
                <div>{format(day, 'MMM')}</div>
              </div>
            ))}
          </div>
          
          {/* Gantt tasks */}
          {ganttTasks.length > 0 ? (
            <div>
              {ganttTasks.map((task, index) => (
                <div key={task.id} className="flex border-b border-black">
                  <div className="w-48 shrink-0 py-2 px-3 text-sm font-medium truncate border-r border-black">
                    <div>{task.title}</div>
                    <div className="text-xs mt-1">
                      {formatTime(task.tokens)} ({task.tokens} tokens)
                    </div>
                  </div>
                  
                  {days.slice(0, 14).map((day, dayIndex) => (
                    <div 
                      key={dayIndex} 
                      className={`w-12 shrink-0 border-r border-black relative
                        ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-gray-100' : ''}`}
                    >
                      {dayIndex >= task.startDay && dayIndex < task.startDay + task.totalDays && (
                        <div className={`
                          absolute top-0 left-0 h-full bg-black
                          ${dayIndex === task.startDay ? 'rounded-l-sm' : ''}
                          ${dayIndex === task.startDay + task.totalDays - 1 ? 'rounded-r-sm' : ''}
                          transition-all duration-300 hover:bg-gray-800
                        `} style={{ width: '100%' }}>
                          {dayIndex === task.startDay && (
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xs">
                              {task.duration}d
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              <p>No approved tasks to display</p>
              <p className="text-xs mt-2">Approve tasks in the Kanban board to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;