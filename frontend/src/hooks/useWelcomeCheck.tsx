import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase.config";
import { useUserStore } from "@/state/stores/useUserStore";

export function useWelcomeCheck() {
  const [isFirstTime, setIsFirstTime] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const checkFirstTimeLogin = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Obtener el usuario actual con sus metadatos
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error("Error getting user:", error);
          setIsFirstTime(false);
          return;
        }

        if (!currentUser) {
          setIsFirstTime(false);
          return;
        }

        // Verificar si ya ha visto la bienvenida
        const hasSeenWelcome = currentUser.user_metadata?.has_seen_welcome;
        
        // Si no existe la propiedad o es false, significa que es la primera vez
        // Si es true, significa que ya vio la bienvenida
        setIsFirstTime(hasSeenWelcome !== true);
        
      } catch (error) {
        console.error("Error checking first time login:", error);
        setIsFirstTime(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstTimeLogin();
  }, [user, forceUpdate]);

  const markWelcomeAsSeen = async () => {
    if (!user) return false;

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          has_seen_welcome: true
        }
      });

      if (error) {
        console.error("Error updating user metadata:", error);
        return false;
      }

      // Actualizar el estado local inmediatamente
      setIsFirstTime(false);
      
      // Forzar una nueva verificación después de un breve delay
      setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 100);

      return true;
    } catch (error) {
      console.error("Error marking welcome as seen:", error);
      return false;
    }
  };

  const forceRefresh = () => {
    setForceUpdate(prev => prev + 1);
  };

  return {
    isFirstTime,
    isLoading,
    markWelcomeAsSeen,
    forceRefresh
  };
}
