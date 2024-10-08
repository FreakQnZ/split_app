import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req) {
    const { username, password } = await req.json();
    const query = `SELECT * FROM users WHERE username = $1`;
    const values = [username];

    try {
        const res = await pool.query(query, values)
        const match = await bcrypt.compare(password, res.rows[0].password)
        if (!res) {
            return NextResponse.json({ success: false, message: "Error" })
        }
        if(res.rowCount === 0){
            return NextResponse.json({ success: false, message: "User Not Found" })
        }

        if (match) {
            const payload = {
                username: username,
                email: res.rows[0].email,
                token_version: res.rows[0].token_version
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET)
            return NextResponse.json({ success: true, message: "Success", token: token })
        }

        return NextResponse.json({ success: false, message: "Wrong Password" })
    } catch (error) {
        return NextResponse.json({ success: false, message: "NO" })
    }
}
