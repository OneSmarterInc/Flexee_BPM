-- Existing NULL codes keep the legacy access-code algorithm unchanged.
ALTER TABLE teams ADD COLUMN access_code TEXT;
ALTER TABLE teams ADD CONSTRAINT teams_access_code_format
 CHECK (access_code IS NULL OR access_code ~ '^[A-HJ-NP-Z2-9]{6}$');
CREATE UNIQUE INDEX teams_game_access_code ON teams(game_id,access_code)
 WHERE access_code IS NOT NULL;
