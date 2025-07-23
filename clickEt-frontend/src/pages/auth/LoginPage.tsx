import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import {
  LoginFormSchema,
  LoginFormValues,
} from "@/lib/formSchemas/authFormSchema";
// import { zodResolver } from "@hookform/resolvers/zod";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import axios from "../../api/authApi"; // Ensure this is your axios file with withCredentials

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [step, setStep] = React.useState<"login" | "totp">("login");
  const [userId, setUserId] = React.useState<string | null>(null);
  const [totpToken, setTotpToken] = React.useState("");
  const [totpError, setTotpError] = React.useState("");
  const [captchaToken, setCaptchaToken] = React.useState<string | null>(null);

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
    mode: "onSubmit",
  });

  // Submit Login credentials
  async function onSubmit(data: LoginFormValues) {
    try {
      if (!captchaToken) {
        alert("Please verify the CAPTCHA.");
        return;
      }
      const res = await axios.post(
        "/auth/login",
        { ...data, captchaToken },
        {
          withCredentials: true,
        }
      );

      // 1. User needs to setup MFA (QR code step)
      if (res.status === 200 && res.data.mfaSetupRequired) {
        localStorage.setItem("mfa_userId", res.data.userId);
        window.location.href = "/security/enable-totp";
        return; // make sure to exit early
      }

      // 2. MFA is already enabled → prompt for TOTP
      if (res.status === 206 && res.data.mfaRequired) {
        setUserId(res.data.userId);
        setStep("totp");
        return;
      }

      // 3. Normal login, no MFA
      window.location.href = "/";
    } catch (err: any) {
      console.error(err);
      alert(
        "Login failed: " + (err.response?.data?.message || "Unknown error")
      );
    }
  }

  // Submit TOTP code
  const handleTOTP = async () => {
    try {
      await axios.post(
        "/mfa/totp/verify",
        { userId, token: totpToken },
        { withCredentials: true }
      );
      window.location.href = "/";
    } catch (err) {
      setTotpError("Invalid TOTP code. Try again.");
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-background dark:bg-dark_bg text-foreground">
      <Card className="w-[60vw] min-h-[60vh] flex justify-center items-stretch rounded-md">
        <CardContent className="flex flex-col gap-3 basis-[60%] justify-center items-center p-6">
          <CardHeader className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">
              {step === "login" ? "Login" : "Verify TOTP"}
            </h2>
          </CardHeader>

          <CardContent className="w-full flex flex-col gap-4">
            {step === "login" && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3 flex flex-col justify-center"
                >
                  <FormField
                    control={form.control}
                    name="user_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="E-mail / Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* reCAPTCHA Widget */}
                  <div className="pt-4 mx-auto">
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={handleCaptchaChange}
                    />
                  </div>

                  <Label htmlFor="password-reset">
                    <Link to={"/auth/forget-password"}>
                      <span className="underline">Forgot Password?</span>
                    </Link>
                  </Label>
                  <div className="mx-auto pt-5 flex flex-col gap-6">
                    <Button type="submit" className="mx-auto px-10">
                      Login
                    </Button>
                    <Label htmlFor="navigateLogin">
                      Not registered yet?{" "}
                      <Link to={"/register"}>
                        <span className="underline">Register</span>
                      </Link>
                    </Label>
                  </div>
                </form>
              </Form>
            )}

            {step === "totp" && (
              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter 6-digit TOTP"
                  value={totpToken}
                  onChange={(e) => setTotpToken(e.target.value)}
                  maxLength={6}
                  className="text-center tracking-widest text-lg"
                />
                <Button onClick={handleTOTP}>Verify Code</Button>
                {totpError && <p className="text-red-500">{totpError}</p>}
              </div>
            )}
          </CardContent>
        </CardContent>

        <div className="flex basis-[40%] isolate rounded-r-md">
          <div
            className="z-0 w-full rounded-r-md"
            style={{
              backgroundImage: "url(/src/assets/auth/login.png)",
              objectFit: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
