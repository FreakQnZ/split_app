import { NextResponse } from "next/server";
import pool from "../../utils/connectDB";

// GET /api/searchfriends
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");
  const pname = searchParams.get("pname");
  console.log(pname, username);
  if (!pname || !username || pname.length < 2) {
    return NextResponse.json({
      success: false,
      message: "Error",
    });
  }
  console.log("here");
  try {
    // Step 1: Get the user_id of the current user
    const useridres = await pool.query(
      "SELECT user_id FROM users WHERE username = $1",
      [username]
    );

    // Check if the user exists
    if (useridres.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    const userid = useridres.rows[0].user_id;
    console.log(userid);
    // Step 2 & 3: Find friends of the user, check username similarity, and exclude the current user
    const result = await pool.query(
      `
        SELECT u.user_id, u.username
        FROM friends f
        INNER JOIN users u
        ON f.friend_id = u.user_id
        WHERE f.user_id = $1
        AND u.username ILIKE $2
        AND u.user_id != $1  -- Exclude the current user
        LIMIT 3
      `,
      [userid, `%${pname}%`]
    );

    // If successful, return the list of friends
    return NextResponse.json({
      success: true,
      friends: result.rows,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return NextResponse.json({
      success: false,
      message: "An error occurred while fetching friends",
    });
  }
}
