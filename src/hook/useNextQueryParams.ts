import { useRouter } from "next/router";
import { useMemo } from "react";

export const useNextQueryParams = () => {
  const router = useRouter();
  const value = useMemo(() => {
    const queryParamsStr = router.asPath.split("?").slice(1).join("");
    const urlSearchParams = new URLSearchParams(queryParamsStr);

    const params = Object.fromEntries(urlSearchParams.entries());
    return params;
  }, [router.asPath]);

  return { ...router, query: { ...router.query, ...value } };
};
