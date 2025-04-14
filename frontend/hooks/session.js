"use client";
import axiosInstance from "@/lib/axiosInstance";
import useSWR from "swr";


const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

function useSession() {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`/me`, fetcher);
  return {
    user,
    isLoading,
    error,
  };
}

export default useSession;
