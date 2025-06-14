
-- Drop the existing trigger and recreate it (this is safe)
DROP TRIGGER IF EXISTS update_mpesa_transactions_updated_at ON public.mpesa_transactions;

-- Recreate the trigger
CREATE TRIGGER update_mpesa_transactions_updated_at
  BEFORE UPDATE ON public.mpesa_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
