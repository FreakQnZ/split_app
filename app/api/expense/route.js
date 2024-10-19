import { NextResponse } from "next/server";
import pool from "../../utils/connectDB";

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

    const query2 = `
        SELECT e.*,b.bill_name,b.created_at
        FROM expenses e
        JOIN bills b ON e.bill_id = b.bill_id
        WHERE e.user_id = $1
        ORDER BY b.created_at DESC
  `;
    const res = await pool.query(query2, [currentUserQuery.rows[0].user_id]);
    if (!res) {
      return NextResponse.json({ success: false, error: "Bill not found." });
    }
    const data = res.rows.map((row) => ({
      id: row.expense_id,
      bill_name: row.bill_name,
      amount: row.amount,
      created_at: row.created_at,
    }));
    console.log(data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}

export async function PUT(req) {
  try {
    const { billId, amount } = await req.json(); // Get expenseId and amount from the request body

    // Check if expenseId and amount are provided
    if (!billId || !amount) {
      return NextResponse.json({
        success: false,
        message: "Expense ID and amount are required.",
      });
    }

    const query = `
        UPDATE expenses
        SET amount = $1
        WHERE bill_id = $2
        RETURNING *;
      `;

    const res = await pool.query(query, [amount, billId]);

    if (res.rowCount === 0) {
      return NextResponse.json({
        success: false,
        message: "Expense not found.",
      });
    }

    const updatedExpense = res.rows[0];
    const data = {
      id: updatedExpense.expense_id,
      bill_name: updatedExpense.bill_name,
      amount: updatedExpense.amount,
      created_at: updatedExpense.created_at,
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
