-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cities table
CREATE TABLE public.cities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT DEFAULT 'India',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Locations table
CREATE TABLE public.locations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  city_id UUID REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pincode TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sports table
CREATE TABLE public.sports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venues table
CREATE TABLE public.venues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  base_price_per_slot INTEGER NOT NULL, -- Base price per slot in paise (₹1 = 100 paise)
  images TEXT[], -- Array of image URLs
  amenities TEXT[], -- Array of amenities
  rules TEXT[], -- Array of venue rules
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courts/Fields table
CREATE TABLE public.courts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Court 1", "Field A"
  type TEXT NOT NULL, -- e.g., "Indoor", "Outdoor"
  capacity INTEGER DEFAULT 10,
  supported_sports UUID[], -- Array of sport IDs that can be played on this court
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game types table
CREATE TABLE public.game_types (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sport_id UUID REFERENCES sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- e.g., "Basketball - Full Court", "Football - 5-a-side"
  min_players INTEGER NOT NULL,
  max_players INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price_multiplier DECIMAL(3,2) DEFAULT 1.0, -- Multiplier for base venue price
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_reference TEXT UNIQUE NOT NULL, -- e.g., "SPT24050789"
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  game_type_id UUID REFERENCES game_types(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_slots INTEGER NOT NULL DEFAULT 1, -- Number of continuous slots booked
  total_amount INTEGER NOT NULL, -- in paise
  service_fee INTEGER DEFAULT 0, -- in paise
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  check_in_status TEXT NOT NULL DEFAULT 'not_checked_in' CHECK (check_in_status IN ('not_checked_in', 'checked_in')),
  check_in_time TIMESTAMP WITH TIME ZONE,
  qr_code_url TEXT,
  cancellation_reason TEXT,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1, -- For optimistic locking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Constraints
  CONSTRAINT valid_booking_time CHECK (end_time > start_time),
  CONSTRAINT valid_total_slots CHECK (total_slots > 0),
  CONSTRAINT valid_total_amount CHECK (total_amount > 0)
);

-- Indexes for better performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_venue_id ON public.bookings(venue_id);
CREATE INDEX idx_bookings_court_id ON public.bookings(court_id);
CREATE INDEX idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_reference ON public.bookings(booking_reference);

-- Time slots table for slot management (moved before slot_availability)
CREATE TABLE public.time_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER NOT NULL DEFAULT 60, -- Duration of each slot in minutes
  price_per_slot INTEGER NOT NULL, -- Price per slot in paise (can override venue base price)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, court_id, day_of_week, start_time)
);

-- Venue operating hours table
CREATE TABLE public.venue_operating_hours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 1=Monday, etc.
  opening_time TIME NOT NULL,
  closing_time TIME NOT NULL,
  is_closed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, day_of_week)
);

-- Slot availability table for real-time availability tracking
CREATE TABLE public.slot_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot_id UUID REFERENCES time_slots(id) ON DELETE CASCADE,
  is_available BOOLEAN DEFAULT true,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  blocked_reason TEXT, -- Reason for blocking (maintenance, event, etc.)
  version INTEGER DEFAULT 1, -- For optimistic locking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(court_id, date, time_slot_id),
  -- Ensure availability logic consistency
  CONSTRAINT check_availability_logic CHECK (is_available = (booking_id IS NULL))
);

-- Booking slots table to track which specific slots are booked
CREATE TABLE public.booking_slots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  slot_availability_id UUID REFERENCES slot_availability(id) ON DELETE CASCADE,
  slot_sequence INTEGER NOT NULL, -- Order of slots in continuous booking (1, 2, 3, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(booking_id, slot_availability_id)
);

