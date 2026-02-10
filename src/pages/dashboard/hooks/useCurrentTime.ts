import { useEffect, useState } from 'react';

export const useCurrentTime = (tickMs: number = 1000): Date => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentTime(new Date()), tickMs);
    return () => window.clearInterval(timer);
  }, [tickMs]);

  return currentTime;
};
