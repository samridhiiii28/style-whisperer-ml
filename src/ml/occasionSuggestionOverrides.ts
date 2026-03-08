export interface OccasionSuggestion {
  item: string;
  color: string;
  reason: string;
}

export interface OccasionSuggestionOverrides {
  bottomWear: OccasionSuggestion[];
  footwear: OccasionSuggestion[];
  accessories: OccasionSuggestion[];
}

// ─── OFFICE / WORK / FORMAL ─────────────────────────────────────────────────

const OFFICE_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Straight-Leg Tailored Trousers", color: "Charcoal", reason: "Sharp silhouette for polished office look." },
    { item: "Pleated Cigarette Pants", color: "Navy", reason: "Professional and structured for long office hours." },
    { item: "High-Waist Pencil Skirt", color: "Black", reason: "Classic formal bottom for meetings and presentations." },
    { item: "Wide-Leg Wool Trousers", color: "Stone", reason: "Modern office tailoring with comfort and drape." },
    { item: "Slim Chinos", color: "Taupe", reason: "Business-casual staple for smart layering." },
    { item: "Creased Dress Pants", color: "Dark Grey", reason: "Sharp crease adds instant formality." },
    { item: "Midi A-Line Skirt", color: "Camel", reason: "Feminine silhouette appropriate for office." },
  ],
  footwear: [
    { item: "Leather Loafers", color: "Black", reason: "Reliable office footwear for a clean finish." },
    { item: "Pointed-Toe Block Heels", color: "Nude", reason: "Comfortable heels for all-day office wear." },
    { item: "Oxford Shoes", color: "Brown", reason: "Structured and timeless for formal workwear." },
    { item: "Kitten Heels", color: "Burgundy", reason: "Subtle personality without losing formality." },
    { item: "Derby Shoes", color: "Tan", reason: "Great for smart looks with long wear comfort." },
    { item: "Slingback Pumps", color: "Black", reason: "Elegant slingbacks for boardroom-ready style." },
    { item: "Monk Strap Shoes", color: "Dark Brown", reason: "Distinctive buckle detail for professional edge." },
  ],
  accessories: [
    { item: "Structured Tote Bag", color: "Black", reason: "Carries essentials while keeping the look refined." },
    { item: "Slim Leather Belt", color: "Brown", reason: "Defines outfit lines and elevates tailoring." },
    { item: "Minimal Analog Watch", color: "Silver", reason: "Professional detail suited for work settings." },
    { item: "Pearl Stud Earrings", color: "White", reason: "Subtle accessory for formal environments." },
    { item: "Silk Neck Scarf", color: "Navy", reason: "Adds polish and color control in office attire." },
    { item: "Laptop Sleeve", color: "Charcoal", reason: "Practical add-on matching professional style." },
    { item: "Cuff Bracelet", color: "Gold", reason: "Refined wrist accent for office outfits." },
  ],
};

// ─── COLLEGE / CAMPUS / SCHOOL ──────────────────────────────────────────────

const COLLEGE_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Relaxed Fit Jeans", color: "Light Blue", reason: "Comfortable for long campus days." },
    { item: "Cargo Pants", color: "Olive", reason: "Trendy college staple with pocket utility." },
    { item: "Wide-Leg Denim", color: "Washed Black", reason: "Popular campus silhouette with streetwear vibe." },
    { item: "A-Line Midi Skirt", color: "Cream", reason: "Casual and put-together for campus events." },
    { item: "Parachute Pants", color: "Grey", reason: "Youthful trend with breathable comfort." },
    { item: "Pleated Tennis Skirt", color: "White", reason: "Sporty-preppy option for college." },
    { item: "Corduroy Pants", color: "Mustard", reason: "Retro corduroy for a distinctive campus look." },
  ],
  footwear: [
    { item: "Retro Sneakers", color: "White", reason: "Campus-friendly and works with every casual look." },
    { item: "Canvas Shoes", color: "Black", reason: "Affordable and versatile for daily classes." },
    { item: "Platform Sneakers", color: "Beige", reason: "Adds height and trendiness with comfort." },
    { item: "Chunky Sandals", color: "Tan", reason: "Good for warm-weather campus outfits." },
    { item: "Slip-On Loafers", color: "Brown", reason: "Quick on/off option for student life." },
    { item: "High-Top Sneakers", color: "Black", reason: "Streetwear high-tops for campus style." },
    { item: "Birkenstock Sandals", color: "Taupe", reason: "Comfort-first sandals loved on campus." },
  ],
  accessories: [
    { item: "Backpack", color: "Black", reason: "Most practical carry for books and devices." },
    { item: "Canvas Tote Bag", color: "Natural", reason: "Lightweight and trendy for campus use." },
    { item: "Sports Watch", color: "Black", reason: "Functional for schedule tracking." },
    { item: "Hoop Earrings", color: "Gold", reason: "Trend-forward detail for student outfits." },
    { item: "Layered Necklace", color: "Silver", reason: "Adds personality to basic campus looks." },
    { item: "Baseball Cap", color: "Navy", reason: "Casual finishing touch for lectures." },
    { item: "Friendship Bracelet", color: "Multi", reason: "Fun colorful bracelet for a youthful vibe." },
  ],
};

