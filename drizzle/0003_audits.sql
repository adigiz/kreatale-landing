-- Website audits: public lead-magnet runs and audits the team makes for outreach. Each has a
-- private share token for its report page, trimmed results, and view tracking.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token varchar(32) NOT NULL UNIQUE,
  url text NOT NULL,
  host varchar(255) NOT NULL,
  status varchar(10) NOT NULL DEFAULT 'queued'
    CHECK (status IN ('queued','running','done','failed')),
  origin varchar(10) NOT NULL DEFAULT 'admin' CHECK (origin IN ('public','admin')),
  requester_email varchar(200),
  requester_name varchar(160),
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  prepared_for varchar(160),
  scores jsonb,
  vitals jsonb,
  checks jsonb,
  fixes jsonb,
  overall integer,
  error text,
  ip_hash varchar(64),
  attempts integer NOT NULL DEFAULT 0,
  views integer NOT NULL DEFAULT 0,
  first_viewed_at timestamptz,
  last_viewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz
);
CREATE INDEX IF NOT EXISTS audits_created_idx ON audits (created_at DESC);
CREATE INDEX IF NOT EXISTS audits_host_idx ON audits (host, created_at DESC);
CREATE INDEX IF NOT EXISTS audits_deal_idx ON audits (deal_id);
CREATE INDEX IF NOT EXISTS audits_pending_idx ON audits (status) WHERE status IN ('queued','running');
