import subprocess
from pathlib import Path
from typing import List

def success(message: str):
    print(f'✅ {message}')

def error(message: str):
    print(f'❌ {message}')

def run(cmd: str | List[str], cwd: str | Path = None):
    cmd = [cmd] if isinstance(cmd, str) else cmd
    for c in cmd:
        subprocess.run(c, check=True, shell=True, cwd=cwd)