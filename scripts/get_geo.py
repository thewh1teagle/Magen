import requests
from pathlib import Path
import json
from tqdm import tqdm


WEB_PATH = Path(__file__).parent / '../web'
CITIES_PATH = WEB_PATH / 'src/assets/cities.json'
POLYGONS_PATH = WEB_PATH / 'src/assets/geo_data.json'

headers = {
    'authority': 'nominatim.openstreetmap.org',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'accept-language': 'en-US,en;q=0.5',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
}

def get_poly(loc: str):
    params = {
        'q': loc,
        'polygon_geojson': '1',
        'dedupe': '0',
        'format': 'jsonv2',
    }

    response = requests.get('https://nominatim.openstreetmap.org/search.php', params=params, headers=headers)
    response.raise_for_status()
    data = response.json()
    if len(data) and isinstance(data[0], dict):
        return data[0].get('geojson', None)
    

# def reverse_coordinates(coordinates: list):
#     for i in range(len(coordinates)):
#         if len(coordinates[i]) == 2:
#             coordinates[i] = [coordinates[i][1], coordinates[i][0]]
#         else:
#             coordinates[i] = reverse_coordinates(coordinates[i])
#     return coordinates

if __name__ == '__main__':
    data = {}
    with CITIES_PATH.open('r', encoding='utf-8') as f:
        cities = json.load(f)
    for city in tqdm(cities):
        name = city['name']
        geo_json = get_poly(name)
        if geo_json:
            data[name] = geo_json
    with POLYGONS_PATH.open('w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)