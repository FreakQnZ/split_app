"use client";

import { useState, useEffect } from "react";
import BillSettle from "../components/ui/bill_settle";
import withAuth from "../utils/withAuth"; // Adjust the path accordingly

function Dashboard() {
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    const res = await fetch(
      `/api/bill/pending?user=${localStorage.getItem("username")}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    if (data?.success) {
      setBills(data?.data);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  return (
    <div
      className="bg-gray-100 p-4 flex flex-col gap-4 "
      style={{ height: "90vh" }}
    >
      <div className=" bg-white rounded-lg min-h-72 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 p-4">Dashboard</h2>
      </div>
      <div className=" rounded-lg bg-white p-2 flex-1">
        <h2 className="text-lg font-semibold mb-4 p-4">Unsettled Bills</h2>
        <div className="overflow-y-auto max-h-80 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center place-items-center ">
            {bills.length > 0 &&
              bills.map((bill) => (
                <BillSettle
                  key={bill.id}
                  id={bill.id}
                  Name={bill.from}
                  amount={bill.amount}
                  time={bill.time}
                  BillName={bill.bill}
                  fetchData={fetchBills}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
