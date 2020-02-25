#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
branch=${TRAVIS_BRANCH//\//-}
docker build -t $DOKCER_REPO .
                        
if [ $TRAVIS_BRANCH == "master" ]
then
    docker tag $DOKCER_REPO $DOCKER_USER/$DOKCER_REPO:latest
    docker push $DOCKER_USER/$DOKCER_REPO:latest
else 
    docker tag $DOKCER_REPO $DOCKER_USER/$DOKCER_REPO:$branch-$TRAVIS_BUILD_NUMBER
    docker push $DOCKER_USER/$DOKCER_REPO:$branch-$TRAVIS_BUILD_NUMBER
    docker tag $DOKCER_REPO $DOCKER_USER/$DOKCER_REPO:$branch-latest
    docker push $DOCKER_USER/$DOKCER_REPO:$branch-latest
fi