import sys
from pathlib import Path
import subprocess
from typing import List
import config

TARGET = sys.argv[1].lower()

def run(cmd: str | List[str], cwd: str | Path = None):
    cmd = [cmd] if isinstance(cmd, str) else cmd
    for c in cmd:
        subprocess.run(c, check=True, shell=True, cwd=cwd)

def build_server():
    run(f'docker build -t server .', cwd=config.CORE_PATH)


if TARGET == 'server':
    build_server()



