"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DashboardNavbar = () => {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    router.push("/");
  };

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar w-full">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-6 w-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 text-xl font-bold">
            <Link href="/dashboard" className="p-3">
              Split
            </Link>
          </div>
          <div className="hidden flex-none lg:block">
            <ul className="menu menu-horizontal gap-4">
              {/* Navbar menu content here */}
              <li>
                <Link href="/dashboard/addbill" className="p-3">
                  Add Bill
                </Link>
              </li>
              <li>
                <Link href="/dashboard/splitBill" className="p-3">
                  Split Bill
                </Link>
              </li>
              <li>
                <Link href="/dashboard/friends" className="p-3">
                  Friends
                </Link>
              </li>
              <li>
                <a
                  onClick={logout}
                  className="rounded-lg bg-base-200 p-3 font-bold"
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <li>
            <Link href="/addBill">Add Bill</Link>
          </li>
          <li>
            <Link href="/splitBill">Split Bill</Link>
          </li>
          <li>
            <Link href="/friends">Friends</Link>
          </li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardNavbar;
