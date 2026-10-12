"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthWrapper({
  children,
  setIsAuthPage,
}: {
  children: React.ReactNode;
  setIsAuthPage: (isStandalone: boolean) => void;
}) {
  const pathname = usePathname() || "";
  const isStandalonePage = pathname === "/" || pathname.startsWith("/auth");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setIsAuthenticated(!!token);
    setIsAuthPage(isStandalonePage);
  }, [pathname, isStandalonePage, setIsAuthPage]);

  return <>{children}</>;
}
