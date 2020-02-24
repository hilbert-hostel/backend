#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
docker build -t $DOKCER_REPO .
                        
if [ $TRAVIS_BRANCH == "master" ]
then
    docker tag $DOKCER_REPO $DOCKER_USER/$DOKCER_REPO:latest
    docker push $DOCKER_USER/$DOKCER_REPO:latest
else 
    docker tag $DOKCER_REPO $DOCKER_USER/$DOKCER_REPO:$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER
    docker push $DOCKER_USER/$DOKCER_REPO:$TRAVIS_BRANCH-$TRAVIS_BUILD_NUMBER
    docker tag $DOKCER_REPO $DOCKER_USER/$DOKCER_REPO:$TRAVIS_BRANCH-latest
    docker push $DOCKER_USER/$DOKCER_REPO:$TRAVIS_BRANCH-latest
fi