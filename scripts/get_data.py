import requests
from pathlib import Path

CITIES_VER = 5
POLY_VER = 3

WEB_PATH = Path(__file__).parent / '../web'
CITIES_PATH = WEB_PATH / 'src/assets/cities.json'
POLYGONS_PATH = WEB_PATH / 'src/assets/polygons.json'

headers = {
    'authority': 'www.tzevaadom.co.il',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9,he-IL;q=0.8,he;q=0.7',
    'referer': 'https://www.tzevaadom.co.il/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
}

def get_cities(version: int):
    response = requests.get(f'https://www.tzevaadom.co.il/static/cities.json?v={version}', headers=headers)
    response.raise_for_status()
    return response.content

def get_polygons(version: int):
    response = requests.get(f'https://www.tzevaadom.co.il/static/polygons.json?v={version}', headers=headers)
    response.raise_for_status()
    return response.content

if __name__ == '__main__':
    cities = get_cities(CITIES_VER)
    polygons = get_polygons(POLY_VER)
    with CITIES_PATH.open('wb') as f:
        f.write(cities)
    with POLYGONS_PATH.open('wb') as f:
        f.write(polygons)