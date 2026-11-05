import QRCode from "qrcode";
import { generateToken } from "./utils";

export async function generateQRDataUrl(token: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // QR contains only a verification URL with the secure token – no personal data
  const verifyUrl = `${appUrl}/verify/${token}`;

  try {
    const dataUrl = await QRCode.toDataURL(verifyUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      width: 300,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (error) {
    console.error("QR generation error:", error);
    throw error;
  }
}

export function createVerificationToken(): string {
  return generateToken(48);
}
