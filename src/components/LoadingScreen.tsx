const GlowingText = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-800">
      <div className="space-y-2">
        <h1
          className="font-wipeout3 text-4xl tracking-widest lowercase text-white opacity-90 animate-pulse transform"
          style={{
            textShadow: `
              0 0 7px #fff,
              0 0 10px #fff,
              0 0 21px #fff,
              0 0 42px #fff
            `,
            letterSpacing: "0.2em",
            fontStretch: "expanded",
            transform: "perspective(500px) rotateX(-5deg) skew(15deg)",
            transformOrigin: "center",
          }}
        >
          Wipeout Three
        </h1>
        <h1
          className="font-wipeout3 text-4xl tracking-widest lowercase text-white opacity-90 animate-pulse transform"
          style={{
            textShadow: `
              0 0 7px #fff,
              0 0 10px #fff,
              0 0 21px #fff,
              0 0 42px #fff
            `,
            letterSpacing: "0.2em",
            fontStretch: "expanded",
            transform: "perspective(500px) rotateX(-5deg) skew(15deg)",
            transformOrigin: "center",
          }}
        >
          Title Screen
        </h1>
      </div>
    </div>
  );
};

/**
 * Animated loading/title screen with glowing Wipeout 3 text.
 */
export default GlowingText;
