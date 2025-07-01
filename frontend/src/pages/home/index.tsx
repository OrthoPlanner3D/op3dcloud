import { supabase } from "@/config/supabase.config";
import { useUserStore } from "@/state/stores/useUserStore";

export default function Home() {
    const removeUser = useUserStore((state) => state.removeUser);

    async function logOut() {
        await supabase.auth.signOut();
        console.log("Cerrando sesión...");
        removeUser();
    }

	return (
        <>
            <h1>Home</h1>
            <button type="button" onClick={logOut}>Cerrar sesión</button>
        </>
    );
}