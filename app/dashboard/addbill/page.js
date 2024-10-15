"use client";

import React from "react";
import { useState } from "react";

const AddBill = () => {

    const [loading , setLoading] = useState(false)

    const handleSubmit = () => {
        setLoading(true)
    }


    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
            {/* Main section with form and participants */}
            <div
                className="flex flex-col lg:flex-row gap-6 w-full"
                style={{ height: "calc(100vh - 64px)" }}
            >
                {/* Left section (Form area) */}
                <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
                    {/* This is where the form content will go */}
                </div>

                {/* Right section (Friends List) */}
                <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-6">
                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <h1 className="card-title flex justify-center pt-5 text-2xl font-bold">Add New Bill</h1>
                        <form className="card-body pt-3">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Bill Name</span>
                                </label>
                                <input type="text" placeholder="Name" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Amount</span>
                                </label>
                                <input type="number" min="0.000001" placeholder="Amount" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                {/* <button className="btn btn-primary">Add Bill</button> */}
                                <button id="submitButton" className="btn btn-primary w-full">
                                    {loading && (
                                        <span className=" absolute right-8 loading loading-spinner"></span>
                                    )}
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddBill;
