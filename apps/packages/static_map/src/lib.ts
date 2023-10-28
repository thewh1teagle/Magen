import StaticMaps, { StaticMapsOptions } from "staticmaps";
import { citiesJson, polygonsJson } from "../../magen_common_ts/src/lib";
import path from "path";
import { ActiveAlert } from "../../magen_common_ts/src/interfaces";
import Jimp from 'jimp'
import fs from 'fs'

function getAssetPath(asset: string): string {
  return path.resolve(path.dirname(__filename), `assets/${asset}`)
}

function reverseCoordinates(coordinates: any[]): any[] {
  for (let i = 0; i < coordinates.length; i++) {
    if (coordinates[i].length === 2) {
      coordinates[i] = [coordinates[i][1], coordinates[i][0]];
    } else {
      coordinates[i] = reverseCoordinates(coordinates[i]);
    }
  }
  return coordinates;
}


function getBoundingBox(alerts: ActiveAlert[]): [number, number, number, number] {
    if (alerts.length === 0) {
      throw new Error('No alerts provided');
    }
  
    let minLat = alerts[0].city!.lat;
    let maxLat = alerts[0].city!.lat;
    let minLng = alerts[0].city!.lng;
    let maxLng = alerts[0].city!.lng;
  
    for (const alert of alerts) {
      const lat = alert.city!.lat;
      const lng = alert.city!.lng;
  
      if (lat < minLat) {
        minLat = lat;
      } else if (lat > maxLat) {
        maxLat = lat;
      }
  
      if (lng < minLng) {
        minLng = lng;
      } else if (lng > maxLng) {
        maxLng = lng;
      }
    }
  
    // Convert to [minLng, maxLng, minLat, maxLat] format
    return [minLng, maxLng, minLat, maxLat];
  }

function calculateZoomLevel(boundaries: any, mapWidth: any, mapHeight: any) {
    const latDiff = boundaries.maxLat - boundaries.minLat;
    const lngDiff = boundaries.maxLng - boundaries.minLng;
    
    const latZoom = Math.log(360 / latDiff) / Math.LN2;
    const lngZoom = Math.log(360 / lngDiff) / Math.LN2;
    
    const zoom = Math.min(latZoom, lngZoom);
  
    // Adjust the zoom based on the map dimensions
    const mapDim = Math.max(mapWidth, mapHeight);
    const adjustedZoom = zoom - Math.log(mapDim / 256) / Math.LN2;
    
    return adjustedZoom;
  }

async function renderAlerts(alerts: ActiveAlert[]) {
  const options: StaticMapsOptions = {
    width: 640,
    height: 530,
    tileSubdomains: "mt0,mt1,mt2,mt3".split(","),
    tileUrl: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=he",
    zoomRange: {
      max: 11,
      min: 7
    }
  };


  let map: StaticMaps | null = new StaticMaps(options);
  

  const cities = alerts.filter(a => a.city?.lng !== undefined).map((a) => {
    let polygon = polygonsJson?.[a.city!.id].slice()
    polygon = reverseCoordinates(polygon)
    return {
      coord: [a.city!.lng, a.city!.lat],
      polygon,  
    }
  });

  const markerPath = getAssetPath("marker.svg");

  for (const city of cities) {
    const marker: StaticMaps.AddMarkerOptions = {
      img: markerPath,
      offsetX: 13,
      offsetY: 43,
      coord: city.coord as [number, number],
      drawHeight: 40,
      drawWidth: 40,
      height: 50,
      width: 50,
      resizeMode: "inside",
    };

    map.addMarker(marker as any);

    map.addPolygon({
      coords: city.polygon,
      color: "#FF0000",
      width: 3,
      fill: "#FF000060",
    });
  }
  // const boundaries = findBoundaries(alerts);
//   const zoom = calculateZoomLevel(boundaries, 700, 700)
  
  const center = getBoundingBox(alerts);
  
  await map.render(center);
  const buffer = map.image.image.buffer.slice(0)
  return buffer
}



async function JimpRead(path: string | any): Promise<Jimp> {
    return new Promise<Jimp>((resolve, reject) => {
      Jimp.read(path, (err, value) => {
        if (err) {
          reject(err);
        }
        resolve(value);
      });
    });
  }


export async function getAlertsImage(alerts: ActiveAlert[]) {
  const filtered = alerts.filter(a => a.city?.lng !== undefined)
  const image = await renderAlerts(filtered);
  const helloImage = await JimpRead(image)
  
  const logo = await JimpRead(getAssetPath('logo.png'))
  const google = await JimpRead(getAssetPath('google.png'))
  const margin = 10; // Adjust this as needed
  const x = margin;
  const y = margin;

  // Resize the logo if needed (optional)
  logo.cover(80, 80); // Adjust the size as needed

  // Composite the logo onto the main image
  helloImage.composite(logo, x, y);
  const x1 = helloImage.bitmap.width - google.bitmap.width;
  const y1 = helloImage.bitmap.height - google.bitmap.height;

  // Composite the "google.png" onto the main image at the bottom right
  helloImage.composite(google, x1, y1);

  // Save the result as a new image
  return helloImage.getBufferAsync(Jimp.AUTO as any);
}

async function main() {
  const alerts: ActiveAlert[] = [
    {
      is_test: false,
      name: "",
      timestamp: new Date(),
      city: citiesJson?.["ניצן"],
      threat: [] as any,
    },
    {
        is_test: true,
        name: "",
        timestamp: new Date(),
        city: citiesJson?.["אזור תעשייה צפוני אשקלון"],
        threat: [] as any
    }
  ];
  const alerts1: ActiveAlert[] = [
    {
      is_test: false,
      name: "",
      timestamp: new Date(),
      city: citiesJson?.["ניצן"],
      threat: [] as any,
    },
    {
        is_test: true,
        name: "",
        timestamp: new Date(),
        city: citiesJson?.["אזור תעשייה צפוני אשקלון"],
        threat: [] as any
    }
  ];
  const image = await getAlertsImage(alerts)
  fs.writeFileSync('test.png', image)
  await new Promise(resolve => setTimeout(resolve, 5000))
  // await getAlertsImage(alerts1)
  const image1 = await getAlertsImage(alerts1)
  fs.writeFileSync('test.png', image1)
}

// main();
