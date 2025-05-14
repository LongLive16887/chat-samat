import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        background: "#0ea5e9",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        padding: "10%",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="60%"
        height="60%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    </div>,
    {
      width: 512,
      height: 512,
    },
  )
}
