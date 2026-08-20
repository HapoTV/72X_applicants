import React from 'react';
import type { CalendarEventItem } from '../../../interfaces/EventData';

interface Props {
  monthName: string;
  year: number;
  month: number;
  dayNames: string[];
  startingDayOfWeek: number;
  daysInMonth: number;
  getEventsForDay: (day: number) => CalendarEventItem[];
}

const CalendarMonth: React.FC<Props> = ({
  monthName: _monthName,
  year,
  month,
  dayNames,
  startingDayOfWeek,
  daysInMonth,
  getEventsForDay,
}) => {
  const today = new Date();

  return (
    <>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-medium text-gray-600 py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayEvents = getEventsForDay(day);
          const hasEvents = dayEvents.length > 0;
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          return (
            <div
              key={day}
              className={`aspect-square p-1.5 rounded-lg border transition-all cursor-pointer relative ${
                isToday
                  ? 'bg-primary-100 border-primary-500 font-bold'
                  : hasEvents
                  ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
              title={hasEvents ? `${dayEvents.length} event(s)` : 'No events'}
            >
              <div className="text-xs text-gray-900">{day}</div>
              {hasEvents && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`w-1 h-1 rounded-full ${event.hasReminder ? 'bg-orange-500' : 'bg-blue-500'}`}
                    />
                  ))}
                  {dayEvents.length > 3 && <div className="w-1 h-1 bg-gray-400 rounded-full" />}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default CalendarMonth;
