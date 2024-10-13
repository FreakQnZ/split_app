import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";

// POST /api/Friends
export async function POST(req) {
  const { user1, user2 } = await req.json();
  if (user1 === user2) {
    return NextResponse.json({
      success: false,
      error: "You cannot add yourself as a friend.",
    });
  }
  try {
    const friendship = await pool.query(
      "SELECT * FROM friends WHERE user_id = $1 AND friend_id = $2",
      [userId, friendId]
    );

    if (friendship.rows.length > 0) {
      return NextResponse.json({
        success: false,
        error: "You are already friends.",
      });
    }

    const res1 = await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)",
      [user1, user2]
    );
    const res2 = await pool.query(
      "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)",
      [user2, user1]
    );
    if (res1.rowCount > 0 && res2.rowCount > 0) {
      return NextResponse.json({ success: true, message: "Friend added." });
    }
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
}

//GET /api/Friends
export async function GET(req) {
  const { user1 } = await req.json();

  try {
    const res = await pool.query("SELECT * FROM friends WHERE user_id = $1", [
      user1,
    ]);

    if (!res) {
      return NextResponse.json({
        success: false,
        message: "Something went wrong.",
      });
    }
    return NextResponse.json({
      success: true,
      numRows: res.rowCount,
      friends: res.rows,
      message: "Friends fetched successfully.",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong.",
    });
  }
}
