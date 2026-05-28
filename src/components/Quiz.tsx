"use client";

import { useState } from "react";
import { QuizAnswers } from "@/lib/types";
import { quizQuestions } from "@/lib/quiz-config";

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const question = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep) / totalSteps) * 100;

  const handleSelect = (value: string) => {
    if (isAnimating) return;

    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    setIsAnimating(true);

    setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete(newAnswers as QuizAnswers);
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentStep > 0 && !isAnimating) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="quiz-container">
      {/* Progress bar */}
      <div className="quiz-progress-wrapper">
        <div className="quiz-progress-bar">
          <div
            className="quiz-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="quiz-step-label">
          {currentStep + 1} of {totalSteps}
        </span>
      </div>

      {/* Question */}
      <div className={`quiz-question ${isAnimating ? "quiz-fade-out" : "quiz-fade-in"}`}>
        <h2 className="quiz-title">{question.title}</h2>
        <p className="quiz-subtitle">{question.subtitle}</p>

        <div className="quiz-options">
          {question.options.map((option) => (
            <button
              key={option.value}
              className={`quiz-option ${
                answers[question.id] === option.value ? "quiz-option-selected" : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              <span className="quiz-option-emoji">{option.emoji}</span>
              <div className="quiz-option-text">
                <span className="quiz-option-label">{option.label}</span>
                <span className="quiz-option-desc">{option.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Back button */}
      {currentStep > 0 && (
        <button className="quiz-back-btn" onClick={handleBack}>
          ← Back
        </button>
      )}
    </div>
  );
}
