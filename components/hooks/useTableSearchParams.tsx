import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const useUpdateSearchParams = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Update multiple parameters at once
    const updateSearchParams = useCallback(
        (params: Record<string, string | undefined>) => {
            const urlParams = new URLSearchParams(searchParams.toString());

            // Update or delete each parameter in the params object
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    urlParams.set(key, value);
                } else {
                    urlParams.delete(key);
                }
            });

            // Push and refresh
            router.push(`?${urlParams.toString()}`);
            router.refresh();
        },
        [searchParams, router]
    );

    return { updateSearchParams, searchParams };
};

export default useUpdateSearchParams;
