#!/bin/bash

set -e

echo "syntax: ...sh version 'start|push'"

if [ -z "$1" ]
then
      echo "provide target version for this build"
      exit 18
fi

echo 'building keycloak - core docker container with version ' $1;

./set-version.sh $1

mvn clean install -DskipTests -DskipExamples -DskipTestsuite

cd quarkus/container

cp '../../quarkus/dist/target/keycloak-'$1'.tar.gz' ./

docker build --build-arg KEYCLOAK_DIST=keycloak-$1.tar.gz . -t registry1.intra.prime-sign.com/tc-dev/keycloak:$1

if [[ "$2" == "start" ]]
then
  docker run --rm -p 8080:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin registry1.intra.prime-sign.com/tc-dev/keycloak:$1 start-dev
fi

if [[ "$2" == "push" ]]
then
  docker push registry1.intra.prime-sign.com/tc-dev/keycloak:$1
fi


