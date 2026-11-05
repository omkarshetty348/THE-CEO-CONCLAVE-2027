"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string; // ISO string
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className="flex gap-3 justify-center">
        {["Days", "Hours", "Mins", "Secs"].map((label) => (
          <div key={label} className="countdown-digit">
            <span className="text-2xl font-bold text-white">--</span>
            <span className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</span>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { value: timeLeft.days, label: "Days" },
    { value: timeLeft.hours, label: "Hours" },
    { value: timeLeft.minutes, label: "Mins" },
    { value: timeLeft.seconds, label: "Secs" },
  ];

  return (
    <div className="flex gap-3 justify-center">
      {items.map((item) => (
        <div key={item.label} className="countdown-digit">
          <span className="text-2xl font-bold tabular-nums text-white">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