-- Payment gateways configuration table
CREATE TABLE public.payment_gateways (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- e.g., "razorpay", "stripe", "payu"
  display_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  config JSONB NOT NULL, -- Gateway-specific configuration (API keys, endpoints, etc.)
  supported_methods TEXT[] NOT NULL, -- Array of supported payment methods
  webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE public.payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gateway_id UUID REFERENCES payment_gateways(id) ON DELETE CASCADE,
  method_code TEXT NOT NULL, -- e.g., "upi", "credit_card", "netbanking"
  method_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  processing_fee_percentage DECIMAL(5,2) DEFAULT 0.00,
  processing_fee_fixed INTEGER DEFAULT 0, -- in paise
  min_amount INTEGER DEFAULT 0, -- in paise
  max_amount INTEGER, -- in paise, NULL for no limit
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gateway_id, method_code)
);

-- Enhanced Payments table
CREATE TABLE public.payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_reference TEXT UNIQUE NOT NULL, -- e.g., "PAY24050789"
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  gateway_id UUID REFERENCES payment_gateways(id) ON DELETE SET NULL,
  payment_method_id UUID REFERENCES payment_methods(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL, -- in paise
  currency TEXT NOT NULL DEFAULT 'INR',
  processing_fee INTEGER DEFAULT 0, -- in paise
  net_amount INTEGER NOT NULL, -- amount - processing_fee
  payment_method TEXT NOT NULL, -- e.g., "upi", "credit_card", "netbanking"
  payment_gateway TEXT, -- e.g., "razorpay", "stripe"
  gateway_payment_id TEXT,
  gateway_order_id TEXT,
  gateway_transaction_id TEXT,
  gateway_signature TEXT, -- For webhook verification
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded')),
  failure_reason TEXT,
  failure_code TEXT,
  gateway_response JSONB, -- Full gateway response
  webhook_data JSONB, -- Webhook payload data
  refund_amount INTEGER DEFAULT 0, -- in paise
  refund_reason TEXT,
  refunded_at TIMESTAMP WITH TIME ZONE,
  refund_gateway_id TEXT,
  expires_at TIMESTAMP WITH TIME ZONE, -- Payment expiry time
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Constraints
  CONSTRAINT valid_payment_amount CHECK (amount > 0),
  CONSTRAINT valid_net_amount CHECK (net_amount > 0),
  CONSTRAINT valid_refund_amount CHECK (refund_amount >= 0 AND refund_amount <= amount)
);

-- Payment webhooks table for tracking webhook events
CREATE TABLE public.payment_webhooks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  gateway_id UUID REFERENCES payment_gateways(id) ON DELETE CASCADE,
  webhook_type TEXT NOT NULL, -- e.g., "payment.completed", "payment.failed", "refund.processed"
  event_id TEXT, -- Gateway's event ID
  payload JSONB NOT NULL, -- Full webhook payload
  signature TEXT, -- Webhook signature for verification
  is_verified BOOLEAN DEFAULT false,
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processed', 'failed', 'ignored')),
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refunds table for detailed refund tracking
CREATE TABLE public.refunds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  refund_reference TEXT UNIQUE NOT NULL, -- e.g., "REF24050789"
  amount INTEGER NOT NULL, -- in paise
  reason TEXT NOT NULL,
  gateway_refund_id TEXT,
  gateway_response JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  failure_reason TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Constraints
  CONSTRAINT valid_refund_amount CHECK (amount > 0)
);

-- Coupons table
CREATE TABLE public.coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INTEGER NOT NULL, -- percentage (1-100) or amount in paise
  max_discount_amount INTEGER, -- max discount in paise for percentage coupons
  min_order_amount INTEGER DEFAULT 0, -- minimum order amount in paise
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  applicable_sports UUID[], -- Array of sport IDs, NULL means all sports
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_to TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Coupon usage table
CREATE TABLE public.coupon_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  discount_amount INTEGER NOT NULL, -- actual discount applied in paise
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(coupon_id, user_id, booking_id)
);

-- Reviews table
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_verified BOOLEAN DEFAULT false, -- true if user actually visited the venue
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, booking_id) -- One review per booking per user
);

