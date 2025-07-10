// src/pages/auth/InitResetPage.tsx
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

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useForgetPassword } from "@/api/authApi";

// Simplified form schema
const FormSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
});

const ForgetPasswordPage = () => {
  const forgetMutation = useForgetPassword();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    forgetMutation.mutate(data);
  }

  return (
    <div className="w-full h-screen center bg-background dark:bg-dark_bg text-foreground">
      <Card className="sm:w-[60vw] md:w-[50vw] lg:w-[40vw] min-h-[60vh] center rounded-md">
        <CardContent className="center flex-col gap-3 w-full p-6">
          <CardHeader className="flex justify-between items-center p-4">
            <h2 className="text-2xl font-semibold">Password Reset Request</h2>
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
                <Label htmlFor="user-login">
                  <Link to={"/login"}>
                    <span className="underline">Remember Password?</span>
                  </Link>
                </Label>
                {/* Submit Button */}
                <div className="mx-auto pt-5 flex flex-col gap-6">
                  <Button
                    type="submit"
                    className="mx-auto px-10"
                    disabled={forgetMutation.isPending}
                  >
                    {forgetMutation.isPending ? (
                      <span>Sending Reset Link</span> // Replace with a spinner or other loading indicator
                    ) : (
                      "Send Reset Link"
                    )}
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
