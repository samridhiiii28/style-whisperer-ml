import demoJeans from "./demo-jeans.jpg";
import demoShoes from "./demo-shoes.jpg";
import demoBag from "./demo-bag.jpg";
import demoFullOutfit from "./demo-full-outfit.jpg";
import demoTryon from "./demo-tryon.jpg";

// Keywords mapped to demo images for item fallback
const ITEM_DEMO_MAP: { keywords: string[]; image: string }[] = [
  { keywords: ["jeans", "pants", "trousers", "chinos", "skirt", "shorts", "cargo"], image: demoJeans },
  { keywords: ["shoes", "sneakers", "loafers", "boots", "heels", "sandals", "mary jane", "flats"], image: demoShoes },
  { keywords: ["bag", "backpack", "tote", "purse", "clutch", "watch", "bracelet", "earring", "necklace", "sunglasses", "accessory"], image: demoBag },
];

export const getDemoItemImage = (itemName: string): string => {
  const lower = itemName.toLowerCase();
  for (const entry of ITEM_DEMO_MAP) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return entry.image;
    }
  }
  // Default to jeans for bottomwear-like items
  return demoJeans;
};

export const getDemoFullOutfitImage = (): string => demoFullOutfit;
export const getDemoTryonImage = (): string => demoTryon;
