import axios from "@/api/authApi"; // Your axios instance with withCredentials  @/api/authApi
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { useEffect, useState } from "react";

const EnableTOTPPage = () => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  // Fetch QR code on mount
  useEffect(() => {
    axios
      .get(`/mfa/totp/setup?userId=${localStorage.getItem("mfa_userId")}`)
      .then((res) => setQrCode(res.data.qrCode))
      .catch(() => setStatus("error"));
  }, []);

  const handleVerify = async () => {
    try {
      await axios.post("/mfa/totp/verify", { token });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-background text-foreground p-4">
      <Card className="w-full max-w-md shadow-xl border">
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Enable Two-Factor Authentication
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {qrCode ? (
            <img
              src={qrCode}
              alt="Scan QR Code"
              className="mx-auto w-48 h-48 border p-2 rounded"
            />
          ) : (
            <p>Loading QR code...</p>
          )}

          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />

          <Button onClick={handleVerify}>Verify</Button>

          {status === "success" && (
            <p className="text-green-500">TOTP verified successfully ✅</p>
          )}
          {status === "error" && (
            <p className="text-red-500">Invalid code. Try again.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnableTOTPPage;
