import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker} from '@react-google-maps/api';

const MapComponent = ({ location }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    setSelectedPosition(location);
  }, [location]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc" 
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={selectedPosition || { lat: -34.603722, lng: -58.381592 }} 
        zoom={14}
      >
        {selectedPosition && <Marker position={selectedPosition} />}

      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;