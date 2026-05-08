import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Webcam } from '../data/webcams';

interface MapProps {
  webcams: Webcam[];
  onMarkerClick: (cam: Webcam) => void;
  selectedCamId: string | null;
}

export default function Map({ webcams, onMarkerClick, selectedCamId }: MapProps) {
  const center = { lat: 37.7946, lng: -122.42 };

  const createIcon = (isSelected: boolean, type: string) => {
    let html = `
      <div style="position: relative; width: 1.5rem; height: 1.5rem; outline: none;">
        <div class="absolute inset-0 rounded-full border-4 border-slate-950 shadow-lg ${
          isSelected 
          ? 'bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-[bounce_1s_infinite]' 
          : 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]'
        } transition-all duration-300"></div>
        ${isSelected ? `<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/50 blur-[2px] rounded-full"></div>` : ''}
      </div>
    `;

    return divIcon({
      html,
      className: 'bg-transparent border-none', // remove default leaflet backgrounds
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={center}
        zoom={12}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {webcams.map((cam) => {
           const isSelected = cam.id === selectedCamId;
           return (
             <Marker
               key={cam.id}
               position={[cam.lat, cam.lng]}
               icon={createIcon(isSelected, cam.type)}
               eventHandlers={{
                 click: () => onMarkerClick(cam),
               }}
             >
               <Popup>
                 <div className="text-slate-900">
                   <p className="font-bold">{cam.name}</p>
                   <p className="text-xs uppercase">{cam.type}</p>
                 </div>
               </Popup>
             </Marker>
           );
        })}
      </MapContainer>
    </div>
  );
}
