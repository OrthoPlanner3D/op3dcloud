import useSWR, { type SWRConfiguration } from "swr";
import { getPlans } from "@/services/supabase/plans.service";
import type { PlanRow } from "@/types/db/plans/plans";

/**
 * SWR hook para el catálogo de planes (op3dcloud.plans).
 *
 * @param config - Configuración opcional de SWR
 * @returns filas de planes, estado de carga y error
 *
 * @example
 * ```tsx
 * const { plans, isLoading, error } = usePlans();
 * ```
 */
export function usePlans(config?: SWRConfiguration<PlanRow[], Error>) {
	const { data, error, isLoading, mutate } = useSWR<PlanRow[], Error>(
		"plans",
		getPlans,
		{
			revalidateOnFocus: false,
			revalidateOnReconnect: true,
			dedupingInterval: 2000,
			keepPreviousData: true,
			...config,
		},
	);

	return {
		plans: data ?? [],
		isLoading,
		error,
		mutate,
	};
}
