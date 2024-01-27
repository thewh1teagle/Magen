import sys
from pathlib import Path
import subprocess
from typing import List
import config
from common import success, error, run

TARGET = sys.argv[1].lower()


def build_server():
    run(f'docker buildx build --platform linux/amd64 -t {config.MAGEN_SRV_IMAGE} .', cwd=config.CORE_PATH)
    success("Build server")
    # Tag
    run(f'docker tag {config.MAGEN_SRV_IMAGE} {config.MAGEN_DOCKER_USER}/{config.MAGEN_SRV_IMAGE}:latest', cwd=config.CORE_PATH)
    success("Tag server")

    # Push
    run(f'docker push {config.MAGEN_DOCKER_USER}/{config.MAGEN_SRV_IMAGE}', cwd=config.CORE_PATH)
    success("Push server")

if TARGET == 'server':
    build_server()
    success('Success')
