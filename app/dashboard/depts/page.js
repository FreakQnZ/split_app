"use client";

import withAuth from "@/app/utils/withAuth";
import React, { useState, useEffect } from "react";

const DeptsPage = () => {
  const [peopleOwed, setPeopleOwed] = useState([]); // People who owe me
  const [peopleOwing, setPeopleOwing] = useState([]); // People I owe
  const [loadingOwed, setLoadingOwed] = useState(true);
  const [loadingOwing, setLoadingOwing] = useState(true);
  const currentUser = localStorage.getItem("username");

  // Fetch people who owe me money
  useEffect(() => {
    const fetchPeopleOwed = async () => {
      try {
        const response = await fetch(
          `/api/bill/split/touser?user=${currentUser}`
        );
        const data = await response.json();
        if (data.success) {
          setPeopleOwed(data.data); // Data of people who owe me money
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching people who owe me money:", error);
      } finally {
        setLoadingOwed(false);
      }
    };

    if (currentUser) fetchPeopleOwed();
  }, [currentUser]);

  // Fetch people I owe money to
  useEffect(() => {
    const fetchPeopleOwing = async () => {
      try {
        const response = await fetch(`/api/bill/pending?user=${currentUser}`);
        const data = await response.json();
        if (data.success) {
          setPeopleOwing(data.data); // Data of people I owe money to
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error fetching people I owe money to:", error);
      } finally {
        setLoadingOwing(false);
      }
    };

    if (currentUser) fetchPeopleOwing();
  }, [currentUser]);

  return (
    <div className="p-6 bg-gray-100">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ height: "86vh" }}
      >
        {/* People who owe me money */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">
            People Who Owe Me Money
          </h2>
          {loadingOwed ? (
            <main className="flex flex-col m-8 w-full">
              <section className="card bg-base-200 w-10/12 shadow-xl gap-5 p-4">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </section>
            </main>
          ) : peopleOwed.length > 0 ? (
            <ul className="space-y-4">
              {peopleOwed.map((person) => (
                <li
                  key={person.username}
                  className="p-4 bg-gray-50 rounded shadow"
                >
                  <p>
                    <strong>{person.username}</strong> owes you{" "}
                    <strong>${person.amount_owed}</strong> for{" "}
                    <strong>{person.bill_name}</strong>
                  </p>
                  <p>Since: {new Date(person.created_at).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center">
              <div className="bg-blue-50 border border-blue-300 text-blue-700 p-4 rounded-lg shadow-lg text-center max-w-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mx-auto mb-2 h-8 w-8 text-blue-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2l4-4"
                  />
                </svg>
                <p className="text-lg font-semibold">No one owes you money.</p>
              </div>
            </div>
          )}
        </div>

        {/* People I owe money to */}
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-6 text-center">
            People I Owe Money To
          </h2>
          {loadingOwing ? (
            <main className="flex flex-col m-8 w-full">
              <section className="card bg-base-200 w-10/12 shadow-xl gap-5 p-4">
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </section>
            </main>
          ) : peopleOwing.length > 0 ? (
            <ul className="space-y-4">
              {peopleOwing.map((person) => (
                <li key={person.id} className="p-4 bg-gray-50 rounded shadow">
                  <p>
                    <strong>{person.from}</strong> is owed{" "}
                    <strong>${person.amount}</strong> for{" "}
                    <strong>{person.bill}</strong>
                  </p>
                  <p>Owed since: {new Date(person.time).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center">
              <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-lg shadow-lg text-center max-w-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mx-auto mb-2 h-8 w-8 text-green-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2l4-4"
                  />
                </svg>
                <p className="text-lg font-semibold">
                  You don't owe anyone any money.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(DeptsPage);
