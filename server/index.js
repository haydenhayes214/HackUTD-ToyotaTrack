import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, 'key.env') });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Load vehicle data from JSON file (fallback to inline data if file doesn't exist)
let VEHICLES_DATA;
try {
  VEHICLES_DATA = JSON.parse(
    readFileSync(join(__dirname, 'data/vehicles.json'), 'utf-8')
  );
} catch (error) {
  console.warn('Could not load vehicles.json, using fallback data');
  // Fallback to original data structure
  VEHICLES_DATA = [
  {
    id: 'camry-hybrid-2025-le',
    make: 'Toyota',
    model: 'Camry Hybrid LE',
    year: 2025,
    price: 30000,
    mpg: 52,
    cityMpg: 51,
    highwayMpg: 53,
    seats: 5,
    drivetrain: 'FWD',
    type: 'Sedan',
    engine: '2.5L 4-Cylinder Hybrid',
    horsepower: 208,
    transmission: 'eCVT',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=600&fit=crop',
    description: 'Efficient and comfortable midsize sedan with exceptional fuel economy.',
    features: ['Toyota Safety Sense 2.5+', 'Apple CarPlay', 'Android Auto', 'Blind Spot Monitor'],
  },
  {
    id: 'camry-2025-xse',
    make: 'Toyota',
    model: 'Camry XSE',
    year: 2025,
    price: 35000,
    mpg: 32,
    cityMpg: 28,
    highwayMpg: 39,
    seats: 5,
    drivetrain: 'FWD',
    type: 'Sedan',
    engine: '3.5L V6',
    horsepower: 301,
    transmission: '8-Speed Automatic',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Sporty trim with powerful V6 engine and premium features.',
    features: ['Sport-tuned suspension', 'JBL Audio', 'Panoramic roof', 'Heated seats'],
  },
  {
    id: 'rav4-hybrid-2025-xle',
    make: 'Toyota',
    model: 'RAV4 Hybrid XLE',
    year: 2025,
    price: 36000,
    mpg: 40,
    cityMpg: 41,
    highwayMpg: 38,
    seats: 5,
    drivetrain: 'AWD',
    type: 'Compact SUV',
    engine: '2.5L 4-Cylinder Hybrid',
    horsepower: 219,
    transmission: 'eCVT',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1920&h=1080&fit=crop&q=90',
    description: 'Versatile compact SUV with all-wheel drive and excellent efficiency. Perfect for adventure and daily commuting.',
    features: ['AWD-i', 'Multi-Terrain Select', 'Toyota Safety Sense 2.5+', 'Power liftgate'],
  },
  {
    id: 'rav4-prime-2025-xse',
    make: 'Toyota',
    model: 'RAV4 Prime XSE',
    year: 2025,
    price: 45000,
    mpg: 94,
    cityMpg: 40,
    highwayMpg: 36,
    seats: 5,
    drivetrain: 'AWD',
    type: 'Compact SUV',
    engine: '2.5L 4-Cylinder Plug-in Hybrid',
    horsepower: 302,
    transmission: 'eCVT',
    fuelType: 'Plug-in Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Plug-in hybrid with 42 miles of electric range and powerful performance.',
    features: ['EV Mode', 'Fast charging', 'Premium audio', 'Advanced safety suite'],
  },
  {
    id: 'corolla-hybrid-2025-se',
    make: 'Toyota',
    model: 'Corolla Hybrid SE',
    year: 2025,
    price: 24000,
    mpg: 53,
    cityMpg: 53,
    highwayMpg: 52,
    seats: 5,
    drivetrain: 'FWD',
    type: 'Compact',
    engine: '1.8L 4-Cylinder Hybrid',
    horsepower: 121,
    transmission: 'eCVT',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Affordable compact car with outstanding fuel economy.',
    features: ['Toyota Safety Sense 2.0', '7-inch display', 'Apple CarPlay', 'LED headlights'],
  },
  {
    id: 'highlander-2025-xle',
    make: 'Toyota',
    model: 'Highlander XLE',
    year: 2025,
    price: 42000,
    mpg: 36,
    cityMpg: 35,
    highwayMpg: 35,
    seats: 7,
    drivetrain: 'AWD',
    type: 'Midsize SUV',
    engine: '2.5L 4-Cylinder Hybrid',
    horsepower: 243,
    transmission: 'eCVT',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Spacious three-row SUV perfect for families.',
    features: ['3-row seating', 'Toyota Safety Sense 2.5+', '12.3-inch display', 'Panoramic moonroof'],
  },
  {
    id: '4runner-2025-trd',
    make: 'Toyota',
    model: '4Runner TRD Off-Road',
    year: 2025,
    price: 41000,
    mpg: 19,
    cityMpg: 17,
    highwayMpg: 21,
    seats: 5,
    drivetrain: '4WD',
    type: 'Midsize SUV',
    engine: '4.0L V6',
    horsepower: 270,
    transmission: '5-Speed Automatic',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Rugged off-road capable SUV with legendary reliability.',
    features: ['Crawl Control', 'Multi-Terrain Select', 'Locking rear differential', 'Skid plates'],
  },
  {
    id: 'tacoma-2025-trd',
    make: 'Toyota',
    model: 'Tacoma TRD Off-Road',
    year: 2025,
    price: 38000,
    mpg: 20,
    cityMpg: 18,
    highwayMpg: 22,
    seats: 5,
    drivetrain: '4WD',
    type: 'Midsize Truck',
    engine: '3.5L V6',
    horsepower: 278,
    transmission: '6-Speed Manual',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Off-road ready midsize truck with impressive capability.',
    features: ['Crawl Control', 'Multi-Terrain Select', 'Locking rear diff', 'Tow package'],
  },
  {
    id: 'prius-2025-le',
    make: 'Toyota',
    model: 'Prius LE',
    year: 2025,
    price: 28000,
    mpg: 57,
    cityMpg: 57,
    highwayMpg: 56,
    seats: 5,
    drivetrain: 'FWD',
    type: 'Compact',
    engine: '2.0L 4-Cylinder Hybrid',
    horsepower: 196,
    transmission: 'eCVT',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Iconic hybrid with cutting-edge design and efficiency.',
    features: ['Solar roof option', 'Toyota Safety Sense 3.0', 'Digital rearview mirror', 'Wireless charging'],
  },
  {
    id: 'sequoia-2025-capstone',
    make: 'Toyota',
    model: 'Sequoia Capstone',
    year: 2025,
    price: 75000,
    mpg: 22,
    cityMpg: 21,
    highwayMpg: 24,
    seats: 8,
    drivetrain: '4WD',
    type: 'Full-Size SUV',
    engine: '3.5L Twin-Turbo V6 Hybrid',
    horsepower: 437,
    transmission: '10-Speed Automatic',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Luxurious full-size SUV with premium amenities and power.',
    features: ['Premium leather', '22-inch wheels', 'Panoramic roof', 'Advanced safety', 'Captain chairs'],
  },
  // Non-Toyota vehicles for comparison
  {
    id: 'mazda-3-2025',
    make: 'Mazda',
    model: 'Mazda 3',
    year: 2025,
    price: 26000,
    mpg: 30,
    cityMpg: 27,
    highwayMpg: 35,
    seats: 5,
    drivetrain: 'FWD',
    type: 'Compact',
    engine: '2.5L 4-Cylinder',
    horsepower: 191,
    transmission: '6-Speed Automatic',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Sporty compact sedan with premium interior and engaging driving dynamics.',
    features: ['SkyActiv Technology', 'i-Activsense', 'Apple CarPlay', 'Bose Audio'],
  },
  {
    id: 'honda-accord-2025',
    make: 'Honda',
    model: 'Accord Hybrid',
    year: 2025,
    price: 32000,
    mpg: 48,
    cityMpg: 48,
    highwayMpg: 47,
    seats: 5,
    drivetrain: 'FWD',
    type: 'Sedan',
    engine: '2.0L 4-Cylinder Hybrid',
    horsepower: 212,
    transmission: 'eCVT',
    fuelType: 'Hybrid',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Efficient midsize sedan with hybrid powertrain and spacious interior.',
    features: ['Honda Sensing', 'Apple CarPlay', 'Wireless charging', 'Adaptive cruise control'],
  },
  {
    id: 'ford-explorer-2025',
    make: 'Ford',
    model: 'Explorer',
    year: 2025,
    price: 38000,
    mpg: 23,
    cityMpg: 21,
    highwayMpg: 28,
    seats: 7,
    drivetrain: 'AWD',
    type: 'Midsize SUV',
    engine: '2.3L 4-Cylinder Turbo',
    horsepower: 300,
    transmission: '10-Speed Automatic',
    fuelType: 'Gasoline',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop',
    description: 'Capable three-row SUV with turbocharged performance.',
    features: ['SYNC 4', 'Co-Pilot360', 'Power liftgate', 'Third-row seating'],
  },
];

// Helper function to parse natural language query and extract filters
function parseQueryFilters(query, vehicles) {
  const q = query.toLowerCase();
  const filters = {
    type: null,
    drivetrain: null,
    fuelType: null,
    minPrice: null,
    maxPrice: null,
    minMpg: null,
    make: null,
    model: null,
    keywords: [],
  };

  // Extract vehicle type
  if (q.includes('suv') || q.includes('sport utility')) {
    filters.type = 'SUV';
    if (q.includes('compact')) filters.type = 'Compact SUV';
    if (q.includes('midsize') || q.includes('mid-size')) filters.type = 'Midsize SUV';
    if (q.includes('full-size') || q.includes('full size')) filters.type = 'Full-Size SUV';
  } else if (q.includes('sedan')) {
    filters.type = 'Sedan';
  } else if (q.includes('truck')) {
    filters.type = 'Midsize Truck';
  } else if (q.includes('compact') && !q.includes('suv')) {
    filters.type = 'Compact';
  }

  // Extract drivetrain
  if (q.includes('awd') || q.includes('all-wheel drive')) filters.drivetrain = 'AWD';
  if (q.includes('4wd') || q.includes('four-wheel drive') || q.includes('4 wheel')) filters.drivetrain = '4WD';
  if (q.includes('fwd') || q.includes('front-wheel drive')) filters.drivetrain = 'FWD';

  // Extract fuel type
  if (q.includes('hybrid')) {
    if (q.includes('plug-in') || q.includes('plugin') || q.includes('phev')) {
      filters.fuelType = 'Plug-in Hybrid';
    } else {
      filters.fuelType = 'Hybrid';
    }
  } else if (q.includes('electric') || q.includes('ev')) {
    filters.fuelType = 'Electric';
  } else if (q.includes('gas') || q.includes('gasoline')) {
    filters.fuelType = 'Gasoline';
  }

  // Extract price range
  const pricePatterns = [
    { pattern: /under\s*\$?(\d{1,3}(?:,\d{3})*(?:k|thousand)?)/i, extract: (m) => parseInt(m[1].replace(/[,k]/g, '')) * (m[1].toLowerCase().includes('k') ? 1000 : 1), setMax: true },
    { pattern: /\$?(\d{1,3}(?:,\d{3})*(?:k|thousand)?)\s*-\s*\$?(\d{1,3}(?:,\d{3})*(?:k|thousand)?)/i, extract: (m) => ({
      min: parseInt(m[1].replace(/[,k]/g, '')) * (m[1].toLowerCase().includes('k') ? 1000 : 1),
      max: parseInt(m[2].replace(/[,k]/g, '')) * (m[2].toLowerCase().includes('k') ? 1000 : 1),
    }) },
    { pattern: /affordable|cheap|budget/i, setMax: true, value: 30000 },
    { pattern: /luxury|premium|high-end/i, setMin: true, value: 50000 },
  ];

  for (const pattern of pricePatterns) {
    const match = q.match(pattern.pattern);
    if (match) {
      if (pattern.extract) {
        const extracted = pattern.extract(match);
        if (typeof extracted === 'object') {
          filters.minPrice = extracted.min;
          filters.maxPrice = extracted.max;
        } else if (pattern.setMax) {
          filters.maxPrice = extracted;
        }
      } else {
        if (pattern.setMax) filters.maxPrice = pattern.value;
        if (pattern.setMin) filters.minPrice = pattern.value;
      }
      break;
    }
  }

  // Extract MPG requirements
  const mpgMatch = q.match(/(\d+)\s*mpg/i);
  if (mpgMatch) {
    filters.minMpg = parseInt(mpgMatch[1]);
  } else if (q.includes('efficient') || q.includes('good gas mileage')) {
    filters.minMpg = 35;
  }

  // Extract make/model
  const makes = ['toyota', 'mazda', 'honda', 'ford', 'chevrolet', 'nissan'];
  for (const make of makes) {
    if (q.includes(make)) {
      filters.make = make.charAt(0).toUpperCase() + make.slice(1);
      break;
    }
  }

  // Extract specific models
  const models = ['camry', 'corolla', 'rav4', 'prius', 'highlander', 'accord', 'mazda3', 'mazda 3', 'explorer'];
  for (const model of models) {
    if (q.includes(model.replace(' ', '')) || q.includes(model)) {
      filters.model = model;
      break;
    }
  }

  return filters;
}

// Filter vehicles based on parsed filters
function filterVehicles(vehicles, filters) {
  return vehicles.filter(vehicle => {
    if (filters.type && !vehicle.type.includes(filters.type.replace('SUV', '').trim()) && vehicle.type !== filters.type) {
      if (filters.type === 'SUV' && !vehicle.type.includes('SUV')) return false;
      if (filters.type !== 'SUV' && vehicle.type !== filters.type) return false;
    }
    if (filters.drivetrain && vehicle.drivetrain !== filters.drivetrain) return false;
    if (filters.fuelType && vehicle.fuelType !== filters.fuelType) return false;
    if (filters.minPrice && vehicle.price < filters.minPrice) return false;
    if (filters.maxPrice && vehicle.price > filters.maxPrice) return false;
    if (filters.minMpg && vehicle.mpg < filters.minMpg) return false;
    if (filters.make && vehicle.make.toLowerCase() !== filters.make.toLowerCase()) return false;
    if (filters.model && !vehicle.model.toLowerCase().includes(filters.model.toLowerCase())) return false;
    return true;
  });
}

// Mock dealer data
const DEALERS = [
  { id: 'dallas-toyota', name: 'Dallas Toyota', zip: '75201', city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970, phone: '(214) 555-0100' },
  { id: 'plano-toyota', name: 'Plano Toyota', zip: '75023', city: 'Plano', state: 'TX', lat: 33.0198, lng: -96.6989, phone: '(972) 555-0101' },
  { id: 'frisco-toyota', name: 'Frisco Toyota', zip: '75034', city: 'Frisco', state: 'TX', lat: 33.1507, lng: -96.8236, phone: '(972) 555-0102' },
  { id: 'irving-toyota', name: 'Irving Toyota', zip: '75038', city: 'Irving', state: 'TX', lat: 32.8140, lng: -96.9489, phone: '(972) 555-0103' },
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all vehicles
app.get('/api/vehicles', (req, res) => {
  res.json(VEHICLES_DATA);
});

// Get vehicle by ID
app.get('/api/vehicles/:id', (req, res) => {
  const vehicle = VEHICLES_DATA.find(v => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(vehicle);
});

// Get dealers
app.get('/api/dealers', (req, res) => {
  const { zip } = req.query;
  if (zip) {
    const nearby = DEALERS.filter(d => d.zip.startsWith(zip.substring(0, 3)));
    return res.json(nearby.length > 0 ? nearby : DEALERS);
  }
  res.json(DEALERS);
});

// Get dealer by ID
app.get('/api/dealers/:id', (req, res) => {
  const dealer = DEALERS.find(d => d.id === req.params.id);
  if (!dealer) {
    return res.status(404).json({ error: 'Dealer not found' });
  }
  res.json(dealer);
});

// Search vehicles with natural language query
app.post('/api/vehicles/search', (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.json(VEHICLES_DATA);
    }

    const filters = parseQueryFilters(query, VEHICLES_DATA);
    const matchingVehicles = filterVehicles(VEHICLES_DATA, filters);

    res.json({
      vehicles: matchingVehicles,
      filters: filters,
      count: matchingVehicles.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Error searching vehicles' });
  }
});

// Compare two vehicles
app.post('/api/compare', (req, res) => {
  try {
    const { vehicle1, vehicle2, query } = req.body;
    
    let v1, v2;

    // If query provided, try to find vehicles by natural language
    if (query) {
      const filters = parseQueryFilters(query, VEHICLES_DATA);
      const matches = filterVehicles(VEHICLES_DATA, filters);
      
      // Try to extract two vehicle names from query
      const vehicleNames = query.toLowerCase().split(/vs|versus|compared? to|and/);
      if (vehicleNames.length >= 2) {
        const name1 = vehicleNames[0].trim();
        const name2 = vehicleNames[1].trim();
        
        v1 = VEHICLES_DATA.find(v => 
          v.model.toLowerCase().includes(name1) || 
          v.make.toLowerCase().includes(name1) ||
          `${v.make} ${v.model}`.toLowerCase().includes(name1)
        );
        
        v2 = VEHICLES_DATA.find(v => 
          v.model.toLowerCase().includes(name2) || 
          v.make.toLowerCase().includes(name2) ||
          `${v.make} ${v.model}`.toLowerCase().includes(name2)
        );
      }
      
      // If only one match found, use first two from matches
      if (!v1 && !v2 && matches.length >= 2) {
        v1 = matches[0];
        v2 = matches[1];
      } else if (!v1 && matches.length > 0) {
        v1 = matches[0];
      }
    }

    // If vehicle IDs provided, use those
    if (vehicle1 && !v1) {
      v1 = VEHICLES_DATA.find(v => v.id === vehicle1 || v.model.toLowerCase().includes(vehicle1.toLowerCase()));
    }
    if (vehicle2 && !v2) {
      v2 = VEHICLES_DATA.find(v => v.id === vehicle2 || v.model.toLowerCase().includes(vehicle2.toLowerCase()));
    }

    if (!v1 || !v2) {
      return res.status(400).json({ 
        error: 'Could not find both vehicles to compare. Please specify vehicle names or IDs.',
        suggestions: VEHICLES_DATA.slice(0, 5).map(v => ({ id: v.id, name: `${v.make} ${v.model}` }))
      });
    }

    // Create comparison data
    const comparison = {
      vehicle1: v1,
      vehicle2: v2,
      differences: {
        price: v2.price - v1.price,
        mpg: v2.mpg - v1.mpg,
        horsepower: v2.horsepower - v1.horsepower,
      },
      similarities: [],
    };

    // Find similarities
    if (v1.type === v2.type) comparison.similarities.push('Same vehicle type');
    if (v1.drivetrain === v2.drivetrain) comparison.similarities.push('Same drivetrain');
    if (v1.fuelType === v2.fuelType) comparison.similarities.push('Same fuel type');
    if (Math.abs(v1.price - v2.price) < 5000) comparison.similarities.push('Similar price range');

    res.json(comparison);
  } catch (error) {
    console.error('Compare error:', error);
    res.status(500).json({ error: 'Error comparing vehicles' });
  }
});

// Helper function for fallback responses
function generateFallbackResponse(msg, matchingVehicles, isSearchRequest, isComparisonRequest) {
  const isGreeting = /hello|hi|hey|greetings|good morning|good afternoon|good evening/i.test(msg);
  const isHelpRequest = /help|what can you|what do you|how|tell me|explain/i.test(msg);
  const isFinanceQuestion = /finance|payment|lease|buy|purchase|monthly|apr|interest|afford|cost|price/i.test(msg);

  if (isGreeting) {
    return "Hello! I'm Toyota Sensei, your AI assistant. I'm here to help you find the perfect Toyota vehicle, understand financing options, and answer any questions you have about our lineup.\n\n" +
      "I can help you:\n" +
      "• Find vehicles that match your needs and budget\n" +
      "• Compare different models and trims\n" +
      "• Understand financing, leasing, and subscription options\n" +
      "• Learn about vehicle features, specifications, and capabilities\n\n" +
      "What would you like to explore today?";
  } else if (isHelpRequest) {
    return "I'm here to help! I can assist you with:\n\n" +
      "🔍 **Vehicle Search**: Find vehicles by type, price, features, or specifications\n" +
      "⚖️ **Comparisons**: Compare different models side-by-side\n" +
      "💰 **Financing**: Get information about buying, leasing, and subscription options\n" +
      "📊 **Specifications**: Learn about MPG, horsepower, features, and more\n\n" +
      "Just ask me anything about Toyota vehicles or financing, and I'll do my best to help!";
  } else if (isSearchRequest && matchingVehicles.length > 0) {
    const vehicleList = matchingVehicles.slice(0, 5).map(v => 
      `• **${v.make} ${v.model}** - $${v.price?.toLocaleString() || 'N/A'} (${v.mpg || 'N/A'} MPG, ${v.type})`
    ).join('\n');
    return `Great! I found ${matchingVehicles.length} vehicle(s) that match your criteria:\n\n${vehicleList}\n\n` +
      `Would you like more details about any of these vehicles, or would you like to compare them?`;
  } else if (isSearchRequest && matchingVehicles.length === 0) {
    return "I couldn't find any vehicles matching those exact criteria. Here are some suggestions:\n\n" +
      "• Try 'Show me all SUVs' or 'Find hybrid vehicles'\n" +
      "• Search by price range: 'Cars under $40,000'\n" +
      "• Ask about specific models: 'Tell me about the Toyota Camry'\n\n" +
      "You can also browse our full inventory on the Vehicles page!";
  } else if (isFinanceQuestion) {
    return "I can help with financing questions! Here's an overview:\n\n" +
      "**Buying:**\n" +
      "• APR typically ranges from 2.9% to 7.9% depending on your credit score\n" +
      "• Loan terms available from 36 to 84 months\n" +
      "• You own the vehicle after paying off the loan\n\n" +
      "**Leasing:**\n" +
      "• Lower monthly payments than buying\n" +
      "• Terms typically 24-48 months\n" +
      "• You return the vehicle at the end of the lease\n\n" +
      "**Subscription:**\n" +
      "• All-inclusive monthly payment\n" +
      "• Includes insurance and maintenance\n" +
      "• Flexible terms with no long-term commitment\n\n" +
      "Use the Finance page to calculate exact monthly payments based on your situation!";
  } else if (isComparisonRequest) {
    return "I can help you compare vehicles! To get the best comparison, please specify two vehicles you'd like to compare.\n\n" +
      "For example:\n" +
      "• 'Compare Toyota Camry with Honda Accord'\n" +
      "• 'Toyota RAV4 vs Mazda CX-5'\n" +
      "• 'Show me Camry vs Accord comparison'\n\n" +
      "I'll provide a detailed side-by-side comparison of features, pricing, and specifications.";
  } else {
    return "I'm here to help! I can assist you with:\n\n" +
      "• Finding the perfect vehicle for your needs\n" +
      "• Comparing different models and trims\n" +
      "• Understanding financing and payment options\n" +
      "• Answering questions about features and specifications\n\n" +
      "What would you like to know? Feel free to ask me anything about Toyota vehicles or financing!";
  }
}

// AI Chatbot endpoint with intelligent vehicle filtering
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.json({
        response: 'Please enter a message or question.',
        error: false,
      });
    }

    const msg = message.toLowerCase();

    // Parse query and find matching vehicles for context
    const filters = parseQueryFilters(message, VEHICLES_DATA);
    const matchingVehicles = filterVehicles(VEHICLES_DATA, filters);

    // Detect intent types for enhanced context
    const isSearchRequest = /show|find|search|look for|affordable|hybrid|suv|sedan|truck|under|\$|car|cars|vehicle|vehicles/i.test(msg);
    const isComparisonRequest = /vs|versus|compared? to|compare/i.test(message);

    // Build comprehensive vehicle context
    const vehiclesContext = VEHICLES_DATA.map(v => 
      `${v.make} ${v.model} (${v.year || '2025'}): $${(v.price || 0).toLocaleString()}, ${v.mpg || 'N/A'} MPG, ${v.type}, ${v.drivetrain || 'FWD'}, ${v.fuelType || 'Gasoline'}, ${v.horsepower || 'N/A'} HP`
    ).join('\n');

    // Enhanced system prompt for ChatGPT-like responses
    const systemPrompt = `You are Toyota Sensei, a knowledgeable and friendly AI assistant for Toyota's vehicle shopping and finance platform. You help customers find the perfect vehicle, understand financing options, and make informed decisions.

**Available Vehicles:**
${vehiclesContext}

**Key Information:**
- Toyota offers competitive financing with APR ranging from 2.9% to 7.9% depending on credit score
- Leasing options: 24-48 month terms with lower monthly payments
- Subscription service: All-inclusive monthly payments with insurance and maintenance
- Toyota Safety Sense is standard on all models
- Hybrid models offer excellent fuel economy (40-57 MPG)
- All vehicles come with comprehensive warranties

**Your Role:**
- Provide natural, conversational responses like ChatGPT
- Answer questions about vehicles, financing, features, and comparisons
- When users ask about specific vehicles, provide detailed information from the available data
- For financing questions, explain options clearly and help with calculations
- Be helpful, friendly, and professional
- If asked about vehicles not in the list, acknowledge it and suggest similar alternatives
- Use markdown formatting for better readability (bold, lists, etc.)
- Keep responses informative but concise (2-4 paragraphs typically)

Respond naturally and conversationally, as if you're having a friendly chat with the customer.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-10).map(msg => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
      { role: 'user', content: message },
    ];

    let response = '';
    let action = 'chat';
    let vehiclesToReturn = null;

    // Try to use OpenAI first for ChatGPT-like responses
    if (process.env.OPENAI_API_KEY && openai) {
      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.8, // Higher temperature for more natural responses
          max_tokens: 500, // Increased for more detailed responses
        });

        response = completion.choices[0].message.content;

        // If it's a search request and we found vehicles, include them in the response
        if (isSearchRequest && matchingVehicles.length > 0) {
          action = 'search';
          vehiclesToReturn = matchingVehicles.slice(0, 10);
          
          // Enhance response with vehicle list if not already included
          if (!response.toLowerCase().includes('found') && !response.toLowerCase().includes('vehicle')) {
            const vehicleList = matchingVehicles.slice(0, 5).map(v => 
              `**${v.make} ${v.model}** - $${v.price?.toLocaleString() || 'N/A'} (${v.mpg || 'N/A'} MPG, ${v.type})`
            ).join('\n');
            response += `\n\n**Matching Vehicles:**\n${vehicleList}`;
          }
        } else if (isComparisonRequest) {
          action = 'compare';
        } else if (/finance|payment|lease|apr|interest/i.test(msg)) {
          action = 'finance';
        }
      } catch (openaiError) {
        console.error('OpenAI error:', openaiError);
        // Fallback to pattern matching if OpenAI fails
        response = generateFallbackResponse(msg, matchingVehicles, isSearchRequest, isComparisonRequest);
        if (isSearchRequest && matchingVehicles.length > 0) {
          vehiclesToReturn = matchingVehicles.slice(0, 10);
          action = 'search';
        }
      }
    } else {
      // No OpenAI key - use intelligent fallback
      response = generateFallbackResponse(msg, matchingVehicles, isSearchRequest, isComparisonRequest);
      if (isSearchRequest && matchingVehicles.length > 0) {
        vehiclesToReturn = matchingVehicles.slice(0, 10);
        action = 'search';
      }
    }

    // Return response
    res.json({
      response,
      vehicles: vehiclesToReturn,
      action: action,
      error: false,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      response: 'I\'m sorry, I encountered an error processing your request. Please try again.\n\n' +
        'Here are some things you can ask me:\n\n' +
        '• "Show me hybrid SUVs"\n' +
        '• "Find cars under $30,000"\n' +
        '• "Compare Camry vs Accord"\n' +
        '• "Tell me about financing options"',
      error: true,
      errorMessage: error.message,
    });
  }
});

// Calculate payment (buy, lease, or subscription)
app.post('/api/calculate-payment', (req, res) => {
  const { price, downPayment, apr, termMonths, isLease, isSubscription, residualValue, tradeInValue, taxRate } = req.body;

  const tax = taxRate || 0.08; // Default 8% tax
  const adjustedPrice = price * (1 + tax);
  const netPrice = adjustedPrice - (tradeInValue || 0) - downPayment;

  if (isSubscription) {
    // Subscription: all-inclusive monthly payment (includes insurance, maintenance, etc.)
    const baseMonthly = netPrice / termMonths;
    const insurance = 150; // Estimated monthly insurance
    const maintenance = 100; // Estimated monthly maintenance
    const monthlyPayment = baseMonthly + insurance + maintenance;
    const totalCost = monthlyPayment * termMonths + downPayment + (tradeInValue || 0);

    res.json({
      monthlyPayment: Math.round(monthlyPayment),
      totalCost: Math.round(totalCost),
      breakdown: {
        vehicle: Math.round(baseMonthly),
        insurance: insurance,
        maintenance: maintenance,
        taxes: Math.round(price * tax),
      },
      type: 'subscription',
    });
  } else if (isLease) {
    // Lease calculation
    const residual = residualValue || Math.round(price * 0.55);
    const depreciation = netPrice - residual;
    const monthlyDepreciation = depreciation / termMonths;
    const moneyFactor = apr / 2400; // Convert APR to money factor
    const monthlyFinance = (netPrice + residual) * moneyFactor;
    const monthlyPayment = monthlyDepreciation + monthlyFinance;
    const totalCost = monthlyPayment * termMonths + downPayment + (tradeInValue || 0);

    res.json({
      monthlyPayment: Math.round(monthlyPayment),
      totalCost: Math.round(totalCost),
      residualValue: residual,
      breakdown: {
        depreciation: Math.round(monthlyDepreciation),
        finance: Math.round(monthlyFinance),
        taxes: Math.round(price * tax),
      },
      type: 'lease',
    });
  } else {
    // Purchase/Finance calculation
    const principal = netPrice;
    const monthlyRate = apr / 100 / 12;
    let monthlyPayment;

    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths;
    } else {
      monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    }

    const totalCost = monthlyPayment * termMonths + downPayment + (tradeInValue || 0);
    const totalInterest = totalCost - adjustedPrice;

    res.json({
      monthlyPayment: Math.round(monthlyPayment),
      totalCost: Math.round(totalCost),
      totalInterest: Math.round(totalInterest),
      breakdown: {
        principal: Math.round(principal),
        interest: Math.round(totalInterest),
        taxes: Math.round(price * tax),
        tradeIn: tradeInValue || 0,
      },
      type: 'purchase',
    });
  }
});

// Request dealer offers
app.post('/api/request-offers', (req, res) => {
  const { vehicleId, zip } = req.body;
  const vehicle = VEHICLES_DATA.find(v => v.id === vehicleId);
  
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  // Mock dealer offers
  const offers = DEALERS.slice(0, 3).map(dealer => {
    const discount = Math.floor(Math.random() * 2000) + 500;
    const fees = Math.floor(Math.random() * 1500) + 800;
    const finalPrice = vehicle.price - discount + fees;

    return {
      dealerId: dealer.id,
      dealerName: dealer.name,
      dealerLocation: `${dealer.city}, ${dealer.state}`,
      dealerPhone: dealer.phone,
      originalPrice: vehicle.price,
      discount: discount,
      fees: fees,
      finalPrice: finalPrice,
      savings: discount - fees > 0 ? discount - fees : 0,
    };
  });

  res.json(offers);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to add your OPENAI_API_KEY to server/key.env`);
  console.log(`💡 AI Chat will use OpenAI API if key is set, otherwise uses intelligent fallback responses`);
});

