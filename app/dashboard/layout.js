"use client";

import DashboardNavbar from "../components/dashboardNavbar";
import withAuth from "../utils/withAuth"; // Adjust the path to your HOC

function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DashboardNavbar />
        {children}
      </body>
    </html>
  );
}

export default withAuth(RootLayout); // Wrap the layout with withAuth
