// src/pages/auth/VerifyOTPPage.tsx
import { useVerifyOTP } from "@/api/authApi";
import { Button } from "@/components/shadcn/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function VerifyOTPPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const verifyMutation = useVerifyOTP();

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: location.state?.email || "",
      otp: "",
    },
  });

  // Auto-fill email if available in location.state
  useEffect(() => {
    const stateEmail = location.state?.email;
    if (stateEmail) {
      form.setValue("email", stateEmail);
    }
  }, [location.state, form]);
 const onSubmit = (data: FormSchemaType) => {
  verifyMutation.mutate(data, {
   onSuccess: (response) => {
  const resetToken = response?.resetToken;
  if (resetToken) {
    navigate(`/auth/reset-password/${resetToken}`);
  } else {
    console.error("Reset token missing in response");
  }
},
    onError: (error) => {
      console.error("OTP verification failed", error);
    },
  });
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark_bg text-foreground">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-6 p-6 border rounded-lg shadow-md"
        >
          <h2 className="text-2xl font-semibold text-center">
            OTP Verification
          </h2>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>Email</Label>
                <FormControl>
                  <Input placeholder="Registered Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <Label>OTP</Label>
                <FormControl>
                  <Input placeholder="6-digit OTP" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={verifyMutation.isPending}
              className="px-6"
            >
              {verifyMutation.isPending ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
