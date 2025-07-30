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

import { useForgetPassword } from "@/api/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner"; // or your preferred toast lib
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
});

const ForgetPasswordPage = () => {
  const navigate = useNavigate();

  const forgetMutation = useForgetPassword();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    forgetMutation.mutate(data, {
      onSuccess: (res) => {
        toast.success(res.message || "OTP sent to your email.");
        // Navigate to OTP verification page, passing email as query or state
        navigate("/verify", { state: { email: data.email } });
      },
      onError: (err: any) => {
        const msg =
          err?.response?.data?.message || "Failed to send OTP. Try again.";
        toast.error(msg);
      },
    });
  };

  return (
    <div className="w-full h-screen center bg-background dark:bg-dark_bg text-foreground">
      <Card className="sm:w-[60vw] md:w-[50vw] lg:w-[40vw] min-h-[60vh] center rounded-md">
        <CardContent className="center flex-col gap-3 w-full p-6">
          <CardHeader className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">Password Reset Request</h2>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col justify-center"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Registered email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Link */}
                <Label htmlFor="user-login" className="text-sm">
                  <Link to="/login" className="underline text-blue-600">
                    Remember Password?
                  </Link>
                </Label>

                {/* Submit Button */}
                <div className="mx-auto pt-5">
                  <Button
                    type="submit"
                    className="px-10"
                    disabled={forgetMutation.isPending}
                  >
                    {forgetMutation.isPending ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgetPasswordPage;
