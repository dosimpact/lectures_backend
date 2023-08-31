#!/bin/bash

# 도커 이미지 빌드 스크립트
IMAGE_NAME="next-ssg-blog" # 이미지 이름
IMAGE_TAG="latest" # 이미지 태그
DOCKER_FILE_PATH="./deployments/Dockerfile" # 파일경로

# Docker 빌드 명령어 실행
docker build -t "$IMAGE_NAME:$IMAGE_TAG" -f "$DOCKER_FILE_PATH" .

# 성공 메시지 출력
echo "docker build complete : $IMAGE_NAME:$IMAGE_TAG"


# pre-run
# chmod +x build-docker-image.sh

# run
# ./script/build-docker-image.sh
