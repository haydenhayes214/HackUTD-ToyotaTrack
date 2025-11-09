import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Filter, Zap, Fuel, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// Hardcoded Toyota vehicles data
const HARDCODED_TOYOTA_VEHICLES = [
  {
    id: "TOY-2025-CAM-LE-HYB-001",
    make: "Toyota",
    model: "Camry LE Hybrid",
    trim: "LE Hybrid",
    year: 2025,
    price: 30000,
    msrp: 30000,
    type: "Sedan",
    fuelType: "Hybrid",
    cityMpg: 51,
    highwayMpg: 53,
    mpg: 52,
    seats: 5,
    horsepower: 208,
    image: "https://autoimage.capitalone.com/stock-media/chrome/2023-Toyota-Camry-Hybrid_LE-218-cc_2023TOC200030_01_2100_218.png",
    features: ["Toyota Safety Sense 2.5+", "Apple CarPlay", "Android Auto", "Blind Spot Monitor", "Wireless Charging"],
    description: "Efficient and comfortable midsize sedan with exceptional fuel economy and advanced safety features."
  },
  {
    id: "TOY-2025-CAM-XSE-002",
    make: "Toyota",
    model: "Camry XSE",
    trim: "XSE",
    year: 2025,
    price: 35000,
    msrp: 35000,
    type: "Sedan",
    fuelType: "Gasoline",
    cityMpg: 28,
    highwayMpg: 39,
    mpg: 32,
    seats: 5,
    horsepower: 301,
    image: "https://www.buyatoyota.com/sharpr/vcr/adobe/dynamicmedia/deliver/urn:aaid:aem:a3985459-b3bc-494d-904c-84a5373bd017/image.png?",
    features: ["Sport-tuned suspension", "JBL Audio System", "Panoramic sunroof", "Heated and ventilated seats", "Toyota Safety Sense 2.5+"],
    description: "Sporty trim with powerful V6 engine and premium features for an engaging driving experience."
  },
  {
    id: "TOY-2025-RAV-XLE-HYB-003",
    make: "Toyota",
    model: "RAV4 XLE Hybrid",
    trim: "XLE Hybrid",
    year: 2025,
    price: 36000,
    msrp: 36000,
    type: "SUV",
    fuelType: "Hybrid",
    cityMpg: 41,
    highwayMpg: 38,
    mpg: 40,
    seats: 5,
    horsepower: 219,
    image: "https://vehicle-images.dealerinspire.com/stock-images/thumbnails/large/chrome/28870fa1f0ff51f320c1b2f34459fbff.png",
    features: ["AWD-i", "Multi-Terrain Select", "Toyota Safety Sense 2.5+", "Power liftgate", "Wireless Charging"],
    description: "Versatile compact SUV with all-wheel drive and excellent efficiency for adventure-ready driving."
  },
  {
    id: "TOY-2025-RAV-PRM-PHEV-004",
    make: "Toyota",
    model: "RAV4 Prime XSE",
    trim: "Prime XSE",
    year: 2025,
    price: 45000,
    msrp: 45000,
    type: "SUV",
    fuelType: "Plug-in Hybrid",
    cityMpg: 40,
    highwayMpg: 36,
    mpg: 94,
    seats: 5,
    horsepower: 302,
    image: "https://di-sitebuilder-assets.dealerinspire.com/Toyota/MLP/RAV4Prime/2024/Trims/SE.png",
    features: ["EV Mode", "Fast charging", "Premium JBL Audio", "Advanced safety suite", "Panoramic sunroof"],
    description: "Plug-in hybrid with 42 miles of electric range and powerful performance for eco-conscious drivers."
  },
  {
    id: "TOY-2025-COR-SE-HYB-005",
    make: "Toyota",
    model: "Corolla SE Hybrid",
    trim: "SE Hybrid",
    year: 2025,
    price: 24000,
    msrp: 24000,
    type: "Sedan",
    fuelType: "Hybrid",
    cityMpg: 53,
    highwayMpg: 52,
    mpg: 53,
    seats: 5,
    horsepower: 121,
    image: "https://media.ed.edmunds-media.com/toyota/corolla-hybrid/2025/oem/2025_toyota_corolla-hybrid_sedan_se_fq_oem_1_1280.jpg",
    features: ["Toyota Safety Sense 2.0", "7-inch touchscreen", "Apple CarPlay", "LED headlights", "Blind Spot Monitor"],
    description: "Affordable compact car with outstanding fuel economy and modern technology features."
  },
  {
    id: "TOY-2025-TUN-SR5-006",
    make: "Toyota",
    model: "Tundra SR5",
    trim: "SR5",
    year: 2025,
    price: 42000,
    msrp: 42000,
    type: "Truck",
    fuelType: "Gasoline",
    cityMpg: 18,
    highwayMpg: 24,
    mpg: 20,
    seats: 5,
    horsepower: 389,
    image: "https://www.buyatoyota.com/sharpr/bat/assets/img/vehicle-info/Tundra/2026/hero-image.png",
    features: ["Toyota Safety Sense 2.5+", "14-inch touchscreen", "Apple CarPlay", "Android Auto", "Towing package", "4WD"],
    description: "Powerful full-size pickup truck with impressive towing capacity and advanced technology."
  }
];

export default function VehiclesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use hardcoded data instead of API
    setVehicles(HARDCODED_TOYOTA_VEHICLES);
    setIsLoading(false);
  }, []);

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
              <p className="text-xl text-gray-600">
                No vehicles found matching your filters. Try selecting a different category.
              </p>
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
