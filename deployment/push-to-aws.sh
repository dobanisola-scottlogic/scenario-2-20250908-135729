#!/usr/bin/env bash

###############################################################################
# Helper script to update Docker image and AWS after changes are made.
###############################################################################
# This is currently a work-in-progress, and doesn't work in all scenarios
#   - ECR repository URL is hard-coded
#   - The script relies on the local AWS CLI having been correctly configured
#     with region and login credentials for a user with appropriate permissions
#   - Won't work for clean uploads creating a new AWS CloudFormation stack,
#     as it provides no way to specify the DB password to use

# If you wish to push an image tagged as something other than `latest`, specify
# this as the first parameter:
# ./push-to-aws.sh label

PROJECT_ROOT_DIR="$(dirname "$(dirname "$(readlink -f "$0")")")"

cd "$PROJECT_ROOT_DIR" || exit $?

# Variables
IMAGE_NAME="hackathon-gameserver"
REPOSITORY_PATH="032044580362.dkr.ecr.eu-west-2.amazonaws.com"
FULLY_QUALIFIED_IMAGE_NAME="$REPOSITORY_PATH/$IMAGE_NAME"
IMAGE_VERSION=$(git rev-parse --short HEAD)

IMAGE_TAG=$1
if [ -z "$IMAGE_TAG" ]; then
  IMAGE_TAG="latest"
fi

echo Using image tag: $IMAGE_TAG

aws="cmd \/c aws"

# Pushes the latest version of the image both with the specified tag (default:
# `latest``) and specific version tags
pushImage () {
    docker tag $IMAGE_NAME:latest "$FULLY_QUALIFIED_IMAGE_NAME":$IMAGE_TAG \
        && docker tag $IMAGE_NAME:latest "$FULLY_QUALIFIED_IMAGE_NAME":"$IMAGE_VERSION" \
        && (aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin "$REPOSITORY_PATH") \
        && docker push "$FULLY_QUALIFIED_IMAGE_NAME":$IMAGE_TAG  \
        && docker push "$FULLY_QUALIFIED_IMAGE_NAME":"$IMAGE_VERSION"
}

createRepo () {
    aws ecr create-repository --repository-name $IMAGE_NAME
    echo Created ECR repository: $IMAGE_NAME.
}

# Don't allow pushing of `latest` if there are uncommitted changes
if [ "$IMAGE_TAG" == "latest" ] && [ -n "$(git status --porcelain)" ]; then
  echo "There are uncommitted changes in the repository." >&2
  echo "Please commit them then rerun." >&2
  exit 1
fi

./gradlew check server:dockerBuild || exit $?

echo "Server image: $FULLY_QUALIFIED_IMAGE_NAME:$IMAGE_VERSION"

pushImage
