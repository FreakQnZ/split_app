"use client";
import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

const BillSettle = ({ id, Name, amount, time, BillName }) => {
    //   const router = useRouter();
    const date = new Date(time);

    // Extract the components
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getUTCFullYear();

    // Format the string as "HH:MM DD-MM-YYYY"
    const newStr = `${hours}:${minutes} ${day}-${month}-${year}`;
    return (
        <div className="bg-gray-100 w-full shadow-xl rounded-md p-2">
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
                <p className="text-xl font-semibold">From: {Name}</p>
                <div className="pt-5 flex gap-3">
                    <button
                        className="btn flex-1 hover:bg-green-600 hover:text-white bg-white text-green-600 border-green-600"
                    >
                        Settle
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BillSettle;
