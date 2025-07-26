import React, { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    coordinates: null,
    address: null,
    city: null,
    area: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to get saved location from localStorage
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setLocation(parsedLocation);
      } catch (error) {
        console.error('Error parsing saved location:', error);
      }
    }
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = [longitude, latitude]; // MongoDB format [lng, lat]
          
          try {
            // Reverse geocoding to get address
            const address = await reverseGeocode(latitude, longitude);
            
            const locationData = {
              coordinates,
              address: address.formatted_address,
              city: address.city,
              area: address.area
            };
            
            setLocation(locationData);
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setLoading(false);
            resolve(locationData);
          } catch (error) {
            // Even if reverse geocoding fails, save coordinates
            const locationData = {
              coordinates,
              address: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
              city: 'Unknown',
              area: 'Unknown'
            };
            
            setLocation(locationData);
            localStorage.setItem('userLocation', JSON.stringify(locationData));
            setLoading(false);
            resolve(locationData);
          }
        },
        (error) => {
          setLoading(false);
          setError(error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  const reverseGeocode = async (lat, lng) => {
    // In a real app, you'd use Google Maps Geocoding API
    // For demo purposes, we'll simulate the response
    try {
      // This would normally call Google Maps API
      // const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`);
      
      // Simulated response for Delhi area
      const simulatedResponse = {
        formatted_address: `${lat.toFixed(4)}, ${lng.toFixed(4)}, New Delhi, India`,
        city: 'New Delhi',
        area: lat > 28.6 ? 'North Delhi' : 'South Delhi'
      };
      
      return simulatedResponse;
    } catch (error) {
      throw error;
    }
  };

  const searchLocation = async (query) => {
    try {
      setLoading(true);
      // In a real app, you'd use Google Places API
      // For demo, return some common Delhi locations
      const commonLocations = [
        { name: 'Paharganj Market', coordinates: [77.2090, 28.6448], area: 'Paharganj' },
        { name: 'Karol Bagh', coordinates: [77.1909, 28.6519], area: 'Karol Bagh' },
        { name: 'Lajpat Nagar', coordinates: [77.2431, 28.5687], area: 'Lajpat Nagar' },
        { name: 'Khan Market', coordinates: [77.2265, 28.5983], area: 'Khan Market' },
        { name: 'Connaught Place', coordinates: [77.2167, 28.6315], area: 'Connaught Place' }
      ];
      
      const filtered = commonLocations.filter(loc => 
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.area.toLowerCase().includes(query.toLowerCase())
      );
      
      setLoading(false);
      return filtered;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const setManualLocation = (locationData) => {
    setLocation(locationData);
    localStorage.setItem('userLocation', JSON.stringify(locationData));
  };

  const clearLocation = () => {
    setLocation({
      coordinates: null,
      address: null,
      city: null,
      area: null
    });
    localStorage.removeItem('userLocation');
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  const value = {
    location,
    loading,
    error,
    hasLocation: !!location.coordinates,
    getCurrentLocation,
    searchLocation,
    setManualLocation,
    clearLocation,
    calculateDistance
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
