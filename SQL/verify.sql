-- Read-only. Run with psql -v ON_ERROR_STOP=1. Invalid JSON fails the cast;
-- no functions, tables, repairs, or data are created by this script.
BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY;
WITH expected(name) AS (VALUES ('games'),('teams'),('submissions'),('round_results'),
 ('state_history'),('transcripts'),('artifacts'),('schema_migrations'))
SELECT name AS expected_table,EXISTS(SELECT 1 FROM information_schema.tables
 WHERE table_schema=current_schema() AND table_name=name) AS present FROM expected;

WITH expected(table_name,columns) AS (VALUES
 ('games','id,simulation_id,config_version,config_hash,config_snapshot,active_round,status,created_at'),
 ('teams','id,game_id,name,members,current_state,outcome,round_narratives'),
 ('submissions','id,game_id,team_id,round,payload,submitter,submitted_at,config_version,config_hash,kind,corrections'),
 ('round_results','team_id,round,result'),('state_history','team_id,round,state'),
 ('transcripts','id,game_id,team_id,round,actor_type,actor_id,user_message,actor_reply,timestamp,context_hash,storage_order'),
 ('artifacts','id,team_id,round,type,student_content,hidden_metadata,artifact_json'),
 ('schema_migrations','version,checksum,applied_at'))
SELECT e.table_name,c.column_name,actual.data_type,actual.is_nullable,actual.column_default,
 actual.column_name IS NOT NULL AS present
FROM expected e CROSS JOIN LATERAL unnest(string_to_array(e.columns,',')) c(column_name)
LEFT JOIN information_schema.columns actual ON actual.table_schema=current_schema()
 AND actual.table_name=e.table_name AND actual.column_name=c.column_name
ORDER BY e.table_name,c.column_name;

SELECT t.relname AS table_name,c.conname AS constraint_name,c.contype AS constraint_type,
 pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid
JOIN pg_namespace n ON n.oid=t.relnamespace WHERE n.nspname=current_schema()
ORDER BY t.relname,c.conname;

SELECT 'games' AS table_name,count(*) AS rows FROM games UNION ALL
SELECT 'teams',count(*) FROM teams UNION ALL SELECT 'submissions',count(*) FROM submissions UNION ALL
SELECT 'round_results',count(*) FROM round_results UNION ALL SELECT 'state_history',count(*) FROM state_history UNION ALL
SELECT 'transcripts',count(*) FROM transcripts UNION ALL SELECT 'artifacts',count(*) FROM artifacts;

SELECT 'teams.game_id' AS reference,count(*) AS orphan_count FROM teams t LEFT JOIN games g ON g.id=t.game_id WHERE g.id IS NULL UNION ALL
SELECT 'submissions.game_id',count(*) FROM submissions s LEFT JOIN games g ON g.id=s.game_id WHERE g.id IS NULL UNION ALL
SELECT 'submissions.team_id',count(*) FROM submissions s LEFT JOIN teams t ON t.id=s.team_id WHERE t.id IS NULL UNION ALL
SELECT 'round_results.team_id',count(*) FROM round_results r LEFT JOIN teams t ON t.id=r.team_id WHERE t.id IS NULL UNION ALL
SELECT 'state_history.team_id',count(*) FROM state_history s LEFT JOIN teams t ON t.id=s.team_id WHERE t.id IS NULL UNION ALL
SELECT 'transcripts.game_id',count(*) FROM transcripts x LEFT JOIN games g ON g.id=x.game_id WHERE g.id IS NULL UNION ALL
SELECT 'transcripts.team_id',count(*) FROM transcripts x LEFT JOIN teams t ON t.id=x.team_id WHERE t.id IS NULL UNION ALL
SELECT 'artifacts.team_id',count(*) FROM artifacts a LEFT JOIN teams t ON t.id=a.team_id WHERE t.id IS NULL;

SELECT team_id,round,count(*) AS duplicates FROM submissions GROUP BY team_id,round HAVING count(*)>1;
-- Also detect independently valid FKs assigned to different games.
SELECT 'submissions' AS table_name,count(*) AS wrong_game FROM submissions s JOIN teams t ON t.id=s.team_id WHERE s.game_id<>t.game_id UNION ALL
SELECT 'transcripts',count(*) FROM transcripts x JOIN teams t ON t.id=x.team_id WHERE x.game_id<>t.game_id;

SELECT 'games.config_snapshot' AS serialized_column,count(config_snapshot::json) AS valid_values FROM games UNION ALL
SELECT 'teams.members',count(members::json) FROM teams UNION ALL
SELECT 'teams.current_state',count(current_state::json) FROM teams UNION ALL
SELECT 'teams.round_narratives',count(round_narratives::json) FROM teams UNION ALL
SELECT 'submissions.payload',count(payload::json) FROM submissions UNION ALL
SELECT 'submissions.corrections',count(corrections::json) FROM submissions UNION ALL
SELECT 'round_results.result',count(result::json) FROM round_results UNION ALL
SELECT 'state_history.state',count(state::json) FROM state_history UNION ALL
SELECT 'artifacts.student_content',count(student_content::json) FROM artifacts UNION ALL
SELECT 'artifacts.hidden_metadata',count(hidden_metadata::json) FROM artifacts UNION ALL
SELECT 'artifacts.artifact_json',count(artifact_json::json) FROM artifacts;
SELECT version,checksum,applied_at FROM schema_migrations ORDER BY version;
COMMIT;
