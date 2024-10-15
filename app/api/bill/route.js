import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { billName, amount, userName } = await req.json();
  console.log(billName, amount, userName);
  try {
    console.log("In try");
    const query1 = `SELECT user_id FROM users WHERE username = $1`;
    console.log("After q1");
    const currentUserQuery = await pool.query(query1, [userName]);
    console.log("after q1 exec");
    console.log(currentUserQuery);
    if (currentUserQuery.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Current user not found.",
      });
    }

    const query2 = `INSERT INTO bills (bill_name, amount, user_id) VALUES ($1, $2, $3)`;
    const res = await pool.query(query2, [
      billName,
      amount,
      currentUserQuery.rows[0].user_id,
    ]);
    if (!res) {
      return NextResponse.json({ success: false, error: "Bill not created." });
    }
    return NextResponse.json({ success: true, message: "Bill created." });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");

  try {
    const query1 = `SELECT user_id FROM users WHERE username = $1`;
    const currentUserQuery = await pool.query(query1, [username]);
    if (currentUserQuery.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Current user not found.",
      });
    }

    const query2 = `SELECT * FROM bills WHERE user_id = $1`;
    const res = await pool.query(query2, [currentUserQuery.rows[0].user_id]);

    if (!res) {
      return NextResponse.json({ success: false, error: "Bill not found." });
    }
    return NextResponse.json({ success: true, bills: res.rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const billId = searchParams.get("billId");
  const username = searchParams.get("user");

  try {
    const query = `SELECT user_id FROM users WHERE username = $1`;
    const currentUserQuery = await pool.query(query1, [username]);
    if (currentUserQuery.rowCount === 0) {
      return NextResponse.json({
        success: false,
        error: "Current user not found.",
      });
    }
    const userid = currentUserQuery.rows[0].user_id;
    const query1 = `SELECT * FROM bills WHERE bill_id = $1 AND user_id = $2`;
    const billsExistence = await pool.query(query1, [billId, userid]);

    if (billsExistence.rowCount === 0) {
      return NextResponse.json({ success: false, error: "Bill not found." });
    }
    const query2 = `DELETE FROM bills WHERE bill_id = $1`;
    const res = await pool.query(query2, [billId]);
    if (!res) {
      return NextResponse.json({ success: false, error: "Bill not deleted." });
    }
    return NextResponse.json({ success: true, message: "Bill deleted." });
  } catch (error) {}
}
