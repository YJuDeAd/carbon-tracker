-- Migration: Add RPC functions for aggregation

CREATE OR REPLACE FUNCTION get_user_daily_trends(p_user_id UUID, p_start_date DATE)
RETURNS TABLE (activity_date DATE, daily_total NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT a.date as activity_date, SUM(a.co2e_kg) as daily_total
    FROM public.activities a
    WHERE a.user_id = p_user_id AND a.date >= p_start_date
    GROUP BY a.date
    ORDER BY a.date ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_user_category_summary(p_user_id UUID, p_start_date DATE)
RETURNS TABLE (category TEXT, total_co2e NUMERIC)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT a.category, SUM(a.co2e_kg) as total_co2e
    FROM public.activities a
    WHERE a.user_id = p_user_id AND a.date >= p_start_date
    GROUP BY a.category;
END;
$$;
