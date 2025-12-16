"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  GoogleMap,
  Marker,
  useLoadScript,
  StandaloneSearchBox,
} from "@react-google-maps/api";

const libraries = ["places"] as const;

interface Props {
  lat: number;
  lng: number;
  onLocationSelect: (
    lat: number,
    lng: number,
    pincode: string,
    address: string
  ) => void;
}

const LocationPickerMap = ({ lat, lng, onLocationSelect }: Props) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: libraries as any,
  });

  const [center, setCenter] = useState({ lat, lng });
  const [marker, setMarker] = useState({ lat, lng });
  const searchBoxRef = useRef<any>(null);

  useEffect(() => {
    setCenter({ lat, lng });
    setMarker({ lat, lng });
  }, [lat, lng]);

  // --------------------------
  // Reverse Geocode Function
  // --------------------------
  const fetchAddressFromLatLng = async (lat: number, lng: number) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    const res = await fetch(url);
    const data = await res.json();

    let pincode = "";
    let formattedAddress = "";

    if (data.results?.length) {
      const components = data.results[0].address_components;
      formattedAddress = data.results[0].formatted_address;

      const pinObj = components.find((c: any) =>
        c.types.includes("postal_code")
      );
      pincode = pinObj?.long_name || "";
    }

    onLocationSelect(lat, lng, pincode, formattedAddress);
  };

  // --------------------------
  // Search Box Change Handler
  // --------------------------
  const onPlacesChanged = () => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;

    const place = places[0];
    const loc = place.geometry.location;

    const newLat = loc.lat();
    const newLng = loc.lng();

    setMarker({ lat: newLat, lng: newLng });
    setCenter({ lat: newLat, lng: newLng });

    fetchAddressFromLatLng(newLat, newLng);
  };

  // --------------------------
  // Map Click Handler
  // --------------------------
  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();

    setMarker({ lat: newLat, lng: newLng });
    fetchAddressFromLatLng(newLat, newLng);
  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="space-y-3 mb-10">
      {/* Search Box */}
      <StandaloneSearchBox
        onLoad={(ref) => (searchBoxRef.current = ref)}
        onPlacesChanged={onPlacesChanged}
      >
        <input
          type="text"
          placeholder="Search location, city or pincode"
          className="w-full border p-3 rounded-md"
        />
      </StandaloneSearchBox>

      {/* Google Map */}
      <GoogleMap
        zoom={14}
        center={center}
        mapContainerStyle={{ width: "100%", height: "350px" }}
        onClick={handleMapClick}
      >
        <Marker position={marker} />
      </GoogleMap>
    </div>
  );
};

export default LocationPickerMap;
