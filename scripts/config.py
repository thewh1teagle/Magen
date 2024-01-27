from pathlib import Path

ROOT = (Path(__file__) / "../..").resolve()
CORE_PATH = ROOT / 'core'
SERVER_PATH = CORE_PATH / 'server'
TELEGRAM_BOT_PATH = ROOT / 'apps/telegram-bot'


MAGEN_DOCKER_USER = 'thewh1teagle'
MAGEN_MOBILE_API_IMAGE = 'magen-api'
MAGEN_SRV_IMAGE = 'magen-srv'