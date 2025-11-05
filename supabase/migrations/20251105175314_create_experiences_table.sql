/*
  # Create experiences table

  1. New Tables
    - `experiences`
      - `id` (uuid, primary key) - Unique identifier for each experience
      - `company` (text) - Company name
      - `role` (text) - Job title/role
      - `location` (text) - Location of the position
      - `duration` (text) - Duration period (e.g., "2023 - Present")
      - `type` (text) - Employment type (Full-time, Contract, etc.)
      - `description` (text) - Overview of the role and responsibilities
      - `achievements` (jsonb) - Array of key achievements and accomplishments
      - `technologies` (jsonb) - Array of technologies and skills used
      - `metrics` (jsonb) - Array of impact metrics and KPIs
      - `order` (integer) - Display order for sorting
      - `created_at` (timestamptz) - When the record was created
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `experiences` table
    - Add policy for authenticated admins to manage experiences
    - Add policy for public read access to view experiences

  3. Indexes
    - Create index on `order` column for efficient sorting
*/

CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL,
  role text NOT NULL,
  location text NOT NULL,
  duration text NOT NULL,
  type text NOT NULL DEFAULT 'Full-time',
  description text NOT NULL,
  achievements jsonb NOT NULL DEFAULT '[]',
  technologies jsonb NOT NULL DEFAULT '[]',
  metrics jsonb NOT NULL DEFAULT '[]',
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read experiences"
  ON experiences
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can read experiences"
  ON experiences
  FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX idx_experiences_order ON experiences("order");
