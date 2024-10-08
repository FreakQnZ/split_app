import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { token } = await req.json();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = decoded.username;
        const token_in_database = decoded.token_version;

        const query = `SELECT * FROM users WHERE username = $1 AND token_version = $2`;
        const values = [user, token_in_database];

        const res = await pool.query(query, values);

        if (res.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Invalid Token", message_code: 0 });
        }

        return NextResponse.json({ success: true, message: "Success", message_code: 2 });

    } catch (err) {
        if (err.name === "JsonWebTokenError") {
            return NextResponse.json({ success: false, message: "Invalid Token", message_code: 0 });
        } else {
            return NextResponse.json({ success: false, message: err.message, message_code: 3 });
        }
    }
}
