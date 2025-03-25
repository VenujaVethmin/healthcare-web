"use client";
import { useRouter } from "next/navigation";
import session from "@/hooks/session";
import { logOut } from "@/hooks/auth-hooks";

export default function DashboardPage() {
  const { user, isLoading, error } = session();
  const router = useRouter();

  if (error) return <div>Error loading user info.</div>;
  if (isLoading) return <div>Loading...</div>;



  return (
    <div>
      <h1>Dashboard</h1>
      <p>User ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={() => logOut(router)}>Logout</button>
    </div>
  );
}
