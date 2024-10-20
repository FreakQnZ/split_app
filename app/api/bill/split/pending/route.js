import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

// /api/bill/pending : Gives the list of people who I owe money to, or a specific participant
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");
  const participant = searchParams.get("participant");

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
        SELECT u.username AS "From", bp.amount_owed AS amount, b.bill_name AS bill, b.created_at AS time, bp.id
        FROM bill_participants bp
        JOIN bills b ON bp.bill_id = b.bill_id
        JOIN users u ON b.user_id = u.user_id
        WHERE bp.user_id = $1 AND bp.settled = false AND b.user_id = $2
        ORDER BY b.created_at;
      `;
      queryParams.push(participantId);
    } else {
      // If no participant is provided, fetch all bills where the current user owes money
      query2 = `
        SELECT u.username AS "From", bp.amount_owed AS amount, b.bill_name AS bill, b.created_at AS time, bp.id
        FROM bill_participants bp
        JOIN bills b ON bp.bill_id = b.bill_id
        JOIN users u ON b.user_id = u.user_id
        WHERE bp.user_id = $1 AND bp.settled = false
        ORDER BY b.created_at;
      `;
    }

    // Execute the query
    const billsQuery = await pool.query(query2, queryParams);

    if (billsQuery.rowCount === 0) {
      return NextResponse.json({
        success: true,
        message: "You don't owe anyone any money.",
        data: [],
      });
    }

    // Return the list of people the user owes money to, or the specific participant
    const bills = billsQuery.rows.map((row) => ({
      from: row.From,
      amount: row.amount,
      bill: row.bill,
      time: row.time,
      id: row.id,
    }));

    return NextResponse.json({
      success: true,
      data: bills,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
}
