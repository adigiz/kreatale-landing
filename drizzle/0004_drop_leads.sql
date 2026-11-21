-- Removes the Google Maps leads tool's data (the admin tool and scraper service are gone).
-- Run only AFTER the code without the leads tool is deployed, and after a pg_dump backup.
-- Safe to run more than once.
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS locations;
DROP TYPE IF EXISTS lead_status;
