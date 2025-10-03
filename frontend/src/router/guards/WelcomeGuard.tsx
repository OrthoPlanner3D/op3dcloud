import { Navigate } from "react-router";
import { useWelcomeCheck } from "@/hooks/useWelcomeCheck";
import WelcomePage from "@/pages/welcome";
import { useUserStore } from "@/state/stores/useUserStore";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function WelcomeGuard({ children }: Props): React.ReactNode {
  const user = useUserStore((state) => state.user);
  const { isFirstTime, isLoading } = useWelcomeCheck();
  const [shouldShowWelcome, setShouldShowWelcome] = useState<boolean | null>(null);

  // Sincronizar el estado local con el hook
  useEffect(() => {
    if (!isLoading) {
      setShouldShowWelcome(isFirstTime);
    }
  }, [isFirstTime, isLoading]);

  // Si no hay usuario, redirigir al login
  if (!user) {
    return <Navigate to="/inicia-sesion" replace />;
  }

  // Si está cargando, mostrar loading
  if (isLoading || shouldShowWelcome === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-300">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si es la primera vez, mostrar la página de bienvenida
  if (shouldShowWelcome === true) {
    return <WelcomePage />;
  }

  // Si ya vio la bienvenida o no es primera vez, mostrar el contenido normal
  return <>{children}</>;
}
