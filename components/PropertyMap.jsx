'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Spinner from './Spinner';
import pin from '@/assets/images/pin.svg';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: pin,
  iconUrl: pin,
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png',
});

export default function PropertyMap({ property }) {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocodeError, setGeocodeError] = useState(false);

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${property.location.street},${property.location.city},${property.location.state},${property.location.zipcode}&key=${process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY}`
        );
        const data = await res.json();

        if (data.results.length === 0) {
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        const { lat, lng } = data.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
        setLoading(false);
      }
    };

    fetchCoords();
  }, [property.location]);

  if (loading) return <Spinner loading={loading} />;

  if (geocodeError) {
    return <div className='text-xl'>No Location data found</div>;
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
      />
      <Marker position={[lat, lng]}>
        <Popup>
          {property.location.street}, {property.location.city},{' '}
          {property.location.state}
        </Popup>
      </Marker>
    </MapContainer>
  );
}
