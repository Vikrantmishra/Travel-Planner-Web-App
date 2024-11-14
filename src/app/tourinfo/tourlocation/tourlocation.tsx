"use client"; // Ensure it's a client-side component

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic"; // Dynamically import the map components
import L from "leaflet"; // Import Leaflet to manually configure icons
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS
import { useAuth } from "@/app/AuthContext";

// Dynamically import Leaflet components
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

// Configure the default marker icons for Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup anchor point
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41], // Size of the shadow
});

// Set the default icon globally to avoid missing markers
L.Marker.prototype.options.icon = DefaultIcon;

const TourLocationPage: React.FC = () => {
  const pathname = usePathname();
  const { chosenItems } = useAuth(); // Access queryParams from context
  const [isMounted, setIsMounted] = useState(false);
  const [locationCoords, setLocationCoords] = useState<[number, number] | null>(null); // Store latitude and longitude
  const [isLoading, setIsLoading] = useState(false);

  const destinationCity = chosenItems[0]?.details.destinationCity || ""; // Extract destination city from queryParams
console.log("destinationCity: ", destinationCity)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (destinationCity) {
      fetchCoordinates(destinationCity);
    }
  }, [destinationCity]);

  // Function to fetch coordinates using a geocoding API (e.g., Nominatim)
  const fetchCoordinates = async (city: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&addressdetails=1&countrycodes=in&limit=1`);
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        console.log("lat & long: ", lat, lon)
        setLocationCoords([lat, lon]); // Update state with the coordinates
      } else {
        console.log("City not found or no coordinates available.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="/andaman.png"
          alt="Landscape"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <p className="text-lg uppercase tracking-wider">Explore</p>
          <h1 className="text-6xl font-extrabold">Landscapes</h1>
        </div>

        {/* Transparent Navigation Tabs */}
        <div className="absolute inset-x-0 bottom-0 mx-auto flex items-center justify-center bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg max-w-4xl p-4">
          <Link
            href="/tourinfo"
            className={`px-4 py-2 mx-2 font-semibold rounded-md ${
              pathname === "/tourinfo/information"
                ? "bg-pink-500 text-white"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Information
          </Link>

          <Link
            href="/tourinfo/tourplan"
            className={`px-4 py-2 mx-2 font-semibold rounded-md ${
              pathname === "/tourinfo/tour-plan"
                ? "bg-pink-500 text-white"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Tour Plan
          </Link>

          <Link
            href="/tourinfo/tourlocation"
            className={`px-4 py-2 mx-2 font-semibold rounded-md ${
              pathname === "/tourinfo/location"
                ? "bg-pink-500 text-white"
                : "text-gray-600 hover:text-pink-600"
            }`}
          >
            Location
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto mt-20 flex space-x-8">
        {/* Left Section: Location Information */}
        <div className="w-2/3 bg-white p-8 shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Tour Location</h2>

          <ul className="list-disc list-inside text-sm text-gray-700 mb-6">
            <li>{destinationCity}</li>
            <li>20°C and Clear Skies</li>
            <li>100% Safe Locations</li>
            <li>Dal Lake</li>
            <li>Sonamarg</li>
            <li>Gulmarg</li>
          </ul>

          {/* Map Section */}
          <div className="relative h-[400px] mb-6 overflow-hidden rounded-lg">
            {isLoading ? (
              <div className="text-center text-lg text-gray-500">Loading map...</div>
            ) : locationCoords ? (
              <MapContainer
                center={locationCoords}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={locationCoords}>
                  <Popup>{destinationCity}</Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="text-center text-lg text-gray-500">City not found.</div>
            )}
          </div>

          <p className="text-gray-600">
            Experience the timeless beauty of {destinationCity}, where every moment offers a unique blend of culture, nature, and tradition.
          </p>
        </div>

        {/* Right Section: Book This Tour */}
        <div className="w-1/3 bg-white p-8 shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Book This Tour</h3>
          <form className="space-y-4">
            <input type="text" placeholder="Full Name" className="w-full border border-gray-300 rounded-md p-3" />
            <input type="email" placeholder="Email" className="w-full border border-gray-300 rounded-md p-3" />
            <textarea placeholder="Message" rows={4} className="w-full border border-gray-300 rounded-md p-3"></textarea>
            <button type="submit" className="w-full bg-pink-500 text-white py-3 rounded-md hover:bg-pink-600">Check Availability</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TourLocationPage;