// ─── PARTY / NIGHT OUT / CLUB ───────────────────────────────────────────────

const PARTY_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Leather Pants", color: "Black", reason: "Bold statement for a night-out look." },
    { item: "Sequin Mini Skirt", color: "Silver", reason: "Party-ready sparkle for the dance floor." },
    { item: "Satin Trousers", color: "Champagne", reason: "Luxe satin adds evening glamour." },
    { item: "Bodycon Skirt", color: "Black", reason: "Sleek bodycon silhouette for parties." },
    { item: "High-Waist Flared Pants", color: "Navy", reason: "Retro flares for a fun party vibe." },
    { item: "Metallic Mini Skirt", color: "Gold", reason: "Eye-catching metallic for nightlife." },
    { item: "Velvet Trousers", color: "Burgundy", reason: "Rich velvet texture for evening events." },
  ],
  footwear: [
    { item: "Stiletto Heels", color: "Black", reason: "Classic party heels for a polished look." },
    { item: "Strappy Sandals", color: "Gold", reason: "Glamorous strappy sandals for evenings." },
    { item: "Platform Heels", color: "Silver", reason: "Statement platforms for nightlife." },
    { item: "Ankle Boots", color: "Black", reason: "Edgy boots for a night-out outfit." },
    { item: "Embellished Flats", color: "Crystal", reason: "Sparkly flats for dancing all night." },
    { item: "Block Heel Sandals", color: "Red", reason: "Bold red heels to command attention." },
    { item: "Pointed Mules", color: "Black", reason: "Chic mules for sophisticated party style." },
  ],
  accessories: [
    { item: "Clutch Bag", color: "Black", reason: "Compact party essential for night out." },
    { item: "Statement Earrings", color: "Gold", reason: "Bold earrings to elevate party outfits." },
    { item: "Chain Choker", color: "Silver", reason: "Edgy choker for nightlife glamour." },
    { item: "Cocktail Ring", color: "Crystal", reason: "Sparkling ring for a party finishing touch." },
    { item: "Metallic Belt", color: "Gold", reason: "Glamorous belt to cinch party outfits." },
    { item: "Glitter Clutch", color: "Silver", reason: "Sparkly bag for a festive look." },
    { item: "Cuff Bracelet", color: "Gold", reason: "Bold cuff for statement party style." },
  ],
};

// ─── DATE NIGHT / DINNER ────────────────────────────────────────────────────

