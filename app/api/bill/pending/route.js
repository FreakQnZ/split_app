import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

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

      const query2 = `select bp.id as id, u.username as From, bp.amount_owed as amount, b.bill_name as bill, b.created_at as time from bill_participants bp, bills b, users u where bp.bill_id = b.bill_id and b.user_id = u.user_id and bp.user_id = $1 and bp.settled = false;`;
      const res = await pool.query(query2, [currentUserQuery.rows[0].user_id]);

      if (!res) {
        return NextResponse.json({ success: false, error: "Bill not found." });
      }
      return NextResponse.json({ success: true, bills: res.rows });
    } catch (error) {
      return NextResponse.json({ success: false, error: error });
    }
  }
