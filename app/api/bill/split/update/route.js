import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  const {
    billNo: billId,
    amounts,
    participants,
    removedParticipantIds: deletedParticipants,
    deleteAllParticipants, // New parameter to delete all participants
  } = await req.json();

  // Validate input
  if (!billId) {
    return NextResponse.json({ success: false, error: "Bill ID is required." });
  }
  if (amounts && participants && amounts.length !== participants.length) {
    return NextResponse.json({
      success: false,
      error: "Mismatch between amounts and participants.",
    });
  }

  try {
    // Check if the bill exists
    const billCheckQuery = `SELECT * FROM bills WHERE bill_id = $1`;
    const billCheckRes = await pool.query(billCheckQuery, [billId]);
    if (billCheckRes.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Bill not found.",
      });
    }

    // If deleteAllParticipants is true, delete all participants
    if (deleteAllParticipants) {
      const deleteAllQuery = `DELETE FROM bill_participants WHERE bill_id = $1`;
      await pool.query(deleteAllQuery, [billId]);
    } else {
      // Delete participants sent from the frontend
      if (deletedParticipants && deletedParticipants.length > 0) {
        const deleteQuery = `DELETE FROM bill_participants WHERE id = ANY($1)`;
        await pool.query(deleteQuery, [deletedParticipants]);
      }

      // Process each participant for update or insert
      for (let i = 0; i < participants.length; i++) {
        if (amounts[i] <= 0 || !participants[i]) {
          return NextResponse.json({
            success: false,
            error: "Invalid data for one or more participants.",
          });
        }

        // Check if the user exists
        const query = `SELECT user_id FROM users WHERE username = $1`;
        const userquery = await pool.query(query, [participants[i]]);
        if (userquery.rowCount === 0) {
          return NextResponse.json({
            success: false,
            message: "User not found.",
          });
        }
        const userid = userquery.rows[0].user_id;

        // Check if the participant already exists
        const participantCheckQuery = `SELECT * FROM bill_participants WHERE bill_id = $1 AND user_id = $2`;
        const participantCheckRes = await pool.query(participantCheckQuery, [
          billId,
          userid,
        ]);

        if (participantCheckRes.rowCount === 0) {
          // If the participant does not exist, insert them
          const insertQuery = `
            INSERT INTO bill_participants (bill_id, user_id, amount_owed, settled) 
            VALUES ($1, $2, $3, false)
          `;
          await pool.query(insertQuery, [billId, userid, amounts[i]]);
        } else {
          // If the participant exists, update their amount
          const updateQuery = `
            UPDATE bill_participants 
            SET amount_owed = $1 
            WHERE bill_id = $2 AND user_id = $3
          `;
          await pool.query(updateQuery, [amounts[i], billId, userid]);
        }
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Bill participants updated successfully",
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `An error occurred while updating the bill: ${error.message}`,
    });
  }
}
