import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé !",
        description: "Un lien de réinitialisation a été envoyé à votre adresse email.",
      });

      return { success: true };

    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de réinitialisation",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading
  };
};