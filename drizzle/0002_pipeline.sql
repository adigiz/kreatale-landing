-- Sales pipeline: every enquiry becomes a deal that moves New → Replied → Call → Proposal →
-- Won / Lost, with a timeline of what happened and reusable reply templates.
-- Safe to run more than once (IF NOT EXISTS / ON CONFLICT / NOT EXISTS guards).

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  name varchar(160) NOT NULL,
  email varchar(200),
  company varchar(160),
  phone varchar(40),
  website text,
  service varchar(40) NOT NULL DEFAULT 'not-sure',
  stage varchar(20) NOT NULL DEFAULT 'new'
    CHECK (stage IN ('new','replied','call','proposal','won','lost')),
  lost_reason varchar(60),
  lost_note text,
  value_amount integer,
  currency char(3) NOT NULL DEFAULT 'USD',
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  source varchar(20) NOT NULL DEFAULT 'manual'
    CHECK (source IN ('contact_form','audit','outreach','referral','manual','imported')),
  next_follow_up_at date,
  first_replied_at timestamptz,
  stage_changed_at timestamptz NOT NULL DEFAULT now(),
  won_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS deals_stage_idx ON deals (stage);
CREATE INDEX IF NOT EXISTS deals_follow_up_idx ON deals (next_follow_up_at) WHERE stage NOT IN ('won','lost');
CREATE INDEX IF NOT EXISTS deals_email_idx ON deals (lower(email));
CREATE INDEX IF NOT EXISTS deals_contact_idx ON deals (contact_id);

CREATE TABLE IF NOT EXISTS deal_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  type varchar(20) NOT NULL
    CHECK (type IN ('enquiry','note','email_sent','whatsapp_sent','auto_reply','stage_change','follow_up_set','audit','audit_viewed')),
  body text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS deal_activities_deal_idx ON deal_activities (deal_id, created_at DESC);

CREATE TABLE IF NOT EXISTS reply_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(120) NOT NULL,
  channel varchar(10) NOT NULL CHECK (channel IN ('email','whatsapp')),
  subject varchar(200),
  body text NOT NULL,
  stage_hint varchar(20),
  sort integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, channel)
);

-- Starter templates. Plain and short, no prices or timelines. Edit them in the admin.
INSERT INTO reply_templates (name, channel, subject, body, stage_hint, sort) VALUES
('First reply', 'email', 'Re: your {{service}} enquiry',
$t$Hi {{firstName}},

Thanks for getting in touch. I've read your message and have a few questions so I can give you a useful answer:

1. Who is it for, and what should they be able to do with it?
2. Is there a design, brand or existing site we'd start from?
3. Is there a date you're working towards?

If it's easier to talk it through, reply with a couple of times that suit you and I'll send a call link.

{{senderFirstName}}
Kreatale$t$, 'new', 10),
('First reply', 'whatsapp', NULL,
$t$Hi {{firstName}}, this is {{senderFirstName}} from Kreatale. Thanks for your message about your {{service}} project. Could we have a quick call this week so I understand what you need? If you'd rather keep it in writing, that works too.$t$, 'new', 20),
('Follow-up, no reply yet', 'email', 'Checking in about your {{service}} project',
$t$Hi {{firstName}},

Just making sure my last message reached you. If now isn't the right time, that's fine. Reply whenever it suits and we'll pick it up from there.

{{senderFirstName}}
Kreatale$t$, 'replied', 30),
('Proposal check-in', 'email', 'Any questions about the plan?',
$t$Hi {{firstName}},

Did you get a chance to look at the plan I sent? I'm happy to walk through any part of it on a call, or change anything that doesn't fit.

{{senderFirstName}}
Kreatale$t$, 'proposal', 40),
('Website audit', 'email', 'A free check of {{website}}',
$t$Hi {{firstName}},

I ran a free check on {{website}} and put the results here:
{{auditUrl}}

It covers how fast the site loads on phones, search basics, and a short list of fixes in plain words. There's nothing to sign up for. If any of it is useful and you'd like a hand with the fixes, just reply.

{{senderFirstName}}
Kreatale$t$, NULL, 50),
('Website audit', 'whatsapp', NULL,
$t$Hi {{firstName}}, I'm {{senderFirstName}} from Kreatale, a small web studio. I ran a free check on {{website}}: {{auditUrl}} It shows speed and search fixes in plain words. Happy to help with any of it if you'd like.$t$, NULL, 60)
ON CONFLICT (name, channel) DO NOTHING;

-- Backfill: one deal per existing enquiry that doesn't have one yet.
--   older than 90 days → lost ("outcome not recorded"), unread → new, read → replied.
WITH src AS (
  SELECT c.*,
    CASE
      WHEN c.created_at < now() - interval '90 days' THEN 'lost'
      WHEN c.read = 'false' THEN 'new'
      ELSE 'replied'
    END AS stage_guess,
    CASE
      WHEN c.inquiry ILIKE '%online store%' THEN 'online-stores'
      WHEN c.inquiry ILIKE '%web app%' THEN 'web-apps'
      WHEN c.inquiry ILIKE '%mobile%' THEN 'mobile-apps'
      WHEN c.inquiry ILIKE '%seo%' THEN 'seo-content'
      WHEN c.inquiry ILIKE '%website%' THEN 'websites'
      ELSE 'not-sure'
    END AS service_guess
  FROM contacts c
  WHERE NOT EXISTS (SELECT 1 FROM deals d WHERE d.contact_id = c.id)
), ins AS (
  INSERT INTO deals (contact_id, name, email, company, phone, service, stage, lost_reason, lost_note,
                     source, stage_changed_at, closed_at, created_at, updated_at)
  SELECT id, left(name, 160), left(email, 200), left(company, 160), left(phone, 40), service_guess, stage_guess,
         CASE WHEN stage_guess = 'lost' THEN 'other' END,
         CASE WHEN stage_guess = 'lost' THEN 'Imported, outcome not recorded' END,
         'contact_form', created_at,
         CASE WHEN stage_guess = 'lost' THEN created_at END,
         created_at, created_at
  FROM src
  RETURNING id, contact_id
)
INSERT INTO deal_activities (deal_id, type, body, meta, created_at)
SELECT ins.id, 'enquiry', c.message, jsonb_build_object('contactId', c.id, 'inquiry', c.inquiry), c.created_at
FROM ins JOIN contacts c ON c.id = ins.contact_id;
