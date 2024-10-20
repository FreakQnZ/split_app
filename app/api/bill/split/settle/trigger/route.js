import pool from "@/app/utils/connectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await pool.query(`  CREATE OR REPLACE FUNCTION insert_into_expense_on_settle()
                        RETURNS TRIGGER AS $$
                        BEGIN
                        -- Check if the settled column is being updated to true
                        IF NEW.settled = true THEN
                            -- Insert into expense table with the necessary values
                            INSERT INTO expenses (bill_id, split_id, user_id, amount)
                            VALUES (
                            NEW.bill_id,  -- Same bill_id as in bill_participants
                            NEW.id,       -- id from bill_participants as split_id
                            NEW.user_id,  -- Same user_id from bill_participants
                            NEW.amount_owed  -- Same amount_owed from bill_participants
                            );
                        END IF;
                        
                        -- Return the new row after the update
                        RETURN NEW;
                        END;
                        $$ LANGUAGE plpgsql;
`);
    await pool.query(`  CREATE TRIGGER after_settle_update
                        AFTER UPDATE OF settled ON bill_participants
                        FOR EACH ROW
                        WHEN (NEW.settled = true)  -- Condition to trigger only when settled is set to true
                        EXECUTE FUNCTION insert_into_expense_on_settle();
`);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
