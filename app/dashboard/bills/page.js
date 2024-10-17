"use client";

import React from "react";
import { useState, useEffect } from "react";
import BillCard from "@/app/components/ui/bill_card";

const AddBill = () => {
  const [btnloading, setBtnLoading] = useState(false);
  const [billLoading, setBillLoading] = useState(false);
  const [billName, setBillName] = useState("");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [bills, setBills] = useState([]);
  const userName = localStorage.getItem("username");

  const fetchBills = async () => {
    const res = await fetch(`/api/bill?user=${userName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data?.success) {
      console.log("bills", data?.bills);
      setBills(data?.bills);
    }
  };

  useEffect(() => {
    setBillLoading(true);
    fetchBills();
    setTimeout(() => {
      setBillLoading(false);
    }, 500);
  }, []);

  const showMessage = (message) => {
    setMessage(message);
    setIsAlertVisible(true);
    setTimeout(() => {
      setIsAlertVisible(false);
      setTimeout(() => {
        setMessage("");
      }, 500);
    }, 3000);
  };

  const handleSubmit = async () => {
    setBtnLoading(true);
    setBillLoading(true);
    const res = await fetch("/api/bill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ billName, amount, userName }),
    });

    const data = await res.json();
    if (data?.success) {
      showMessage(data?.message);
      fetchBills();
      setBtnLoading(false);
      setBillLoading(false);
    } else {
      setBtnLoading(false);
      setBillLoading(false);
      showMessage(data?.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div
        className="flex flex-col-reverse lg:flex-row gap-6 w-full"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {billLoading ? (
          <main className="flex-1 bg-white shadow-lg rounded-lg p-6 overflow-scroll flex w-full justify-around">
            <section className="card bg-base-200 w-96 h-72 shadow-xl gap-5 p-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </section>
            <section className="card bg-base-200 w-96 h-72 shadow-xl gap-5 p-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </section>
          </main>
        ) : (
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6 overflow-scroll">
            <div className=" grid grid-cols-1 md:grid-cols-3 gap-2 w-full justify-between justify-items-center ">
              {bills.map((bill) => (
                <BillCard
                  key={bill?.bill_id}
                  BillName={bill?.bill_name}
                  amount={bill?.amount}
                  createdAt={bill?.created_at}
                  billId={bill?.bill_id}
                  fetchData={fetchBills}
                />
              ))}
            </div>
          </div>
        )}
        <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl h-96">
            <h1 className="card-title flex justify-center pt-5 text-2xl font-bold">
              Add New Bill
            </h1>
            <div className="card-body pt-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bill Name</span>
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  onChange={(e) => setBillName(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Amount</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="Amount"
                  className="input input-bordered"
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="form-control mt-6">
                {/* <button className="btn btn-primary">Add Bill</button> */}
                <button
                  id="submitButton"
                  onClick={handleSubmit}
                  className="btn btn-primary w-full"
                >
                  {btnloading && (
                    <span className=" absolute right-12 loading loading-spinner"></span>
                  )}
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div>
            {message && (
              <section className=" w-full overflow-hidden flex justify-center">
                <div
                  role="alert"
                  className={` w-64 alert alert-info mt-10 transform transition-all duration-1000 ease-out ${
                    isAlertVisible ? "" : "-translate-y-[100%] opacity-0"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>{message}</span>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBill;
