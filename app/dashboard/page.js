"use client";

import BillSettle from "../components/ui/bill_settle";
import withAuth from "../utils/withAuth"; // Adjust the path accordingly

function Dashboard() {
    return (
        <div className="bg-gray-100 p-4 flex flex-col gap-4 " style={{ height: "90vh" }}>
            <div className=" bg-white rounded-lg h-80">
                <h2 className="text-lg font-semibold mb-4 p-4">Dashboard</h2>
            </div>
            <div className=" rounded-lg bg-white overflow-scroll">
                <h2 className="text-lg font-semibold mb-4 p-4">Unsettled Bills</h2>
                <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 items-center place-items-center p-4">
                    <BillSettle />
                    <BillSettle />
                    <BillSettle />
                    <BillSettle />
                </div>
            </div>
        </div>
    );
}

export default withAuth(Dashboard);
