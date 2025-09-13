-- Insert cities
INSERT INTO cities (name, state) VALUES
('Mumbai', 'Maharashtra'),
('Delhi', 'Delhi'),
('Bangalore', 'Karnataka'),
('Hyderabad', 'Telangana'),
('Chennai', 'Tamil Nadu'),
('Kolkata', 'West Bengal'),
('Pune', 'Maharashtra'),
('Ahmedabad', 'Gujarat'),
('Jaipur', 'Rajasthan'),
('Lucknow', 'Uttar Pradesh');

-- Insert locations for Mumbai
INSERT INTO locations (city_id, name, pincode) 
SELECT 
    c.id,
    location_name,
    pincode
FROM cities c,
(VALUES 
    ('Andheri West', '400058'),
    ('Bandra', '400050'),
    ('Powai', '400076'),
    ('Dadar', '400028'),
    ('Juhu', '400049'),
    ('Malad', '400064'),
    ('Goregaon', '400062'),
    ('Borivali', '400092')
) AS locations(location_name, pincode)
WHERE c.name = 'Mumbai';

-- Insert sports
INSERT INTO sports (name, description) VALUES
('Basketball', 'Fast-paced team sport played on a court with hoops'),
('Cricket', 'Bat-and-ball game played between two teams'),
('Football', 'Team sport played with a spherical ball between two teams'),
('Tennis', 'Racket sport played individually or in pairs'),
('Badminton', 'Racket sport played with a shuttlecock'),
('Volleyball', 'Team sport played with a ball over a net'),
('Swimming', 'Individual or team racing sport using arms and legs'),
('Table Tennis', 'Racket sport played on a table with a small ball'),
('Squash', 'Racket sport played in a four-walled court'),
('Yoga', 'Physical, mental and spiritual practice');

-- Insert game types
INSERT INTO game_types (sport_id, name, min_players, max_players, duration_minutes, price_multiplier)
SELECT 
    s.id,
    game_name,
    min_p,
    max_p,
    duration,
    multiplier
FROM sports s,
(VALUES 
    ('Basketball', 'Basketball - Full Court', 6, 10, 60, 1.0),
    ('Basketball', 'Basketball - Half Court', 2, 6, 60, 0.6),
    ('Football', 'Football - 5-a-side', 6, 10, 60, 1.0),
    ('Football', 'Football - 7-a-side', 8, 14, 90, 1.5),
    ('Football', 'Football - 11-a-side', 12, 22, 90, 2.0),
    ('Cricket', 'Cricket - T20', 12, 22, 180, 1.0),
    ('Cricket', 'Cricket - One Day', 12, 22, 480, 2.5),
    ('Tennis', 'Tennis - Singles', 2, 2, 60, 1.0),
    ('Tennis', 'Tennis - Doubles', 4, 4, 60, 1.2),
    ('Badminton', 'Badminton - Singles', 2, 2, 60, 1.0),
    ('Badminton', 'Badminton - Doubles', 4, 4, 60, 1.0),
    ('Swimming', 'Swimming - Lane', 1, 1, 60, 1.0),
    ('Table Tennis', 'Table Tennis - Singles', 2, 2, 60, 1.0),
    ('Table Tennis', 'Table Tennis - Doubles', 4, 4, 60, 1.0)
) AS games(sport_name, game_name, min_p, max_p, duration, multiplier)
WHERE s.name = games.sport_name;

-- Insert venues for Mumbai
INSERT INTO venues (name, description, location_id, sport_id, address, phone, price_per_hour, amenities, rules)
SELECT 
    venue_name,
    description,
    l.id,
    s.id,
    address,
    phone,
    price * 100, -- Convert to paise
    amenities,
    rules
