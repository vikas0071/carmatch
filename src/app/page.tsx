"use client";

import { useState } from "react";
import Quiz from "@/components/Quiz";
import CarCard from "@/components/CarCard";
import CarDetail from "@/components/CarDetail";
import ComparePanel from "@/components/ComparePanel";
import ChatPanel from "@/components/ChatPanel";
import LoadingSpinner from "@/components/LoadingSpinner";
import { QuizAnswers, RecommendedCar } from "@/lib/types";

type AppView = "landing" | "quiz" | "loading" | "results" | "detail" | "compare";

export default function HomePage() {
  const [view, setView] = useState<AppView>("landing");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedCar[]>([]);
  const [selectedCar, setSelectedCar] = useState<RecommendedCar | null>(null);
  const [compareCars, setCompareCars] = useState<RecommendedCar[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleQuizComplete = async (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setView("loading");
    setError(null);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answers),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setRecommendations(data.recommendations);
      setView("results");
    } catch (err) {
      console.error("Failed to get recommendations:", err);
      setError("Something went wrong. Please try again.");
      setView("quiz");
    }
  };

  const handleViewDetails = (car: RecommendedCar) => {
    setSelectedCar(car);
    setView("detail");
  };

  const handleCompare = (car: RecommendedCar) => {
    if (compareCars.find((c) => c.id === car.id)) return;
    const updated = [...compareCars, car].slice(0, 3);
    setCompareCars(updated);
    if (updated.length >= 2) {
      setView("compare");
    }
  };

  const handleRemoveCompare = (carId: number) => {
    setCompareCars(compareCars.filter((c) => c.id !== carId));
  };

  const handleRetakeQuiz = () => {
    setView("quiz");
    setRecommendations([]);
    setQuizAnswers(null);
    setCompareCars([]);
    setSelectedCar(null);
  };

  return (
    <main className="app-main">
      {/* Landing */}
      {view === "landing" && (
        <div className="landing">
          <div className="landing-glow"></div>
          <div className="landing-content">
            <div className="landing-badge">🚗 AI-Powered</div>
            <h1 className="landing-title">
              Find Your <span className="gradient-text">Perfect Car</span>
            </h1>
            <p className="landing-subtitle">
              Answer 5 quick questions and let our AI match you with the best cars 
              from 33+ options in the Indian market. No more confusion, just confidence.
            </p>
            <button className="landing-cta" onClick={() => setView("quiz")}>
              Start Car Quiz
              <span className="cta-arrow">→</span>
            </button>
            <div className="landing-stats">
              <div className="stat">
                <span className="stat-number">33+</span>
                <span className="stat-label">Cars Analyzed</span>
              </div>
              <div className="stat">
                <span className="stat-number">5</span>
                <span className="stat-label">Quick Questions</span>
              </div>
              <div className="stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered Match</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quiz */}
      {view === "quiz" && (
        <div className="quiz-page">
          {error && (
            <div className="error-banner">
              <span>⚠️ {error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}
          <Quiz onComplete={handleQuizComplete} />
        </div>
      )}

      {/* Loading */}
      {view === "loading" && <LoadingSpinner />}

      {/* Results */}
      {view === "results" && (
        <div className="results-page">
          <div className="results-header">
            <div>
              <h2 className="results-title">Your Top Matches</h2>
              <p className="results-subtitle">
                Based on your preferences, here are the cars we think you&apos;ll love
              </p>
            </div>
            <button className="btn-ghost" onClick={handleRetakeQuiz}>
              ↻ Retake Quiz
            </button>
          </div>

          <div className="results-grid">
            {recommendations.map((car, i) => (
              <CarCard
                key={car.id}
                car={car}
                rank={i + 1}
                onViewDetails={handleViewDetails}
                onCompare={handleCompare}
              />
            ))}
          </div>

          {compareCars.length > 0 && compareCars.length < 2 && (
            <div className="compare-banner">
              <span>📊 {compareCars[0].make} {compareCars[0].model} selected for comparison. Pick one more!</span>
            </div>
          )}

          {quizAnswers && recommendations.length > 0 && (
            <ChatPanel quizAnswers={quizAnswers} recommendedCars={recommendations} />
          )}
        </div>
      )}

      {/* Detail */}
      {view === "detail" && selectedCar && (
        <div className="detail-page">
          <CarDetail
            car={selectedCar}
            onBack={() => setView("results")}
            onCompare={handleCompare}
          />
          {quizAnswers && recommendations.length > 0 && (
            <ChatPanel quizAnswers={quizAnswers} recommendedCars={recommendations} />
          )}
        </div>
      )}

      {/* Compare */}
      {view === "compare" && (
        <div className="compare-page">
          <ComparePanel
            cars={compareCars}
            onRemove={handleRemoveCompare}
            onClose={() => setView("results")}
          />
          {quizAnswers && recommendations.length > 0 && (
            <ChatPanel quizAnswers={quizAnswers} recommendedCars={recommendations} />
          )}
        </div>
      )}
    </main>
  );
}