const DATE_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Slim Fit Dark Jeans", color: "Black", reason: "Sleek dark jeans for a refined date look." },
    { item: "Silk Midi Skirt", color: "Burgundy", reason: "Romantic silk skirt for dinner dates." },
    { item: "Tailored Trousers", color: "Navy", reason: "Polished trousers for upscale date spots." },
    { item: "Leather A-Line Skirt", color: "Brown", reason: "Edgy-chic leather for date night." },
    { item: "Wide-Leg Satin Pants", color: "Black", reason: "Luxe satin for romantic evening vibes." },
    { item: "Pleated Midi Skirt", color: "Dusty Rose", reason: "Soft feminine pleats for date elegance." },
    { item: "High-Waist Trousers", color: "Cream", reason: "Elegant high-waist for a put-together look." },
  ],
  footwear: [
    { item: "Kitten Heels", color: "Nude", reason: "Comfortable and elegant for dinner dates." },
    { item: "Suede Ankle Boots", color: "Black", reason: "Chic suede boots for date night." },
    { item: "Strappy Block Heels", color: "Tan", reason: "Walkable heels for dinner and drinks." },
    { item: "Pointed Flats", color: "Red", reason: "Bold flats for a confident date look." },
    { item: "Slingback Pumps", color: "Black", reason: "Classic pumps for an elegant evening." },
    { item: "Mule Heels", color: "Cream", reason: "Effortless mules for relaxed date style." },
    { item: "Chelsea Boots", color: "Brown", reason: "Smart boots for casual date settings." },
  ],
  accessories: [
    { item: "Delicate Pendant Necklace", color: "Gold", reason: "Romantic pendant for a date look." },
    { item: "Small Crossbody Bag", color: "Black", reason: "Hands-free bag for date convenience." },
    { item: "Drop Earrings", color: "Silver", reason: "Elegant drops that catch the candlelight." },
    { item: "Perfume Bracelet", color: "Gold", reason: "Subtle fragrance accessory for dates." },
    { item: "Silk Scarf", color: "Printed", reason: "Adds romantic flair to date outfits." },
    { item: "Dainty Ring Set", color: "Gold", reason: "Stacked rings for understated elegance." },
    { item: "Evening Clutch", color: "Velvet Burgundy", reason: "Luxe clutch for upscale dining." },
  ],
};

// ─── WEDDING / FESTIVE ──────────────────────────────────────────────────────

const WEDDING_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Silk Palazzo Pants", color: "Ivory", reason: "Flowy silk for wedding guest elegance." },
    { item: "Embroidered Sharara", color: "Rose Gold", reason: "Festive sharara for traditional weddings." },
    { item: "Pleated Maxi Skirt", color: "Pastel Blue", reason: "Graceful pleats for wedding celebrations." },
    { item: "Brocade Skirt", color: "Gold", reason: "Rich brocade for festive occasions." },
    { item: "Chiffon Wide-Leg Pants", color: "Peach", reason: "Lightweight chiffon for warm wedding venues." },
    { item: "Velvet Straight Pants", color: "Emerald", reason: "Luxe velvet for winter wedding guests." },
    { item: "Organza Midi Skirt", color: "Lilac", reason: "Sheer organza for dreamy wedding attire." },
  ],
  footwear: [
    { item: "Embellished Heels", color: "Gold", reason: "Sparkling heels for wedding celebrations." },
    { item: "Satin Pumps", color: "Champagne", reason: "Classic satin pumps for elegant events." },
    { item: "Block Heel Sandals", color: "Rose Gold", reason: "Comfortable heels for long ceremonies." },
    { item: "Crystal Kitten Heels", color: "Silver", reason: "Delicate crystal heels for weddings." },
    { item: "Metallic Flats", color: "Gold", reason: "Festive flats for dancing at receptions." },
    { item: "Peep-Toe Heels", color: "Nude", reason: "Classic peep-toes for wedding guest outfits." },
    { item: "Juttis / Mojari", color: "Gold", reason: "Traditional festive footwear for ethnic weddings." },
  ],
  accessories: [
    { item: "Statement Necklace", color: "Gold", reason: "Bold necklace for wedding celebrations." },
    { item: "Embroidered Clutch", color: "Rose Gold", reason: "Festive clutch matching wedding attire." },
    { item: "Jhumka Earrings", color: "Gold", reason: "Traditional earrings for festive occasions." },
    { item: "Maang Tikka", color: "Gold", reason: "Traditional headpiece for ethnic weddings." },
    { item: "Crystal Hair Pin", color: "Silver", reason: "Delicate hair accessory for celebrations." },
    { item: "Bangle Set", color: "Gold", reason: "Stacking bangles for festive wrist styling." },
    { item: "Potli Bag", color: "Red", reason: "Traditional bag for wedding ceremonies." },
  ],
};

// ─── CASUAL / EVERYDAY ──────────────────────────────────────────────────────

