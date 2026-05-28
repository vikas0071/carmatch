"use client";

import { useState, useEffect } from "react";
import { RecommendedCar } from "@/lib/types";

interface BrowseCatalogProps {
  onBack: () => void;
  onViewDetails: (car: RecommendedCar) => void;
  onCompare: (car: RecommendedCar) => void;
}

export default function BrowseCatalog({
  onBack,
  onViewDetails,
  onCompare,
}: BrowseCatalogProps) {
  const [cars, setCars] = useState<RecommendedCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");
  const [selectedTransmission, setSelectedTransmission] = useState<string>("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedSafety, setSelectedSafety] = useState<number>(0);

  useEffect(() => {
    async function fetchCars() {
      try {
        const res = await fetch("/api/cars");
        if (!res.ok) throw new Error("Failed to load cars catalog");
        const data = await res.json();
        // Convert to include a dummy 100% matchScore for display format compatibility
        const displayCars = data.cars.map((c: any) => ({
          ...c,
          matchScore: 100,
          reason: c.summary,
          highlights: c.features.slice(0, 3).map((f: string) => f.replace(/_/g, " ")),
        }));
        setCars(displayCars);
      } catch (err) {
        console.error(err);
        setError("Could not load the catalog. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchCars();
  }, []);

  // Filter logic
  const filteredCars = cars.filter((car) => {
    // 1. Search text
    const query = search.toLowerCase();
    const matchesSearch =
      car.make.toLowerCase().includes(query) ||
      car.model.toLowerCase().includes(query) ||
      car.variant.toLowerCase().includes(query);

    // 2. Body Type
    const matchesBody =
      selectedBodyType === "all" ||
      car.bodyType.toLowerCase() === selectedBodyType.toLowerCase();

    // 3. Fuel Type
    const matchesFuel =
      selectedFuelType === "all" ||
      car.fuelType.toLowerCase() === selectedFuelType.toLowerCase();

    // 4. Transmission
    const matchesTrans =
      selectedTransmission === "all" ||
      car.transmission.toLowerCase() === selectedTransmission.toLowerCase();

    // 5. Safety Rating
    const matchesSafety = car.safetyRating >= selectedSafety;

    // 6. Price Range
    let matchesPrice = true;
    if (selectedPriceRange !== "all") {
      const price = car.priceLakh;
      if (selectedPriceRange === "under-8") matchesPrice = price < 8;
      else if (selectedPriceRange === "8-15") matchesPrice = price >= 8 && price <= 15;
      else if (selectedPriceRange === "15-25") matchesPrice = price > 15 && price <= 25;
      else if (selectedPriceRange === "over-25") matchesPrice = price > 25;
    }

    return (
      matchesSearch &&
      matchesBody &&
      matchesFuel &&
      matchesTrans &&
      matchesSafety &&
      matchesPrice
    );
  });

  return (
    <div className="catalog-container">
      <div className="catalog-header">
        <button className="btn-ghost back-to-landing" onClick={onBack}>
          ← Back to Home
        </button>
        <div className="catalog-title-wrapper">
          <h1 className="catalog-title">
            Browse Our <span className="gradient-text">Car Catalog</span>
          </h1>
          <p className="catalog-subtitle">
            Explore and filter all {cars.length} cars in our database, or add them side-by-side to compare
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="catalog-filter-bar">
        <div className="search-box-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="catalog-search"
            placeholder="Search by make, model, or variant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          {/* Price Range */}
          <div className="filter-select-wrapper">
            <label>Price Range</label>
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under-8">Under ₹8 Lakh</option>
              <option value="8-15">₹8 - ₹15 Lakh</option>
              <option value="15-25">₹15 - ₹25 Lakh</option>
              <option value="over-25">Over ₹25 Lakh</option>
            </select>
          </div>

          {/* Body Type */}
          <div className="filter-select-wrapper">
            <label>Body Type</label>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
            >
              <option value="all">All Bodies</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="MUV">MUV</option>
            </select>
          </div>

          {/* Fuel Type */}
          <div className="filter-select-wrapper">
            <label>Fuel Type</label>
            <select
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
            >
              <option value="all">All Fuels</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electric">Electric</option>
            </select>
          </div>

          {/* Transmission */}
          <div className="filter-select-wrapper">
            <label>Transmission</label>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
            >
              <option value="all">All Transmissions</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>

          {/* Safety Rating */}
          <div className="filter-select-wrapper">
            <label>Safety</label>
            <select
              value={selectedSafety}
              onChange={(e) => setSelectedSafety(Number(e.target.value))}
            >
              <option value="0">Any Safety</option>
              <option value="4">4+ Stars ★★★★</option>
              <option value="5">5 Stars ★★★★★</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Area */}
      {isLoading ? (
        <div className="catalog-loading">
          <div className="loading-spinner" style={{ margin: "4rem auto 1rem" }}>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <p>Analyzing model specifications...</p>
        </div>
      ) : error ? (
        <div className="catalog-error">
          <p>⚠️ {error}</p>
        </div>
      ) : filteredCars.length === 0 ? (
        <div className="catalog-empty">
          <span className="empty-icon">🚗💨</span>
          <h3>No matching cars found</h3>
          <p>Try broadening your filters or clearing your search term</p>
          <button
            className="btn-ghost"
            style={{ marginTop: "1rem" }}
            onClick={() => {
              setSearch("");
              setSelectedBodyType("all");
              setSelectedFuelType("all");
              setSelectedTransmission("all");
              setSelectedPriceRange("all");
              setSelectedSafety(0);
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="catalog-results-section">
          <div className="catalog-count">
            Showing {filteredCars.length} of {cars.length} cars
          </div>
          <div className="catalog-grid">
            {filteredCars.map((car) => (
              <div key={car.id} className="catalog-card-wrapper">
                {/* Simplified Card with dynamic properties */}
                <div className="car-card catalog-card">
                  <div className="car-image-placeholder">
                    <div className="car-image-text">
                      <span className="car-image-make">{car.make}</span>
                      <span className="car-image-model">{car.model}</span>
                    </div>
                    <span
                      className="car-body-badge"
                      style={{
                        background:
                          car.bodyType === "SUV"
                            ? "linear-gradient(135deg, #f59e0b, #d97706)"
                            : car.bodyType === "Sedan"
                            ? "linear-gradient(135deg, #3b82f6, #1d4ed8)"
                            : car.bodyType === "Hatchback"
                            ? "linear-gradient(135deg, #10b981, #047857)"
                            : "linear-gradient(135deg, #8b5cf6, #6d28d9)",
                      }}
                    >
                      {car.bodyType}
                    </span>
                  </div>
                  <div className="car-info">
                    <div className="car-header">
                      <div>
                        <span className="car-name">
                          {car.make} {car.model}
                        </span>
                        <div className="car-variant">{car.variant}</div>
                      </div>
                      <span className="car-price">₹{car.priceLakh}L</span>
                    </div>

                    <div className="car-specs-row">
                      <div className="car-spec">
                        <span className="car-spec-icon">⛽</span>
                        <span className="car-spec-value">{car.fuelType}</span>
                      </div>
                      <div className="car-spec">
                        <span className="car-spec-icon">⚙️</span>
                        <span className="car-spec-value">{car.transmission}</span>
                      </div>
                      <div className="car-spec">
                        <span className="car-spec-icon">⭐</span>
                        <span className="car-spec-value">{car.safetyRating} Star</span>
                      </div>
                      {car.mileageKmpl > 0 && (
                        <div className="car-spec">
                          <span className="car-spec-icon">📉</span>
                          <span className="car-spec-value">{car.mileageKmpl} km/l</span>
                        </div>
                      )}
                    </div>

                    <div className="car-actions">
                      <button
                        className="btn-secondary"
                        onClick={() => onViewDetails(car)}
                      >
                        Details
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() => onCompare(car)}
                      >
                        + Compare
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
