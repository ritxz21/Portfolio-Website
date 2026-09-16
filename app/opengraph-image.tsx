import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

// This file generates the picture people see when your link is pasted
// into LinkedIn, Slack, WhatsApp, iMessage or X. Next builds it once at
// build time — it's a real PNG, not a live render.

export const alt = `${site.name} — ${site.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          backgroundColor: "#16161a",
          color: "#f4f2ee",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#e3b23c",
          }}
        >
          Portfolio
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 86,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {site.name}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 38,
            color: "#928d85",
          }}
        >
          {site.role}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 56,
            height: 6,
            width: 180,
            backgroundColor: "#e3b23c",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
