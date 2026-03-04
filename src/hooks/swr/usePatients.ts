import useSWR, { type SWRConfiguration } from "swr";
import { getPatients } from "@/services/supabase/patients.service";
import type { PatientsRow } from "@/types/db/patients/patients";

/**
 * SWR hook to fetch all patients with automatic caching and revalidation
 *
 * @param options - SWR configuration options
 * @returns SWR response with patients data, loading state, and error
 *
 * @example
 * ```tsx
 * const { data: patients, isLoading, error } = usePatients();
 * ```
 */
export function usePatients(options?: {
	/** Only fetch patients with planning enabled */
	planningEnabledOnly?: boolean;
	/** Custom SWR configuration */
	config?: SWRConfiguration<PatientsRow[], Error>;
}) {
	const { planningEnabledOnly = false, config } = options || {};

	const { data, error, isLoading, mutate } = useSWR<PatientsRow[], Error>(
		"patients",
		getPatients,
		{
			// Revalidate on window focus (good for multi-tab scenarios)
			revalidateOnFocus: true,
			// Revalidate on reconnect (good for offline scenarios)
			revalidateOnReconnect: true,
			// Dedupe requests within 2 seconds
			dedupingInterval: 2000,
			// Keep previous data while revalidating
			keepPreviousData: true,
			...config,
		},
	);

	// Filter patients if needed
	const filteredData = planningEnabledOnly
		? data?.filter((patient) => patient.planning_enabled)
		: data;

	return {
		patients: filteredData,
		isLoading,
		error,
		mutate,
	};
}
