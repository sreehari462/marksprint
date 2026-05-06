import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import "../App.css";
import MagicRings from "../components/MagicRings";

const subjects = ["Physics", "Chemistry", "Maths", "Computer", "Biology", "English", "Tamil"];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showRing, setShowRing] = useState(false);
  const navigate = useNavigate();

  // Subject rotation every 5 seconds
  useEffect(() => {
    if (selected) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % subjects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [selected, index]);

  const next = () => setIndex((prev) => (prev + 1) % subjects.length);
  const prev = () => setIndex((prev) => (prev - 1 + subjects.length) % subjects.length);

  const handleSelect = () => {
    setSelected(subjects[index]);
    setShowRing(true);
    setTimeout(() => setShowRing(false), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center flex-1 h-full pt-8">
      <h1 className="main-title mt-8">MARKSPRINT</h1>
      <p className="about-section text-gray-200">
        Boost your 12th board scores with focused one-mark practice.
        Choose a subject, test yourself, and improve your accuracy with every sprint.
      </p>

      <p className="subtitle text-gray-100">Choose the Subject</p>

      <div className="circle-container">
        <button className="arrow" onClick={prev}>◀</button>
        <div className="circle">
          <div key={index} className="subject animate">
            {subjects[index]}
          </div>
          <button className="select-btn" onClick={handleSelect}>
            SELECT
          </button>
          {showRing && (
            <div className="ring-wrapper">
              <MagicRings />
            </div>
          )}
        </div>
        <button className="arrow" onClick={next}>▶</button>
      </div>

      {selected && (
        <p className="selected-text font-semibold text-white">Selected: {selected}</p>
      )}

      <button 
        className="go-btn"
        onClick={() => {
          if (!selected) {
            alert("Select a subject first");
            return;
          }
          navigate(`/quiz/${selected === "Computer" ? "cs" : selected.toLowerCase()}`);
        }}
      >
        GO
      </button>

      <div className="creator-footer mt-8">
        <button 
          className="portfolio-btn" 
          onClick={() => navigate("/about")}
        >
          ABOUT
        </button>
      </div>
    </div>
  );
}
