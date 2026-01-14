"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { loginSchema, LoginInput } from "@/lib/validations/auth.schema";
import { useLoginMutation } from "@/store/api/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginInput) => {
    try {
      const res = await login(values).unwrap();

      dispatch(
        setCredentials({
          user: res.user,
        })
      );

     toast.success("Login successful");


      router.push("/dashboard");
    } catch (err: any) {

  toast.error(err?.data?.message ?? "Invalid credentials");

    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border-muted">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-6 w-6 text-primary" />
        </div>

        <CardTitle className="text-2xl font-bold">
          Admin Login
        </CardTitle>

        <CardDescription>
          Enter your credentials to access the dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="admin@email.com"
                      autoComplete="email"
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full mt-3 py-4"
              disabled={isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign in
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
