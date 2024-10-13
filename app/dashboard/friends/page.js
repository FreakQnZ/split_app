"use client";
import React, { useState } from "react";
import withAuth from "@/app/utils/withAuth";

const Friends = () => {
  const [friendUsername, setFriendUsername] = useState("");

  const currentUser = "currentLoggedInUser";

  const addFriend = async (user1, user2) => {
    try {
      const res = await fetch("/api/Friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1, user2 }),
      });
      const data = await res.json();
      if (data?.success) {
        console.log("Friend added successfully:", data);
      } else {
        console.log("Error adding friend:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddFriend = () => {
    if (friendUsername.trim()) {
      addFriend(currentUser, friendUsername);
    } else {
      console.log("Please enter a valid friend's username.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
        <div
          className="flex flex-col lg:flex-row gap-6 w-full"
          style={{ height: "calc(100vh - 64px)" }}
        >
          <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 ">List Of Friends</h2>
            {/* Display your friends list here */}
          </div>

          <div className="w-full lg:w-1/4 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Add Friends</h2>
            <div className="form-control mb-4">
              <input
                type="text"
                placeholder="Enter friend's username"
                value={friendUsername}
                onChange={(e) => setFriendUsername(e.target.value)} // Update state with input
                className="input input-bordered w-full"
              />
            </div>
            <button
              className="btn btn-primary w-full"
              onClick={handleAddFriend}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(Friends);
