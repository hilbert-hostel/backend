#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
branch=${TRAVIS_BRANCH//\//-}
docker build -t $DOCKER_REPO .
                        
if [ $TRAVIS_BRANCH == "master" ]
then
    docker tag $DOCKER_REPO $DOCKER_USER/$DOCKER_REPO:latest
    docker push $DOCKER_USER/$DOCKER_REPO:latest
else 
    docker tag $DOCKER_REPO $DOCKER_USER/$DOCKER_REPO:$branch-$TRAVIS_BUILD_NUMBER
    docker push $DOCKER_USER/$DOCKER_REPO:$branch-$TRAVIS_BUILD_NUMBER
    docker tag $DOCKER_REPO $DOCKER_USER/$DOCKER_REPO:$branch-latest
    docker push $DOCKER_USER/$DOCKER_REPO:$branch-latest
fi