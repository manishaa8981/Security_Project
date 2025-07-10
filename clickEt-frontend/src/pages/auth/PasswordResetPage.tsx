import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams } from "react-router-dom";
import { usePasswordReset } from "@/api/authApi";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import * as React from "react";
import { Eye, EyeOff } from "lucide-react";

const resetSchema = z
  .object({
    token: z.string().nonempty("Token not received"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { token } = useParams();
  const form = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });
  const resetMutation = usePasswordReset();
  const onSubmit = (data: z.infer<typeof resetSchema>) => {
    resetMutation.mutate(data);
  };

  return (
    <div className="w-full h-screen center bg-background dark:bg-dark_bg text-foreground">
      <Card className="sm:w-[60vw] md:w-[50vw] lg:w-[40vw] min-h-[60vh] center rounded-md">
        <CardContent className="center flex-col gap-3 w-full p-6">
          <CardHeader className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">Reset Password</h2>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-3 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm Password"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
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

                <Button type="submit" disabled={resetMutation.isPending}>
                  {resetMutation.isPending
                    ? "Resetting Password"
                    : "Reset Password"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
