import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";

export async function POST(req) {

    const { billName, amount, userName } = await req.json();
    console.log(billName, amount, userName);
    try {
        console.log("In try")
        const query1 = `SELECT user_id FROM users WHERE username = $1`;
        console.log("After q1")
        const currentUserQuery = await pool.query(query1, [userName]);
        console.log("after q1 exec")
        console.log(currentUserQuery);
        if (currentUserQuery.rowCount === 0) {
            return NextResponse.json({
                success: false,
                error: "Current user not found.",
            });
        }

        const query2 = `INSERT INTO bills (bill_name, amount, user_id) VALUES ($1, $2, $3)`;
        const res = await pool.query(query2, [billName, amount, currentUserQuery.rows[0].user_id]);
        if (!res) {
            return NextResponse.json({ success: false, error: "Bill not created." });
        }
        return NextResponse.json({ success: true, message: "Bill created." });
    } catch (error) {
        return NextResponse.json({ success: false, error: error });
    }
}
