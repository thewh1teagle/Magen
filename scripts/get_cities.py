from pathlib import Path
import requests
import json

URL = 'https://github.com/eladnava/redalert-android/raw/master/app/src/main/res/raw/cities.json'
WEB_PATH = Path(__file__).parent / '../web'
PATH = WEB_PATH / 'src/assets/cities.json'

res = requests.get(URL)
data = res.json()
with PATH.open('wb', encoding='utf-8') as f:
    json.dump(data, f, indent=4, ensure_ascii=False)
