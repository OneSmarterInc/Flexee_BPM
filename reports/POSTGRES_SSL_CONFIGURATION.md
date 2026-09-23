# PostgreSQL SSL selection

Both `scripts/migrate.ts` and the production server construct `PostgresGameRepository`; its pool is also passed into `migratePostgres`. No migration SQL or schema is changed.

Set backend process variables explicitly. The server and migration script do not automatically load an environment file. Never put credentials into committed examples or frontend variables.

## Local Windows PostgreSQL

With the local `DATABASE_URL` already supplied securely, set `$env:FLEXEE_POSTGRES_SSL = 'disable'` before running `npm.cmd run migrate` and `npm.cmd start`. Build first after source changes. This setting is accepted only for localhost, 127.0.0.1 or ::1, and only when NODE_ENV is not production. Production startup (`npm start`) does not itself set NODE_ENV.

## Render external PostgreSQL

Leave FLEXEE_POSTGRES_SSL unset, or set it to `require`. Both retain the existing deployed `ssl: { rejectUnauthorized: false }` configuration: TLS remains enabled with no plaintext fallback. This deliberately preserves the existing certificate-verification bypass at the user's explicit compatibility requirement; it does not claim authenticated certificate verification. No Render hostname or credentials are embedded.

Do not include SSL parameters (`ssl`, `sslmode`, `sslcert`, `sslkey`, `sslrootcert`) in DATABASE_URL or provide an options.ssl override: conflicting TLS sources are rejected rather than letting pg silently replace the policy. Check this prerequisite before rollout. No deployment is performed by this change.

PostgreSQL integration tests still require a separate TEST_DATABASE_URL satisfying the existing disposable test-database safety rules. Local tests need the same explicit disable setting. Missing database credentials prevent live migration/start/login verification; unit configuration checks do not prove a live Render connection.
