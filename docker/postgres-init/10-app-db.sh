#!/bin/sh
# Legt neben der Keycloak-Datenbank die Anwendungsdatenbank an.
# Eine Postgres-Instanz fuer beide spart einen kompletten Container.
set -eu
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v app_user="$APP_DB_USERNAME" -v app_pass="$APP_DB_PASSWORD" -v app_db="$APP_DB_NAME" <<'SQL'
CREATE USER :"app_user" WITH PASSWORD :'app_pass';
CREATE DATABASE :"app_db" OWNER :"app_user";
SQL
