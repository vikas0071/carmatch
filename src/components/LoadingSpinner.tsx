export default function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      <div className="loading-text">
        <h3>Finding your perfect match...</h3>
        <p>Our AI is analyzing 33+ cars to find the best options for you</p>
      </div>
      <div className="loading-steps">
        <div className="loading-step loading-step-active">
          <span className="loading-dot"></span>
          <span>Analyzing your preferences</span>
        </div>
        <div className="loading-step">
          <span className="loading-dot"></span>
          <span>Matching with car database</span>
        </div>
        <div className="loading-step">
          <span className="loading-dot"></span>
          <span>Generating personalized insights</span>
        </div>
      </div>
    </div>
  );
}
