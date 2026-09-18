CREATE TABLE IF NOT EXISTS schema_migrations (
 version TEXT PRIMARY KEY, checksum TEXT NOT NULL,
 applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE games (
 id TEXT PRIMARY KEY, simulation_id TEXT NOT NULL, config_version TEXT NOT NULL,
 config_hash TEXT NOT NULL, config_snapshot TEXT NOT NULL, active_round INTEGER NOT NULL,
 status TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE teams (
 id TEXT PRIMARY KEY, game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
 name TEXT NOT NULL, members TEXT NOT NULL, current_state TEXT NOT NULL, outcome TEXT,
 round_narratives TEXT NOT NULL DEFAULT '[]'
);
CREATE TABLE submissions (
 id TEXT PRIMARY KEY, game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
 team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE, round INTEGER NOT NULL,
 payload TEXT NOT NULL, submitter TEXT NOT NULL, submitted_at TEXT NOT NULL,
 config_version TEXT NOT NULL, config_hash TEXT NOT NULL,
 kind TEXT NOT NULL DEFAULT 'submitted', corrections TEXT NOT NULL DEFAULT '[]',
 UNIQUE(team_id,round)
);
CREATE TABLE round_results (
 team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
 round INTEGER NOT NULL, result TEXT NOT NULL, PRIMARY KEY(team_id,round)
);
CREATE TABLE state_history (
 team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
 round INTEGER NOT NULL, state TEXT NOT NULL, PRIMARY KEY(team_id,round)
);
CREATE TABLE transcripts (
 id TEXT PRIMARY KEY, game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
 team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE, round INTEGER NOT NULL,
 actor_type TEXT NOT NULL, actor_id TEXT NOT NULL, user_message TEXT NOT NULL,
 actor_reply TEXT NOT NULL, timestamp TEXT NOT NULL, context_hash TEXT NOT NULL,
 storage_order BIGINT GENERATED ALWAYS AS IDENTITY
);
CREATE TABLE artifacts (
 id TEXT NOT NULL, team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
 round INTEGER NOT NULL, type TEXT NOT NULL, student_content TEXT NOT NULL,
 hidden_metadata TEXT NOT NULL, artifact_json TEXT, PRIMARY KEY(team_id,id)
);
