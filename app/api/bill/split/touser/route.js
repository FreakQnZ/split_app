import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

//  Gives the list of people who owe me money, or a specific participant

// /api/bill/split/touser
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");
  const participant = searchParams.get("participant"); // New query param for a specific participant

  try {
    // Get the current user's ID
    const query1 = `SELECT user_id FROM users WHERE username = $1`;
    const currentUserQuery = await pool.query(query1, [username]);
    if (currentUserQuery.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Current user not found.",
      });
    }
    const currentUserId = currentUserQuery.rows[0].user_id;

    // Prepare the query and parameters
    let query2;
    const queryParams = [currentUserId];

    // If a specific participant is requested
    if (participant) {
      // Get the user_id of the participant by username
      const participantQuery = `SELECT user_id FROM users WHERE username = $1`;
      const participantRes = await pool.query(participantQuery, [participant]);
      if (participantRes.rowCount === 0) {
        return NextResponse.json({
          success: false,
          message: "Participant user not found.",
        });
      }
      const participantId = participantRes.rows[0].user_id;

      // Add the participant ID to the query
      query2 = `
        SELECT u.username, bp.amount_owed, b.created_at, b.bill_name
        FROM bills b
        JOIN bill_participants bp ON b.bill_id = bp.bill_id
        JOIN users u ON u.user_id = bp.user_id
        WHERE b.user_id = $1 AND bp.amount_owed > 0 AND bp.settled = false
        AND u.user_id = $2
      `;
      queryParams.push(participantId);
    } else {
      // If no participant is provided, fetch all participants
      query2 = `
        SELECT u.username, bp.amount_owed, b.created_at, b.bill_name
        FROM bills b
        JOIN bill_participants bp ON b.bill_id = bp.bill_id
        JOIN users u ON u.user_id = bp.user_id
        WHERE b.user_id = $1 AND bp.amount_owed > 0 AND bp.settled = false
      `;
    }

    // Execute the query
    const participantsQuery = await pool.query(query2, queryParams);

    if (participantsQuery.rowCount === 0) {
      return NextResponse.json({
        success: true,
        message: "No participants owe money.",
        data: [],
      });
    }

    // Return the list of participants or the specific participant
    const participants = participantsQuery.rows.map((row) => ({
      username: row.username,
      amount_owed: row.amount_owed,
      created_at: row.created_at,
      bill_name: row.bill_name,
    }));

    return NextResponse.json({
      success: true,
      data: participants,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
