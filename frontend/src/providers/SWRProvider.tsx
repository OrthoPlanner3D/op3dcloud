import { SWRConfig } from "swr";

interface SWRProviderProps {
	children: React.ReactNode;
}

/**
 * Global SWR configuration provider
 *
 * Provides default configuration for all SWR hooks in the application:
 * - Error retry logic
 * - Automatic revalidation on focus/reconnect
 * - Request deduplication
 */
export function SWRProvider({ children }: SWRProviderProps) {
	return (
		<SWRConfig
			value={{
				// Retry failed requests up to 3 times with exponential backoff
				errorRetryCount: 3,
				errorRetryInterval: 5000,
				// Show error toast on retry failure
				onErrorRetry: (
					error,
					_key,
					_config,
					revalidate,
					{ retryCount },
				) => {
					// Never retry on 404
					if (error.status === 404) return;

					// Only retry up to 3 times
					if (retryCount >= 3) return;

					// Retry after 5 seconds
					setTimeout(() => revalidate({ retryCount }), 5000);
				},
				// Revalidate data when window regains focus
				revalidateOnFocus: true,
				// Revalidate when network reconnects
				revalidateOnReconnect: true,
				// Dedupe requests within 2 seconds
				dedupingInterval: 2000,
			}}
		>
			{children}
		</SWRConfig>
	);
}
