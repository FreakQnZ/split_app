import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const billId = searchParams.get("billId");

  try {
    const query = `SELECT * FROM bill_participants WHERE bill_id = $1`;
    const res = await pool.query(query, [billId]);
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
    return NextResponse.json({ success: true, message: "Bill has been split" });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Unexpected Error Occured",
    });
  }
}
