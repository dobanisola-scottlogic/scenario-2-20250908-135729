#!/usr/bin/env bash

###############################################################################
# Helper script to update Docker image and AWS after changes are made.
###############################################################################
# This is currently a work-in-progress, and doesn't work in all scenarios
#   - ECR repository URL is hard-coded
#   - The script relies on the local AWS CLI having been correctly configured
#     with region and login credentials for a user with appropriate permissions


PROJECT_ROOT_DIR="$(dirname "$(dirname "$(readlink -f "$0")")")"

cd "$PROJECT_ROOT_DIR" || exit $?

# Variables
IMAGE_NAME="hackathon-contestant"
REPOSITORY_PATH="$1"
FULLY_QUALIFIED_IMAGE_NAME="$REPOSITORY_PATH/$IMAGE_NAME"
IMAGE_VERSION=`git rev-parse --short HEAD`


aws="cmd \/c aws"

# Pushes the latest version of the image both with the `latest` and specific version tags
pushImage () {
    docker tag $IMAGE_NAME:latest $FULLY_QUALIFIED_IMAGE_NAME:latest \
        && docker tag $IMAGE_NAME:latest $FULLY_QUALIFIED_IMAGE_NAME:$IMAGE_VERSION \
        && eval "$(aws ecr get-login --region eu-west-2 --no-include-email)" \
        && docker push $FULLY_QUALIFIED_IMAGE_NAME:latest  \
        && docker push $FULLY_QUALIFIED_IMAGE_NAME:$IMAGE_VERSION
}

createRepo () {
    aws ecr create-repository --repository-name $IMAGE_NAME
    echo Created ECR repository: $IMAGE_NAME.
}

if [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes in the repository." >&2
  echo "Please commit them then rerun." >&2
  exit 1
fi

./gradlew check code-server:dockerBuild || exit $?

echo "Server image: $FULLY_QUALIFIED_IMAGE_NAME:$IMAGE_VERSION"

pushImage

