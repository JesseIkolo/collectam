import Link from "next/link";
import { Globe } from "lucide-react";
import { LoginForm } from "../../components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="relative w-full max-w-md p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-medium">Connexion à votre compte</h1>
            <p className="text-muted-foreground text-sm">Veuillez entrer vos informations pour vous connecter.</p>
          </div>
          <div className="space-y-4">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}
