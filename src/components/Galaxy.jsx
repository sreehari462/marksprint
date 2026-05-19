import { useEffect, useRef } from "react";

export default function Galaxy({ isDark = true }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const container = ref.current;
    container.appendChild(canvas);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 2
    }));

    let frame;
    const draw = () => {
      // Background: Black for dark mode, Light Blue for light mode
      ctx.fillStyle = isDark ? "black" : "#add8e6"; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars: White for dark mode, Black for light mode
      ctx.fillStyle = isDark ? "white" : "black";
      stars.forEach((s) => {
        ctx.fillRect(s.x, s.y, s.z, s.z);
        s.y += s.z;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      });
      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, [isDark]);

  return <div ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}
