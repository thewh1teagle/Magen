import dayjs from 'dayjs';
import 'dayjs/locale/he';
import { useEffect, useState } from 'react';

dayjs.locale('he');

const CurrentDate = () => {
  const [currentDateTime, setCurrentDateTime] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(dayjs());
    }, 1000); // Update every second

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="text-4xl text-red-500">
        {currentDateTime.format('HH:mm:ss')}
      </div>
      <div className="text-sm pt-0.5">
        {currentDateTime.format('dddd, MMMM D, YYYY')}
      </div>
    </div>
  );
};

export default CurrentDate;
