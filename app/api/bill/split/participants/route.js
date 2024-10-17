import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

// /api/split/bill/participants
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const billId = searchParams.get("billId");

  try {
    // Join the bill_participants and users tables to fetch user_name along with other data
    const query = `
      SELECT 
        bill_participants.id,
        bill_participants.user_id, 
        users.username, 
        bill_participants.amount_owed, 
        bill_participants.settled 
      FROM bill_participants
      JOIN users ON bill_participants.user_id = users.user_id
      WHERE bill_participants.bill_id = $1
    `;
    const res = await pool.query(query, [billId]);
    console.log("here");
    if (!res) {
      return NextResponse.json({
        success: false,
        message: "Failed to fetch data",
      });
    }
    if (res.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Bill has not been split",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Bill has been split",
      data: res.rows,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error,
    });
  }
}