-- Notifications table
CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., "booking_confirmed", "booking_reminder", "check_in_success"
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional data for the notification
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email/SMS logs table
CREATE TABLE public.communication_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'push')),
  template_name TEXT,
  recipient TEXT NOT NULL,
  subject TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  provider TEXT, -- e.g., "sendgrid", "twilio"
  provider_message_id TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots and venue operating hours tables already defined above

-- Bulk slot blocking for events/maintenance
CREATE TABLE public.bulk_slot_blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE, -- NULL for all courts in venue
  block_name TEXT NOT NULL, -- e.g., "Annual Maintenance", "Cricket Tournament"
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week INTEGER[], -- Array of days (0-6), NULL means all days
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Venue maintenance/pause table
CREATE TABLE public.venue_maintenance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('scheduled', 'emergency', 'renovation')),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced pricing rules table
CREATE TABLE public.pricing_rules (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('base_price', 'multiplier', 'fixed_override')),
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  price_value INTEGER NOT NULL, -- in paise
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  priority INTEGER DEFAULT 0, -- Higher priority overrides lower
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Slot reservation system for better UX
CREATE TABLE public.slot_reservations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  court_id UUID REFERENCES courts(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily aggregation table for performance
CREATE TABLE public.daily_venue_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_revenue INTEGER DEFAULT 0, -- in paise
  total_slots_booked INTEGER DEFAULT 0,
  total_slots_available INTEGER DEFAULT 0,
  average_rating DECIMAL(2,1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(venue_id, date)
);

-- User behavior tracking
CREATE TABLE public.user_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'search', 'view_venue', 'book_slot', etc.
  entity_type TEXT, -- 'venue', 'sport', 'location'
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue recognition table
CREATE TABLE public.revenue_recognition (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- in paise
  recognition_date DATE NOT NULL,
  booking_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logging table
CREATE TABLE public.audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  operation TEXT NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'venue_manager', 'staff')),
  permissions TEXT[], -- Array of permissions
  venue_ids UUID[], -- Array of venue IDs for venue managers/staff
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
DECLARE
    reference TEXT;
    counter INTEGER;
BEGIN
    -- Generate reference with format: SPT + YYMMDD + 4-digit counter
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_reference FROM 9) AS INTEGER)), 0) + 1
    INTO counter
    FROM bookings
    WHERE booking_reference LIKE 'SPT' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '%';
    
    reference := 'SPT' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || LPAD(counter::TEXT, 4, '0');
    
    RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Function to generate payment reference
CREATE OR REPLACE FUNCTION generate_payment_reference()
RETURNS TEXT AS $$
DECLARE
    reference TEXT;
    counter INTEGER;
BEGIN
    -- Generate reference with format: PAY + YYMMDD + 4-digit counter
    SELECT COALESCE(MAX(CAST(SUBSTRING(payment_reference FROM 8) AS INTEGER)), 0) + 1
    INTO counter
    FROM payments
    WHERE payment_reference LIKE 'PAY' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '%';
    
    reference := 'PAY' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || LPAD(counter::TEXT, 4, '0');
    
    RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Function to generate refund reference
CREATE OR REPLACE FUNCTION generate_refund_reference()
RETURNS TEXT AS $$
DECLARE
    reference TEXT;
    counter INTEGER;
BEGIN
    -- Generate reference with format: REF + YYMMDD + 4-digit counter
    SELECT COALESCE(MAX(CAST(SUBSTRING(refund_reference FROM 8) AS INTEGER)), 0) + 1
    INTO counter
    FROM refunds
    WHERE refund_reference LIKE 'REF' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || '%';
    
    reference := 'REF' || TO_CHAR(CURRENT_DATE, 'YYMMDD') || LPAD(counter::TEXT, 4, '0');
    
    RETURN reference;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate dynamic pricing
