import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/router";
import { AuthService } from "@/lib/auth";
import Link from "next/link";
import { useEffect } from "react";

const registerSchema = z.object({
  invitationToken: z.string().optional(),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 caractères"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmPassword: z.string().min(8, "Confirmez votre mot de passe"),
  companyName: z.string().optional(),
  userType: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<string>("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    const type = router.query.type as string;
    if (type) {
      setUserType(type);
      setValue('userType', type);
    }
  }, [router.query.type, setValue]);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Déterminer le rôle basé sur le type d'utilisateur
      let role = 'user'; // par défaut
      if (data.userType === 'collecteur') {
        role = 'collector';
      } else if (data.userType === 'collectam-business') {
        role = 'org_admin';
      }

      const response = await AuthService.register({
        invitationToken: data.invitationToken || "",
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: role,
        companyName: data.companyName,
        userType: data.userType,
      });
      
      if (response.success) {
        toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        router.push('/');
      } else {
        toast.error(response.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      toast.error("Une erreur s'est produite lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            {userType === 'menage' && 'Inscription Particulier'}
            {userType === 'collecteur' && 'Inscription Collecteur'}
            {userType === 'collectam-business' && 'Inscription Collectam Business'}
            {userType === 'entreprise' && 'Inscription Entreprise'}
            {!userType && 'Créer un compte Collectam'}
          </CardTitle>
          <CardDescription>
            {userType === 'menage' && 'Rejoignez Collectam pour simplifier la gestion de vos déchets domestiques'}
            {userType === 'collecteur' && 'Devenez partenaire collecteur et optimisez vos tournées'}
            {userType === 'collectam-business' && 'Accédez à notre plateforme business complète'}
            {userType === 'entreprise' && 'Solutions sur mesure pour votre entreprise'}
            {!userType && 'Rejoignez notre plateforme de gestion des déchets intelligente'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="invitationToken">Token d'invitation (optionnel)</Label>
                <Input
                  id="invitationToken"
                  placeholder="Votre token d'invitation (optionnel)"
                  {...register("invitationToken")}
                  className={errors.invitationToken ? "border-red-500" : ""}
                />
                {errors.invitationToken && (
                  <p className="text-sm text-red-500">{errors.invitationToken.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    placeholder="Votre prénom"
                    {...register("firstName")}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName.message}</p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    placeholder="Votre nom"
                    {...register("lastName")}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone">Numéro de téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  {...register("phone")}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {userType === 'entreprise' && (
                <div className="grid gap-3">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    placeholder="Nom de votre entreprise"
                    {...register("companyName")}
                    className={errors.companyName ? "border-red-500" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">{errors.companyName.message}</p>
                  )}
                </div>
              )}

              <div className="grid gap-3">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </div>


              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création du compte..." : "Créer un compte"}
              </Button>

              <div className="text-center text-sm">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                  Se connecter
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance mt-6">
        En créant un compte, vous acceptez nos{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Conditions d&apos;utilisation
        </a>{" "}
        et notre{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Politique de confidentialité
        </a>.
      </div>
    </div>
  );
}
