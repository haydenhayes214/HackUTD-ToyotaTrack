import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Filter, Zap, Fuel, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = 'http://localhost:3001/api';

export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      console.log('Fetching vehicles from:', `${API_BASE}/vehicles?make=Toyota&limit=1000`);
      // Try with make filter first (server-side filtering is more efficient)
      let response = await fetch(`${API_BASE}/vehicles?make=Toyota&limit=1000`);
      
      // If that fails, try without the make filter and filter client-side
      if (!response.ok) {
        console.log('Server-side make filter failed, trying without filter...');
        response = await fetch(`${API_BASE}/vehicles?limit=1000`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', { 
        hasVehicles: !!data.vehicles, 
        isArray: Array.isArray(data),
        dataType: typeof data,
        keys: Object.keys(data || {})
      });
      
      // Handle both response formats: { vehicles: [...] } or direct array
      const vehiclesArray = data.vehicles || data;
      
      if (!Array.isArray(vehiclesArray)) {
        console.error('Invalid vehicles data format:', vehiclesArray);
        setVehicles([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`Received ${vehiclesArray.length} vehicles from server`);
      
      // Filter to only Toyota vehicles (case-insensitive) as backup
      const toyotaVehicles = vehiclesArray.filter(v => {
        const make = v.make || v.Make || '';
        return make.toString().toLowerCase() === 'toyota';
      });
      
      console.log(`Loaded ${toyotaVehicles.length} Toyota vehicles out of ${vehiclesArray.length} total`);
      
      if (toyotaVehicles.length === 0 && vehiclesArray.length > 0) {
        console.warn('No Toyota vehicles found. Sample vehicle:', vehiclesArray[0]);
      }
      
      setVehicles(toyotaVehicles);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      // Check if it's a network error (server not running)
      if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
        console.error('⚠️ Backend server is not running or not accessible.');
        console.error('Please check:');
        console.error('1. Server is running: npm run server');
        console.error('2. Server is on port 3001');
        console.error('3. CORS is enabled');
        console.error('4. Try accessing: http://localhost:3001/api/vehicles in your browser');
      }
      setVehicles([]);
      setIsLoading(false);
    }
  };

  const categories = [
    { value: "all", label: "All Vehicles" },
    { value: "sedan", label: "Sedans" },
    { value: "suv", label: "SUVs" },
    { value: "truck", label: "Trucks" },
    { value: "hybrid", label: "Hybrids" },
    { value: "sports", label: "Sports" },
  ];

  // Map server data structure to expected format
  const mapVehicle = (vehicle) => {
    // Determine category from type and fuel type
    let category = "sedan";
    const type = vehicle.type || "";
    const fuelType = vehicle.fuelType || "";
    
    // First check if it's a hybrid (can be any type)
    if (fuelType === "Hybrid" || fuelType === "Plug-in Hybrid") {
      category = "hybrid";
    } else if (type.includes("SUV")) {
      category = "suv";
    } else if (type.includes("Truck")) {
      category = "truck";
    } else if (type === "Sedan" || type === "Compact") {
      category = "sedan";
    } else if (type.includes("Sports") || vehicle.model?.toLowerCase().includes("supra")) {
      category = "sports";
    }

    return {
      id: vehicle.id,
      model_name: vehicle.model,
      trim: vehicle.model.split(' ').slice(2).join(' ') || vehicle.model.split(' ').slice(1).join(' ') || "",
      year: vehicle.year || 2025,
      msrp: vehicle.price,
      category: category,
      fuel_type: fuelType.toLowerCase().replace(/\s+/g, "_") || "gasoline",
      mpg_city: vehicle.cityMpg || vehicle.mpg,
      mpg_highway: vehicle.highwayMpg || vehicle.mpg,
      image_url: vehicle.image,
      horsepower: vehicle.horsepower,
      seating_capacity: vehicle.seats,
      features: vehicle.features || [],
      description: vehicle.description,
      // Keep original data for filtering
      originalType: type,
      originalFuelType: fuelType,
    };
  };

  const filteredVehicles = vehicles
    .map(mapVehicle)
    .filter((v) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "hybrid") {
        // Show all hybrid vehicles regardless of type
        return v.fuel_type === "hybrid" || v.fuel_type === "plug-in_hybrid" || 
               v.originalFuelType === "Hybrid" || v.originalFuelType === "Plug-in Hybrid";
      }
      if (selectedCategory === "suv") {
        // Show all SUVs (but not if they're hybrids when hybrid category is selected)
        return v.originalType?.includes("SUV");
      }
      if (selectedCategory === "truck") {
        return v.originalType?.includes("Truck");
      }
      if (selectedCategory === "sedan") {
        // Show sedans and compacts that aren't hybrids
        return (v.originalType === "Sedan" || v.originalType === "Compact") && 
               !(v.originalFuelType === "Hybrid" || v.originalFuelType === "Plug-in Hybrid");
      }
      return v.category === selectedCategory;
    });

  return (
    <div className="min-h-screen py-12 px-6" style={{ paddingTop: '100px' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1C1C1C] mb-4">
            Explore Toyota Vehicles
          </h1>
          <p className="text-xl text-gray-600">
            Find your perfect match from our complete lineup
          </p>
        </div>
        {/* Category Filter */}
        <div className="neumorphic p-6 mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#EB0A1E]" />
            <span className="font-semibold text-[#1C1C1C]">Filter by Category</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.value
                    ? "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-[#EB0A1E]"
                    : "neumorphic-button text-[#1C1C1C]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block neumorphic p-8">
              <div className="animate-spin w-12 h-12 border-4 border-[#EB0A1E] border-t-transparent rounded-full" />
            </div>
          </div>
        ) : filteredVehicles.length === 0 ? (
          <div className="text-center py-20">
            <div className="neumorphic p-12 inline-block max-w-2xl">
              <p className="text-xl text-gray-600 mb-4">
                {vehicles.length === 0 && !isLoading 
                  ? "Unable to load vehicles. Please make sure the backend server is running."
                  : "No vehicles found matching your filters. Try selecting a different category."}
              </p>
              {vehicles.length === 0 && !isLoading && (
                <div className="text-sm text-gray-500 mt-4 space-y-2">
                  <p>To start the server, run:</p>
                  <code className="block bg-gray-100 px-4 py-2 rounded mt-2">npm run server</code>
                  <p className="mt-4">Or run both frontend and backend together:</p>
                  <code className="block bg-gray-100 px-4 py-2 rounded mt-2">npm run dev:all</code>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="neumorphic p-6 hover:shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] transition-all group">
                  {/* Vehicle Image */}
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={
                        vehicle.image_url ||
                        "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80"
                      }
                      alt={vehicle.model_name}
                      className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&q=80";
                      }}
                    />
                    <div className="absolute top-4 left-4 neumorphic px-3 py-1 bg-white">
                      <span className="text-xs font-semibold text-[#1C1C1C]">
                        {vehicle.year}
                      </span>
                    </div>
                    {(vehicle.fuel_type === "hybrid" || vehicle.fuel_type === "plug-in_hybrid") && (
                      <div className="absolute top-4 right-4 neumorphic px-3 py-1 bg-green-500">
                        <span className="text-xs font-semibold text-white">
                          HYBRID
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Vehicle Info */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-[#1C1C1C] mb-1">
                      {vehicle.model_name}
                    </h3>
                    {vehicle.trim && (
                      <p className="text-gray-600 font-medium">{vehicle.trim}</p>
                    )}
                  </div>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {vehicle.horsepower && (
                      <div className="neumorphic-inset p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Zap className="w-4 h-4 text-[#EB0A1E]" />
                          <span className="text-xs text-gray-600">Power</span>
                        </div>
                        <p className="text-sm font-bold text-[#1C1C1C] mt-1">
                          {vehicle.horsepower} HP
                        </p>
                      </div>
                    )}
                    {vehicle.mpg_city && (
                      <div className="neumorphic-inset p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-[#EB0A1E]" />
                          <span className="text-xs text-gray-600">MPG</span>
                        </div>
                        <p className="text-sm font-bold text-[#1C1C1C] mt-1">
                          {vehicle.mpg_city}/{vehicle.mpg_highway || vehicle.mpg_city}
                        </p>
                      </div>
                    )}
                    {vehicle.seating_capacity && (
                      <div className="neumorphic-inset p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-[#EB0A1E]" />
                          <span className="text-xs text-gray-600">Seats</span>
                        </div>
                        <p className="text-sm font-bold text-[#1C1C1C] mt-1">
                          {vehicle.seating_capacity}
                        </p>
                      </div>
                    )}
                    <div className="neumorphic-inset p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#EB0A1E]" />
                        <span className="text-xs text-gray-600">MSRP</span>
                      </div>
                      <p className="text-sm font-bold text-[#1C1C1C] mt-1">
                        ${vehicle.msrp?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                  {/* CTA Button */}
                  <Link
                    to={`${createPageUrl("Finance")}?vehicleId=${vehicle.id}&price=${
                      vehicle.msrp
                    }&model=${encodeURIComponent(vehicle.model_name)}`}
                  >
                    <button className="toyota-red-button w-full py-3 text-white font-semibold">
                      Configure & Finance
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
