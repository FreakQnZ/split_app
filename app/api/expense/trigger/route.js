import pool from "../../../utils/connectDB";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await pool.query(`
        CREATE OR REPLACE FUNCTION update_expenses_on_bills()
        RETURNS TRIGGER AS $$
        BEGIN
            IF TG_OP = 'INSERT' THEN
                INSERT INTO expenses (bill_id, user_id, amount)
                VALUES (NEW.bill_id, NEW.user_id, NEW.amount); -- Ensure these columns exist in your bills table
                RETURN NEW;

            ELSIF TG_OP = 'DELETE' THEN
                DELETE FROM expenses WHERE bill_id = OLD.bill_id;
                RETURN OLD;
            END IF;

            RETURN NULL;  -- Fallback return statement (should not reach here)
        EXCEPTION
            WHEN OTHERS THEN
                INSERT INTO public.trigger_logs (log_message) 
                VALUES (FORMAT('Error: %s', SQLERRM));
                RETURN NULL;  -- Prevent any error from stopping the trigger
        END;
        $$ LANGUAGE plpgsql;
        `);

    await pool.query(`
            CREATE TRIGGER bills_trigger
            AFTER INSERT OR DELETE ON bills
            FOR EACH ROW
            EXECUTE FUNCTION update_expenses_on_bills();
        `);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error });
  }
}
