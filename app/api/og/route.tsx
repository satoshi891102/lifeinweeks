import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  // Generate a mini grid visualization
  const rows = 20;
  const cols = 52;
  const lived = 15 * 52; // ~15 years lived for demo

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fafafa",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            color: "#111",
            letterSpacing: "-2px",
            marginBottom: 8,
          }}
        >
          Life in Weeks
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#9CA3AF",
            marginBottom: 32,
          }}
        >
          Your entire life, visualized as ~4,000 tiny boxes
        </div>

        {/* Mini grid */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {Array.from({ length: rows }).map((_, row) => (
            <div key={row} style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: cols }).map((_, col) => {
                const idx = row * cols + col;
                const isLived = idx < lived;
                const colors = ["#FDE68A", "#A7F3D0", "#93C5FD", "#C4B5FD", "#F9A8D4"];
                const phaseColor = colors[Math.floor(row / 4) % colors.length];
                return (
                  <div
                    key={col}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 1,
                      background: isLived ? phaseColor : "#E5E7EB",
                      opacity: isLived ? 1 : 0.3,
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "#9CA3AF",
          }}
        >
          Each box = one week of your life
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
