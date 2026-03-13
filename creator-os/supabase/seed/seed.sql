-- Seed data for Creator OS
-- Run this after creating a user through the app UI
-- Replace USER_ID_HERE with your actual user ID from auth.users

-- To find your user ID after signing up:
-- SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Example seed (uncomment and replace USER_ID_HERE):

/*
-- Brand 1
INSERT INTO public.brands (id, user_id, name, niche, audience, tone_of_voice, monetization_model, cta_style, posting_frequency, content_pillars)
VALUES (
  'b0000001-0000-0000-0000-000000000001',
  'USER_ID_HERE',
  'CreatorGrowth',
  'Creator Economy / Business',
  'Aspiring and early-stage content creators',
  'Direct, motivational, data-driven',
  'Courses, affiliates, coaching',
  'Value-first soft sell',
  'Daily shorts, 2x weekly long-form',
  ARRAY['Growth tactics', 'Monetization', 'Platform algorithms', 'Creator mindset']
);

-- Platform connections
INSERT INTO public.platform_connections (user_id, brand_id, platform, status, platform_username, metadata)
VALUES
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'youtube', 'connected', '@CreatorGrowth', '{"subscribers": 12400}'::jsonb),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'tiktok', 'connected', '@creatorgrowth', '{"followers": 45200}'::jsonb),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'instagram', 'disconnected', NULL, '{}'::jsonb),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'x', 'connected', '@CreatorGrowthHQ', '{"followers": 8300}'::jsonb);

-- Sample ideas
INSERT INTO public.content_ideas (user_id, brand_id, platform, hook, topic, format, target_audience_angle, monetization_angle, status)
VALUES
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'youtube', 'Why 90% of creators fail in year one', 'Common mistakes new creators make', 'Long-form video (10-12 min)', 'New creators feeling overwhelmed', 'Promote creator course affiliate', 'accepted'),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'tiktok', 'I made $10K in 30 days doing this', 'Revenue diversification strategies', 'Short-form video (60s)', 'Creators earning under $1K/month', 'Digital templates pack', 'new'),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'x', 'The algorithm hack nobody talks about', 'Understanding platform recommendation systems', 'Thread (8-10 tweets)', 'Creators struggling with reach', 'Lead gen for coaching waitlist', 'new');

-- Sample analytics (14 days)
INSERT INTO public.analytics (user_id, brand_id, platform, date, views, likes, shares, comments, saves, click_throughs, estimated_earnings)
VALUES
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'youtube', '2025-03-01', 8420, 523, 89, 45, 102, 234, 42.50),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'tiktok', '2025-03-02', 15230, 890, 210, 67, 145, 189, 28.30),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'x', '2025-03-03', 3200, 245, 56, 34, 23, 78, 12.40),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'instagram', '2025-03-04', 6100, 412, 134, 52, 187, 156, 35.20),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'youtube', '2025-03-05', 11250, 678, 123, 89, 156, 312, 68.90),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'tiktok', '2025-03-06', 22100, 1230, 345, 98, 234, 267, 45.60),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'x', '2025-03-07', 4500, 312, 78, 45, 34, 92, 15.80),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'instagram', '2025-03-08', 7800, 534, 167, 63, 212, 178, 41.30),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'youtube', '2025-03-09', 9800, 612, 98, 56, 134, 278, 55.20),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'tiktok', '2025-03-10', 18900, 1100, 289, 87, 198, 234, 38.90),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'x', '2025-03-11', 5200, 378, 92, 51, 45, 112, 18.40),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'instagram', '2025-03-12', 8900, 623, 189, 71, 245, 201, 48.70),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'youtube', '2025-03-13', 13400, 789, 145, 92, 178, 345, 78.30),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'tiktok', '2025-03-14', 25600, 1450, 412, 112, 267, 298, 52.10);

-- Sample monetization links
INSERT INTO public.monetization_links (user_id, brand_id, type, label, url, platform, is_active, metadata)
VALUES
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'affiliate', 'TubeBuddy - YouTube SEO Tool', 'https://example.com/affiliate/tubebuddy', 'youtube', true, '{"commission_rate": "30%"}'::jsonb),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'digital_product', 'Creator Growth Templates Pack', 'https://example.com/products/templates', NULL, true, '{"price": "$29"}'::jsonb),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'sponsorship', 'SkillShare Partnership', 'https://example.com/sponsor/skillshare', 'youtube', true, '{"rate": "$500/video"}'::jsonb),
  ('USER_ID_HERE', 'b0000001-0000-0000-0000-000000000001', 'lead_gen', 'Creator Coaching Waitlist', 'https://example.com/coaching/waitlist', NULL, true, '{"conversions": 143}'::jsonb);

-- Sample revenue entries
INSERT INTO public.revenue_entries (user_id, brand_id, link_id, type, amount, date)
SELECT
  'USER_ID_HERE',
  'b0000001-0000-0000-0000-000000000001',
  NULL,
  (ARRAY['affiliate', 'digital_product', 'sponsorship', 'lead_gen']::link_type[])[1 + (s % 4)],
  round((random() * 200 + 5)::numeric, 2),
  ('2025-02-01'::date + (s || ' days')::interval)::date
FROM generate_series(0, 29) AS s;
*/
