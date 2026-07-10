import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import SplitType from "split-type";

export function ScrambleText({
  text,
  className = "",
}) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitType(textRef.current, { types: "chars" });

    gsap.fromTo(
      split.chars,
      {
        opacity: 0,
        filter: "blur(10px)",
        scale: 0.8,
        rotationX: 90,
      },
      {
        opacity: 1,
        filter: "blur(0px)",
        scale: 1,
        rotationX: 0,
        duration: 1,
        stagger: 0.02,
        ease: "power3.out",
        delay: 0.2,
      },
    );

    return () => {
      split.revert();
    };
  }, [text]);

  return (
    <h1
      ref={textRef}
      className={className}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
    >
      {text}
    </h1>
  );
}
