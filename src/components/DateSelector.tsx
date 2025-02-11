import React, { useState } from 'react';
import { format, addDays, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth } from 'date-fns';
import { tr } from 'date-fns/locale';

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChange }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <button
          onClick={() => setCurrentMonth(subDays(currentMonth, 30))}
          className="text-gray-400 hover:text-white"
        >
          ◀
        </button>
        <span className="text-white font-medium">
          {format(currentMonth, 'MMMM yyyy', { locale: tr })}
        </span>
        <button
          onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
          className="text-gray-400 hover:text-white"
        >
          ▶
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <div className="grid grid-cols-7 border-b border-gray-700">
        {days.map(day => (
          <div key={day} className="text-gray-400 text-xs text-center py-2">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        days.push(
          <button
            key={day.toString()}
            onClick={() => {
              onChange(cloneDay);
              setShowCalendar(false);
            }}
            className={`
              py-3 text-sm transition-colors relative
              ${isSameMonth(day, monthStart) ? 'text-white' : 'text-gray-600'}
              ${isSameDay(day, selectedDate) ? 'text-blue-400' : 'hover:text-blue-400'}
              ${isSameDay(day, selectedDate) ? 'after:absolute after:w-1 after:h-1 after:bg-blue-400 after:rounded-full after:-bottom-0.5 after:left-1/2 after:-translate-x-1/2' : ''}
            `}
          >
            {format(day, 'd')}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onChange(subDays(selectedDate, 1))}
        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <span className="text-xs">◀</span>
        <span className="text-sm">{format(subDays(selectedDate, 1), 'd MMMM', { locale: tr })}</span>
      </button>

      <div className="flex flex-col items-center">
        <span className="text-lg font-medium text-white">
          {format(selectedDate, 'd MMMM yyyy', { locale: tr })}
        </span>
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          {format(selectedDate, 'EEEE', { locale: tr })}
        </button>
      </div>

      <button
        onClick={() => onChange(addDays(selectedDate, 1))}
        className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <span className="text-sm">{format(addDays(selectedDate, 1), 'd MMMM', { locale: tr })}</span>
        <span className="text-xs">▶</span>
      </button>

      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg shadow-xl w-80">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="p-4 border-t border-gray-700 flex justify-center">
              <button
                onClick={() => {
                  onChange(new Date());
                  setShowCalendar(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                TODAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateSelector; 