import { useRef, useEffect } from "react";

export default function ClickSpark({ children, isDark = true }) {
  const canvasRef = useRef(null);
  const sparks = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparks.current = sparks.current.filter((s) => {
        s.life--;
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        // Spark color: White for dark mode, Black for light mode
        ctx.fillStyle = isDark ? "white" : "black";
        ctx.fill();

        s.x += s.vx;
        s.y += s.vy;

        return s.life > 0;
      });

      frame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  const handleClick = (e) => {
    for (let i = 0; i < 10; i++) {
      sparks.current.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30
      });
    }
  };

  return (
    <div onClick={handleClick}>
      <canvas
        ref={canvasRef}
        style={{ position: "fixed", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
      />
      {children}
    </div>
  );
}
