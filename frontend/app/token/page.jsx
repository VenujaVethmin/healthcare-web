'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Set cookie in frontend (token lasts 1 day)
      Cookies.set("token", token, {
        expires: 1,
        secure: true,
        sameSite: "None",
      });

      // Clean up URL
      window.history.replaceState(null, "", "/");

      // Redirect to wherever you want (e.g., dashboard)
      router.push("/redirect");
    } else {
      router.push("/login"); // fallback if no token
    }
  }, [router]);

  return <div></div>;
}
