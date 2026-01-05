// components/MapView.tsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

type MapViewProps = {
  location: { lat: number; lng: number };
  address: string;
  onClose: () => void;
};

const MapView: React.FC<MapViewProps> = ({ location, address, onClose }) => {
  const { lat, lng } = location;
  const position = [lat, lng];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <MapContainer center={position} zoom={15} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>{address}</Popup>
          </Marker>
        </MapContainer>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MapView;
