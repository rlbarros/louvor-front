import { cn } from "@/lib/utils";
import reactLogo from "./assets/react.svg";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Login } from "./models/auth/login.model";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";
import { AuthService } from "./services/auth/auth.service";
import { ZodInput } from "./components/form/zod-input";
import { constants } from "./constants";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, { message: "o email deve ser preenchido" })
      .email("email inválido"),
    password: z.string().min(1, { message: "a senha deve ser preenchida" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Login>({
    resolver: zodResolver(loginSchema),
  });

  const authService = new AuthService();
  const navigate = useNavigate();

  async function fetchData(data: Login) {
    const encodeRequest = await authService.login(data);
    if (encodeRequest && encodeRequest.success) {
      navigate(constants.routes.home);
    }
    //setIsPending(false);
  }

  async function handleLogin(data: Login) {
    await fetchData(data);
  }

  return (
    <div className="w-full max-w-sm">
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription className="flex justify-center items-center">
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(handleLogin)}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <ZodInput
                    label="Email"
                    type="text"
                    name="email"
                    placeholder="Enter your e-mail"
                    errors={errors}
                    register={register}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <ZodInput
                    label="password"
                    type="password"
                    name="password"
                    errors={errors}
                    register={register}
                  />
                </div>

                <div className="w-full flex justify-center items-center">
                  {isSubmitting ? (
                    <FadeLoader
                      width={3}
                      height={10}
                      margin={-10}
                      color="#000000"
                      className="ml-8 mt-3"
                    />
                  ) : (
                    <Button type="submit" className="w-full">
                      <LogIn />
                      Login
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