FROM locations l
JOIN cities c ON l.city_id = c.id
CROSS JOIN sports s,
(VALUES 
    ('Hoops Arena', 'Premium basketball facility with professional-grade courts', 'Andheri West', 'Basketball', 'Plot 123, Andheri West, Mumbai', '+91-9876543210', 500, ARRAY['Parking', 'Changing Rooms', 'Shower', 'Equipment Rental', 'Café', 'First Aid'], ARRAY['Proper sports shoes required', 'Arrive 15 minutes before slot', 'No food or drinks on court']),
    ('Green Field', 'Large outdoor football ground with natural grass', 'Powai', 'Football', 'Powai Sports Complex, Mumbai', '+91-9876543211', 800, ARRAY['Parking', 'Changing Rooms', 'Floodlights', 'Equipment Rental'], ARRAY['Metal studs not allowed', 'Arrive 15 minutes before slot', 'No smoking on premises']),
    ('Smash Court', 'Multi-court badminton facility with wooden flooring', 'Bandra', 'Badminton', 'Bandra Sports Center, Mumbai', '+91-9876543212', 400, ARRAY['Parking', 'Changing Rooms', 'Air Conditioning', 'Equipment Rental'], ARRAY['Non-marking shoes required', 'Arrive 10 minutes before slot', 'No outside food allowed']),
    ('Cricket Hub', 'Professional cricket ground with turf wicket', 'Dadar', 'Cricket', 'Dadar Cricket Ground, Mumbai', '+91-9876543213', 1200, ARRAY['Parking', 'Changing Rooms', 'Pavilion', 'Equipment Rental', 'Scoreboard'], ARRAY['Bring your own equipment', 'Arrive 30 minutes before slot', 'Follow cricket etiquette']),
    ('Tennis Paradise', 'Clay court tennis facility', 'Juhu', 'Tennis', 'Juhu Tennis Club, Mumbai', '+91-9876543214', 600, ARRAY['Parking', 'Changing Rooms', 'Equipment Rental', 'Café'], ARRAY['Tennis shoes required', 'Arrive 10 minutes before slot', 'Court booking for 1 hour minimum']),
    ('Aqua Center', 'Olympic-size swimming pool', 'Powai', 'Swimming', 'Powai Aquatic Center, Mumbai', '+91-9876543215', 300, ARRAY['Parking', 'Changing Rooms', 'Shower', 'Lockers', 'Lifeguard'], ARRAY['Swimming costume mandatory', 'No diving in shallow end', 'Children must be supervised'])
) AS venues_data(venue_name, description, location_name, sport_name, address, phone, price, amenities, rules)
WHERE l.name = venues_data.location_name 
AND c.name = 'Mumbai' 
AND s.name = venues_data.sport_name;

-- Insert courts for each venue
INSERT INTO courts (venue_id, name, type, capacity)
SELECT 
    v.id,
    court_name,
    court_type,
    capacity
FROM venues v,
(VALUES 
    ('Hoops Arena', 'Court 1', 'Indoor', 10),
    ('Hoops Arena', 'Court 2', 'Indoor', 10),
    ('Hoops Arena', 'Court 3', 'Indoor', 10),
    ('Green Field', 'Field 1', 'Outdoor', 22),
    ('Green Field', 'Field 2', 'Outdoor', 14),
    ('Smash Court', 'Court 1', 'Indoor', 4),
    ('Smash Court', 'Court 2', 'Indoor', 4),
    ('Smash Court', 'Court 3', 'Indoor', 4),
    ('Smash Court', 'Court 4', 'Indoor', 4),
    ('Cricket Hub', 'Main Ground', 'Outdoor', 22),
    ('Cricket Hub', 'Practice Nets', 'Outdoor', 6),
    ('Tennis Paradise', 'Court 1', 'Outdoor', 4),
    ('Tennis Paradise', 'Court 2', 'Outdoor', 4),
    ('Tennis Paradise', 'Court 3', 'Outdoor', 4),
    ('Aqua Center', 'Main Pool', 'Indoor', 20),
    ('Aqua Center', 'Kids Pool', 'Indoor', 10)
) AS courts_data(venue_name, court_name, court_type, capacity)
WHERE v.name = courts_data.venue_name;

-- Insert sample coupons
INSERT INTO coupons (code, name, description, discount_type, discount_value, max_discount_amount, min_order_amount, usage_limit, valid_from, valid_to)
VALUES
('WELCOME20', 'Welcome Offer', 'Get 20% off on your first booking', 'percentage', 20, 20000, 0, 1000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '30 days'),
('SUMMER10', 'Summer Special', 'Get 10% off on all bookings', 'percentage', 10, 10000, 0, 2000, NOW() + INTERVAL '1 day', NOW() + INTERVAL '90 days'),
('CRICKET15', 'Cricket Special', 'Get 15% off on cricket bookings', 'percentage', 15, 15000, 0, 500, NOW() - INTERVAL '1 day', NOW() + INTERVAL '60 days'),
('FIRSTGAME', 'First Game Free', 'Get ₹100 off on your first booking', 'fixed', 10000, NULL, 0, 5000, NOW() - INTERVAL '1 day', NOW() + INTERVAL '365 days'),
('WEEKEND25', 'Weekend Special', 'Get 25% off on weekend bookings', 'percentage', 25, 25000, 50000, 1000, NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day');

-- Update coupon usage counts for expired coupon
UPDATE coupons SET usage_count = 876 WHERE code = 'WEEKEND25';