CREATE OR REPLACE FUNCTION calculate_slot_price(
    p_venue_id UUID,
    p_court_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME
) RETURNS INTEGER AS $$
DECLARE
    base_price INTEGER;
    final_price INTEGER;
BEGIN
    -- Get base price from venue
    SELECT base_price_per_slot INTO base_price
    FROM public.venues WHERE id = p_venue_id;
    
    -- Apply pricing rules in priority order
    SELECT COALESCE(
        (SELECT price_value FROM public.pricing_rules 
         WHERE venue_id = p_venue_id 
         AND (court_id = p_court_id OR court_id IS NULL)
         AND day_of_week = EXTRACT(DOW FROM p_date)
         AND start_time <= p_start_time 
         AND end_time >= p_end_time
         AND valid_from <= p_date 
         AND valid_to >= p_date
         AND is_active = true
         ORDER BY priority DESC, 
                  CASE WHEN court_id IS NOT NULL THEN 1 ELSE 0 END DESC
         LIMIT 1),
        base_price
    ) INTO final_price;
    
    RETURN final_price;
END;
$$ LANGUAGE plpgsql;

-- Function to reserve a slot temporarily
CREATE OR REPLACE FUNCTION reserve_slot(
    p_court_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_user_id UUID,
    p_reservation_minutes INTEGER DEFAULT 15
) RETURNS UUID AS $$
DECLARE
    reservation_id UUID;
BEGIN
    -- Clean up expired reservations
    DELETE FROM public.slot_reservations 
    WHERE expires_at < NOW() AND status = 'reserved';
    
    -- Check if slots are available
    IF NOT EXISTS (
        SELECT 1 FROM public.slot_availability sa
        JOIN public.time_slots ts ON sa.time_slot_id = ts.id
        WHERE sa.court_id = p_court_id 
        AND sa.date = p_date
        AND sa.is_available = true
        AND ts.start_time >= p_start_time
        AND ts.end_time <= p_end_time
    ) THEN
        RAISE EXCEPTION 'Slots not available for reservation';
    END IF;
    
    -- Create reservation
    INSERT INTO public.slot_reservations (
        court_id, date, start_time, end_time, user_id, expires_at
    ) VALUES (
        p_court_id, p_date, p_start_time, p_end_time, p_user_id,
        NOW() + INTERVAL '1 minute' * p_reservation_minutes
    ) RETURNING id INTO reservation_id;
    
    RETURN reservation_id;
END;
$$ LANGUAGE plpgsql;

-- Atomic slot booking function
CREATE OR REPLACE FUNCTION book_slots_atomic(
    p_court_id UUID,
    p_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_user_id UUID,
    p_venue_id UUID,
    p_game_type_id UUID DEFAULT NULL,
    p_total_slots INTEGER DEFAULT 1
) RETURNS UUID AS $$
DECLARE
    booking_id UUID;
    slot_record RECORD;
    total_amount INTEGER := 0;
    slot_price INTEGER;
