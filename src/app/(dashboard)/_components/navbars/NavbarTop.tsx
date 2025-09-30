"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav, Navbar, Form } from "react-bootstrap";
import { Menu, User as UserIcon } from "react-feather";

type SafeUser = {
  id: number;
  username: string;
  email?: string;
  name?: string;
  mobile?: string;
};

const LS_USER_KEY = "auth_user";

const NavbarTop = (props: any) => {
  const [user, setUser] = useState<SafeUser | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  const displayName = user?.name || user?.username || "کاربر";

  return (
    <Navbar className="navbar-classic navbar navbar-expand-lg">
      <div className="d-flex justify-content-between w-100">
        <div className="d-flex align-items-center">
          <Link
            href="#"
            id="nav-toggle"
            className="nav-icon me-2 icon-xs"
            onClick={(e) => {
              e.preventDefault();
              props?.data?.SidebarToggleMenu?.(!props?.data?.showMenu);
            }}
            aria-label="Toggle sidebar"
          >
            <Menu size={18} />
          </Link>
        </div>

        <Nav className="navbar-right-wrap ms-2 d-flex nav-top-wrap">
          <div className="d-flex align-items-center lh-1">
            <div className="text-truncate">
              <h5 className="mb-0 d-none d-sm-block">{displayName}</h5>
              <span className="d-block d-sm-none small">{displayName}</span>
            </div>

            <UserIcon size={18} />
          </div>
        </Nav>
      </div>
    </Navbar>
  );
};

export default NavbarTop;
