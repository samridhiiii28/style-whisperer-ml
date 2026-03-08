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

const OFFICE_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Straight-Leg Tailored Trousers", color: "Charcoal", reason: "Sharp silhouette that keeps office outfits polished." },
    { item: "Pleated Cigarette Pants", color: "Navy", reason: "Professional and structured for long office hours." },
    { item: "High-Waist Pencil Skirt", color: "Black", reason: "Classic formal bottom for meetings and presentations." },
    { item: "Wide-Leg Wool Trousers", color: "Stone", reason: "Modern office tailoring with comfort and drape." },
    { item: "Slim Chinos", color: "Taupe", reason: "Business-casual staple that pairs with most tops." },
  ],
  footwear: [
    { item: "Leather Loafers", color: "Black", reason: "Reliable office footwear for a clean professional finish." },
    { item: "Pointed-Toe Block Heels", color: "Nude", reason: "Formal enough for office while remaining comfortable." },
    { item: "Oxford Shoes", color: "Brown", reason: "Structured and timeless for formal workwear." },
    { item: "Kitten Heels", color: "Burgundy", reason: "Adds subtle personality without losing office formality." },
    { item: "Derby Shoes", color: "Tan", reason: "Great for smart office looks with long wear comfort." },
  ],
  accessories: [
    { item: "Structured Tote Bag", color: "Black", reason: "Carries office essentials while keeping the look refined." },
    { item: "Slim Leather Belt", color: "Brown", reason: "Defines outfit lines and elevates tailoring." },
    { item: "Minimal Analog Watch", color: "Silver", reason: "A professional detail suited for work settings." },
    { item: "Pearl Stud Earrings", color: "White", reason: "Subtle accessory appropriate for formal environments." },
    { item: "Silk Neck Scarf", color: "Navy", reason: "Adds polish and color control in office attire." },
    { item: "Laptop Sleeve", color: "Charcoal", reason: "Practical add-on that still matches professional style." },
  ],
};

const COLLEGE_OVERRIDES: OccasionSuggestionOverrides = {
  bottomWear: [
    { item: "Relaxed Fit Jeans", color: "Light Blue", reason: "Comfortable for long campus days and easy to style." },
    { item: "Cargo Pants", color: "Olive", reason: "Trendy college staple with practical pocket utility." },
    { item: "Wide-Leg Denim", color: "Washed Black", reason: "Popular campus silhouette with modern streetwear vibe." },
    { item: "A-Line Midi Skirt", color: "Cream", reason: "Balanced casual and put-together for college events." },
    { item: "Parachute Pants", color: "Grey", reason: "Youthful trend with breathable comfort for daily wear." },
    { item: "Pleated Tennis Skirt", color: "White", reason: "Sporty-preppy option common in college fashion." },
  ],
  footwear: [
    { item: "Retro Sneakers", color: "White", reason: "Campus-friendly and works with almost every casual look." },
    { item: "Canvas Shoes", color: "Black", reason: "Affordable and versatile for daily classes." },
    { item: "Platform Sneakers", color: "Beige", reason: "Adds height and trendiness without sacrificing comfort." },
    { item: "Chunky Sandals", color: "Tan", reason: "Good for warm-weather campus outfits." },
    { item: "Slip-On Loafers", color: "Brown", reason: "Quick on/off option for practical student life." },
  ],
  accessories: [
    { item: "Backpack", color: "Black", reason: "Most practical carry option for books and devices." },
    { item: "Canvas Tote Bag", color: "Natural", reason: "Lightweight and trendy for everyday campus use." },
    { item: "Sports Watch", color: "Black", reason: "Functional for schedule tracking during classes." },
    { item: "Hoop Earrings", color: "Gold", reason: "Simple trend-forward detail for student outfits." },
    { item: "Layered Necklace", color: "Silver", reason: "Adds personality to otherwise basic campus looks." },
    { item: "Baseball Cap", color: "Navy", reason: "Casual finishing touch for lectures and commute." },
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

  if (normalized.includes("office") || normalized.includes("work") || normalized.includes("formal")) {
    return {
      ...OFFICE_OVERRIDES,
      bottomWear: isFullBodyGarment ? [] : OFFICE_OVERRIDES.bottomWear,
    };
  }

  if (normalized.includes("college") || normalized.includes("school") || normalized.includes("campus")) {
    return {
      ...COLLEGE_OVERRIDES,
      bottomWear: isFullBodyGarment ? [] : COLLEGE_OVERRIDES.bottomWear,
    };
  }

  return EMPTY_OVERRIDES;
}
