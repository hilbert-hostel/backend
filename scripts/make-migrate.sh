#! /bin/bash

yarn knex migrate:make $1 -x ts --cwd ./src