CREATE INDEX games_created_at_idx ON games(created_at COLLATE "C" DESC);
CREATE INDEX teams_game_id_idx ON teams(game_id,id COLLATE "C");
CREATE INDEX submissions_game_id_idx ON submissions(game_id);
CREATE INDEX transcripts_game_id_idx ON transcripts(game_id);
CREATE INDEX transcripts_team_timestamp_idx ON transcripts(team_id,timestamp COLLATE "C",storage_order);
