import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export function MagneticButton({
  children,
  className = "",
  onClick,
  as: Component = "button",
  disabled,
}) {
  const buttonRef = useRef(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    const xTo = gsap.quickTo(button, "x", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });
    const yTo = gsap.quickTo(button, "y", {
      duration: 1,
      ease: "elastic.out(1, 0.3)",
    });

    const handleMouseMove = (e) => {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // Calculate distance
      const distance = Math.sqrt(x * x + y * y);

      // Magnetic pull radius of ~80px
      if (distance < 80) {
        xTo(x * 0.4);
        yTo(y * 0.4);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled]);

  return (
    <Component
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={`relative z-10 ${className}`}
    >
      {children}
    </Component>
  );
}
