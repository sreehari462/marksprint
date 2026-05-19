import React, { useEffect, useRef } from "react";
import "./MagicRings.css";

const MagicRings = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const rings = container.querySelectorAll(".ring");
    
    rings.forEach((ring, index) => {
      const duration = 4 + index * 0.5;
      ring.style.animationDuration = `${duration}s`;
      ring.style.animationDelay = `${index * 0.2}s`;
    });
  }, []);

  return (
    <div className="magic-rings-container" ref={containerRef}>
      <div className="ring ring-1"></div>
      <div className="ring ring-2"></div>
      <div className="ring ring-3"></div>
      <div className="ring ring-4"></div>
      <div className="ring ring-5"></div>
    </div>
  );
};

export default MagicRings;
