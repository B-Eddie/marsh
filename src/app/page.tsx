"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function predictTestDelay(assignment: string): {
  willDelay: boolean;
  probability: number;
  delayDays: number;
} {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sunday, 6=Saturday

  // Simple hash function for deterministic randomness
  let hash = 0;
  for (let i = 0; i < assignment.length; i++) {
    const char = assignment.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  // Use hash to generate pseudo-random values
  const randomChance = Math.abs(hash) % 10 > 3; // 60% chance based on hash
  const moonPhase = Math.abs(hash * 7) % 10 > 5;
  const coffeeLevel = (Math.abs(hash * 13) % 10) + 1 > 5;

  // Factors that might influence the prediction
  const factors = {
    weekday: dayOfWeek > 0 && dayOfWeek < 6, // More likely on weekdays
    randomChance,
    moonPhase,
    coffeeLevel,
    assignmentLength: assignment.length > 10, // Longer assignments might cause delay
  };

  // Calculate probability
  const probability =
    Object.values(factors).filter(Boolean).length / Object.keys(factors).length;

  // Decision - make it consistent, no extra randomness, biased towards no delay
  const willDelay = probability > 0.7;

  // Delay days: 1 to 90 (3 months)
  const delayDays = willDelay ? (Math.abs(hash * 17) % 6) + 1 : 0;

  return { willDelay, probability, delayDays };
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Home() {
  const [assignment, setAssignment] = useState("");
  const [result, setResult] = useState<{
    willDelay: boolean;
    probability: number;
    delayDays: number;
  } | null>(null);

  const handleCalculate = () => {
    if (assignment.trim()) {
      const prediction = predictTestDelay(assignment);
      setResult(prediction);
    }
  };

  const today = new Date();
  const dayName = dayNames[today.getDay()];

  return (
    <div className="min-h-screen bg-[#0a1929] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 lg:px-12">
        <div>
          <h1 className="font-serif text-4xl italic leading-tight">
            Mr. Marsh
            <br />
            <span className="text-3xl">Test Delay Predictor</span>
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:block">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Trending Assignments
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-2xl">🥇</span>
              <span className="text-base">Macbeth Test</span>
            </div>
          </div>

          <Button className="bg-[#0a7aff] text-white hover:bg-[#0969da] px-6">
            <span className="mr-2">👍</span>
            Like 10K
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-20 lg:py-32">
        <div className="w-full max-w-2xl space-y-8 text-center">
          {result ? (
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-white">
                Chance of test delay{" "}
                {result.willDelay
                  ? `by ${result.delayDays} day${
                      result.delayDays === 1 ? "" : "s"
                    }`
                  : ""}{" "}
                on {dayName} for {assignment}
              </h2>
              <div className="text-6xl font-bold text-[#00b8ff]">
                {Math.round(result.probability * 100)}%
              </div>
              <div className="text-lg text-gray-400">
                of a test delay{" "}
                {result.willDelay
                  ? `by ${result.delayDays} day${
                      result.delayDays === 1 ? "" : "s"
                    }`
                  : ""}
              </div>
              <div className="text-sm text-gray-500">
                🔥 3 others hoping for a test delay tonight.
              </div>
              <img
                src="https://snowdaypredictor.com/img/for-good-luck.5a663867.svg"
                alt="for good luck"
                className="mx-auto"
              />
              <p className="text-xl text-white mt-4">
                {result.willDelay
                  ? `🎉 Good news! Mr. Marsh is likely to delay the test by ${
                      result.delayDays
                    } day${result.delayDays === 1 ? "" : "s"}!`
                  : "📝 Bad news! The test is probably happening as scheduled."}
              </p>
              <Button
                onClick={() => setResult(null)}
                className="mt-4 bg-gray-500 text-white hover:bg-gray-600 px-6"
              >
                Try Another Assignment
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                Will Mr. Marsh delay the test?
              </h2>
              <p className="text-3xl font-light leading-tight lg:text-4xl">
                Test Delay Predictor calculates the chance of
                <br />
                test being delayed due to various factors.
              </p>
            </div>
          )}

          {!result && (
            <div className="relative">
              <div className="flex items-center gap-3 rounded-full bg-white p-3 shadow-xl">
                <Input
                  type="text"
                  placeholder="Enter assignment name..."
                  value={assignment}
                  onChange={(e) => setAssignment(e.target.value)}
                  className="flex-1 border-0 bg-transparent text-lg text-gray-600 placeholder:text-gray-400 focus-visible:ring-0"
                  onKeyDown={(e) => e.key === "Enter" && handleCalculate()}
                />
                <Button
                  onClick={handleCalculate}
                  className="rounded-full bg-[#00b8ff] px-8 text-base font-semibold uppercase tracking-wide text-white hover:bg-[#00a0e0]"
                >
                  Calculate
                </Button>
              </div>
              <p className="mt-3 text-sm text-gray-400">
                Enter the name of your assignment to predict test delay odds.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-8 lg:px-12">
        <div className="flex items-center justify-between border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-400">
            Mr. Marsh Test Delay Predictor © 2025
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Test delay calculator, enter your assignment name to calculate the
            odds of test being delayed.
          </p>
        </div>
      </footer>
    </div>
  );
}
