"use client";

// Slow-drifting colored nebula orbs — pure CSS animation, no canvas.
// Simulates the atmospheric depth from the reference images.
const ORBS = [
  { color: "139,92,246",  size: "75vw",  left: "15%",  top: "5%",   duration: "32s", delay: "0s" },
  { color: "232,168,32",  size: "55vw",  left: "72%",  top: "55%",  duration: "40s", delay: "-12s" },
  { color: "0,204,216",   size: "65vw",  left: "5%",   top: "65%",  duration: "26s", delay: "-18s" },
  { color: "109,40,217",  size: "48vw",  left: "78%",  top: "8%",   duration: "50s", delay: "-25s" },
  { color: "0,168,184",   size: "40vw",  left: "45%",  top: "80%",  duration: "36s", delay: "-6s" },
];

export function CosmicBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.left,
            top: orb.top,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, rgba(${orb.color},0.07) 0%, rgba(${orb.color},0.02) 40%, transparent 70%)`,
            animation: `cosmicDrift ${orb.duration} ease-in-out ${orb.delay} infinite`,
            filter: "blur(50px)",
          }}
        />
      ))}
    </div>
  );
}