const CASUAL_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Mom Jeans", color: "Light Blue", reason: "Relaxed mom jeans for easy everyday style." },
    { item: "Jogger Pants", color: "Grey", reason: "Comfy joggers for errands and coffee runs." },
    { item: "Bermuda Shorts", color: "Khaki", reason: "Casual bermudas for warm weekend outings." },
    { item: "Linen Drawstring Pants", color: "Sand", reason: "Breathable linen for laid-back days." },
    { item: "Barrel Leg Jeans", color: "Washed Blue", reason: "Trendy barrel-leg for a modern casual look." },
    { item: "Sweatpants", color: "Black", reason: "Ultimate comfort for casual hangouts." },
    { item: "Denim Shorts", color: "Blue", reason: "Classic denim shorts for summer casual." },
  ],
  footwear: [
    { item: "White Sneakers", color: "White", reason: "Clean sneakers that go with everything." },
    { item: "Slide Sandals", color: "Black", reason: "Easy slides for quick errands." },
    { item: "Canvas Slip-Ons", color: "Navy", reason: "Effortless slip-ons for everyday wear." },
    { item: "Running Shoes", color: "Grey", reason: "Sporty comfort for active casual days." },
    { item: "Flip Flops", color: "Brown", reason: "Beach-ready casual footwear." },
    { item: "Platform Sneakers", color: "White", reason: "Trendy platforms for casual outings." },
    { item: "Clogs", color: "Tan", reason: "Comfortable clogs for relaxed weekend style." },
  ],
  accessories: [
    { item: "Crossbody Bag", color: "Brown", reason: "Hands-free bag for everyday convenience." },
    { item: "Bucket Hat", color: "Beige", reason: "Trendy hat for casual sun protection." },
    { item: "Digital Watch", color: "Black", reason: "Functional watch for daily wear." },
    { item: "Stud Earrings", color: "Silver", reason: "Minimal studs for everyday style." },
    { item: "Simple Bracelet", color: "Gold", reason: "Dainty bracelet for casual charm." },
    { item: "Tote Bag", color: "Canvas", reason: "Practical tote for daily essentials." },
    { item: "Sunglasses", color: "Tortoise", reason: "Essential accessory for sunny days." },
  ],
};

// ─── GYM / ACTIVEWEAR / SPORTS ──────────────────────────────────────────────

const GYM_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Compression Leggings", color: "Black", reason: "High-performance leggings for workouts." },
    { item: "Running Shorts", color: "Navy", reason: "Breathable shorts for cardio sessions." },
    { item: "Track Pants", color: "Grey", reason: "Classic track pants for gym and warm-ups." },
    { item: "Biker Shorts", color: "Black", reason: "Trendy biker shorts for HIIT and cycling." },
    { item: "Jogger Sweatpants", color: "Charcoal", reason: "Comfortable joggers for weightlifting." },
    { item: "Tennis Skort", color: "White", reason: "Sporty skort for court and outdoor activities." },
    { item: "Yoga Pants", color: "Deep Purple", reason: "Flexible yoga pants for stretching sessions." },
  ],
  footwear: [
    { item: "Cross-Training Shoes", color: "Black", reason: "Versatile trainers for gym workouts." },
    { item: "Running Shoes", color: "Neon Green", reason: "Cushioned runners for cardio sessions." },
    { item: "Lightweight Sneakers", color: "White", reason: "Breathable sneakers for indoor training." },
    { item: "Trail Running Shoes", color: "Grey", reason: "Grip-focused shoes for outdoor activities." },
    { item: "Boxing Shoes", color: "Black", reason: "Ankle-support shoes for combat sports." },
    { item: "Minimalist Trainers", color: "Navy", reason: "Barefoot-style trainers for lifting." },
    { item: "Athletic Sandals", color: "Black", reason: "Post-workout recovery sandals." },
  ],
  accessories: [
    { item: "Sports Watch", color: "Black", reason: "Fitness tracker for workout monitoring." },
    { item: "Gym Bag", color: "Navy", reason: "Spacious bag for workout gear." },
    { item: "Headband", color: "Black", reason: "Sweat-wicking headband for intense workouts." },
    { item: "Water Bottle", color: "Steel", reason: "Hydration essential for gym sessions." },
    { item: "Resistance Band", color: "Red", reason: "Portable workout accessory." },
    { item: "Sport Sunglasses", color: "Black", reason: "UV protection for outdoor workouts." },
    { item: "Wristband", color: "White", reason: "Sweat-absorbing wristband for training." },
  ],
};

