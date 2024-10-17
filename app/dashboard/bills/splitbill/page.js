"use client";

import React, { useState, useEffect } from "react";
import withAuth from "@/app/utils/withAuth";
import { useSearchParams, useRouter } from "next/navigation";

const SplitBill = () => {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const [billName, setBillName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [error, setError] = useState("");
  const [isBillLoading, setIsBillLoading] = useState(true); // New state for loading bill details
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = localStorage.getItem("username");

  const searchParams = useSearchParams();
  const billId = searchParams.get("billid");
  const router = useRouter();

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Fetch bill details from backend using billId

  useEffect(() => {
    if (!billId) {
      router.push("/bills");
      return;
    }
    const fetchBill = async () => {
      try {
        const response = await fetch(`/api/bill/info?billId=${billId}`);
        const data = await response.json();
        console.log(data);
        if (data.success) {
          setBillName(data.bill.bill_name);
          setTotalAmount(data.bill.amount);
        } else {
          setError("Failed to fetch bill details.");
          router.push("/dashboard/bills");
        }
      } catch (error) {
        console.error("Error fetching bill:", error);
        setError("An error occurred while fetching bill details.");
        router.push("/dashboard/bills");
      } finally {
        // Set loading to false only after the fetch is completed, either success or failure
        setIsBillLoading(false);
      }
    };
    if (billId) {
      fetchBill();
    }
  }, [billId, router]);

  // Handle adding a new friend
  const handleAddFriend = async (newParticipant) => {
    if (typeof newParticipant !== "string" || !newParticipant.trim()) {
      setError("Please enter a valid friend's username.");
      setSuggestedFriends([]);
      return;
    }
    if (newParticipant === currentUser) {
      setError("You cannot add yourself as a participant.");
      setSuggestedFriends([]);
      return;
    }

    try {
      const alreadyAdded = friends.some(
        (friend) => friend.name === newParticipant
      );
      if (alreadyAdded) {
        setError(`${newParticipant} has already been added to the list.`);
        return;
      }

      const response = await fetch(
        `/api/checkfriendship?uname=${currentUser}&fname=${newParticipant}`
      );
      const data = await response.json();

      if (data.success) {
        setFriends([...friends, { name: newParticipant, amount: "" }]);
        setNewFriend("");
        setSuggestedFriends([]);
      } else {
        setSuggestedFriends([]);
        setError(
          `${newParticipant} does not exist. Please add them to your friends list.`
        );
      }
    } catch (error) {
      console.error("Error checking friendship:", error);
      setSuggestedFriends([]);
      setError("An error occurred while checking friendship");
    }
  };

  // Fetch friend suggestions based on the input query
  const fetchSuggestions = async (query) => {
    if (query.length < 2) return;

    try {
      const response = await fetch(
        `/api/searchfriends?user=${currentUser}&pname=${query}`
      );
      const data = await response.json();
      if (data.success) {
        const filteredSuggestions = data.friends.filter(
          (suggestedFriend) =>
            !friends.some(
              (addedFriend) => addedFriend.name === suggestedFriend.username
            )
        );

        setSuggestedFriends(filteredSuggestions);
      } else {
        setSuggestedFriends([]);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      setSuggestedFriends([]);
    }
  };

  // Handle search input change and fetch suggestions
  const handleSearchChange = (e) => {
    setError("");
    if (e.target.value.length < 2) {
      setSuggestedFriends([]);
    }
    setNewFriend(e.target.value);
    fetchSuggestions(e.target.value); // Fetch friend suggestions when typing
  };

  // Handle amount change for each friend
  const handleFriendAmountChange = (index, event) => {
    const updatedFriends = friends.map((friend, i) =>
      i === index ? { ...friend, amount: event.target.value } : friend
    );
    setFriends(updatedFriends);
  };

  const handleRemoveFriend = (index) => {
    const updatedFriends = friends.filter((_, i) => i !== index);
    setFriends(updatedFriends);
  };

  const handleAddFriendClick = () => {
    handleAddFriend(newFriend); // Add friend from input field
  };

  // Function to split amount equally among participants
  const handleSplitEqually = () => {
    const numParticipants = friends.length + 1;
    const amountPerParticipant =
      numParticipants > 0
        ? (parseFloat(totalAmount) / numParticipants).toFixed(2)
        : 0;

    const updatedFriends = friends.map((friend) => ({
      ...friend,
      amount: amountPerParticipant,
    }));
    setFriends(updatedFriends);
  };

  // Function to handle submission (e.g., send data to a server)
  const handleSubmit = async () => {
    if (!billId || !friends.length) {
      setError("Please add at least one participant and enter amount.");
      return;
    }
    const amounts = friends.map((friend) => parseFloat(friend.amount) || 0); // Parse amounts to float, default to 0 if invalid
    const participants = friends.map((friend) => friend.name);

    if (amounts.some((amount) => amount <= 0)) {
      setError("Please ensure all participants have a valid amount.");
      return;
    }
    try {
      const response = await fetch("/api/bill/split", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billNo: billId,
          amounts: amounts,
          participants: participants,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // setError("SUCCESSS");
        setIsModalOpen(true);
        setFriends([]);
        setTimeout(() => {
            router.push("/dashboard/bills");
        }, 2000);
      } else {
        setError(data.message || "Failed to split the bill.");
      }
    } catch (error) {
      console.error("Error submitting bill split:", error);
      setError("An unexpected error occurred while submitting the bill.");
    }
  };

  if (isBillLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div
        className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="flex-1 bg-white shadow-lg rounded-lg p-10">
          <h2 className="text-2xl font-bold mb-4 text-center">Split Bill</h2>
          <div className="form-control mb-4">
            <label className="label font-semibold">Bill Name</label>
            <input
              type="text"
              className="input input-bordered"
              value={billName}
              readOnly // Make the input non-editable
            />
          </div>
          <div className="form-control mb-4">
            <label className="label font-semibold">Total Amount</label>
            <input
              type="number"
              className="input input-bordered"
              value={totalAmount}
              min="0"
              readOnly // Make the input non-editable
              style={{
                WebkitAppearance: "none" /* Chrome, Safari, Edge */,
                MozAppearance: "textfield" /* Firefox */,
              }}
            />
          </div>
          <label className="label font-semibold">Search Participants</label>
          <div className="form-control mb-4 flex flex-row gap-2 items-center">
            <input
              type="text"
              placeholder="Enter friend's name"
              className="input input-bordered flex-grow"
              value={newFriend}
              onChange={handleSearchChange}
            />
            <button
              className="btn btn-outline group"
              onClick={handleAddFriendClick}
            >
              <svg
                className="h-6 w-6 text-slate-900 group-hover:text-white transition duration-200"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" />
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span className="text-lg">Add</span>
            </button>
          </div>
          {error && (
            <div role="alert" className="alert alert-error mt-4">
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
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}
          {suggestedFriends.length > 0 && (
            <div className="bg-white shadow-md rounded-md">
              <ul className="divide-y divide-gray-200">
                {suggestedFriends.map((friend) => (
                  <li
                    key={friend.user_id}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleAddFriend(friend.username)}
                  >
                    {friend.username}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {friends.length > 0 && (
            <div className="form-control mb-4">
              <label className="label font-semibold">Participants</label>
              {friends.map((friend, index) => (
                <div key={index} className="flex gap-2 mb-2 items-center">
                  {/* Friend name input */}
                  <input
                    type="text"
                    className="input input-bordered w-[60%]" // Adjust width as needed
                    value={friend.name}
                    readOnly
                  />

                  {/* Amount input */}
                  <input
                    type="number"
                    placeholder="Amount"
                    className="input input-bordered w-[30%]" // Adjust width as needed
                    value={friend.amount}
                    min="0"
                    onChange={(e) => handleFriendAmountChange(index, e)}
                  />

                  {/* Remove button */}
                  <button className="btn btn-square btn-outline">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Button to split the amount equally */}
          {friends.length > 0 && (
            <div className="flex justify-between mb-4">
              <button
                className="btn w-1/2 bg-black text-white text-base hover:bg-white hover:text-black border-black hover:border-black mr-2"
                onClick={handleSplitEqually}
              >
                Split Equally
              </button>
              <button
                className="btn w-1/2 bg-black text-white text-base hover:bg-white hover:text-black border-black hover:border-black "
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-11/12 max-w-lg mx-auto p-8 rounded-lg shadow-lg relative">

            <h2 className="text-2xl font-semibold mb-4">Bill Successfully Split</h2>
            <p className="text-gray-600">
              Redirecting ...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(SplitBill);
