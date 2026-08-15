import { useEffect, useRef } from "react";

export default function useMouseParallax(options = {}) {
  const {
    intensity = 10,
    enabled = true,
    smoothing = 0.1,
  } = options;

  const ref = useRef(null);
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    
    // Only enable on desktop
    if (window.innerWidth < 1024) return;

    const handleMouseMove = (e) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate normalized position (-1 to 1)
      const normalizedX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normalizedY = (e.clientY - centerY) / (window.innerHeight / 2);
      
      // Clamp to -1 to 1 range
      targetPos.current = {
        x: Math.max(-1, Math.min(1, normalizedX)) * intensity,
        y: Math.max(-1, Math.min(1, normalizedY)) * intensity,
      };
    };

    // Smooth animation loop
    let animationFrame;
    const animate = () => {
      // Smooth interpolation
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * smoothing;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * smoothing;
      
      if (ref.current) {
        // Apply transform to child elements only, NOT the ref element itself
        // This prevents creating a stacking context on parent containers
        const children = ref.current.querySelectorAll("[data-parallax]");
        children.forEach((child) => {
          const factor = parseFloat(child.dataset.parallax) || 1;
          child.style.transform = `translate(${currentPos.current.x * factor}px, ${currentPos.current.y * factor}px)`;
        });
      }
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, [enabled, intensity, smoothing]);

  return ref;
}