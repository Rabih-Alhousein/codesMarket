"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

import { trpc } from "@/trpc/client";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { toast } from "sonner";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

const SignUpPage: React.FC = ({}) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (error) => {
      if (error.data?.code === "CONFLICT") {
        toast.error("Email already exists");

        return;
      }

      if (error instanceof ZodError) {
        toast.error(error.issues[0].message);

        return;
      }

      toast.error("Something went wrong, please try again later.");
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Email sent to ${sentToEmail}`);
      router.push("/verify-email?to=" + sentToEmail);
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    mutate({ email, password });
  };

  return (
    <div className="container relative flex pt-20 flex-col items-center justify-center lg:px-0">
      <div className=" flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Icons.logoImage width={120} height={120} />
          <h1 className="text-2xl font-bold">Create an account</h1>

          <Link
            className={buttonVariants({
              variant: "link",
              className: "gap-1.5",
            })}
            href="/sign-in"
          >
            Already have an account? Sign-in
          </Link>
        </div>
        <div className="grid gap-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-2">
              <div className="grid gap-2 py-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  className={cn({
                    "focus-visible:ring-red-500": errors.email,
                  })}
                  placeholder="you@example.com"
                  type="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              <div className="grid gap-2 py-2">
                <Label htmlFor="email">Password</Label>
                <Input
                  {...register("password")}
                  className={cn({
                    "focus-visible:ring-red-500": errors.password,
                  })}
                  placeholder="Password"
                  type="Password"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <Button type="submit">Sign up</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
