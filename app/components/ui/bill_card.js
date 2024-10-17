"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BillCard = ({ BillName, amount, createdAt, billId, fetchData }) => {
  const router = useRouter();
  const [isSplit, setIsSplit] = useState(false); // State to track if the bill is split

  const handleSplitClick = () => {
    router.push(`/dashboard/bills/splitbill?billid=${billId}`);
  };

  const handleDeleteClick = async () => {
    const response = await fetch(
      `/api/bill?billId=${billId}&user=${localStorage.getItem("username")}`,
      {
        method: "DELETE",
      }
    );
    const data = await response.json();
    if (data.success) {
      fetchData();
    }
  };

  const billsplitcheck = async (billId) => {
    const res = await fetch(`/api/bill/split/check?billId=${billId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    return data.success === true;
  };

  // Check if the bill is split on component mount
  useEffect(() => {
    const checkBillSplit = async () => {
      const result = await billsplitcheck(billId);
      setIsSplit(result);
    };
    checkBillSplit();
  }, [billId]);

  const date = new Date(createdAt);

  // Extract the components
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const year = date.getUTCFullYear();

  // Format the string as "HH:MM DD-MM-YYYY"
  const newStr = `${hours}:${minutes} ${day}-${month}-${year}`;

  return (
    <div className="bg-base-100 w-full shadow-xl rounded-md">
      <div className="flex h-full p-5 flex-col justify-between gap-4">
        <h2 className="card-title items-center text-2xl">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                d="M6 4H10.5M10.5 4C12.9853 4 15 6.01472 15 8.5C15 10.9853 12.9853 13 10.5 13H6L13 20M10.5 4H18M6 8.5H18"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </g>
          </svg>
          {amount}
        </h2>
        <p className="text-xl">{BillName}</p>
        <p className="text-xs font-semibold p-3 pl-0">{newStr}</p>
        <div className="pt-5 flex gap-3">
          <button
            className="btn flex-1 hover:bg-green-600 hover:text-white bg-white text-green-600 border-green-600"
            onClick={handleSplitClick}
          >
            {isSplit ? "View Split" : "Split"}
          </button>
          <button
            className="btn flex-1 hover:bg-red-500 hover:text-white border-red-500 text-red-500 bg-white"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillCard;