BEGIN
    -- Calculate total amount
    SELECT calculate_slot_price(p_venue_id, p_court_id, p_date, p_start_time, p_end_time) 
    INTO slot_price;
    total_amount := slot_price * p_total_slots;
    
    -- Use SELECT FOR UPDATE to prevent race conditions
    FOR slot_record IN 
        SELECT sa.id, sa.version, ts.id as time_slot_id
        FROM public.slot_availability sa
        JOIN public.time_slots ts ON sa.time_slot_id = ts.id
        WHERE sa.court_id = p_court_id 
        AND sa.date = p_date
        AND sa.is_available = true
        AND ts.start_time >= p_start_time
        AND ts.end_time <= p_end_time
        FOR UPDATE
    LOOP
        -- Double-check availability after lock
        IF NOT EXISTS (
            SELECT 1 FROM public.slot_availability 
            WHERE id = slot_record.id AND is_available = true
        ) THEN
            RAISE EXCEPTION 'Slot no longer available during booking process';
        END IF;
    END LOOP;
    
    -- Create booking
    INSERT INTO public.bookings (
        booking_reference, user_id, venue_id, court_id, game_type_id,
        booking_date, start_time, end_time, total_slots, total_amount
    ) VALUES (
        generate_booking_reference(), p_user_id, p_venue_id, p_court_id, p_game_type_id,
        p_date, p_start_time, p_end_time, p_total_slots, total_amount
    ) RETURNING id INTO booking_id;
    
    -- Update slot availability
    UPDATE public.slot_availability 
    SET 
        is_available = false,
        booking_id = booking_id,
        version = version + 1,
        updated_at = NOW()
    WHERE court_id = p_court_id 
    AND date = p_date
    AND time_slot_id IN (
        SELECT ts.id FROM public.time_slots ts
        WHERE ts.court_id = p_court_id
        AND ts.start_time >= p_start_time
        AND ts.end_time <= p_end_time
    );
    
    -- Create booking slots records
    INSERT INTO public.booking_slots (booking_id, slot_availability_id, slot_sequence)
    SELECT 
        booking_id,
        sa.id,
        ROW_NUMBER() OVER (ORDER BY ts.start_time)
    FROM public.slot_availability sa
    JOIN public.time_slots ts ON sa.time_slot_id = ts.id
    WHERE sa.booking_id = booking_id
    ORDER BY ts.start_time;
    
    RETURN booking_id;
END;
$$ LANGUAGE plpgsql;

-- Enhanced indexes for better performance
CREATE INDEX idx_time_slots_venue_court ON public.time_slots(venue_id, court_id);
CREATE INDEX idx_time_slots_day ON public.time_slots(day_of_week);
CREATE INDEX idx_slot_availability_court_date ON public.slot_availability(court_id, date);
CREATE INDEX idx_slot_availability_booking ON public.slot_availability(booking_id);
CREATE INDEX idx_booking_slots_booking ON public.booking_slots(booking_id);
CREATE INDEX idx_venue_operating_hours_venue ON public.venue_operating_hours(venue_id);
CREATE INDEX idx_bulk_slot_blocks_venue ON public.bulk_slot_blocks(venue_id);
CREATE INDEX idx_venue_maintenance_venue ON public.venue_maintenance(venue_id);

-- Critical composite indexes for availability queries
CREATE INDEX idx_slot_availability_booking_lookup 
ON public.slot_availability(court_id, date, is_available) 
WHERE is_available = true;

CREATE INDEX idx_bookings_date_status 
ON public.bookings(booking_date, status) 
INCLUDE (user_id, venue_id, total_amount);

-- Covering indexes for common queries
CREATE INDEX idx_venues_location_active 
ON public.venues(location_id, is_active) 
INCLUDE (name, rating, base_price_per_slot);

-- Partial indexes for performance
CREATE INDEX idx_payments_pending 
ON public.payments(created_at) 
WHERE status = 'pending';

-- Pricing rules indexes
CREATE INDEX idx_pricing_rules_venue_court 
ON public.pricing_rules(venue_id, court_id, is_active);

CREATE INDEX idx_pricing_rules_date_range 
ON public.pricing_rules(valid_from, valid_to, is_active);

-- Slot reservations indexes
CREATE INDEX idx_slot_reservations_court_date 
ON public.slot_reservations(court_id, date, status);

CREATE INDEX idx_slot_reservations_expires 
ON public.slot_reservations(expires_at) 
WHERE status = 'reserved';

-- Analytics indexes
CREATE INDEX idx_daily_venue_metrics_venue_date 
ON public.daily_venue_metrics(venue_id, date);

CREATE INDEX idx_user_activity_logs_user_activity 
ON public.user_activity_logs(user_id, activity_type, created_at);

CREATE INDEX idx_revenue_recognition_venue_date 
ON public.revenue_recognition(venue_id, recognition_date);

