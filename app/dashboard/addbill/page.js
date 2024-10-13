import React from "react";

const AddBill = () => {
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
          {/* This is where the friends list will go */}
        </div>
      </div>
    </div>
  );
};

export default AddBill;
