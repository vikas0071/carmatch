"use client";

import { RecommendedCar } from "@/lib/types";

interface CarDetailProps {
  car: RecommendedCar;
  onBack: () => void;
  onCompare?: (car: RecommendedCar) => void;
}

export default function CarDetail({ car, onBack, onCompare }: CarDetailProps) {
  return (
    <div className="car-detail">
      <button className="detail-back-btn" onClick={onBack}>
        ← Back to Results
      </button>

      <div className="detail-header">
        <div className="detail-title-section">
          <h1 className="detail-car-name">{car.make} {car.model}</h1>
          <p className="detail-variant">{car.variant} • {car.year}</p>
          <p className="detail-summary">{car.summary}</p>
        </div>
        <div className="detail-price-section">
          <span className="detail-price">₹{car.priceLakh} Lakh</span>
          <span className="detail-match">{car.matchScore}% match</span>
        </div>
      </div>

      {/* AI Reason */}
      <div className="detail-ai-section">
        <h3 className="detail-section-title">🤖 Why We Recommended This</h3>
        <p className="detail-ai-reason">{car.reason}</p>
        <div className="detail-highlights">
          {car.highlights.map((h, i) => (
            <span key={i} className="car-highlight-tag">{h}</span>
          ))}
        </div>
      </div>

      {/* Specs grid */}
      <div className="detail-specs-grid">
        <h3 className="detail-section-title">📋 Specifications</h3>
        <div className="specs-grid">
          <div className="spec-item">
            <span className="spec-label">Price</span>
            <span className="spec-value">₹{car.priceLakh} Lakh</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Fuel Type</span>
            <span className="spec-value">{car.fuelType}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Transmission</span>
            <span className="spec-value">{car.transmission}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Body Type</span>
            <span className="spec-value">{car.bodyType}</span>
          </div>
          {car.mileageKmpl > 0 && (
            <div className="spec-item">
              <span className="spec-label">Mileage</span>
              <span className="spec-value">{car.mileageKmpl} km/l</span>
            </div>
          )}
          {car.engineCc > 0 && (
            <div className="spec-item">
              <span className="spec-label">Engine</span>
              <span className="spec-value">{car.engineCc} cc</span>
            </div>
          )}
          <div className="spec-item">
            <span className="spec-label">Seats</span>
            <span className="spec-value">{car.seats}</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">Safety Rating</span>
            <span className="spec-value">{"★".repeat(car.safetyRating)}{"☆".repeat(5 - car.safetyRating)}</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="detail-features">
        <h3 className="detail-section-title">✨ Features</h3>
        <div className="features-list">
          {car.features.map((f, i) => (
            <span key={i} className="feature-tag">
              {f.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </span>
          ))}
        </div>
      </div>

      {/* Pros & Cons */}
      <div className="detail-pros-cons">
        <div className="pros-section">
          <h3 className="detail-section-title">👍 Pros</h3>
          <ul className="pros-list">
            {car.pros.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
        <div className="cons-section">
          <h3 className="detail-section-title">👎 Cons</h3>
          <ul className="cons-list">
            {car.cons.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      {onCompare && (
        <button className="btn-primary detail-compare-btn" onClick={() => onCompare(car)}>
          + Add to Compare
        </button>
      )}
    </div>
  );
}
