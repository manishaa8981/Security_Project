// src/pages/auth/LoginPage.tsx
import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/shadcn/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";

import { EyeOff, Eye } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormSchema,
  LoginFormValues,
} from "@/lib/formSchemas/authFormSchema";

import { useForm } from "react-hook-form";

import { Link } from "react-router-dom";

import { useLogin } from "@/api/authApi";

// Simplified form schema

const LoginPage = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const loginMutation = useLogin();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      user_name: "",
      password: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: LoginFormValues) {
    loginMutation.mutate(data);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-background dark:bg-dark_bg text-foreground">
      <Card className="w-[60vw] min-h-[60vh] flex justify-center items-stretch rounded-md">
        <CardContent className="flex flex-col gap-3 basis-[60%] justify-center items-center p-6">
          <CardHeader className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">Login</h2>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-3 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 flex flex-col justify-center"
              >
                {/* Email/Username Field */}
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="E-mail/ Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
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
                <Label htmlFor="password-reset">
                  <Link to={"/auth/forget-password"}>
                    <span className="underline">Forgot Password?</span>
                  </Link>
                </Label>
                {/* Submit Button */}
                <div className="mx-auto pt-5 flex flex-col gap-6">
                  <Button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="mx-auto px-10"
                  >
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
