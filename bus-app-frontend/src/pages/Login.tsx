// Stores
import { useAuthStore } from "@/stores/authStore";

// Constants
import { API_URL } from "@/utils/constants";

// Hook Form
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ShadCN components
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function Login() {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
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
    alert("Login Failed");
  }

  return (
    <main className="h-screen flex justify-center items-center flex-col gap-2">
      <h1 className="text-center text-3xl mb-9 font-bold">Login</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          className="space-y-8 w-1/3 flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Email"
                    type="email"
                    {...field}
                    className="w-full"
                  />
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
                  <Input placeholder="Password" type="password" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="flex w-full justify-center items-center">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </Form>
    </main>
  );
}
