"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

// ─────────────────────────────────────────────────────────────
// DEFAULT CONFIGURATION CONSTANTS (overridable via props)
// ─────────────────────────────────────────────────────────────
export const DEFAULT_SCRAMBLE_CHAR_SET = "0123456789#$%&*";
export const DEFAULT_CYCLES_PER_CHAR = 10;
export const DEFAULT_CYCLE_SPEED_MS = 40;
export const DEFAULT_STAGGER_PER_CHAR_MS = 25;
export const DEFAULT_STAGGER_PER_LINE_MS = 200;

export const DEFAULT_SHINE_COLOR = "rgba(255, 255, 255, 0.25)";
export const DEFAULT_SHINE_OPACITY = 0.15;
export const DEFAULT_SHINE_ANGLE = 45;
export const DEFAULT_SHINE_WIDTH = "35%";

// Regex for non-scrambled characters (spaces & standard punctuation stay intact)
const NON_SCRAMBLE_REGEX = /[\s—–\-’'"`.,!?:;()\[\]{}@/\\]/;

export interface ScrambleTextProps {
  /** The text string to be revealed/decoded. Can contain line breaks (`\n`). */
  text: string;
  /** Trigger mode: "onScroll" (IntersectionObserver) or "onMount". Default: "onScroll" */
  trigger?: "onMount" | "onScroll";
  /** Optional custom CSS classes for the container element */
  className?: string;
  /** Characters used for scrambling. Default: "0123456789#$%&*" */
  scrambleCharacterSet?: string;
  /** Number of random character swaps per character before resolving. Default: 10 */
  cyclesPerCharacter?: number;
  /** Duration in ms for each character swap interval. Default: 40 */
  cycleSpeedMs?: number;
  /** Delay in ms between each character starting to scramble. Default: 25 */
  staggerPerCharacterMs?: number;
  /** Delay in ms between each line starting to scramble. Default: 200 */
  staggerPerLineMs?: number;

  // Background Shine Effect Options
  /** Enable background diagonal light sweep. Default: true */
  enableShine?: boolean;
  /** Color of the light sweep band. Default: "rgba(255, 255, 255, 0.25)" */
  shineColor?: string;
  /** Opacity of the light sweep band. Default: 0.15 */
  shineOpacity?: number;
  /** Angle in degrees for the diagonal light gradient. Default: 45 */
  shineAngle?: number;
  /** Width of the light sweep band (e.g. "35%" or "250px"). Default: "35%" */
  shineWidth?: string;
  /** Custom duration in seconds for the shine sweep. If null, auto-calculated from decode time. Default: null */
  shineDuration?: number | null;
  /** Callback fired when the scramble reveal animation finishes */
  onComplete?: () => void;
}

interface CharState {
  target: string;
  current: string;
  isLocked: boolean;
  isScrambling: boolean;
}

export function ScrambleText({
  text,
  trigger = "onScroll",
  className = "",
  scrambleCharacterSet = DEFAULT_SCRAMBLE_CHAR_SET,
  cyclesPerCharacter = DEFAULT_CYCLES_PER_CHAR,
  cycleSpeedMs = DEFAULT_CYCLE_SPEED_MS,
  staggerPerCharacterMs = DEFAULT_STAGGER_PER_CHAR_MS,
  staggerPerLineMs = DEFAULT_STAGGER_PER_LINE_MS,
  enableShine = true,
  shineColor = DEFAULT_SHINE_COLOR,
  shineOpacity = DEFAULT_SHINE_OPACITY,
  shineAngle = DEFAULT_SHINE_ANGLE,
  shineWidth = DEFAULT_SHINE_WIDTH,
  shineDuration = null,
  onComplete,
}: ScrambleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const hasTriggeredRef = useRef(false);

  // Split text into lines
  const lines = useMemo(() => text.split("\n"), [text]);

  // Initial state structure for all characters in all lines
  const initialLinesState = useMemo(() => {
    return lines.map((line) =>
      line.split("").map((char) => ({
        target: char,
        current: NON_SCRAMBLE_REGEX.test(char) ? char : scrambleCharacterSet[0] || char,
        isLocked: NON_SCRAMBLE_REGEX.test(char),
        isScrambling: false,
      }))
    );
  }, [lines, scrambleCharacterSet]);

  const [linesState, setLinesState] = useState<CharState[][]>(initialLinesState);

  // Calculate total decode duration for shine animation matching
  const totalDecodeDurationSec = useMemo(() => {
    let maxDurationMs = 0;
    lines.forEach((line, lineIndex) => {
      const lineStartMs = lineIndex * staggerPerLineMs;
      let scrambleCharCountInLine = 0;
      line.split("").forEach((char) => {
        if (!NON_SCRAMBLE_REGEX.test(char)) scrambleCharCountInLine++;
      });
      const lineFinishMs =
        lineStartMs +
        scrambleCharCountInLine * staggerPerCharacterMs +
        cyclesPerCharacter * cycleSpeedMs;
      if (lineFinishMs > maxDurationMs) {
        maxDurationMs = lineFinishMs;
      }
    });
    return (maxDurationMs + 200) / 1000;
  }, [lines, staggerPerLineMs, staggerPerCharacterMs, cyclesPerCharacter, cycleSpeedMs]);

  // Execute the decode scramble animation sequence
  const startAnimation = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Check prefers-reduced-motion
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Immediately reveal target text
      setLinesState(
        lines.map((line) =>
          line.split("").map((char) => ({
            target: char,
            current: char,
            isLocked: true,
            isScrambling: false,
          }))
        )
      );
      onComplete?.();
      return;
    }

    // Trigger Shine Sweep Animation via GSAP
    if (enableShine && shineRef.current) {
      const duration = shineDuration !== null ? shineDuration : Math.max(0.6, totalDecodeDurationSec);
      gsap.fromTo(
        shineRef.current,
        { xPercent: -100, opacity: 0 },
        {
          xPercent: 200,
          opacity: shineOpacity,
          duration: duration,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.to(shineRef.current, { opacity: 0, duration: 0.3 });
          },
        }
      );
    }

    const charSetLen = scrambleCharacterSet.length;
    const getRandomChar = () =>
      scrambleCharacterSet[Math.floor(Math.random() * charSetLen)] || "0";

    // Track active timers to clean up safely if unmounted
    const timeouts: NodeJS.Timeout[] = [];
    const intervals: NodeJS.Timeout[] = [];

    let activeScrambles = 0;

    lines.forEach((line, lineIndex) => {
      const lineStartMs = lineIndex * staggerPerLineMs;
      let scramblableCharIdx = 0;

      line.split("").forEach((char, charIndex) => {
        if (NON_SCRAMBLE_REGEX.test(char)) return; // skip spaces & punctuation

        const charDelayMs = lineStartMs + scramblableCharIdx * staggerPerCharacterMs;
        scramblableCharIdx++;
        activeScrambles++;

        // Schedule start of scramble for this character
        const startTimeout = setTimeout(() => {
          let cycleCount = 0;

          // Set character into scrambling state
          setLinesState((prev) => {
            const next = prev.map((l) => [...l]);
            if (next[lineIndex] && next[lineIndex][charIndex]) {
              next[lineIndex][charIndex] = {
                ...next[lineIndex][charIndex],
                isScrambling: true,
                current: getRandomChar(),
              };
            }
            return next;
          });

          // Character scramble ticker interval
          const interval = setInterval(() => {
            cycleCount++;
            if (cycleCount >= cyclesPerCharacter) {
              clearInterval(interval);

              // Lock character to final target value
              setLinesState((prev) => {
                const next = prev.map((l) => [...l]);
                if (next[lineIndex] && next[lineIndex][charIndex]) {
                  next[lineIndex][charIndex] = {
                    ...next[lineIndex][charIndex],
                    current: char,
                    isLocked: true,
                    isScrambling: false,
                  };
                }
                return next;
              });

              activeScrambles--;
              if (activeScrambles === 0) {
                onComplete?.();
              }
            } else {
              // Update character to new random scramble character
              setLinesState((prev) => {
                const next = prev.map((l) => [...l]);
                if (next[lineIndex] && next[lineIndex][charIndex]) {
                  next[lineIndex][charIndex] = {
                    ...next[lineIndex][charIndex],
                    current: getRandomChar(),
                  };
                }
                return next;
              });
            }
          }, cycleSpeedMs);

          intervals.push(interval);
        }, charDelayMs);

        timeouts.push(startTimeout);
      });
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  };

  useEffect(() => {
    if (trigger === "onMount") {
      startAnimation();
      return;
    }

    // Trigger on scroll via IntersectionObserver
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [trigger]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden inline-block ${className}`}
      aria-label={text}
    >
      {/* Background Diagonal Light Sweep Shine Effect */}
      {enableShine && (
        <div
          ref={shineRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 select-none"
          style={{
            width: "200%",
            height: "100%",
            left: "-50%",
            top: 0,
            background: `linear-gradient(${shineAngle}deg, transparent 0%, ${shineColor} 50%, transparent 100%)`,
            opacity: 0,
            transform: "translateX(-100%)",
            filter: "blur(6px)",
          }}
        />
      )}

      {/* Scramble Text Content */}
      <div className="relative z-10 font-mono tracking-tight leading-relaxed">
        {linesState.map((line, lineIdx) => (
          <div key={lineIdx} className="block whitespace-pre-wrap">
            {line.map((item, charIdx) => {
              // Space handling
              if (item.target === " ") {
                return <span key={charIdx}>{" "}</span>;
              }

              return (
                <span
                  key={charIdx}
                  className={`inline-block transition-colors duration-150 ${
                    item.isLocked
                      ? "text-current opacity-100"
                      : item.isScrambling
                      ? "text-emerald-400 font-bold opacity-90 scale-105"
                      : "text-neutral-500 opacity-40"
                  }`}
                  style={{
                    minWidth: item.target === " " ? "0.3em" : "0.55em",
                    textAlign: "center",
                  }}
                >
                  {item.current}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
