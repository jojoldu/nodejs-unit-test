FROM postgres:13-alpine3.17

# Update config with non-durable settings (fsync, synchronous_commit, full_page_writes, max_wal_size)
# See: https://www.postgresql.org/docs/13/non-durability.html
RUN sed -ri "s!^#?(fsync|synchronous_commit|full_page_writes)\s*=\s*\S+.*!\1 = off!" /usr/local/share/postgresql/postgresql.conf.sample
RUN sed -ri "s!^#?(checkpoint_completion_target)\s*=\s*\S+.*!\1 = 0.9!" /usr/local/share/postgresql/postgresql.conf.sample
