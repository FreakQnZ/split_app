"use client";

import React, { useState, useEffect } from "react";
import withAuth from "@/app/utils/withAuth";

const SplitBill = () => {
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState("");
  const [billName, setBillName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [suggestedFriends, setSuggestedFriends] = useState([]);
  const [error, setError] = useState("");

  const currentUser = localStorage.getItem("username");

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("");
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  // Handle adding a new friend
  const handleAddFriend = async (newParticipant) => {
    if (!newParticipant.trim()) return;

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
        setError(
          `${newParticipant} does not exist. Please add them to your friends list.`
        );
      }
    } catch (error) {
      console.error("Error checking friendship:", error);
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
    setNewFriend(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Handle amount change for each friend
  const handleFriendAmountChange = (index, event) => {
    const updatedFriends = friends.map((friend, i) =>
      i === index ? { ...friend, amount: event.target.value } : friend
    );
    setFriends(updatedFriends);
  };

  const handleAddFriendClick = () => {
    handleAddFriend(newFriend); // Add friend from input field
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div
        className="flex flex-col lg:flex-row gap-6 w-full max-w-4xl"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Split Bill</h2>
          <div className="form-control mb-4">
            <label className="label font-semibold">Bill Name</label>
            <input
              type="text"
              placeholder="Enter bill name"
              className="input input-bordered"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
            />
          </div>
          <div className="form-control mb-4">
            <label className="label font-semibold">Total Amount</label>
            <input
              type="number"
              placeholder="Enter total amount"
              className="input input-bordered"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          <label className="label font-semibold">Participants</label>
          <div className="form-control mb-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter friend's name"
              className="input input-bordered flex-grow"
              value={newFriend}
              onChange={handleSearchChange}
            />
            <button className="btn btn-outline" onClick={handleAddFriendClick}>
              Add Friend
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
            <div className="form-control mb-4">
              <ul className="dropdown-content p-2 shadow bg-white rounded-box w-full">
                {suggestedFriends.map((friend) => (
                  <li
                    key={friend.user_id}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                    onClick={() => handleAddFriend(friend.username)} // Directly add friend on click
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
                <div key={index} className="flex gap-4 mb-2">
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={friend.name}
                    readOnly
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="input input-bordered w-full"
                    value={friend.amount}
                    onChange={(e) => handleFriendAmountChange(index, e)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(SplitBill);
