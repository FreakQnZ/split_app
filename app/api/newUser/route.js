import pool from "../../utils/connectDB";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export async function POST(req) {
    const { username, password, email } = await req.json();
    const hash = await bcrypt.hash(password, 10)
    const query = `INSERT INTO users (username, password, email, token_version) VALUES ($1, $2, $3, 1)`;
    const values = [username, hash, email];

    try {
        const res = await pool.query(query, values)
        if (!res) {
            return NextResponse.json({ success: false, message: "Error" })
        }

        const payload = {
            username: username,
            email: email,
            token_version: 1
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return NextResponse.json({ success: true, message: "Success", token: token })
    } catch (error) {
        return NextResponse.json({ success: false, message: error })
    }
}
