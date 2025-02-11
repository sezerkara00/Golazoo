import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr';
import "react-datepicker/dist/react-datepicker.css";

registerLocale('tr', tr);

interface DateSelectorProps {
  selectedDate: Date;
  onChange: (date: Date) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onChange }) => {
  return (
    <div className="relative">
      <DatePicker
        selected={selectedDate}
        onChange={(date: Date) => onChange(date)}
        dateFormat="dd/MM/yyyy"
        locale="tr"
        className="bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
        wrapperClassName="w-full"
        popperClassName="react-datepicker-popper"
        calendarClassName="bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
        dayClassName={date =>
          date.getDate() === selectedDate.getDate()
            ? "bg-blue-500 text-white rounded-full"
            : "text-gray-300 hover:bg-gray-700 rounded-full"
        }
        monthClassName={() => "text-gray-300"}
        weekDayClassName={() => "text-gray-400"}
        popperPlacement="bottom-start"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 8]
            }
          }
        ]}
        showPopperArrow={false}
      />
    </div>
  );
};

export default DateSelector; 