-- Audit logs indexes
CREATE INDEX idx_audit_logs_table_record 
ON public.audit_logs(table_name, record_id, created_at);

CREATE INDEX idx_audit_logs_user_created 
ON public.audit_logs(user_id, created_at);

-- Payment system indexes
CREATE INDEX idx_payment_gateways_active ON public.payment_gateways(is_active);
CREATE INDEX idx_payment_methods_gateway ON public.payment_methods(gateway_id);
CREATE INDEX idx_payment_methods_active ON public.payment_methods(is_active);
CREATE INDEX idx_payments_booking ON public.payments(booking_id);
CREATE INDEX idx_payments_gateway ON public.payments(gateway_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_reference ON public.payments(payment_reference);
CREATE INDEX idx_payments_gateway_payment_id ON public.payments(gateway_payment_id);
CREATE INDEX idx_payments_created_at ON public.payments(created_at);
CREATE INDEX idx_payment_webhooks_payment ON public.payment_webhooks(payment_id);
CREATE INDEX idx_payment_webhooks_gateway ON public.payment_webhooks(gateway_id);
CREATE INDEX idx_payment_webhooks_type ON public.payment_webhooks(webhook_type);
CREATE INDEX idx_payment_webhooks_status ON public.payment_webhooks(processing_status);
CREATE INDEX idx_refunds_payment ON public.refunds(payment_id);
CREATE INDEX idx_refunds_reference ON public.refunds(refund_reference);
CREATE INDEX idx_refunds_status ON public.refunds(status);
CREATE INDEX idx_refunds_created_by ON public.refunds(created_by);

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON public.cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON public.sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON public.venues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courts_updated_at BEFORE UPDATE ON public.courts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_game_types_updated_at BEFORE UPDATE ON public.game_types FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_gateways_updated_at BEFORE UPDATE ON public.payment_gateways FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refunds_updated_at BEFORE UPDATE ON public.refunds FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON public.coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_time_slots_updated_at BEFORE UPDATE ON public.time_slots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venue_operating_hours_updated_at BEFORE UPDATE ON public.venue_operating_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_slot_availability_updated_at BEFORE UPDATE ON public.slot_availability FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bulk_slot_blocks_updated_at BEFORE UPDATE ON public.bulk_slot_blocks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_venue_maintenance_updated_at BEFORE UPDATE ON public.venue_maintenance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pricing_rules_updated_at BEFORE UPDATE ON public.pricing_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_venue_metrics_updated_at BEFORE UPDATE ON public.daily_venue_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Audit logging function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, operation, old_values, user_id)
        VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD), auth.uid());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO public.audit_logs (table_name, record_id, operation, old_values, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD), row_to_json(NEW), auth.uid());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO public.audit_logs (table_name, record_id, operation, new_values, user_id)
        VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(NEW), auth.uid());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_bookings_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_payments_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.payments 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_slot_availability_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.slot_availability 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_venues_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.venues 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_pricing_rules_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.pricing_rules 
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Business logic triggers and functions

-- Function to automatically update venue rating when review is added/updated
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update venue rating and total reviews
    UPDATE public.venues 
    SET 
        rating = (
            SELECT ROUND(AVG(rating)::DECIMAL, 1)
            FROM public.reviews 
            WHERE venue_id = NEW.venue_id AND is_verified = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM public.reviews 
            WHERE venue_id = NEW.venue_id AND is_verified = true
        )
    WHERE id = NEW.venue_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_venue_rating_trigger 
    AFTER INSERT OR UPDATE OR DELETE ON public.reviews 
    FOR EACH ROW EXECUTE FUNCTION update_venue_rating();

