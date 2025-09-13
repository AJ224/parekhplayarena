-- Indexes for better query performance

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);

-- Cities and locations indexes
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_active ON cities(is_active);
CREATE INDEX idx_locations_city_id ON locations(city_id);
CREATE INDEX idx_locations_active ON locations(is_active);

-- Sports indexes
CREATE INDEX idx_sports_name ON sports(name);
CREATE INDEX idx_sports_active ON sports(is_active);

-- Venues indexes
CREATE INDEX idx_venues_location_id ON venues(location_id);
CREATE INDEX idx_venues_sport_id ON venues(sport_id);
CREATE INDEX idx_venues_active ON venues(is_active);
CREATE INDEX idx_venues_rating ON venues(rating);
CREATE INDEX idx_venues_price ON venues(price_per_hour);

-- Courts indexes
CREATE INDEX idx_courts_venue_id ON courts(venue_id);
CREATE INDEX idx_courts_active ON courts(is_active);

-- Game types indexes
CREATE INDEX idx_game_types_sport_id ON game_types(sport_id);
CREATE INDEX idx_game_types_active ON game_types(is_active);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON bookings(venue_id);
CREATE INDEX idx_bookings_court_id ON bookings(court_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX idx_bookings_check_in_status ON bookings(check_in_status);
CREATE INDEX idx_bookings_date_time ON bookings(booking_date, start_time, end_time);

-- Payments indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_gateway_payment_id ON payments(gateway_payment_id);

-- Coupons indexes
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);
CREATE INDEX idx_coupons_valid_dates ON coupons(valid_from, valid_to);

-- Coupon usage indexes
CREATE INDEX idx_coupon_usage_coupon_id ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user_id ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_booking_id ON coupon_usage(booking_id);

-- Reviews indexes
CREATE INDEX idx_reviews_venue_id ON reviews(venue_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_verified ON reviews(is_verified);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Communication logs indexes
CREATE INDEX idx_communication_logs_user_id ON communication_logs(user_id);
CREATE INDEX idx_communication_logs_booking_id ON communication_logs(booking_id);
CREATE INDEX idx_communication_logs_type ON communication_logs(type);
CREATE INDEX idx_communication_logs_status ON communication_logs(status);

-- Admin users indexes
CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX idx_admin_users_role ON admin_users(role);
CREATE INDEX idx_admin_users_active ON admin_users(is_active);
