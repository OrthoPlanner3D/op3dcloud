import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import ReactRouterProvider from "./providers/ReactRouterProvider.tsx";
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root") as HTMLElement).render(
	<StrictMode>
		<ReactRouterProvider />
		<Toaster />
	</StrictMode>,
);