-- Function to automatically update booking status when payment is completed
CREATE OR REPLACE FUNCTION update_booking_on_payment()
RETURNS TRIGGER AS $$
BEGIN
    -- If payment is completed, confirm the booking
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.bookings 
        SET 
            status = 'confirmed',
            payment_status = 'completed'
        WHERE id = NEW.booking_id;
    END IF;
    
    -- If payment is failed, keep booking as pending
    IF NEW.status = 'failed' AND OLD.status != 'failed' THEN
        UPDATE public.bookings 
        SET payment_status = 'failed'
        WHERE id = NEW.booking_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_booking_on_payment_trigger 
    AFTER UPDATE ON public.payments 
    FOR EACH ROW EXECUTE FUNCTION update_booking_on_payment();

-- Function to automatically update payment refund amount when refund is processed
CREATE OR REPLACE FUNCTION update_payment_refund_amount()
RETURNS TRIGGER AS $$
BEGIN
    -- If refund is completed, update payment refund amount
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.payments 
        SET 
            refund_amount = refund_amount + NEW.amount,
            refunded_at = CASE 
                WHEN refund_amount + NEW.amount >= amount THEN NOW()
                ELSE refunded_at
            END,
            status = CASE 
                WHEN refund_amount + NEW.amount >= amount THEN 'refunded'
                ELSE 'partially_refunded'
            END
        WHERE id = NEW.payment_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_payment_refund_amount_trigger 
    AFTER UPDATE ON public.refunds 
    FOR EACH ROW EXECUTE FUNCTION update_payment_refund_amount();

-- Function to validate slot availability before booking (DEPRECATED - use book_slots_atomic instead)
CREATE OR REPLACE FUNCTION validate_slot_availability()
RETURNS TRIGGER AS $$
DECLARE
    slot_count INTEGER;
    required_slots INTEGER;
BEGIN
    -- Check if all required slots are available
    SELECT COUNT(*) INTO slot_count
    FROM public.slot_availability sa
    JOIN public.time_slots ts ON sa.time_slot_id = ts.id
    WHERE sa.court_id = NEW.court_id 
    AND sa.date = NEW.booking_date
    AND sa.is_available = true
    AND ts.start_time >= NEW.start_time
    AND ts.end_time <= NEW.end_time;
    
    required_slots := NEW.total_slots;
    
    IF slot_count < required_slots THEN
        RAISE EXCEPTION 'Not enough available slots for booking. Required: %, Available: %. Use book_slots_atomic() function for atomic booking.', required_slots, slot_count;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger is kept for backward compatibility but should be replaced with book_slots_atomic()
CREATE TRIGGER validate_slot_availability_trigger 
    BEFORE INSERT ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION validate_slot_availability();

-- Function to automatically create slot availability records
CREATE OR REPLACE FUNCTION create_slot_availability()
RETURNS TRIGGER AS $$
DECLARE
    slot_record RECORD;
BEGIN
    -- Create availability records for all time slots for the booking date
    FOR slot_record IN 
        SELECT ts.id as time_slot_id
        FROM public.time_slots ts
        WHERE ts.court_id = NEW.court_id
        AND ts.day_of_week = EXTRACT(DOW FROM NEW.booking_date)
        AND ts.is_active = true
        AND ts.start_time >= NEW.start_time
        AND ts.end_time <= NEW.end_time
    LOOP
        INSERT INTO public.slot_availability (court_id, date, time_slot_id, is_available, booking_id)
        VALUES (NEW.court_id, NEW.booking_date, slot_record.time_slot_id, false, NEW.id)
        ON CONFLICT (court_id, date, time_slot_id) 
        DO UPDATE SET 
            is_available = false,
            booking_id = NEW.id,
            updated_at = NOW();
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_slot_availability_trigger 
    AFTER INSERT ON public.bookings 
    FOR EACH ROW EXECUTE FUNCTION create_slot_availability();
