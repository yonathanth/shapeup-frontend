import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt =
  "ShapeUp Sport Zone - Premium Fitness Center in Addis Ababa, Ethiopia";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  try {
    // Font
    const interSemiBold = fetch(
      new URL("./Inter-SemiBold.ttf", import.meta.url)
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 128,
            background:
              "linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #121212 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            position: "relative",
          }}
        >
          {/* Background pattern */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.1,
              background:
                "radial-gradient(circle at 30% 50%, #4099ff 0%, transparent 50%)",
            }}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 8,
                textAlign: "center",
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              ShapeUp Sport Zone
            </div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 500,
                color: "#4099ff", // CustomBlue color
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Premium Fitness Center • Addis Ababa
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 400,
                color: "#cccccc",
                textAlign: "center",
                maxWidth: 900,
                lineHeight: 1.3,
              }}
            >
              CrossFit • Muay Thai • Kickboxing • Recovery Center • Sports
              Courts
            </div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 400,
                color: "#888888",
                textAlign: "center",
                marginTop: 16,
              }}
            >
              shapeupsportzone.com
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Inter",
            data: await interSemiBold,
            style: "normal",
            weight: 400,
          },
        ],
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
