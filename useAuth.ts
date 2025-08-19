import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthState {
  user: any;
  loading: boolean;
  isAdmin: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    isAdmin: false
  });

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        checkUserRole(session.user);
      } else {
        setAuthState({ user: null, loading: false, isAdmin: false });
      }
    });

    // Écouter les changements d'auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          checkUserRole(session.user);
        } else {
          setAuthState({ user: null, loading: false, isAdmin: false });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUserRole = async (user: any) => {
    try {
      const { data: profile, error } = await (supabase as any)
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      // Profile data loaded (removed console.log for production security)

      setAuthState({
        user,
        loading: false,
        isAdmin: profile?.role === 'admin'
      });
    } catch (error) {
      console.error('Error checking user role:', error);
      setAuthState({
        user,
        loading: false,
        isAdmin: false
      });
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...authState, signOut };
};

// Hook pour protéger les routes admin
export const useRequireAdmin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, loading, isAdmin, navigate]);

  return { user, loading, isAdmin };
};