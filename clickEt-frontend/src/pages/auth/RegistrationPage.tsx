// src/pages/auth/RegistrationPage.tsx
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

import { Eye, EyeOff } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistrationFormSchema,
  RegistrationFormValues,
} from "@/lib/formSchemas/authFormSchema";

import { Link } from "react-router-dom";

import { useRegister } from "@/api/authApi";

const RegistrationPage = () => {
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
                <div className="mx-auto flex flex-col gap-6">
                  <Button type="submit" disabled={registerMutation.isPending} className="px-10">
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
