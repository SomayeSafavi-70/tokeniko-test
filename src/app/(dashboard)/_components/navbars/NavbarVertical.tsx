"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { Fragment } from "react";
import { Image } from "react-bootstrap";
import SimpleBar from "simplebar-react";
import { logout } from "@/app/(auth)/authentication/core/_requests";

export const DashboardMenu = [
  { id: 50, title: "Dashboard", icon: "home", link: "/dashboard" },
  { id: 51, title: "Sign Out", icon: "log-out", link: "/signin" },
];

type Props = {
  showMenu?: boolean;
  onClick?: (next: boolean) => void;
};

export default function NavbarVertical({ showMenu, onClick }: Props) {
  const pathname = usePathname();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();

  const handleClick = (item: (typeof DashboardMenu)[0]) => {
    if (item.title === "Sign Out") {
      logout();
      router.push("/authentication/signin");
      return;
    }

    if (isMobile && onClick) onClick(!Boolean(showMenu));
  };

  return (
    <Fragment>
      <SimpleBar style={{ maxHeight: "100vh" }}>
        <div className="nav-scroller p-3">
          <Link
            href="/"
            className="navbar-brand d-inline-flex align-items-center gap-2"
          >
            <Image src="/images/brand/logo/logo.svg" alt="logo" />
          </Link>
        </div>

        <ul className="navbar-nav flex-column px-3">
          {DashboardMenu.map((item) => (
            <li className="nav-item" key={item.id}>
              <Link
                href={item.link}
                className={`nav-link d-flex align-items-center ${
                  pathname === item.link ? "active" : ""
                }`}
                onClick={(e) => {
                  if (item.title === "Sign Out") {
                    e.preventDefault();
                  }
                  handleClick(item);
                }}
              >
                <i
                  className={`nav-icon fe fe-${item.icon} me-2`}
                  aria-hidden="true"
                />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </SimpleBar>
    </Fragment>
  );
}
