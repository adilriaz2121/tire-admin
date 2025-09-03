import { useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const useUpdateSearchParams = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const updateSearchParams = useCallback(
        (paramKey: string, paramValue: string | undefined) => {
            console.log("🚀 ~ useUpdateSearchParams ~ paramValue:", paramValue)
            const params = new URLSearchParams(searchParams.toString());

            // Update or delete the parameter
            if (paramKey && paramValue && paramValue.trim() !== "") {
                params.set(paramKey, paramValue);
            } else if (paramKey) {
                params.delete(paramKey);
            }

            // Push the updated URL and refresh
            router.push(`?${params.toString()}`);
            router.refresh();
        },
        [searchParams, router]
    );


    return { updateSearchParams, searchParams };
};

export default useUpdateSearchParams;