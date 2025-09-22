"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, CheckCircle, Loader2 } from "lucide-react";
import { AuthService } from "@/lib/auth";
import { forceUserTypePreservation, getDashboardRouteByUserType } from "@/lib/user-utils";
import { saveRegistrationData } from "@/lib/user-type-fixer";

const registerSchema = z.object({
  invitationToken: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  companyName: z.string().optional(),
  userType: z.string().default("menage"),
});

const FormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const router = useRouter();
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      invitationToken: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      companyName: "",
      userType: "menage",
    },
  });

  // Fonction pour obtenir la géolocalisation
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur");
      return;
    }

    setLocationStatus('loading');
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        setCoordinates(coords);
        setLocationStatus('success');
        toast.success("Position obtenue avec succès");
        console.log('📍 Coordonnées collecteur obtenues:', coords);
      },
      (error) => {
        console.error('❌ Erreur géolocalisation:', error);
        setLocationStatus('error');
        toast.error("Impossible d'obtenir votre position");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  // Surveiller le changement de userType pour demander la géolocalisation
  const watchedUserType = form.watch("userType");
  
  useEffect(() => {
    if (watchedUserType === 'collecteur' && locationStatus === 'idle') {
      // Demander automatiquement la géolocalisation quand l'utilisateur sélectionne "Collecteur"
      setTimeout(() => {
        toast.info("En tant que collecteur, nous avons besoin de votre position pour vous assigner des demandes");
        getUserLocation();
      }, 500);
    }
  }, [watchedUserType, locationStatus]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = data;
      
      // Pour les collecteurs, ajouter les données de géolocalisation et configurer le statut
      if (data.userType === 'collecteur') {
        if (coordinates) {
          (registerData as any).lastLocation = {
            type: 'Point',
            coordinates: coordinates
          };
          (registerData as any).onDuty = true; // Activer le collecteur par défaut
          console.log('📍 Inscription collecteur avec géolocalisation:', coordinates);
        } else {
          toast.error("Position requise pour les collecteurs. Veuillez autoriser la géolocalisation.");
          setIsLoading(false);
          return;
        }
      }
      
      // Save registration data for userType fixing
      saveRegistrationData(data);
      
      const result = await AuthService.register(registerData);
      
      if (result.success) {
        const userData = result.data?.user;
        
        // CRITICAL: Force userType preservation
        forceUserTypePreservation(userData, data.userType);
        
        // Special handling for collectam-business users
        if (data.userType === 'collectam-business') {
          toast.success("Account created! Please choose your Business plan...");
          router.push('/business-pricing');
          return;
        }
        
        toast.success("Registration successful! Redirecting to dashboard...");
        
        // Use our utility function to get the correct dashboard route
        const dashboardRoute = getDashboardRouteByUserType(data.userType, userData?.role);
        console.log('🔍 Register Form - Dashboard route:', dashboardRoute);
        router.push(dashboardRoute);
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="invitationToken"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Invitation Token (Optional)</FormLabel>
              <FormControl>
                <Input id="invitationToken" type="text" placeholder="Enter your invitation token (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input id="firstName" type="text" placeholder="John" autoComplete="given-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input id="lastName" type="text" placeholder="Doe" autoComplete="family-name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input id="email" type="email" placeholder="you@example.com" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input id="phone" type="tel" placeholder="+33 1 23 45 67 89" autoComplete="tel" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>User Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your user type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="menage">Ménage (Household)</SelectItem>
                  <SelectItem value="collecteur">Collecteur (Collector)</SelectItem>
                  <SelectItem value="collectam-business">Collectam Business</SelectItem>
                  <SelectItem value="entreprise">Entreprise (Company)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Indicateur de géolocalisation pour les collecteurs */}
        {watchedUserType === 'collecteur' && (
          <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Position du collecteur</span>
              {locationStatus === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
              {locationStatus === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
            </div>
            
            {locationStatus === 'success' && coordinates && (
              <div className="text-xs text-muted-foreground">
                ✅ Position obtenue: {coordinates[1].toFixed(4)}, {coordinates[0].toFixed(4)}
                <br />
                💡 Cela nous permettra de vous assigner des demandes de collecte proches
              </div>
            )}
            
            {locationStatus === 'error' && (
              <Alert>
                <AlertDescription className="text-sm">
                  ❌ Impossible d'obtenir votre position. Veuillez autoriser la géolocalisation pour continuer.
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="ml-2"
                    onClick={getUserLocation}
                  >
                    Réessayer
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            {locationStatus === 'loading' && (
              <div className="text-xs text-muted-foreground">
                📍 Obtention de votre position en cours...
              </div>
            )}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name (Optional)</FormLabel>
              <FormControl>
                <Input id="companyName" type="text" placeholder="Your company name" {...field} />
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
                <Input id="password" type="password" placeholder="••••••••" autoComplete="new-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </Button>
      </form>
    </Form>
  );
}
