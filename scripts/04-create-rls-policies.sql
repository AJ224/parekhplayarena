-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Public read access for reference data
CREATE POLICY "Anyone can view active cities" ON cities FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active locations" ON locations FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active sports" ON sports FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active venues" ON venues FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active courts" ON courts FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active game types" ON game_types FOR SELECT USING (is_active = true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = payments.booking_id 
            AND bookings.user_id = auth.uid()
        )
    );

-- Coupons policies
CREATE POLICY "Anyone can view active coupons" ON coupons FOR SELECT USING (is_active = true AND valid_from <= NOW() AND valid_to >= NOW());

-- Coupon usage policies
CREATE POLICY "Users can view their own coupon usage" ON coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create coupon usage" ON coupon_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view verified reviews" ON reviews FOR SELECT USING (is_verified = true);
CREATE POLICY "Users can create reviews for their bookings" ON reviews 
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND 
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id 
            AND bookings.user_id = auth.uid()
            AND bookings.status = 'completed'
        )
    );
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (only for admin users)
CREATE POLICY "Admin users can manage all data" ON cities FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can manage all locations" ON locations FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can manage all sports" ON sports FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can manage venues" ON venues FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
        AND (admin_users.role IN ('super_admin', 'admin') OR venues.id = ANY(admin_users.venue_ids))
    )
);

CREATE POLICY "Admin users can view all bookings" ON bookings FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can update bookings" ON bookings FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can view all payments" ON payments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can manage coupons" ON coupons FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
        AND admin_users.role IN ('super_admin', 'admin')
    )
);

CREATE POLICY "Admin users can view communication logs" ON communication_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM admin_users 
        WHERE admin_users.user_id = auth.uid() 
        AND admin_users.is_active = true
    )
);

CREATE POLICY "Admin users can manage admin users" ON admin_users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM admin_users existing_admin
        WHERE existing_admin.user_id = auth.uid() 
        AND existing_admin.is_active = true
        AND existing_admin.role = 'super_admin'
    )
);
