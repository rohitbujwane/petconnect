import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { LostPet, FoundPet } from '../../types';
import { Phone, Calendar, MapPin, AlertCircle, HeartHandshake } from 'lucide-react';

// Fix Leaflet's default marker icon issue in Vite/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

const lostIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foundIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LostFoundMapProps {
  lostPets: LostPet[];
  foundPets: FoundPet[];
  onClaimClick: (report: LostPet | FoundPet, type: 'Lost' | 'Found') => void;
}

export const LostFoundMap: React.FC<LostFoundMapProps> = ({ lostPets, foundPets, onClaimClick }) => {
  // Center roughly on Maharashtra (around Pune/Mumbai/Nanded)
  const defaultCenter: [number, number] = [18.9, 75.0];

  return (
    <div className="w-full h-[520px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Lost Pets Markers (Red) */}
        {lostPets.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.coordinates.lat, pet.coordinates.lng]}
            icon={lostIcon}
          >
            <Popup>
              <div className="p-1 max-w-[240px] text-slate-800">
                <div className="flex items-center space-x-1.5 mb-2">
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    LOST PET
                  </span>
                  <span className="text-xs font-bold truncate">{pet.petName}</span>
                </div>

                <img
                  src={pet.images[0]}
                  alt={pet.petName}
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />

                <p className="text-xs text-slate-600 mb-1">
                  <strong>Breed:</strong> {pet.breed} ({pet.species})
                </p>

                <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{pet.lastSeenLocation}, {pet.city}</span>
                </p>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${pet.contactPhone}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Guardian ({pet.contactPhone})</span>
                  </a>

                  <button
                    onClick={() => onClaimClick(pet, 'Lost')}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    "I Found This Pet"
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Found Pets Markers (Green) */}
        {foundPets.map((pet) => (
          <Marker
            key={pet.id}
            position={[pet.coordinates.lat, pet.coordinates.lng]}
            icon={foundIcon}
          >
            <Popup>
              <div className="p-1 max-w-[240px] text-slate-800">
                <div className="flex items-center space-x-1.5 mb-2">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    FOUND PET
                  </span>
                  <span className="text-xs font-bold truncate">{pet.species}</span>
                </div>

                <img
                  src={pet.images[0]}
                  alt="Found Pet"
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />

                <p className="text-xs text-slate-600 mb-1">
                  <strong>Likely Breed:</strong> {pet.approximateBreed}
                </p>

                <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">{pet.locationFound}, {pet.city}</span>
                </p>

                <div className="space-y-1 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${pet.contactPhone}`}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Finder ({pet.contactPhone})</span>
                  </a>

                  <button
                    onClick={() => onClaimClick(pet, 'Found')}
                    className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors"
                  >
                    "This May Be My Pet"
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
