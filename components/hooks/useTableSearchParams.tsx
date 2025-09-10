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

      // Push without refresh to prevent infinite re-renders
      router.push(`?${urlParams.toString()}`);
    },
    [router]
  );

  return { updateSearchParams, searchParams };
};

export default useUpdateSearchParams;
