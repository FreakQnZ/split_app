import React from "react";
import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { billNo, amounts, participants } = await req.json();

  if (
    !billNo ||
    !amounts ||
    !participants ||
    amounts.length !== participants.length
  ) {
    return NextResponse.json({ success: false, error: "Invalid data." });
  }

  try {
    for (let i = 0; i < participants.length; i++) {
      if (amounts[i] === 0) {
        return NextResponse.json({ success: false, error: "Invalid data." });
      }

      const query = `SELECT user_id FROM users WHERE username = $1`;
      const userquery = await pool.query(query, [participants[i]]);
      if (userquery.rowCount === 0) {
        return NextResponse.json({
          success: false,
          message: "User not found.",
        });
      }

      const userid = userquery.rows[0].user_id;
      const query1 = `INSERT INTO bill_participants (bill_id, user_id, amount_owed) VALUES ($1, $2, $3)`;
      console.log(query1);
      const res = await pool.query(query1, [billNo, userid, amounts[i]]);
      console.log("HERE");
      if (!res) {
        return NextResponse.json({
          success: false,
          message: "Bill not created.",
        });
      }
    }
    return NextResponse.json({ success: true, message: "Bill created." });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: `Unexpected error occured ${error}`,
    });
  }
}
