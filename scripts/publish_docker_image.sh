#! /bin/bash

echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin
branch=${TRAVIS_BRANCH//\//-}
tag_name="$DOCKER_USER/$DOCKER_REPO"
docker build -t $DOCKER_REPO .
                        
if [ $TRAVIS_BRANCH == "dev" ]
then
    docker tag $DOCKER_REPO $tag_name:latest
    docker push $tag_name:latest
else 
    docker tag $DOCKER_REPO $tag_name:$branch-$TRAVIS_BUILD_NUMBER
    docker push $tag_name:$branch-$TRAVIS_BUILD_NUMBER
    docker tag $DOCKER_REPO $tag_name:$branch-latest
    docker push $tag_name:$branch-latest
fi