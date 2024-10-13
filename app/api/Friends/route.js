import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";

// POST /api/Friends
export async function POST(req) {
  const { user1: currentUsername, user2: friendUsername } = await req.json();

  // Step 1: Get current user's ID
  const currentUserQuery = await pool.query(
    "SELECT user_id FROM users WHERE username = $1",
    [currentUsername]
  );

  if (currentUserQuery.rowCount === 0) {
    return NextResponse.json({
      success: false,
      error: "Current user not found.",
    });
  }
  const currentUserId = currentUserQuery.rows[0].user_id;

  // Step 2: Get friend's ID
  const friendQuery = await pool.query(
    "SELECT user_id FROM users WHERE username = $1",
    [friendUsername]
  );

  if (friendQuery.rowCount === 0) {
    return NextResponse.json({
      success: false,
      message: "Friend not found.",
    });
  }
  const friendId = friendQuery.rows[0].user_id;

  // Step 3: Check if trying to add oneself
  if (currentUserId === friendId) {
    return NextResponse.json({
      success: false,
      message: "You cannot add yourself as a friend.",
    });
  }

  // Step 4: Check if already friends (bidirectional check)
  const friendship = await pool.query(
    "SELECT * FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
    [currentUserId, friendId]
  );

  if (friendship.rows.length > 0) {
    return NextResponse.json({
      success: false,
      message: "You are already friends.",
    });
  }

  // Step 5: Add the friendship
  try {
    const res = await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)",
      [currentUserId, friendId]
    );

    if (res.rowCount > 0) {
      return NextResponse.json({ success: true, message: "Friend added." });
    }

    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    return NextResponse.json({
      success: false,
      message: "Something went wrong. Caught error.",
    });
  }
}

// GET /api/Friends
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");

  try {
    const userQuery = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );

    if (userQuery.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found.",
      });
    }

    const userId = userQuery.rows[0].user_id;

    const res = await pool.query(
      "SELECT friend_id FROM friends WHERE user_id = $1",
      [userId]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({
        success: true,
        friends: [],
        message: "No friends found.",
      });
    }

    // Fetch usernames of friends in one query
    const friendIds = res.rows.map((row) => row.friend_id);
    const friendsQuery = await pool.query(
      "SELECT username FROM users WHERE user_id = ANY($1::int[])",
      [friendIds]
    );

    return NextResponse.json({
      success: true,
      numRows: friendsQuery.rowCount,
      friends: friendsQuery.rows,
      message: "Friends fetched successfully.",
    });
  } catch (error) {
    console.error("Database query error:", error); // Log the error for debugging
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

export async function DELETE(req) {
  const { user1, user2 } = await req.json();

  // Get user IDs from usernames
  const userid1Result = await pool.query(
    "SELECT user_id FROM users WHERE username = $1",
    [user1]
  );
  const userid2Result = await pool.query(
    "SELECT user_id FROM users WHERE username = $1",
    [user2]
  );

  // Check if user IDs were found
  if (userid1Result.rowCount === 0 || userid2Result.rowCount === 0) {
    return NextResponse.json({
      success: false,
      message: "User not found.",
    });
  }

  // Extract user IDs from query results
  const userid1 = userid1Result.rows[0].user_id;
  const userid2 = userid2Result.rows[0].user_id;

  try {
    const query = `
      DELETE FROM friends 
      WHERE (user_id = $1 AND friend_id = $2) 
      OR (user_id = $2 AND friend_id = $1)
    `;
    const values = [userid1, userid2];

    const res = await pool.query(query, values);

    // Check how many rows were affected by the DELETE query
    if (res.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "No friend relationship found to delete.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Friend deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting friend:", error); // Log the error for debugging
    return NextResponse.json({
      success: false,
      message: "Error deleting friend.",
    });
  }
}
