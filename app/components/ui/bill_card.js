import React from 'react'

const BillCard = ({ BillName, amount, createdAt }) => {
    return (
        <div className=" bg-base-100 w-full shadow-xl rounded-md">
            <div className="flex h-full p-5 flex-col justify-between gap-4">
                <h2 className="card-title items-center text-2xl">
                    <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M6 4H10.5M10.5 4C12.9853 4 15 6.01472 15 8.5C15 10.9853 12.9853 13 10.5 13H6L13 20M10.5 4H18M6 8.5H18" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                    {amount}
                </h2>
                <p className="text-xl">{BillName}</p>
                <p className=" text-xs font-semibold p-3 pl-0">{createdAt}</p>
                <div className="pt-5">
                    <button className="btn w-full btn-warning">Split</button>
                </div>
            </div>
        </div>
    )
}

export default BillCard