// ─── TRAVEL / VACATION ──────────────────────────────────────────────────────

const TRAVEL_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Stretch Travel Pants", color: "Navy", reason: "Wrinkle-resistant pants for long journeys." },
    { item: "Convertible Cargo Pants", color: "Olive", reason: "Zip-off pants that convert to shorts." },
    { item: "Linen Shorts", color: "White", reason: "Breathable linen for tropical vacations." },
    { item: "Travel Leggings", color: "Black", reason: "Comfortable leggings for flights and hikes." },
    { item: "Quick-Dry Shorts", color: "Khaki", reason: "Fast-drying shorts for beach and adventure." },
    { item: "Relaxed Chinos", color: "Beige", reason: "Versatile chinos for sightseeing days." },
    { item: "Jersey Culottes", color: "Grey", reason: "Comfortable culottes for long walking tours." },
  ],
  footwear: [
    { item: "Walking Sneakers", color: "White", reason: "Cushioned sneakers for sightseeing." },
    { item: "Hiking Sandals", color: "Brown", reason: "Sturdy sandals for outdoor adventures." },
    { item: "Slip-On Loafers", color: "Tan", reason: "Easy on/off for airport travel." },
    { item: "Canvas Sneakers", color: "Navy", reason: "Lightweight sneakers for exploring cities." },
    { item: "Waterproof Boots", color: "Black", reason: "Weather-ready boots for rainy destinations." },
    { item: "Espadrilles", color: "Cream", reason: "Vacation-ready espadrilles for coastal trips." },
    { item: "Sport Sandals", color: "Black", reason: "All-terrain sandals for outdoor activities." },
  ],
  accessories: [
    { item: "Travel Backpack", color: "Grey", reason: "Organized backpack for day trips." },
    { item: "Passport Holder", color: "Tan", reason: "Stylish and practical travel essential." },
    { item: "Polarized Sunglasses", color: "Black", reason: "UV protection for outdoor travel." },
    { item: "Wide-Brim Hat", color: "Straw", reason: "Sun protection for beach and sightseeing." },
    { item: "Crossbody Travel Bag", color: "Black", reason: "Secure hands-free bag for exploring." },
    { item: "Silk Eye Mask", color: "Navy", reason: "Sleep essential for long-haul flights." },
    { item: "Scarf Wrap", color: "Multi", reason: "Versatile scarf for planes and temples." },
  ],
};

const EMPTY_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [],
  footwear: [],
  accessories: [],
};

export function getOccasionSuggestionOverrides(
  occasion: string | undefined,
  isFullBodyGarment: boolean,
): OccasionSuggestionOverrides {
  const normalized = (occasion || "").toLowerCase();

  let overrides: OccasionSuggestionOverrides = EMPTY_OVERRIDES;

  if (normalized.includes("office") || normalized.includes("work") || normalized.includes("formal")) {
    overrides = OFFICE_OVERRIDES;
  } else if (normalized.includes("college") || normalized.includes("school") || normalized.includes("campus")) {
    overrides = COLLEGE_OVERRIDES;
  } else if (normalized.includes("party") || normalized.includes("club") || normalized.includes("night out")) {
    overrides = PARTY_OVERRIDES;
  } else if (normalized.includes("date") || normalized.includes("dinner") || normalized.includes("romantic")) {
    overrides = DATE_OVERRIDES;
  } else if (normalized.includes("wedding") || normalized.includes("festiv") || normalized.includes("celebration")) {
    overrides = WEDDING_OVERRIDES;
  } else if (normalized.includes("casual") || normalized.includes("everyday") || normalized.includes("errand")) {
    overrides = CASUAL_OVERRIDES;
  } else if (normalized.includes("gym") || normalized.includes("workout") || normalized.includes("sport") || normalized.includes("activewear")) {
    overrides = GYM_OVERRIDES;
  } else if (normalized.includes("travel") || normalized.includes("vacation") || normalized.includes("trip") || normalized.includes("holiday")) {
    overrides = TRAVEL_OVERRIDES;
  }

  return {
    ...overrides,
    bottomWear: isFullBodyGarment ? [] : overrides.bottomWear,
  };
}
