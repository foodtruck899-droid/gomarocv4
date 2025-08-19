import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useEmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendVerificationEmail = async (email: string, userName: string, theme: 'light' | 'dark' = 'light') => {
    setIsLoading(true);
    
    try {
      // Appeler directement notre edge function pour envoyer l'email personnalisé
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          to_email: email,
          user_name: userName,
          verification_link: `${window.location.origin}/auth?verified=true`,
          theme: theme
        }
      });

      if (emailError) {
        throw emailError;
      }

      toast({
        title: "Email envoyé !",
        description: "Un email de vérification personnalisé a été envoyé.",
      });

      return { success: true, data: emailData };

    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      
      toast({
        title: "Erreur",
        description: error.message || "Impossible d'envoyer l'email de vérification",
        variant: "destructive",
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string, userName: string) => {
    return await sendVerificationEmail(email, userName);
  };

  return {
    sendVerificationEmail,
    resendVerificationEmail,
    isLoading
  };
};