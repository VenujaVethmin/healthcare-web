"use client";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

function useSession() {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, fetcher);
  return {
    user,
    isLoading,
    error,
  };
}

export default useSession;