-- Row Level Security (RLS) Policies
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_operating_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_slot_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slot_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_venue_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_recognition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
-- Note: admin_users RLS is disabled to avoid circular dependency

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Public read access for reference data
CREATE POLICY "Anyone can view active cities" ON public.cities FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active locations" ON public.locations FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active sports" ON public.sports FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active venues" ON public.venues FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active courts" ON public.courts FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active game types" ON public.game_types FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active time slots" ON public.time_slots FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view venue operating hours" ON public.venue_operating_hours FOR SELECT USING (true);
CREATE POLICY "Anyone can view slot availability" ON public.slot_availability FOR SELECT USING (true);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

-- Booking slots policies
CREATE POLICY "Users can view their own booking slots" ON public.booking_slots FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = booking_slots.booking_id AND bookings.user_id = auth.uid())
);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = payments.booking_id AND bookings.user_id = auth.uid())
);

-- Payment gateways and methods - public read access
CREATE POLICY "Anyone can view active payment gateways" ON public.payment_gateways FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active payment methods" ON public.payment_methods FOR SELECT USING (is_active = true);

-- Coupons policies
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT USING (is_active = true AND valid_from <= NOW() AND valid_to >= NOW());

-- Coupon usage policies
CREATE POLICY "Users can view their own coupon usage" ON public.coupon_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create coupon usage" ON public.coupon_usage FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Anyone can view verified reviews" ON public.reviews FOR SELECT USING (is_verified = true);
CREATE POLICY "Users can create reviews for their bookings" ON public.reviews FOR INSERT WITH CHECK (
    auth.uid() = user_id AND 
    EXISTS (SELECT 1 FROM public.bookings WHERE bookings.id = reviews.booking_id AND bookings.user_id = auth.uid() AND bookings.status = 'completed')
);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Admin policies (only for admin users)
-- Note: admin_users table has RLS disabled to avoid circular dependency
CREATE POLICY "Admin users can manage all data" ON public.cities FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage all locations" ON public.locations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage all sports" ON public.sports FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage venues" ON public.venues FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage courts" ON public.courts FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage game types" ON public.game_types FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage time slots" ON public.time_slots FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage venue operating hours" ON public.venue_operating_hours FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage slot availability" ON public.slot_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage bulk slot blocks" ON public.bulk_slot_blocks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage venue maintenance" ON public.venue_maintenance FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can view all bookings" ON public.bookings FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can update bookings" ON public.bookings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can view all payments" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage payment gateways" ON public.payment_gateways FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage payment methods" ON public.payment_methods FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can view payment webhooks" ON public.payment_webhooks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage refunds" ON public.refunds FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage coupons" ON public.coupons FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can view communication logs" ON public.communication_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Pricing rules policies
CREATE POLICY "Anyone can view active pricing rules" ON public.pricing_rules FOR SELECT USING (is_active = true);

-- Slot reservations policies
CREATE POLICY "Users can view their own reservations" ON public.slot_reservations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create reservations" ON public.slot_reservations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own reservations" ON public.slot_reservations FOR UPDATE USING (auth.uid() = user_id);

-- Daily venue metrics policies (admin only)
CREATE POLICY "Admin users can view daily venue metrics" ON public.daily_venue_metrics FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- User activity logs policies
CREATE POLICY "Users can view their own activity logs" ON public.user_activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own activity logs" ON public.user_activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Revenue recognition policies (admin only)
CREATE POLICY "Admin users can view revenue recognition" ON public.revenue_recognition FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Audit logs policies (admin only)
CREATE POLICY "Admin users can view audit logs" ON public.audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

-- Admin policies for new tables
CREATE POLICY "Admin users can manage pricing rules" ON public.pricing_rules FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage slot reservations" ON public.slot_reservations FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage daily venue metrics" ON public.daily_venue_metrics FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage user activity logs" ON public.user_activity_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage revenue recognition" ON public.revenue_recognition FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);

CREATE POLICY "Admin users can manage audit logs" ON public.audit_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE admin_users.user_id = auth.uid() AND admin_users.is_active = true)
);
