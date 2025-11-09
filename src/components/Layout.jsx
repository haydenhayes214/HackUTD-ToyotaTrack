import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Car, Calculator, MessageCircle, FolderHeart, BookOpen, X, Send, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./chat/MessageBubble";

// Hardcoded vehicles for client-side chatbot
const HARDCODED_VEHICLES = [
  { make: "Toyota", model: "Camry LE Hybrid", price: 30000, mpg: 52, type: "Sedan", fuelType: "Hybrid", horsepower: 208 },
  { make: "Toyota", model: "Camry XSE", price: 35000, mpg: 32, type: "Sedan", fuelType: "Gasoline", horsepower: 301 },
  { make: "Toyota", model: "RAV4 XLE Hybrid", price: 36000, mpg: 40, type: "SUV", fuelType: "Hybrid", horsepower: 219 },
  { make: "Toyota", model: "RAV4 Prime XSE", price: 45000, mpg: 94, type: "SUV", fuelType: "Plug-in Hybrid", horsepower: 302 },
  { make: "Toyota", model: "Corolla SE Hybrid", price: 24000, mpg: 53, type: "Sedan", fuelType: "Hybrid", horsepower: 121 },
  { make: "Toyota", model: "Tundra SR5", price: 42000, mpg: 20, type: "Truck", fuelType: "Gasoline", horsepower: 389 },
  { make: "Toyota", model: "GR Supra 3.0", price: 55000, mpg: 25, type: "Sports Car", fuelType: "Gasoline", horsepower: 382 },
  { make: "Toyota", model: "Highlander XLE", price: 42000, mpg: 24, type: "SUV", fuelType: "Gasoline", horsepower: 295 },
  { make: "Toyota", model: "Prius LE", price: 28000, mpg: 57, type: "Sedan", fuelType: "Hybrid", horsepower: 196 },
];

