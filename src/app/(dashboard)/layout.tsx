"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavbarVertical from "./_components/navbars/NavbarVertical";
import NavbarTop from "./_components/navbars/NavbarTop";

const LS_TOKEN_KEY = "auth_token";
const LS_USER_KEY = "auth_user";

const DashboardLayout = (props: any) => {
  const [showMenu, setShowMenu] = useState(true);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  const ToggleMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN_KEY);
    const user = localStorage.getItem(LS_USER_KEY);

    if (!token || !user) {
      router.replace("/authentication/signin");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return <div className="p-5 text-center">در حال بررسی اطلاعات کاربر...</div>;
  }

  return (
    <div id="db-wrapper" className={`${showMenu ? "" : "toggled"}`}>
      <div className="navbar-vertical navbar">
        <NavbarVertical
          showMenu={showMenu}
          onClick={(value: any) => setShowMenu(value)}
        />
      </div>
      <div id="page-content">
        <div className="header">
          <NavbarTop
            data={{
              showMenu: showMenu,
              SidebarToggleMenu: ToggleMenu,
            }}
          />
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default DashboardLayout;
