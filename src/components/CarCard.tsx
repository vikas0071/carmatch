"use client";

import { RecommendedCar } from "@/lib/types";

interface CarCardProps {
  car: RecommendedCar;
  rank: number;
  onViewDetails?: (car: RecommendedCar) => void;
  onCompare?: (car: RecommendedCar) => void;
}

function getBodyTypeColor(bodyType: string): string {
  const colors: Record<string, string> = {
    Hatchback: "#6366f1",
    Sedan: "#8b5cf6",
    SUV: "#ec4899",
    MUV: "#f59e0b",
  };
  return colors[bodyType] || "#6366f1";
}

function getFuelIcon(fuelType: string): string {
  const icons: Record<string, string> = {
    Petrol: "⛽",
    Diesel: "🛢️",
    Electric: "⚡",
    CNG: "🌿",
  };
  return icons[fuelType] || "⛽";
}

export default function CarCard({ car, rank, onViewDetails, onCompare }: CarCardProps) {
  const color = getBodyTypeColor(car.bodyType);

  return (
    <div className="car-card" style={{ animationDelay: `${rank * 150}ms` }}>
      {/* Rank badge */}
      <div className="car-rank">#{rank}</div>

      {/* Car image placeholder */}
      <div className="car-image-placeholder" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
        <div className="car-image-text" style={{ color }}>
          <span className="car-image-make">{car.make}</span>
          <span className="car-image-model">{car.model}</span>
        </div>
        <div className="car-body-badge" style={{ backgroundColor: color }}>
          {car.bodyType}
        </div>
      </div>

      {/* Car info */}
      <div className="car-info">
        <div className="car-header">
          <div>
            <h3 className="car-name">{car.make} {car.model}</h3>
            <p className="car-variant">{car.variant} • {car.year}</p>
          </div>
          <div className="car-price">₹{car.priceLakh}L</div>
        </div>

        {/* Match score */}
        <div className="car-match">
          <div className="car-match-bar">
            <div
              className="car-match-fill"
              style={{ width: `${car.matchScore}%` }}
            />
          </div>
          <span className="car-match-score">{car.matchScore}% match</span>
        </div>

        {/* AI reason */}
        <p className="car-reason">{car.reason}</p>

        {/* Highlights */}
        <div className="car-highlights">
          {car.highlights.map((h, i) => (
            <span key={i} className="car-highlight-tag">
              {h}
            </span>
          ))}
        </div>

        {/* Quick specs */}
        <div className="car-specs-row">
          <div className="car-spec">
            <span className="car-spec-icon">{getFuelIcon(car.fuelType)}</span>
            <span className="car-spec-value">{car.fuelType}</span>
          </div>
          <div className="car-spec">
            <span className="car-spec-icon">⚙️</span>
            <span className="car-spec-value">{car.transmission}</span>
          </div>
          {car.mileageKmpl > 0 && (
            <div className="car-spec">
              <span className="car-spec-icon">📊</span>
              <span className="car-spec-value">{car.mileageKmpl} km/l</span>
            </div>
          )}
          <div className="car-spec">
            <span className="car-spec-icon">🛡️</span>
            <span className="car-spec-value">{"★".repeat(car.safetyRating)}{"☆".repeat(5 - car.safetyRating)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="car-actions">
          {onViewDetails && (
            <button className="btn-primary" onClick={() => onViewDetails(car)}>
              View Details
            </button>
          )}
          {onCompare && (
            <button className="btn-secondary" onClick={() => onCompare(car)}>
              + Compare
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
