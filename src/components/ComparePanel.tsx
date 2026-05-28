"use client";

import { RecommendedCar } from "@/lib/types";

interface ComparePanelProps {
  cars: RecommendedCar[];
  onRemove: (carId: number) => void;
  onClose: () => void;
}

export default function ComparePanel({ cars, onRemove, onClose }: ComparePanelProps) {
  if (cars.length < 2) {
    return (
      <div className="compare-panel">
        <div className="compare-header">
          <h2 className="compare-title">Compare Cars</h2>
          <button className="compare-close" onClick={onClose}>✕</button>
        </div>
        <p className="compare-empty">Select at least 2 cars to compare. You have {cars.length} selected.</p>
        {cars.length === 1 && (
          <div className="compare-selected">
            <span>{cars[0].make} {cars[0].model}</span>
            <button onClick={() => onRemove(cars[0].id)}>Remove</button>
          </div>
        )}
      </div>
    );
  }

  const specRows = [
    { label: "Price", render: (c: RecommendedCar) => `₹${c.priceLakh} Lakh` },
    { label: "Fuel Type", render: (c: RecommendedCar) => c.fuelType },
    { label: "Transmission", render: (c: RecommendedCar) => c.transmission },
    { label: "Body Type", render: (c: RecommendedCar) => c.bodyType },
    { label: "Mileage", render: (c: RecommendedCar) => c.mileageKmpl > 0 ? `${c.mileageKmpl} km/l` : "N/A (EV)" },
    { label: "Engine", render: (c: RecommendedCar) => c.engineCc > 0 ? `${c.engineCc} cc` : "Electric Motor" },
    { label: "Seats", render: (c: RecommendedCar) => `${c.seats}` },
    { label: "Safety Rating", render: (c: RecommendedCar) => "★".repeat(c.safetyRating) + "☆".repeat(5 - c.safetyRating) },
    { label: "Match Score", render: (c: RecommendedCar) => `${c.matchScore}%` },
  ];

  return (
    <div className="compare-panel">
      <div className="compare-header">
        <h2 className="compare-title">Side-by-Side Comparison</h2>
        <button className="compare-close" onClick={onClose}>✕</button>
      </div>

      <div className="compare-table-wrapper">
        <table className="compare-table">
          <thead>
            <tr>
              <th className="compare-label-col">Spec</th>
              {cars.map((car) => (
                <th key={car.id} className="compare-car-col">
                  <div className="compare-car-header">
                    <span className="compare-car-name">{car.make} {car.model}</span>
                    <span className="compare-car-variant">{car.variant}</span>
                    <button className="compare-remove-btn" onClick={() => onRemove(car.id)}>
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specRows.map((row) => (
              <tr key={row.label}>
                <td className="compare-label">{row.label}</td>
                {cars.map((car) => (
                  <td key={car.id} className="compare-value">
                    {row.render(car)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td className="compare-label">Key Features</td>
              {cars.map((car) => (
                <td key={car.id} className="compare-value compare-features">
                  {car.features.slice(0, 5).map((f, i) => (
                    <span key={i} className="feature-tag-sm">
                      {f.replace(/_/g, " ")}
                    </span>
                  ))}
                </td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Pros</td>
              {cars.map((car) => (
                <td key={car.id} className="compare-value">
                  <ul className="compare-list">
                    {car.pros.map((p, i) => (
                      <li key={i}>✅ {p}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="compare-label">Cons</td>
              {cars.map((car) => (
                <td key={car.id} className="compare-value">
                  <ul className="compare-list">
                    {car.cons.map((c, i) => (
                      <li key={i}>⚠️ {c}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
