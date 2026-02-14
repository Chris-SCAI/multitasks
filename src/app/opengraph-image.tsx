import { ImageResponse } from "next/og";

export const alt = "Multitasks - Priorisation IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          background: "linear-gradient(135deg, #0B1120 0%, #1E293B 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FACC15"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
          </svg>
          <span
            style={{
              fontSize: "64px",
              fontWeight: 800,
              color: "white",
              letterSpacing: "-0.02em",
            }}
          >
            Multi
            <span style={{ color: "#A78BFA" }}>Tasks</span>
          </span>
        </div>

        <p
          style={{
            fontSize: "36px",
            fontWeight: 700,
            color: "#E2E8F0",
            textAlign: "center",
            lineHeight: 1.3,
            maxWidth: "800px",
            margin: 0,
          }}
        >
          To-do partout. Priorites nulle part.
        </p>
        <p
          style={{
            fontSize: "30px",
            fontWeight: 600,
            color: "#7C3AED",
            marginTop: "12px",
          }}
        >
          On tranche. Tu avances.
        </p>

        <div
          style={{
            display: "flex",
            gap: "24px",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(124, 58, 237, 0.15)",
              border: "1px solid rgba(124, 58, 237, 0.3)",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#A78BFA",
            }}
          >
            Priorisation IA
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(37, 99, 235, 0.15)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#93C5FD",
            }}
          >
            Matrice Eisenhower
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(16, 185, 129, 0.15)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "9999px",
              padding: "10px 24px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#6EE7B7",
            }}
          >
            Gratuit
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
