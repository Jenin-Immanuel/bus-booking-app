// Stores
import { useAuthStore } from "@/stores/authStore";

// Constants
import { API_URL } from "@/utils/constants";

// Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import { Link } from "react-router-dom";

// ShadCN components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleLogin(values: z.infer<typeof loginSchema>) {
    const res = await fetch(API_URL + "/user/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.name, data.email);
      navigate("/p/dashboard");
      return;
    }
    toast({
      title: "Error",
      description: data.message,
      variant: "destructive",
    });
  }

  return (
    <main className="h-screen flex justify-center items-center flex-col ">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleLogin)}
              className="space-y-8  flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          placeholder="Email"
                          type="email"
                          {...field}
                          className="w-full"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          placeholder="Password"
                          type="password"
                          {...field}
                          required
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid gap-4">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
