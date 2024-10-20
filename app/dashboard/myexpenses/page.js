"use client";

import withAuth from "@/app/utils/withAuth";
import React, { useEffect, useState } from "react";

const MyExpensesGrid = () => {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(`/api/expense?user=${username}`);
        const result = await response.json();

        if (result.success) {
          setExpenses(result.data);
        } else {
          setError(result.error);
        }
      } catch (error) {
        setError("An error occurred while fetching data.");
        console.error(error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchExpenses();
  }, [username]);

  return (
    <div className="bg-gray-100 flex justify-center items-center p-4">
      <div
        className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl"
        style={{ height: "86vh" }}
      >
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            My Expenses
          </h2>
          {loading ? ( // Conditional rendering for loading state
            <main className="flex flex-col m-8 w-full ">
              <section className="card bg-base-200  w-10/12 shadow-xl gap-5 p-4">
                <div className="skeleton h-32 w-full"></div>
                <div className="skeleton h-4 w-28"></div>
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-full"></div>
              </section>
            </main>
          ) : (
            <>
              {error && <p className="text-red-500 text-center">{error}</p>}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="bg-white shadow-md p-4 rounded-lg"
                  >
                    <div className="text-lg font-semibold">
                      {expense.bill_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(expense.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xl font-semibold mt-2">
                      {expense.amount}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(MyExpensesGrid);