// Car buying advice chatbot - focused on helping users make informed Toyota purchase decisions
function generateClientResponse(message, vehicles = HARDCODED_VEHICLES) {
  const msg = message.toLowerCase();
  
  // Greetings
  if (/hello|hi|hey|greetings/i.test(msg)) {
    return "Hello! I'm Toyota Sensei, your car buying advisor. I'm here to help you make the best decision when buying a Toyota. I can advise on:\n\n• Budget and financing strategies\n• Choosing the right model for your needs\n• Hybrid vs gasoline vehicles\n• First-time buyer tips\n• Trade-in advice\n• Warranty and reliability\n\nWhat would you like help with today?";
  }
  
  // Budget and financing advice
  if (/budget|afford|price range|how much|can i afford|what can i afford/i.test(msg)) {
    const sorted = [...vehicles].sort((a, b) => a.price - b.price);
    const cheapest = sorted[0];
    const expensive = sorted[sorted.length - 1];
    return `**Budget Advice for Buying a Toyota:**\n\n• **Price Range:** $${cheapest.price.toLocaleString()} - $${expensive.price.toLocaleString()}\n• **Most Affordable:** ${cheapest.model} at $${cheapest.price.toLocaleString()}\n• **Average Price:** $${Math.round(vehicles.reduce((sum, v) => sum + v.price, 0) / vehicles.length).toLocaleString()}\n\n**Smart Budgeting Tips:**\n• Aim for 20% down payment to avoid being upside down\n• Keep monthly payment under 15% of your gross income\n• Consider certified pre-owned for better value\n• Factor in insurance, maintenance, and fuel costs\n• Use our Finance Calculator to plan ahead\n\n**Toyota Financing:**\n• Competitive APR rates (2.9% - 7.9% depending on credit)\n• Flexible terms (36-72 months)\n• Special offers for qualified buyers\n\nWhat's your budget range? I can recommend specific models!`;
  }
  
  // First-time buyer advice
  if (/first|new buyer|beginner|first time|never bought|new to buying/i.test(msg)) {
    return `**Advice for First-Time Toyota Buyers:**\n\n**1. Start with Your Needs:**\n• Daily commute? → Fuel-efficient hybrids (Corolla, Camry, Prius)\n• Family vehicle? → SUVs with space (Highlander, RAV4)\n• Sporty driving? → Performance models (GR Supra, Camry XSE)\n• Budget-conscious? → Entry-level models (Corolla, Prius)\n\n**2. Research & Preparation:**\n• Check your credit score (aim for 700+ for best rates)\n• Get pre-approved for financing\n• Research models on our Vehicles page\n• Read reviews and safety ratings\n• Schedule test drives\n\n**3. Financing Tips:**\n• Use our Finance Calculator to estimate payments\n• Follow the 20/4/10 rule: 20% down, 4-year term, 10% of income\n• Don't forget to factor in taxes, fees, and insurance\n• Consider Toyota's special financing offers\n\n**4. Best First Cars:**\n• **Corolla SE Hybrid** - $24,000, 53 MPG, reliable and affordable\n• **Camry LE Hybrid** - $30,000, 52 MPG, comfortable midsize\n• **RAV4 XLE Hybrid** - $36,000, 40 MPG, versatile SUV\n\n**5. What to Avoid:**\n• Don't buy more car than you can afford\n• Don't skip the test drive\n• Don't ignore maintenance costs\n• Don't forget about insurance premiums\n\nWould you like advice on a specific model or financing scenario?`;
  }
  
  // Hybrid vs Gas advice
  if (/hybrid|gas|gasoline|electric|fuel|mpg|efficiency|save money on gas/i.test(msg)) {
    const hybrids = vehicles.filter(v => v.fuelType.toLowerCase().includes("hybrid"));
    const gas = vehicles.filter(v => v.fuelType === "Gasoline");
    const mostEfficient = [...vehicles].sort((a, b) => b.mpg - a.mpg)[0];
    
    return `**Hybrid vs Gasoline - Which Should You Buy?**\n\n**Hybrid Benefits:**\n• **Better fuel economy** - Up to ${mostEfficient.mpg} MPG (vs 20-30 MPG for gas)\n• **Lower emissions** - Better for the environment\n• **Tax incentives** - May qualify for federal/state credits\n• **Great for city driving** - Regenerative braking saves fuel\n• **Proven technology** - Toyota has 25+ years of hybrid experience\n• **Higher resale value** - Hybrids hold value well\n\n**Gasoline Benefits:**\n• **Lower upfront cost** - Typically $2,000-$5,000 less\n• **More power** - Better for towing and heavy use\n• **No battery concerns** - Simpler long-term maintenance\n• **Better for highway** - Gas engines excel at constant speeds\n\n**When to Choose Hybrid:**\n✓ City/urban commuting\n✓ High annual mileage (15,000+ miles/year)\n✓ Environmental concerns\n✓ Want to save on fuel costs long-term\n\n**When to Choose Gas:**\n✓ Budget is tight\n✓ Mostly highway driving\n✓ Need maximum towing/power\n✓ Prefer simplicity\n\n**Top Hybrid Options:**\n${hybrids.slice(0, 3).map(v => `• ${v.model} - ${v.mpg} MPG, $${v.price.toLocaleString()}`).join("\n")}\n\n**Savings Example:** At $3.50/gallon and 15,000 miles/year, a ${mostEfficient.mpg} MPG hybrid saves about $${Math.round((15000/25 - 15000/mostEfficient.mpg) * 3.50)} per year vs a 25 MPG gas vehicle!\n\nWhat's your primary use case?`;
  }
  
  // SUV vs Sedan advice
  if (/suv|sedan|truck|which type|what type|vehicle type|should i get/i.test(msg)) {
    const suvs = vehicles.filter(v => v.type === "SUV");
    const sedans = vehicles.filter(v => v.type === "Sedan");
    const trucks = vehicles.filter(v => v.type === "Truck");
    
    return `**SUV vs Sedan vs Truck - Which Should You Buy?**\n\n**Choose an SUV if:**\n✓ You need 3 rows or more cargo space\n✓ You drive in snow/rough terrain frequently\n✓ You have a family or frequently transport passengers\n✓ You want higher seating position and visibility\n✓ You need towing capacity\n✓ You prefer AWD capability\n\n**Choose a Sedan if:**\n✓ You prioritize fuel economy\n✓ You want lower cost and insurance\n✓ You prefer better handling and ride comfort\n✓ You don't need extra cargo space\n✓ You mostly drive on paved roads\n✓ You want lower maintenance costs\n\n**Choose a Truck if:**\n✓ You need serious towing capacity\n✓ You frequently haul heavy loads\n✓ You work in construction/trades\n✓ You want maximum utility\n\n**Toyota SUV Options:**\n${suvs.map(v => `• ${v.model} - $${v.price.toLocaleString()}, ${v.mpg} MPG, ${v.seats} seats`).join("\n")}\n\n**Toyota Sedan Options:**\n${sedans.map(v => `• ${v.model} - $${v.price.toLocaleString()}, ${v.mpg} MPG`).join("\n")}\n\n**Toyota Truck Options:**\n${trucks.map(v => `• ${v.model} - $${v.price.toLocaleString()}, ${v.horsepower} HP`).join("\n")}\n\nWhat's your lifestyle and driving needs? I can help you decide!`;
  }
  
  // Financing and payment advice
  if (/finance|financing|loan|payment|apr|interest|monthly payment|down payment/i.test(msg)) {
    return `**Financing Advice for Your Toyota Purchase:**\n\n**1. Down Payment Strategy:**\n• **Recommended:** 20% of vehicle price\n• **Minimum:** 10% (but you'll pay more interest)\n• **Why 20%?** Prevents being "upside down" (owing more than car is worth)\n• Larger down payment = lower monthly payments and less interest\n\n**2. Loan Terms - Choose Wisely:**\n• **36-48 months:** Less total interest, higher payments (BEST VALUE)\n• **60 months:** Balanced option, manageable payments\n• **72+ months:** Lower payments, but significantly more interest (AVOID if possible)\n• **Rule of thumb:** Keep term under 4 years if you can afford it\n\n**3. APR & Credit Score Impact:**\n• **Excellent (750+):** 2.9% - 4.9% APR → Save thousands in interest\n• **Good (700-749):** 4.9% - 6.9% APR → Still good rates\n• **Fair (650-699):** 6.9% - 9.9% APR → Consider improving credit first\n• **Poor (<600):** 9.9%+ APR → Work on credit before buying\n\n**4. Monthly Payment Rule:**\n• Should be ≤ 15% of your gross monthly income\n• Example: $5,000/month income = max $750/month payment\n• Use our Finance Calculator to see real numbers\n\n**5. Toyota Financing Benefits:**\n• Competitive rates vs other lenders\n• Special offers for qualified buyers\n• Flexible terms to fit your budget\n• Trade-in options to reduce loan amount\n• Pre-approval available\n\n**6. What to Avoid:**\n✗ Stretching your budget too thin\n✗ Taking 72+ month loans (you'll pay way more)\n✗ Skipping down payment if you can afford it\n✗ Not shopping around for rates\n\nTry our Finance Calculator to see your specific payment options!`;
  }
  
  // Specific model recommendations
  if (/recommend|suggest|best|which car|what should i buy|help me choose/i.test(msg)) {
    const context = msg;
    let recommendations = [];
    
    if (/family|kids|space|children|passengers/i.test(context)) {
      recommendations = vehicles.filter(v => v.type === "SUV" || v.seats >= 5);
      return `**Best Toyota for Families:**\n\n${recommendations.slice(0, 3).map(v => `• **${v.model}** - $${v.price.toLocaleString()}\n  - ${v.seats} seats, ${v.mpg} MPG, ${v.type}\n  - ${v.horsepower} HP, ${v.fuelType}\n  - Great for: Family trips, daily errands, safety`).join("\n\n")}\n\n**Why these?** Spacious, safe, reliable, excellent safety ratings, and perfect for family adventures. The Highlander offers 7 seats for larger families!`;
    }
    
    if (/commute|gas|save|efficient|economy|fuel/i.test(context)) {
      const efficient = [...vehicles].sort((a, b) => b.mpg - a.mpg).slice(0, 3);
      return `**Most Fuel-Efficient Toyotas (Best for Commuting):**\n\n${efficient.map(v => `• **${v.model}** - ${v.mpg} MPG\n  - $${v.price.toLocaleString()}, ${v.fuelType}\n  - Perfect for: Daily commuting, saving on gas`).join("\n\n")}\n\n**Annual Savings:** At $3.50/gallon and 15,000 miles/year:\n• ${efficient[0].model} saves $${Math.round((15000/25 - 15000/efficient[0].mpg) * 3.50)}/year vs 25 MPG vehicle\n• ${efficient[1].model} saves $${Math.round((15000/25 - 15000/efficient[1].mpg) * 3.50)}/year\n• Over 5 years, that's $${Math.round((15000/25 - 15000/efficient[0].mpg) * 3.50 * 5)} in fuel savings!`;
    }
    
    if (/sport|fast|performance|fun|power|speed/i.test(context)) {
      const sporty = vehicles.filter(v => v.horsepower > 300 || v.type === "Sports Car");
      return `**Sporty Toyota Options (For Performance Enthusiasts):**\n\n${sporty.map(v => `• **${v.model}** - ${v.horsepower} HP\n  - $${v.price.toLocaleString()}, ${v.mpg} MPG\n  - Perfect for: Thrilling drives, track days`).join("\n\n")}\n\n**For Maximum Performance:** The GR Supra offers track-ready handling, 382 HP, and legendary sports car heritage!`;
    }
    
    if (/budget|cheap|affordable|inexpensive|under/i.test(context)) {
      const budget = [...vehicles].sort((a, b) => a.price - b.price).slice(0, 3);
      return `**Most Affordable Toyotas:**\n\n${budget.map(v => `• **${v.model}** - $${v.price.toLocaleString()}\n  - ${v.mpg} MPG, ${v.type}\n  - Great value, reliable, efficient`).join("\n\n")}\n\n**Smart Budget Choice:** The Corolla SE Hybrid offers exceptional value at $24,000 with 53 MPG - perfect for first-time buyers!`;
    }
    
    return `**Toyota Recommendations Based on Your Needs:**\n\n**For Budget-Conscious Buyers:**\n• Corolla SE Hybrid - $24,000, 53 MPG, reliable entry-level\n• Prius LE - $28,000, 57 MPG, iconic hybrid\n\n**For Families:**\n• Highlander XLE - $42,000, 7 seats, spacious 3-row SUV\n• RAV4 XLE Hybrid - $36,000, 40 MPG, versatile compact SUV\n\n**For Performance Enthusiasts:**\n• GR Supra 3.0 - $55,000, 382 HP, track-ready sports car\n• Camry XSE - $35,000, 301 HP, sporty V6 sedan\n\n**For Commuters:**\n• Prius LE - $28,000, 57 MPG (best fuel economy)\n• Corolla SE Hybrid - $24,000, 53 MPG (most affordable hybrid)\n• Camry LE Hybrid - $30,000, 52 MPG (comfortable midsize)\n\nWhat's most important to you - budget, space, performance, or efficiency?`;
  }
  
  // Comparison advice
  if (/compare|vs|versus|difference|better/i.test(msg)) {
    const models = msg.match(/(\w+)\s+(?:vs|versus|compare|difference|better)\s+(\w+)/i);
    if (models) {
      const v1 = vehicles.find(v => v.model.toLowerCase().includes(models[1].toLowerCase()));
      const v2 = vehicles.find(v => v.model.toLowerCase().includes(models[2].toLowerCase()));
      if (v1 && v2) {
        return `**Comparing ${v1.model} vs ${v2.model}:**\n\n**${v1.model}:**\n• Price: $${v1.price.toLocaleString()}\n• MPG: ${v1.mpg}\n• HP: ${v1.horsepower}\n• Type: ${v1.type}\n• Fuel: ${v1.fuelType}\n• Seats: ${v1.seats || 5}\n\n**${v2.model}:**\n• Price: $${v2.price.toLocaleString()}\n• MPG: ${v2.mpg}\n• HP: ${v2.horsepower}\n• Type: ${v2.type}\n• Fuel: ${v2.fuelType}\n• Seats: ${v2.seats || 5}\n\n**Which to Choose?**\n${v1.price < v2.price ? `• ${v1.model} saves $${(v2.price - v1.price).toLocaleString()} upfront` : `• ${v2.model} costs $${(v1.price - v2.price).toLocaleString()} more`}\n${v1.mpg > v2.mpg ? `• ${v1.model} gets ${v1.mpg - v2.mpg} more MPG (saves on gas)` : `• ${v2.model} gets ${v2.mpg - v1.mpg} more MPG`}\n${v1.horsepower > v2.horsepower ? `• ${v1.model} has ${v1.horsepower - v2.horsepower} more HP (more power)` : `• ${v2.model} has ${v2.horsepower - v1.horsepower} more HP`}\n\n**Recommendation:** ${v1.type === v2.type ? "Both are great choices!" : v1.type === "SUV" ? "Choose SUV if you need space and versatility" : "Choose Sedan if you prioritize efficiency and cost"}.\n\nUse our comparison tool for detailed analysis!`;
      }
    }
    return "I can help you compare Toyota models! Try asking:\n• 'Compare Camry vs RAV4'\n• 'Difference between hybrid and gas'\n• 'Highlander vs RAV4'\n• 'Corolla vs Camry'\n\nWhat would you like to compare?";
  }
  
  // Trade-in advice
  if (/trade|trade-in|trade in|old car|current car|sell my car/i.test(msg)) {
    return `**Trade-In Advice for Your Toyota Purchase:**\n\n**Benefits of Trading In:**\n• Reduces your loan amount (acts as down payment)\n• Lowers monthly payments\n• Simplifies the process (one transaction)\n• May reduce sales tax (in some states)\n• Quick and convenient\n\n**Maximize Your Trade-In Value:**\n• **Get appraised first** - Know your car's worth before negotiating\n• **Research value** - Check KBB, Edmunds, NADA guides\n• **Clean it up** - Wash, vacuum, fix minor issues\n• **Gather documents** - Title, maintenance records, service history\n• **Time it right** - Trade when your car still has value\n\n**Toyota Trade-In Program:**\n• We accept all makes and models (not just Toyotas)\n• Competitive offers based on market value\n• Can be applied directly to your down payment\n• Quick evaluation process\n• Hassle-free transaction\n\n**Alternative: Private Sale**\n• You might get 10-20% more selling privately\n• But requires more time and effort\n• Consider if the extra money is worth it\n\n**Tip:** Get a trade-in quote from Toyota, then compare to private sale value. The convenience of trade-in often makes it worth a slightly lower price.\n\nWould you like to estimate your trade-in value or learn more about the process?`;
  }
  
  // Warranty and reliability
  if (/warranty|reliable|reliability|maintenance|repair|break down|problems/i.test(msg)) {
    return `**Toyota Reliability & Warranty - Why It Matters:**\n\n**Toyota's Reputation:**\n• Consistently ranked among most reliable brands (Consumer Reports, J.D. Power)\n• High resale value (Toyotas hold value better than most brands)\n• Long-lasting vehicles (many last 200,000+ miles with proper maintenance)\n• Lower maintenance costs than luxury brands\n• Excellent safety ratings across all models\n\n**Warranty Coverage:**\n• **Basic:** 3 years/36,000 miles (bumper-to-bumper)\n• **Powertrain:** 5 years/60,000 miles (engine, transmission)\n• **Hybrid components:** 8 years/100,000 miles (battery, hybrid system)\n• **Rust:** 5 years/unlimited miles\n• **Roadside assistance:** 2 years/unlimited miles\n\n**Maintenance Tips:**\n• Follow Toyota's recommended maintenance schedule\n• Use genuine Toyota parts for best performance\n• Regular oil changes and inspections\n• Keep service records (increases resale value)\n• Find a trusted Toyota service center\n\n**Why Toyota Reliability Matters:**\n• Less time in the shop = more time on the road\n• Lower repair costs over vehicle lifetime\n• Better resale value when you're ready to upgrade\n• Peace of mind knowing your investment is protected\n• Toyota's reputation for quality is well-earned\n\n**This makes Toyota a smart long-term investment!** You're not just buying a car, you're buying reliability and peace of mind.\n\nWould you like to know more about a specific model's reliability ratings?`;
  }
  
  // Vehicle search (keep this but make it advice-focused)
  if (/show|find|search|look for|list|see/i.test(msg)) {
    let filtered = [...vehicles];
    
    if (/hybrid/i.test(msg)) {
      filtered = filtered.filter(v => v.fuelType.toLowerCase().includes('hybrid'));
    }
    if (/suv/i.test(msg)) {
      filtered = filtered.filter(v => v.type === 'SUV');
    }
    if (/sedan/i.test(msg)) {
      filtered = filtered.filter(v => v.type === 'Sedan');
    }
    if (/truck/i.test(msg)) {
      filtered = filtered.filter(v => v.type === 'Truck');
    }
    if (/under.*\$?(\d+)/i.test(msg)) {
      const match = msg.match(/under.*\$?(\d+)/i);
      const maxPrice = parseInt(match[1]) * 1000;
      filtered = filtered.filter(v => v.price <= maxPrice);
    }
    
    if (filtered.length === 0) {
      return "I couldn't find any vehicles matching your criteria. Here's my advice:\n\n• Try broadening your search (e.g., 'show me all SUVs')\n• Consider your budget range\n• Think about your primary needs (space, efficiency, performance)\n\nWhat are you looking for in your next Toyota?";
    }
    
    const vehicleList = filtered.map(v => 
      `• **${v.model}** - $${v.price.toLocaleString()} (${v.mpg} MPG, ${v.fuelType}, ${v.horsepower} HP)`
    ).join('\n');
    
    return `I found ${filtered.length} Toyota vehicle(s) matching your search:\n\n${vehicleList}\n\n**My Recommendation:** ${filtered.length === 1 ? `The ${filtered[0].model} is a great choice!` : `Compare these options based on your priorities - budget, features, or fuel economy.`}\n\nWould you like advice on choosing between these, or details about financing?`;
  }
  
  // Default helpful responses
  const responses = [
    "I'm your Toyota buying advisor! I can help you with:\n\n• **Budget & Financing** - Smart payment planning and loan advice\n• **Model Selection** - Finding the perfect Toyota for your needs\n• **Hybrid vs Gas** - Which fuel type fits your lifestyle\n• **SUV vs Sedan** - Choosing the right vehicle type\n• **First-Time Buyer Tips** - Guidance for new car buyers\n• **Trade-ins** - Maximizing your trade-in value\n• **Warranty & Reliability** - Understanding Toyota's coverage\n• **Comparisons** - Side-by-side model analysis\n\nWhat would you like help with?",
    "Welcome! I'm Toyota Sensei, your car buying advisor. I'm here to help you make an informed decision. Ask me about:\n\n• Finding the right model for your needs\n• Budget and financing strategies\n• Hybrid vs gasoline vehicles\n• Family-friendly options\n• Performance vehicles\n• Fuel efficiency and savings\n• Trade-in advice\n\nWhat can I help you decide today?",
    "I'm here to guide you through buying a Toyota! I provide expert advice on:\n\n• Vehicle recommendations based on your needs\n• Financing and payment planning\n• Model comparisons\n• Trade-in information\n• Reliability and warranty questions\n• First-time buyer guidance\n\nWhat are you looking for in your next Toyota?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: createPageUrl("Home"), icon: Home },
    { name: "Vehicles", path: createPageUrl("Vehicles"), icon: Car },
    { name: "Finance", path: createPageUrl("Finance"), icon: Calculator },
    { name: "Learn", path: createPageUrl("FinancialLiteracy"), icon: BookOpen },
    { name: "My Garage", path: createPageUrl("MyGarage"), icon: FolderHeart },
  ];

  const API_BASE = 'http://localhost:3001/api';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Listen for custom event to open chat from other components
  useEffect(() => {
    const handleOpenChat = () => {
      setShowChat(true);
    };
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    const newUserMessage = {
      role: "user",
      content: userMessage,
    };

    // Update messages and clear input immediately
    setChatMessages(prev => [...prev, newUserMessage]);
    const currentMessages = [...chatMessages, newUserMessage];
    setChatInput("");
    setChatLoading(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Build conversation history from current messages (excluding the one we just added)
      const conversationHistory = chatMessages.map(msg => ({
        from: msg.role === "user" ? "user" : "bot",
        text: msg.content,
      }));

      // Try server with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory: conversationHistory,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          
          if (!data.error) {
            const assistantMessage = {
              role: "assistant",
              content: data.response || "I'm sorry, I couldn't process that request.",
            };
            setChatMessages(prev => [...prev, assistantMessage]);
            setChatLoading(false);
            return;
          }
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
          console.log("Request timeout, using client-side chatbot");
        } else {
          console.log("Server not available, using client-side chatbot");
        }
      }

      // Client-side fallback
      try {
        const response = generateClientResponse(userMessage, HARDCODED_VEHICLES);
        const assistantMessage = {
          role: "assistant",
          content: response,
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } catch (clientError) {
        console.error("Client-side chatbot error:", clientError);
        const errorResponse = {
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your question. Please try rephrasing it or ask about budget, financing, model recommendations, or comparisons.",
        };
        setChatMessages(prev => [...prev, errorResponse]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorResponse = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again or rephrase your question.",
      };
      setChatMessages(prev => [...prev, errorResponse]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      if (!chatLoading && chatInput.trim()) {
        handleChatSend();
      }
      return false;
    }
  };

  const isHomePage = location.pathname === createPageUrl("Home");

  return (
    <div className="min-h-screen bg-[#e0e0e0]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap');
        
        * {
          font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
        }
        
        .neumorphic {
          background: #e0e0e0;
          box-shadow: 8px 8px 16px #bebebe, -8px -8px 16px #ffffff;
          border-radius: 20px;
        }
        
        .neumorphic-inset {
          background: #e0e0e0;
          box-shadow: inset 6px 6px 12px #bebebe, inset -6px -6px 12px #ffffff;
          border-radius: 20px;
        }
        
        .neumorphic-button {
          background: #e0e0e0;
          box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .neumorphic-button:hover {
          box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff;
        }
        
        .neumorphic-button:active {
          box-shadow: inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff;
        }
        
        .toyota-red-button {
          background: linear-gradient(145deg, #ff1127, #d60916);
          box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
          border-radius: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .toyota-red-button:hover {
          box-shadow: 4px 4px 8px #bebebe, -4px -4px 8px #ffffff, 0 0 20px rgba(235, 10, 30, 0.3);
          transform: translateY(-1px);
        }
        
        .toyota-red-button:active {
          box-shadow: inset 4px 4px 8px #c00812, inset -4px -4px 8px #ff1c2e;
          transform: translateY(0);
        }
        .glassmorphic {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glassmorphic:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.15);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(235, 10, 30, 0.5); }
          50% { box-shadow: 0 0 40px rgba(235, 10, 30, 0.8); }
        }
      `}</style>

      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHomePage
            ? 'bg-[#e0e0e0] shadow-lg' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/691014dbc031a1b0c767643d/c9b339dbc_image.png"
                alt="Toyota Logo"
                className="h-10 w-auto"
              />
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${scrolled || !isHomePage ? 'text-[#1C1C1C]' : 'text-white'}`}>TOYOTA</span>
                <span className="text-lg font-bold text-[#EB0A1E]">AI</span>
              </div>
            </Link>

            {/* Nav Items - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                      isActive && (scrolled || !isHomePage)
                        ? "shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] text-[#EB0A1E]"
                        : isActive && isHomePage && !scrolled
                        ? "bg-white/20 backdrop-blur-md text-white"
                        : scrolled || !isHomePage
                        ? "neumorphic-button text-[#1C1C1C] hover:text-[#EB0A1E]"
                        : "text-white/90 hover:bg-white/10 backdrop-blur-md"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </Link>
                );
              })}
              {/* AI Chat Button */}
              <button
                onClick={() => setShowChat(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all ${
                  scrolled || !isHomePage
                    ? "neumorphic-button text-[#1C1C1C] hover:text-[#EB0A1E]"
                    : "text-white/90 hover:bg-white/10 backdrop-blur-md"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm">AI Chat</span>
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden mt-4 gap-2 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap ${
                    isActive && (scrolled || !isHomePage)
                      ? "shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff] text-[#EB0A1E]"
                      : isActive && isHomePage && !scrolled
                      ? "bg-white/20 backdrop-blur-md text-white"
                      : scrolled || !isHomePage
                      ? "neumorphic-button text-[#1C1C1C]"
                      : "text-white/90 bg-white/10 backdrop-blur-md"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{item.name}</span>
                </Link>
              );
            })}
            {/* AI Chat Button - Mobile */}
            <button
              onClick={() => setShowChat(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap ${
                scrolled || !isHomePage
                  ? "neumorphic-button text-[#1C1C1C]"
                  : "text-white/90 bg-white/10 backdrop-blur-md"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">AI Chat</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {showChat && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowChat(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            {/* Chat Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed bottom-6 right-6 w-full max-w-md h-[600px] neumorphic z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#EB0A1E] rounded-xl">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1C1C1C]">Toyota Sensei</h3>
                    <p className="text-xs text-gray-600">AI Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowChat(false)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5 text-[#1C1C1C]" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {chatMessages.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="text-center">
                        <div className="neumorphic p-6 inline-block mb-4">
                          <Sparkles className="w-12 h-12 text-[#EB0A1E]" />
                        </div>
                        <h3 className="text-xl font-bold text-[#1C1C1C] mb-2">
                          Welcome! I'm Toyota Sensei
                        </h3>
                        <p className="text-gray-600 text-sm">
                          Ask me anything about vehicles, financing, or comparisons
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    chatMessages.map((message, index) => (
                      <MessageBubble key={index} message={message} />
                    ))
                  )}
                </AnimatePresence>
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="neumorphic-inset p-3 rounded-2xl">
                      <Loader2 className="w-5 h-5 text-[#EB0A1E] animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="neumorphic-inset p-4 border-t border-gray-300">
                <div className="flex items-end gap-3">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={handleChatKeyPress}
                    placeholder="Ask about vehicles, financing, or comparisons..."
                    className="flex-1 bg-transparent resize-none outline-none text-[#1C1C1C] placeholder-gray-500 max-h-32 text-sm"
                    rows={1}
                    disabled={chatLoading}
                  />
                  <button
                    type="button"
                    onClick={handleChatSend}
                    disabled={!chatInput.trim() || chatLoading}
                    className={`p-3 rounded-xl transition-all ${
                      chatInput.trim() && !chatLoading
                        ? "toyota-red-button text-white"
                        : "neumorphic-button text-gray-400"
                    }`}
                  >
                    {chatLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

