import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import { useAlerts } from "../hooks/useAlerts";
import { polygonsJson } from "../../../data/src/lib";

// fix leaflet icon loading
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconAnchor: [14, 42],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function InteractiveMap() {
  const {alerts} = useAlerts()

  const mapURL = import.meta.env.VITE_MAP_TILE_URL
  const mapSubdomains = import.meta.env.VITE_MAP_SUBDOMAINS ? import.meta.env.VITE_MAP_SUBDOMAINS.split(',') : []
  return (
    <>
      <div className="attribution absolute bottom-0 right-0 z-[1000] p-0.5 px-2 bg-white  text-black rounded-tl-lg">
         <a href="https://maps.google.com">Google Maps</a> &copy;
      </div>
      <MapContainer
        minZoom={7}
        
        center={[31.4146683,35.1156254]}
        zoom={8}
        scrollWheelZoom={true}
        zoomAnimation={true}
        attributionControl={false}
      >
        <TileLayer
          url={mapURL}
          subdomains={mapSubdomains}
        />
        {alerts.map((alert) => {
          if (alert.city) {
            return (
              <Marker
                key={alert.timestamp.getTime() + alert.name}
                position={[alert.city.lat, alert.city.lng]}
              />
            );
          }
        })}
        {alerts.map((alert) => {
          
          if (alert.city) {
            
            const polygon = polygonsJson?.[alert.city.id.toString()]
            if (polygon) {
              return (
                <Polygon
                  key={alert.timestamp.getTime() + alert.name}
                  positions={polygon}
                  color="red"
                />
              );
            }
          }
        })}
      </MapContainer>
    </>
  );
}
