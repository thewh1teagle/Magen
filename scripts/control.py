import sys
from pathlib import Path
import subprocess
from typing import List
import config
from common import success, error, run

ACTION = sys.argv[1].lower()

def refresh_cert():
    run([
        'docker compose run --rm certbot',
        'docker compose exec nginx nginx -s reload'
    ], cwd=config.SERVER_PATH)

if ACTION == 'refresh':
    refresh_cert()

