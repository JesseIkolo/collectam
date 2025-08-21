"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"

export default function OtpPage() {
    const params = useSearchParams()
    const router = useRouter()
    const email = params.get("email") || ""
    const [code, setCode] = useState("")

    return (
        <section className="bg-linear-to-b from-muted to-background flex min-h-screen px-4 py-16 md:py-32">
            <form
                className="max-w-92 m-auto h-fit w-full"
                onSubmit={(e) => {
                    e.preventDefault()
                    router.push("/login")
                }}
            >
                <div className="p-6">
                    <div>
                        <h1 className="mt-6 text-balance text-xl font-semibold">Enter the verification code</h1>
                        <p className="text-muted-foreground mt-1 text-sm">We sent a code to {email || "your email"}</p>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="block text-sm">
                                Code OTP
                            </Label>
                            <Input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                                name="otp"
                                id="otp"
                                placeholder="123456"
                                className="ring-foreground/15 border-transparent ring-1"
                                required
                            />
                        </div>

                        <Button className="w-full" size="default">
                            Verify
                        </Button>
                    </div>
                </div>
                <div className="px-6">
                    <p className="text-muted-foreground text-sm">
                        Didn’t receive the code?
                        <Button asChild variant="link" className="px-2">
                            <Link href="/forgot-password">Resend</Link>
                        </Button>
                    </p>
                </div>
            </form>
        </section>
    )
}


