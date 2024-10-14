import { NextResponse } from "next/server";
import pool from "../../utils/connectDB";

// GET /api/checkfriendship?uname=<uname>&fname=<fname>
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const uname = searchParams.get("uname");
  const fname = searchParams.get("fname");

  // Validate input
  if (
    !uname ||
    !fname ||
    uname.trim().length === 0 ||
    fname.trim().length === 0
  ) {
    return NextResponse.json({
      success: false,
      message: "Both usernames are required",
    });
  }

  try {
    // Step 1: Get user_ids for both uname and fname
    const userRes = await pool.query(
      "SELECT user_id, username FROM users WHERE username = $1 OR username = $2",
      [uname, fname]
    );

    if (userRes.rowCount < 2) {
      // One or both users not found
      return NextResponse.json({
        success: false,
        message: "One or both users do not exist",
      });
    }

    const users = userRes.rows;
    const userIdMap = {};
    users.forEach((user) => {
      userIdMap[user.username] = user.user_id;
    });

    const user_id = userIdMap[uname];
    const friend_id = userIdMap[fname];

    // Step 2: Check if they are friends in the 'friends' table
    const friendshipRes = await pool.query(
      `
        SELECT * FROM friends
        WHERE (user_id = $1 AND friend_id = $2)
        OR (user_id = $2 AND friend_id = $1)
      `,
      [user_id, friend_id]
    );

    if (friendshipRes.rowCount === 0) {
      // They are not friends
      return NextResponse.json({
        success: false,
        message: "Users are not friends",
      });
    }

    // They are friends
    return NextResponse.json({
      success: true,
      message: "Users are friends",
    });
  } catch (error) {
    // Handle errors
    console.error("Error checking friendship:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while checking friendship",
    });
  }
}
