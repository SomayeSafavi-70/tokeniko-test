"use client";

import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



const LS_TOKEN_KEY = "auth_token";
const LS_USER_KEY = "auth_user";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN_KEY);
    const user = localStorage.getItem(LS_USER_KEY);

    if (token && user) {
      router.replace("/dashboard");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return <div className="p-5 text-center">در حال بررسی وضعیت ورود...</div>;
  }

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center g-0">
        <div className="col-12 col-md-8 col-lg-6 col-xxl-4 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
