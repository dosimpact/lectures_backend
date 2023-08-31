#!/bin/bash

IMAGE_NAME="next-ssg-blog" # 이미지 이름
IMAGE_TAG="latest" # 이미지 태그

docker run -it --rm -p 3000:3000 --name next-1 "$IMAGE_NAME:$IMAGE_TAG"

# 성공 메시지 출력
echo "docker build complete : $IMAGE_NAME:$IMAGE_TAG"


# pre-run
# chmod +x preview-next.sh

# run
# ./script/preview-next.sh
