#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
docker build -t hilbert-backend .
                        
if [ $TRAVIS_BRANCH == "master" ]
then
    docker tag hilbert-backend $DOCKER_USER/hilbert-backend:latest
    docker push $DOCKER_USER/hilbert-backend:latest
else 
    docker tag hilbert-backend $DOCKER_USER/hilbert-backend:$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER
    docker push $DOCKER_USER/hilbert-backend:$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER
fi