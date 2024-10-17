"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
//withAuth.js
export default function withAuth(Component) {
  return function WithAuth(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true); // Add a loading state

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return router.push("/auth");
      }

      try {
        const res = await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data?.success) {
          setLoading(false); // Set loading to false when authentication is successful
        } else {
          localStorage.removeItem("token");
          router.push("/auth");
        }
      } catch (error) {
        console.error("Error during authentication check", error);
        router.push("/auth");
      }
    };

    useEffect(() => {
      checkAuth();
    }, []);

    if (loading) {
      return (
        <div className="min-h-screen flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      );
    }

    // Render the protected component when authentication is validated
    return <Component {...props} />;
  };
}
