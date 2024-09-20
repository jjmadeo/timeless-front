import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const MapComponent = ({ onPlaceSelected }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setSelectedPosition(location);
        onPlaceSelected(place);
      } else {
        console.error('El lugar seleccionado no tiene información de ubicación.');
      }
    }
  };

  return (
    <LoadScript
      //googleMapsApiKey="AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc" 
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={selectedPosition || { lat: -34.603722, lng: -58.381592 }} 
        zoom={14}
      >
        {selectedPosition && <Marker position={selectedPosition} />}
        <Autocomplete
          onLoad={(autocomplete) => setAutocomplete(autocomplete)}
          onPlaceChanged={handlePlaceChanged}
        >
          <input 
            type="text" 
            placeholder="Busca un servicio..." 
            style={{ width: '300px', padding: '10px', position: 'absolute', top: '10px', left: '10px', zIndex: 1 }} 
          />
        </Autocomplete>
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;