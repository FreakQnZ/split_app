import React from "react";
import { NextResponse } from "next/server";
import pool from "@/app/utils/connectDB";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const billId = searchParams.get("billId");
  try {
    const query = `SELECT * FROM bills WHERE bill_id = $1`;
    const res = await pool.query(query, [billId]);
    if (res.rowCount === 0 || !res) {
      return NextResponse.json({ success: false, message: "Bill not found." });
    }
    const data = {
      bill_name: res.rows[0].bill_name,
      amount: res.rows[0].amount,
    };
    return NextResponse.json({ success: true, bill: data });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Unexpected error" });
  }
}
