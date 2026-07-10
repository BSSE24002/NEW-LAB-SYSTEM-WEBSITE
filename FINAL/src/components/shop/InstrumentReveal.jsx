import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

const FLAGSHIP = {
  name: "ELECTRON MICROSCOPE",
  colors: [
    {
      name: "LENS SYSTEM.",
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1470&auto=format&fit=crop",
    },
    {
      name: "VACUUM CHAMBER.",
      image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?q=80&w=1471&auto=format&fit=crop",
    },
    {
      name: "SPECIMEN STAGE.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=1470&auto=format&fit=crop",
    },
    {
      name: "ELECTRON GUN.",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1469&auto=format&fit=crop",
    },
    {
      name: "DETECTORS.",
      image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1470&auto=format&fit=crop",
    },
    {
      name: "CONTROL UNIT.",
      image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=1472&auto=format&fit=crop",
    },
  ],
};

export function InstrumentReveal() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Calculate discrete active index (0 to 5)
  const activeIndex = useTransform(scrollYProgress, (v) =>
    Math.min(5, Math.max(0, Math.floor(v * 6)))
  );

  const img1Op = useTransform(activeIndex, (v) => (v === 0 ? 1 : 0));
  const img2Op = useTransform(activeIndex, (v) => (v === 1 ? 1 : 0));
  const img3Op = useTransform(activeIndex, (v) => (v === 2 ? 1 : 0));
  const img4Op = useTransform(activeIndex, (v) => (v === 3 ? 1 : 0));
  const img5Op = useTransform(activeIndex, (v) => (v === 4 ? 1 : 0));
  const img6Op = useTransform(activeIndex, (v) => (v === 5 ? 1 : 0));

  const img1Scale = useTransform(scrollYProgress, [0, 1/6], [1, 1.1]);
  const img2Scale = useTransform(scrollYProgress, [1/6, 2/6], [1, 1.1]);
  const img3Scale = useTransform(scrollYProgress, [2/6, 3/6], [1, 1.1]);
  const img4Scale = useTransform(scrollYProgress, [3/6, 4/6], [1, 1.1]);
  const img5Scale = useTransform(scrollYProgress, [4/6, 5/6], [1, 1.1]);
  const img6Scale = useTransform(scrollYProgress, [5/6, 1], [1, 1.1]);

  return (
    <div ref={containerRef} className="h-[600vh] relative bg-black">
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
        {/* Images */}
        <motion.div style={{ opacity: img1Op }} className="absolute inset-0 z-10 bg-black">
          <motion.img
            style={{ scale: img1Scale }}
            src={FLAGSHIP.colors[0].image}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div style={{ opacity: img2Op }} className="absolute inset-0 z-10 bg-black">
          <motion.img
            style={{ scale: img2Scale }}
            src={FLAGSHIP.colors[1].image}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div style={{ opacity: img3Op }} className="absolute inset-0 z-10 bg-black">
          <motion.img
            style={{ scale: img3Scale }}
            src={FLAGSHIP.colors[2].image}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div style={{ opacity: img4Op }} className="absolute inset-0 z-10 bg-black">
          <motion.img
            style={{ scale: img4Scale }}
            src={FLAGSHIP.colors[3].image}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div style={{ opacity: img5Op }} className="absolute inset-0 z-10 bg-black">
          <motion.img
            style={{ scale: img5Scale }}
            src={FLAGSHIP.colors[4].image}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div style={{ opacity: img6Op }} className="absolute inset-0 z-10 bg-black">
          <motion.img
            style={{ scale: img6Scale }}
            src={FLAGSHIP.colors[5].image}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dynamic Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none z-[45]" />

        {/* Text Area */}
        <div className="relative z-50 w-full px-6 md:px-12 pointer-events-none flex flex-col justify-center h-full items-center text-center">
          <h2 className="text-[10vw] md:text-[8vw] leading-[0.8] font-sans font-black uppercase text-white tracking-tighter mix-blend-overlay">
            {FLAGSHIP.name}
          </h2>
          <div className="absolute bottom-20 flex justify-center text-white font-sans text-xl md:text-3xl font-black tracking-tight uppercase items-center w-full">
            <motion.span style={{ opacity: img1Op }} className="absolute">
              {FLAGSHIP.colors[0].name}
            </motion.span>
            <motion.span style={{ opacity: img2Op }} className="absolute">
              {FLAGSHIP.colors[1].name}
            </motion.span>
            <motion.span style={{ opacity: img3Op }} className="absolute">
              {FLAGSHIP.colors[2].name}
            </motion.span>
            <motion.span style={{ opacity: img4Op }} className="absolute">
               {FLAGSHIP.colors[3].name}
            </motion.span>
            <motion.span style={{ opacity: img5Op }} className="absolute">
              {FLAGSHIP.colors[4].name}
            </motion.span>
            <motion.span style={{ opacity: img6Op }} className="absolute">
              {FLAGSHIP.colors[5].name}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}
