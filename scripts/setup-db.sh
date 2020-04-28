#! /bin/bash

yarn
./scripts/migrate.sh latest
./scripts/seed.sh