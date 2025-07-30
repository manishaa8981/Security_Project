// src/pages/auth/RegistrationPage.tsx
import * as React from "react";
// @ts-ignore
import zxcvbn from "zxcvbn";

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

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import {
  RegistrationFormSchema,
  RegistrationFormValues,
} from "@/lib/formSchemas/authFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";

import { Link } from "react-router-dom";

import { useRegister } from "@/api/authApi";

const passwordRequirements = [
  { label: "At least 8 characters", test: (pw: string) => pw.length >= 8 },
  {
    label: "At least 1 uppercase letter",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "At least 1 lowercase letter",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  { label: "At least 1 number", test: (pw: string) => /\d/.test(pw) },
  {
    label: "At least 1 special character (!@#$%^&*)",
    test: (pw: string) => /[!@#$%^&*]/.test(pw),
  },
];

const RegistrationPage = () => {
  const [passwordStrength, setPasswordStrength] = React.useState<number>(0);
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = React.useState(false);
  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(RegistrationFormSchema),
    defaultValues: {
      full_name: "",
      user_name: "",
      email: "",
      phone_number: "",
      password: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: RegistrationFormValues) {
    registerMutation.mutate(data);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center bg-background dark:bg-dark_bg text-foreground">
      <Card className="w-[60vw] flex justify-center items-stretch rounded-md">
        <CardContent className="flex flex-col gap-3 basis-[60%] justify-center items-center p-6">
          <CardHeader className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">Register</h2>
          </CardHeader>
          <CardContent className="w-full flex flex-col gap-3 ">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 flex flex-col justify-center"
              >
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="user_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="E-mail address"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Phone number"
                          type="number"
                          {...field}
                        />
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
                          placeholder="Enter your password"
                          {...field}
                          onChange={(e) => {
                            const password = e.target.value;
                            const result = zxcvbn(password);
                            setPasswordStrength(result.score); // score from 0 (weak) to 4 (strong)
                            field.onChange(password); // update react-hook-form value
                          }}
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
                      <div className="text-xs text-muted-foreground mt-1">
                        Strength:{" "}
                        {
                          ["Very Weak", "Weak", "Fair", "Good", "Strong"][
                            passwordStrength
                          ]
                        }
                      </div>
                      <div className="h-1 mt-1 rounded-full bg-muted relative">
                        <div
                          className={`h-full rounded-full ${
                            [
                              "bg-red-500",
                              "bg-orange-400",
                              "bg-yellow-400",
                              "bg-green-400",
                              "bg-green-600",
                            ][passwordStrength]
                          }`}
                          style={{ width: `${(passwordStrength + 1) * 20}%` }}
                        />
                      </div>
                      {/* Password requirements checklist */}
                      <ul className="mt-2 mb-1 text-xs space-y-1">
                        {passwordRequirements.map((req) => (
                          <li
                            key={req.label}
                            className="flex items-center gap-2"
                          >
                            <span
                              className={
                                req.test(field.value)
                                  ? "text-green-600 font-semibold"
                                  : "text-gray-400"
                              }
                            >
                              {req.test(field.value) ? "✓" : "✗"}
                            </span>
                            <span>{req.label}</span>
                          </li>
                        ))}
                      </ul>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="mx-auto flex flex-col gap-6">
                  <Button
                    type="submit"
                    disabled={registerMutation.isPending}
                    className="px-10"
                  >
                    Register
                  </Button>

                  <Label htmlFor="navigateLogin">
                    Already have an account?{" "}
                    <Link to={"/login"}>
                      <span className="underline">Login</span>
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

export default RegistrationPage;
