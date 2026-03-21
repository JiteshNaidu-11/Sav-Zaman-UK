import { useState, useEffect, useRef } from "react";

function parseValue(value: string): { prefix: string; end: number; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+)(.*)$/);
  if (!match) return { prefix: value, end: 0, suffix: "" };
  return {
    prefix: match[1] || "",
    end: parseInt(match[2], 10),
    suffix: match[3] || "",
  };
}

const duration = 2000; // ms
const fps = 60;
const interval = 1000 / fps;

interface CounterProps {
  value: string;
  className?: string;
}

const Counter = ({ value, className = "" }: CounterProps) => {
  const { prefix, end, suffix } = parseValue(value);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setStarted(true);
      },
      { threshold: 0.2, rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started || end === 0) {
      if (started) setCount(end);
      return;
    }

    const steps = Math.ceil((duration / 1000) * fps);
    const stepValue = end / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step += 1;
      current = Math.min(Math.round(stepValue * step), end);
      setCount(current);
      if (current >= end) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [started, end]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
};

export default Counter;
