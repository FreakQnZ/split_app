"use client";
import React, { useState, useEffect } from "react";
import withAuth from "@/app/utils/withAuth";
import { useUser } from "../../context/userContext";

const Friends = () => {
  const { user } = useUser();
  const [friendUsername, setFriendUsername] = useState("");
  const [friends, setFriends] = useState([]); // State to store friends
  const [error, setError] = useState(""); // State to store error messages
  const currentUser = localStorage.getItem("username");

  // Function to add a friend
  const addFriend = async (user1, user2) => {
    try {
      const res = await fetch("/api/friends", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1, user2 }),
      });
      const data = await res.json();
      if (data?.success) {
        console.log("Friend added successfully:", data);
        // After adding a friend, fetch the updated list of friends
        fetchFriends();
        setError("");
        setFriendUsername("");
      } else {
        setError(data?.message || "Error adding friend."); // Set error message from backend
        console.log("Error adding friend:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An unexpected error occurred."); // Set generic error message
    }
  };

  // Function to fetch the friends list
  const getFriends = async (user) => {
    try {
      const res = await fetch(`/api/friends?user=${user}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data?.success) {
        return data.friends; // Return the list of friends
      } else {
        console.error("Error fetching friends:", data.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      return [];
    }
  };

  // Function to fetch friends and set them in state
  const fetchFriends = async () => {
    const fetchedFriends = await getFriends(currentUser);
    setFriends(fetchedFriends);
  };

  // useEffect to fetch friends when the component mounts
  useEffect(() => {
    fetchFriends(); // Fetch friends when the component mounts
  }, []); // Empty dependency array ensures this runs only once

  // Handle the add friend action
  const handleAddFriend = () => {
    if (friendUsername.trim()) {
      addFriend(currentUser, friendUsername);
    } else {
      setError("Please enter a valid friend's username."); // Set error for empty input
    }
  };
  const handleDeleteFriend = async (friendUsername) => {
    try {
      const res = await fetch("/api/friends", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user1: currentUser, user2: friendUsername }),
      });
      const data = await res.json();
      if (data?.success) {
        console.log("Friend deleted successfully:", data);
        fetchFriends();
      } else {
        console.error("Error deleting friend:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div
        className="flex flex-col lg:flex-row gap-6 w-full"
        style={{ height: "calc(100vh - 64px)" }}
      >
        <div className="flex-1 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">List Of Friends</h2>
          <ul>
            {friends.length > 0 ? (
              friends.map((friend, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-2 hover:bg-gray-100 rounded transition"
                >
                  <span className="text-lg">{friend.username}</span>
                  <button
                    onClick={() => handleDeleteFriend(friend.username)} // Add your delete handler here
                    className="btn btn-ghost btn-sm"
                    aria-label="Delete friend"
                  >
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
                </li>
              ))
            ) : (
              <li>No friends found</li>
            )}
          </ul>
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
          <button className="btn btn-primary w-full" onClick={handleAddFriend}>
            Add
          </button>
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
        </div>
      </div>
    </div>
  );
};

export default withAuth(Friends);
