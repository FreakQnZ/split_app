"use client";

import withAuth from "../utils/withAuth"; // Adjust the path accordingly

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

export default withAuth(Dashboard);
