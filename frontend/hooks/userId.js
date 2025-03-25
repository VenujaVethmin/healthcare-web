"use client";

import { redirect } from "next/navigation";

export async function getUserData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/me`, {
      credentials: "include",
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);

      // Redirect if unauthorized (401) or other relevant errors
      if (response.status === 401 || response.status === 403) {
        redirect("/login"); // Redirect to login page
      } else {
        redirect("/login"); // Redirect to a generic error page
      }

      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    redirect("/error"); // Redirect to an error page
    return null;
  }
}
