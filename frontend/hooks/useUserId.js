import { useState, useEffect } from "react";
import { getUserData } from "@/hooks/userId";

function useUserId() {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      setIsLoading(true);
      setError(null);
      const userData = await getUserData();
      if (userData) {
        setUserId(userData.id); // Assuming userData contains an 'id' field
      } else {
        setError(new Error("Failed to load user ID"));
        setUserId(null);
      }
      setIsLoading(false);
    };

    fetchUserId();
  }, []);

  return { userId, isLoading, error };
}

export default useUserId;
