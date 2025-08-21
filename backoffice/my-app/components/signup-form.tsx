"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)
        const password = (formData.get("password") as string) || ""
        const confirmPassword = (formData.get("confirmPassword") as string) || ""

        if (password !== confirmPassword) {
            setErrorMessage("Les mots de passe ne correspondent pas.")
            return
        }
        if (!hasAcceptedTerms) {
            setErrorMessage("Vous devez accepter les conditions d'utilisation.")
            return
        }

        setErrorMessage(null)

        // Build payload according to backend expectations
        const street = ((formData.get("street") as string) || "").trim()
        const city = ((formData.get("city") as string) || "").trim()
        const state = ((formData.get("state") as string) || "").trim()
        const country = ((formData.get("country") as string) || "").trim()
        // Coordinates removed from UI; no parsing needed

        // Normalize phone to E.164-like format (remove spaces and non-digits except leading +)
        const rawPhone = (formData.get("phone") as string) || ""
        const phone = rawPhone
            .trim()
            .replace(/\s+/g, "")
            .replace(/(?!^)[^\d]/g, "") // keep only digits after first char; allow leading +
            .replace(/^\+?/, "+") // ensure it starts with +

        const payload: any = {
            email: formData.get("email"),
            password: formData.get("password"),
            phone,
            role: "user"
        }

        const firstName = (formData.get("firstName") as string) || ""
        const lastName = (formData.get("lastName") as string) || ""
        if (firstName || lastName) {
            payload.firstName = firstName
            payload.lastName = lastName
        }

        const hasAnyAddressField = street || city || state || country
        if (hasAnyAddressField) {
            payload.address = {
                street: street || undefined,
                city: city || undefined,
                state: state || undefined,
                country: country || undefined
            }
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (!res.ok || !data?.success) {
                const details = Array.isArray(data?.errors)
                    ? data.errors.map((e: any) => e.msg).filter(Boolean).join("; ")
                    : undefined
                setErrorMessage(details || data?.message || "Inscription échouée")
                return
            }
            const token = data?.data?.accessToken
            if (token) {
                localStorage.setItem("accessToken", token)
            }
            router.push("/dashboard")
        } catch (err: any) {
            setErrorMessage(err.message || "Une erreur est survenue")
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Créer un compte</CardTitle>
                    <CardDescription>
                        Inscrivez-vous avec Apple, Google ou votre email
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Sign up with Apple
                                </Button>
                                <Button variant="outline" className="w-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    Sign up with Google
                                </Button>
                            </div>
                            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2">
                                    Ou continuer avec
                                </span>
                            </div>
                            <div className="grid gap-6">
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="grid gap-3">
                                        <Label htmlFor="firstName">Prénom</Label>
                                        <Input id="firstName" name="firstName" type="text" placeholder="Jean" required />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="lastName">Nom</Label>
                                        <Input id="lastName" name="lastName" type="text" placeholder="Dupont" required />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="m@example.com"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="street">Rue</Label>
                                    <Input id="street" name="street" type="text" placeholder="10 Rue de la Paix" />
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="grid gap-3">
                                        <Label htmlFor="city">Ville</Label>
                                        <Input id="city" name="city" type="text" placeholder="Paris" />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="state">Région/État</Label>
                                        <Input id="state" name="state" type="text" placeholder="Île-de-France" />
                                    </div>
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="country">Pays</Label>
                                    <Input id="country" name="country" type="text" placeholder="France" />
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="phone">Téléphone</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+33123456789"
                                        required
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                    <Input id="confirmPassword" name="confirmPassword" type="password" required />
                                </div>
                                <div className="flex items-start gap-2">
                                    <Checkbox id="terms" checked={hasAcceptedTerms} onCheckedChange={(v) => setHasAcceptedTerms(Boolean(v))} />
                                    <Label htmlFor="terms" className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        J'accepte les Conditions d'utilisation et la Politique de confidentialité
                                    </Label>
                                </div>
                                {errorMessage ? (
                                    <p className="text-sm text-destructive">{errorMessage}</p>
                                ) : null}
                                <Button type="submit" className="w-full">
                                    Créer le compte
                                </Button>
                            </div>
                            <div className="text-center text-sm">
                                Vous avez déjà un compte ?{" "}
                                <a href="/login" className="underline underline-offset-4">
                                    Connectez-vous
                                </a>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}


