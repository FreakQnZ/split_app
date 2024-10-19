import { NextResponse } from "next/server";
import pool from "@/app/utils/connectDB";

export async function POST(req) {
    const { billId, username } = await req.json();
    console.log(billId, username);

    try {
        const query1 = `SELECT user_id FROM users WHERE username = $1`;
        const currentUserQuery = await pool.query(query1, [username]);
        if (currentUserQuery.rowCount === 0) {
          return NextResponse.json({
            success: false,
            error: "Current user not found.",
          });
        }
        const query = `UPDATE bill_participants SET settled = true WHERE id = $1 AND user_id = $2`;
        const res = await pool.query(query, [billId, currentUserQuery.rows[0].user_id]);
        if (!res) {
            return NextResponse.json({ success: false, error: "Bill not settled." });
        }
        return NextResponse.json({ success: true, message: "Bill settled." });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}
