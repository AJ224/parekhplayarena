-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_types_updated_at BEFORE UPDATE ON game_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_reference IS NULL THEN
        NEW.booking_reference := 'SPT' || TO_CHAR(NOW(), 'YYMMDDHH24MI') || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000)::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for booking reference generation
CREATE TRIGGER generate_booking_reference_trigger 
    BEFORE INSERT ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_booking_reference();

-- Function to generate payment reference
CREATE OR REPLACE FUNCTION generate_payment_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_reference IS NULL THEN
        NEW.payment_reference := 'PAY' || TO_CHAR(NOW(), 'YYMMDDHH24MI') || LPAD((EXTRACT(EPOCH FROM NOW())::BIGINT % 1000)::TEXT, 3, '0');
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for payment reference generation
CREATE TRIGGER generate_payment_reference_trigger 
    BEFORE INSERT ON payments 
    FOR EACH ROW 
    EXECUTE FUNCTION generate_payment_reference();

-- Function to update venue rating when a review is added/updated/deleted
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
DECLARE
    venue_id_to_update UUID;
    avg_rating DECIMAL(2,1);
    review_count INTEGER;
BEGIN
    -- Determine which venue to update
    IF TG_OP = 'DELETE' THEN
        venue_id_to_update := OLD.venue_id;
    ELSE
        venue_id_to_update := NEW.venue_id;
    END IF;
    
    -- Calculate new average rating and count
    SELECT 
        COALESCE(ROUND(AVG(rating), 1), 0.0),
        COUNT(*)
    INTO avg_rating, review_count
    FROM reviews 
    WHERE venue_id = venue_id_to_update AND is_verified = true;
    
    -- Update venue
    UPDATE venues 
    SET 
        rating = avg_rating,
        total_reviews = review_count,
        updated_at = NOW()
    WHERE id = venue_id_to_update;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Create triggers for venue rating updates
CREATE TRIGGER update_venue_rating_on_insert 
    AFTER INSERT ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_venue_rating();

CREATE TRIGGER update_venue_rating_on_update 
    AFTER UPDATE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_venue_rating();

CREATE TRIGGER update_venue_rating_on_delete 
    AFTER DELETE ON reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_venue_rating();
