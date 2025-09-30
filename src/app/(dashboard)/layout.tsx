"use client";
import { useState } from "react";
import NavbarVertical from "./_components/navbars/NavbarVertical";
import NavbarTop from "./_components/navbars/NavbarTop";

const DashboardLayout = (props: any) => {
  const [showMenu, setShowMenu] = useState(true);
  const ToggleMenu = () => {
    return setShowMenu(!showMenu);
  };
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
