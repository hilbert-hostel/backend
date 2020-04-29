#! /bin/bash

export NODE_ENV=$1
dev="dev"
if [ "$1" == "$dev" ]
then
echo "yee"
docker-compose up -d db
sleep 5
fi
docker-compose -f docker-compose.setup.yml up --build
if [ "$1" == "$dev" ]
then
docker-compose down db
fi