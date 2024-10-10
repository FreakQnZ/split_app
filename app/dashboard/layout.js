import DashboardNavbar from "../components/dashboardNavbar"

export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
            <DashboardNavbar />
            {children}
        </body>
      </html>
    )
  }
