-- Adds where each enquiry came from (landing page, referrer, UTM tags). Run this on the
-- database before deploying the code that reads contacts.source. Safe to run more than once.
ALTER TABLE "contacts" ADD COLUMN IF NOT EXISTS "source" jsonb;
