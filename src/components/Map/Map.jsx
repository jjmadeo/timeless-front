import { useState, useEffect } from 'react';
import { GoogleMap, LoadScriptNext, MarkerF} from '@react-google-maps/api';

const MapComponent = ({ location }) => {
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    console.log(location);
    setSelectedPosition(location);
  }, [location]);

  return (
    <LoadScriptNext
      googleMapsApiKey="AIzaSyAZ6rhipfSVaz-41Jn4vv-MgEDd87n4Zkc" 
      libraries={['places']}
    >
      <GoogleMap
        mapContainerStyle={{ height: '400px', width: '100%' }}
        center={selectedPosition} 
        zoom={14}
      >
        {selectedPosition && <MarkerF position={selectedPosition} />}

      </GoogleMap>
    </LoadScriptNext>
  );
};

export default MapComponent;