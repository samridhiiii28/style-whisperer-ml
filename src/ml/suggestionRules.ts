/**
 * ══════════════════════════════════════════════════════════════════════════════
 * OUTFIT SUGGESTION RULES — EXPANDED 2026 EDITION
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * 30+ garment-type rules × 5+ suggestions per category = 500+ unique combos.
 * All text suggestions are ML-local; only image generation uses API.
 */

import type { SuggestionRule } from "./dataset";

export const EXPANDED_SUGGESTION_RULES: SuggestionRule[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // TOPS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── T-Shirt / Tee ─────────────────────────────────────────────────────────
  {
    matchKeywords: ["t-shirt", "tee", "tshirt"],
    matchColors: ["neutral", "blue", "red", "green", "yellow", "orange", "purple", "pink"],
    bottomWear: [
      { item: "Slim Fit Jeans", colors: ["Blue Denim", "Black", "Grey"], reason: "Classic t-shirt and jeans — timeless casual pairing" },
      { item: "Barrel Leg Pants", colors: ["Cream", "Olive", "Tan"], reason: "2026 trending barrel-leg silhouette for a relaxed modern look" },
      { item: "Pleated Wide-Leg Trousers", colors: ["Khaki", "Navy", "Beige"], reason: "Elevated wide-leg trend elevates a casual tee effortlessly" },
      { item: "Cargo Shorts", colors: ["Olive", "Khaki", "Black"], reason: "Relaxed summer pairing with utility-core trend" },
      { item: "Linen Drawstring Pants", colors: ["White", "Sand", "Light Grey"], reason: "Quiet luxury linen pants for a breezy refined casual look" },
      { item: "Straight-Leg Chinos", colors: ["Camel", "Navy", "Olive"], reason: "Smart-casual chinos for a polished everyday look" },
      { item: "Jogger Pants", colors: ["Grey", "Black", "Navy"], reason: "Athleisure joggers for a comfortable streetwear vibe" },
    ],
    footwear: [
      { item: "Chunky Sneakers", colors: ["White", "Off-White", "Grey"], reason: "2026 chunky sneaker trend keeps the look fresh and modern" },
      { item: "Canvas Slip-ons", colors: ["Navy", "Grey", "White"], reason: "Effortless slip-ons complement casual tees perfectly" },
      { item: "Platform Loafers", colors: ["Black", "Brown", "Burgundy"], reason: "Platform loafers trending in 2026 for smart-casual edge" },
      { item: "Retro Running Shoes", colors: ["Grey", "Navy", "Multi"], reason: "Retro runner revival — a top sneaker trend of 2026" },
      { item: "Leather Sandals", colors: ["Brown", "Tan", "Black"], reason: "Relaxed summer sandals for warm-weather tee outfits" },
      { item: "High-Top Sneakers", colors: ["White", "Black", "Red"], reason: "High-tops add streetwear personality to basic tees" },
      { item: "Espadrilles", colors: ["Navy", "White", "Tan"], reason: "Mediterranean-inspired espadrilles for a summer casual look" },
    ],
    accessories: [
      { item: "Casual Watch", colors: ["Silver", "Black"], reason: "A simple watch adds subtle style to a casual outfit" },
      { item: "Sunglasses", colors: ["Black", "Tortoise"], reason: "Essential casual accessory that completes the look" },
      { item: "Canvas Belt", colors: ["Brown", "Black"], reason: "Practical and stylish belt for jeans pairing" },
      { item: "Stud Earrings", colors: ["Silver", "Gold"], reason: "Minimal studs add a clean finishing touch" },
      { item: "Beaded Bracelet", colors: ["Black", "Brown", "Mixed"], reason: "Casual bracelet for a laid-back vibe" },
      { item: "Baseball Cap", colors: ["Black", "Navy", "White"], reason: "Sporty cap completes a casual tee outfit" },
      { item: "Chain Necklace", colors: ["Silver", "Gold"], reason: "Simple chain adds edge to a plain tee" },
    ],
  },

  // ── Polo Shirt ────────────────────────────────────────────────────────────
  {
    matchKeywords: ["polo", "polo shirt"],
    matchColors: ["neutral", "blue", "red", "green", "yellow", "white"],
    bottomWear: [
      { item: "Chinos", colors: ["Khaki", "Navy", "Olive"], reason: "Classic polo and chinos for a preppy smart-casual look" },
      { item: "Tailored Shorts", colors: ["White", "Navy", "Beige"], reason: "Sharp shorts create a refined summer polo outfit" },
      { item: "Slim Fit Jeans", colors: ["Dark Indigo", "Black"], reason: "Dark jeans give polos a modern casual edge" },
      { item: "Linen Trousers", colors: ["White", "Sand", "Light Blue"], reason: "Linen trousers for a resort-ready polo look" },
      { item: "Pleated Chinos", colors: ["Cream", "Olive", "Tan"], reason: "Pleated chinos trending in 2026 for relaxed elegance" },
    ],
    footwear: [
      { item: "Leather Loafers", colors: ["Brown", "Tan", "Navy"], reason: "Loafers are the quintessential polo companion" },
      { item: "White Sneakers", colors: ["White", "Off-White"], reason: "Clean white sneakers for a modern sporty-chic look" },
      { item: "Boat Shoes", colors: ["Brown", "Navy", "Tan"], reason: "Nautical boat shoes complement polos perfectly" },
      { item: "Suede Drivers", colors: ["Tan", "Navy", "Burgundy"], reason: "Driving mocs for effortless smart-casual style" },
      { item: "Canvas Sneakers", colors: ["White", "Navy", "Grey"], reason: "Low-key canvas sneakers for an everyday finish" },
    ],
    accessories: [
      { item: "Leather Belt", colors: ["Brown", "Black"], reason: "A clean leather belt ties the preppy look together" },
      { item: "Aviator Sunglasses", colors: ["Gold", "Silver", "Black"], reason: "Aviators add a sporty-luxe touch to polos" },
      { item: "Analog Watch", colors: ["Silver", "Gold", "Brown Leather"], reason: "Classic watch for timeless polo style" },
      { item: "Bracelet", colors: ["Brown Leather", "Navy Cord"], reason: "Simple bracelet adds relaxed personality" },
      { item: "Stud Earrings", colors: ["Silver", "Gold"], reason: "Minimal studs for a clean sporty look" },
    ],
  },

  // ── Tank Top / Sleeveless ─────────────────────────────────────────────────
  {
    matchKeywords: ["tank", "tank top", "sleeveless", "vest top", "muscle tee"],
    matchColors: ["neutral", "blue", "red", "green", "pink", "yellow"],
    bottomWear: [
      { item: "High-Waist Shorts", colors: ["Denim", "White", "Black"], reason: "Shorts and tanks are the ultimate summer combo" },
      { item: "Flowy Palazzo Pants", colors: ["White", "Cream", "Black"], reason: "Wide palazzo pants balance a fitted tank top" },
      { item: "Denim Skirt", colors: ["Blue Denim", "White", "Black"], reason: "Denim skirt pairs casually with sleeveless tops" },
      { item: "Linen Shorts", colors: ["Sand", "White", "Olive"], reason: "Breathable linen for a summery relaxed look" },
      { item: "Bike Shorts", colors: ["Black", "Grey", "Navy"], reason: "2026 athleisure bike shorts for an active-chic vibe" },
    ],
    footwear: [
      { item: "Flat Sandals", colors: ["Tan", "Black", "Gold"], reason: "Easy summer sandals for a breezy look" },
      { item: "Platform Sneakers", colors: ["White", "Black"], reason: "Platform sneakers add height and modern edge" },
      { item: "Espadrille Wedges", colors: ["Tan", "Black", "Navy"], reason: "Wedge espadrilles elevate casual tank outfits" },
      { item: "Slide Sandals", colors: ["Black", "White", "Brown"], reason: "Minimalist slides for effortless summer style" },
      { item: "Strappy Sandals", colors: ["Gold", "Black", "Tan"], reason: "Delicate strappy sandals for a feminine touch" },
    ],
    accessories: [
      { item: "Layered Necklaces", colors: ["Gold", "Silver"], reason: "Layered chains enhance exposed necklines beautifully" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Hoops complement sleeveless tops perfectly" },
      { item: "Oversized Sunglasses", colors: ["Black", "Tortoise"], reason: "Statement sunnies complete the summer aesthetic" },
      { item: "Straw Tote", colors: ["Natural", "Tan"], reason: "Beach-ready straw bag for a summer vibe" },
      { item: "Anklet", colors: ["Gold", "Silver"], reason: "A dainty anklet adds subtle summer charm" },
    ],
  },

  // ── Henley ────────────────────────────────────────────────────────────────
  {
    matchKeywords: ["henley"],
    matchColors: ["neutral", "blue", "red", "green", "brown"],
    bottomWear: [
      { item: "Slim Fit Jeans", colors: ["Dark Indigo", "Black", "Grey"], reason: "Henley and jeans is a ruggedly handsome combination" },
      { item: "Cargo Pants", colors: ["Olive", "Khaki", "Black"], reason: "Utility cargo pants complement the casual Henley vibe" },
      { item: "Corduroy Pants", colors: ["Brown", "Cream", "Forest Green"], reason: "Textured corduroy pairs naturally with henleys" },
      { item: "Chinos", colors: ["Khaki", "Navy", "Olive"], reason: "Classic chinos for a clean smart-casual henley look" },
      { item: "Joggers", colors: ["Grey", "Black", "Navy"], reason: "Relaxed joggers for an off-duty henley outfit" },
    ],
    footwear: [
      { item: "Desert Boots", colors: ["Tan", "Brown", "Grey"], reason: "Desert boots bring rugged sophistication to henleys" },
      { item: "Leather Sneakers", colors: ["White", "Brown", "Black"], reason: "Clean leather sneakers for everyday wear" },
      { item: "Moccasins", colors: ["Brown", "Tan"], reason: "Relaxed moccasins suit the casual henley aesthetic" },
      { item: "Chelsea Boots", colors: ["Black", "Brown"], reason: "Sleek Chelseas add a refined edge" },
      { item: "Work Boots", colors: ["Brown", "Tan"], reason: "Rugged work boots for a masculine outdoor look" },
    ],
    accessories: [
      { item: "Leather Watch", colors: ["Brown", "Black"], reason: "A leather-strap watch suits the rugged henley style" },
      { item: "Woven Bracelet", colors: ["Brown", "Black", "Mixed"], reason: "Casual woven bracelet for a laid-back look" },
      { item: "Beanie", colors: ["Grey", "Black", "Navy"], reason: "A beanie adds cozy layering to henley outfits" },
      { item: "Dog Tag Necklace", colors: ["Silver"], reason: "Simple pendant adds masculine detail" },
      { item: "Canvas Belt", colors: ["Brown", "Olive", "Black"], reason: "Casual belt completes the henley look" },
    ],
  },

  // ── Shirt / Button-Up ────────────────────────────────────────────────────
  {
    matchKeywords: ["shirt", "dress shirt", "oxford", "button", "button-up", "button-down"],
    matchColors: ["white", "blue", "neutral", "pink", "green"],
    bottomWear: [
      { item: "Tailored Trousers", colors: ["Charcoal", "Navy", "Black"], reason: "Formal trousers create a polished professional look" },
      { item: "Relaxed Fit Chinos", colors: ["Beige", "Sage", "Olive"], reason: "2026 relaxed-fit chinos for a modern smart-casual balance" },
      { item: "Pleated Dress Pants", colors: ["Dark Indigo", "Charcoal", "Cream"], reason: "Pleated pants trending in 2026 for neo-classic styling" },
      { item: "Wide-Leg Linen Trousers", colors: ["White", "Sand", "Light Blue"], reason: "Quiet luxury linen trousers for warm-weather sophistication" },
      { item: "Slim Fit Jeans", colors: ["Dark Indigo", "Black"], reason: "Dark jeans dress down a shirt while keeping it sharp" },
      { item: "Corduroy Trousers", colors: ["Tan", "Olive", "Brown"], reason: "Corduroy adds rich texture to button-up shirts" },
      { item: "Pencil Skirt", colors: ["Black", "Navy", "Grey"], reason: "Classic feminine pairing for professional settings" },
    ],
    footwear: [
      { item: "Oxford Shoes", colors: ["Brown", "Black", "Tan"], reason: "Classic formal shoes that pair perfectly with shirts" },
      { item: "Suede Loafers", colors: ["Camel", "Navy", "Burgundy"], reason: "2026 suede loafer trend for a textured smart-casual look" },
      { item: "Chelsea Boots", colors: ["Black", "Brown"], reason: "Versatile boots that work with formal and casual shirts" },
      { item: "Monk Strap Shoes", colors: ["Brown", "Tan", "Burgundy"], reason: "Monk straps are a 2026 alternative to traditional oxfords" },
      { item: "Knit Sneakers", colors: ["White", "Grey", "Navy"], reason: "Clean knit sneakers for a tech-smart casual finish" },
      { item: "Pointed Flats", colors: ["Black", "Nude", "Red"], reason: "Chic flats for a comfortable polished look" },
      { item: "Derby Shoes", colors: ["Brown", "Black"], reason: "Slightly casual alternative to oxfords" },
    ],
    accessories: [
      { item: "Leather Belt", colors: ["Brown", "Black"], reason: "Match belt color to shoes for a cohesive look" },
      { item: "Analog Watch", colors: ["Silver", "Gold", "Brown Leather"], reason: "A quality watch elevates any shirt outfit" },
      { item: "Tie", colors: ["Navy", "Burgundy", "Grey"], reason: "Adds formal polish when the occasion calls for it" },
      { item: "Cuff Bracelet", colors: ["Silver", "Gold"], reason: "Sleek cuff adds a modern professional accent" },
      { item: "Pearl Earrings", colors: ["Pearl", "Gold", "Silver"], reason: "Classic earrings for a refined elegant look" },
      { item: "Tie Bar", colors: ["Silver", "Gold"], reason: "Functional and stylish tie accessory" },
      { item: "Pocket Square", colors: ["White", "Patterned"], reason: "Adds flair to shirt-and-blazer combos" },
    ],
  },

  // ── Blouse / Top / Camisole / Wrap ────────────────────────────────────────
  {
    matchKeywords: ["blouse", "top", "camisole", "wrap", "peplum", "off-shoulder"],
    matchColors: ["neutral", "pink", "purple", "red", "blue", "green", "yellow", "orange"],
    bottomWear: [
      { item: "High-Waist Trousers", colors: ["Black", "Navy", "Cream"], reason: "Flattering silhouette that pairs beautifully with blouses" },
      { item: "Pencil Skirt", colors: ["Black", "Navy", "Grey"], reason: "Classic feminine pairing for a polished look" },
      { item: "Wide-Leg Palazzo", colors: ["White", "Cream", "Black"], reason: "2026 palazzo pants for a flowy elegant silhouette" },
      { item: "Leather Midi Skirt", colors: ["Black", "Brown", "Burgundy"], reason: "Leather skirts trending in 2026 for edgy-feminine contrast" },
      { item: "Pleated Midi Skirt", colors: ["Sage", "Cream", "Navy"], reason: "Pleated midis are a 2026 wardrobe staple" },
      { item: "Tailored Shorts", colors: ["White", "Black", "Beige"], reason: "Dressy shorts create a chic summer blouse outfit" },
      { item: "Straight-Leg Jeans", colors: ["Dark Indigo", "Black", "White"], reason: "Jeans dress down a blouse for casual elegance" },
    ],
    footwear: [
      { item: "Kitten Heels", colors: ["Black", "Nude", "Red"], reason: "2026 kitten heel comeback — elegant with everyday comfort" },
      { item: "Pointed Flats", colors: ["Black", "Nude", "Metallic"], reason: "Chic yet comfortable alternative to heels" },
      { item: "Strappy Sandals", colors: ["Gold", "Black", "Tan"], reason: "Delicate strappy sandals for warm-weather elegance" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Edgy contrast for a modern feminine look" },
      { item: "Mary Janes", colors: ["Black", "Burgundy", "White"], reason: "Mary Janes are a 2026 retro-feminine trending shoe" },
      { item: "Mules", colors: ["Black", "Tan", "White"], reason: "Open-back mules for effortless chic" },
      { item: "Block Heels", colors: ["Black", "Nude", "Red"], reason: "Comfortable heels for all-day elegance" },
    ],
    accessories: [
      { item: "Statement Necklace", colors: ["Gold", "Silver", "Pearl"], reason: "Bold necklace enhances the neckline of blouses" },
      { item: "Clutch", colors: ["Black", "Gold", "Matching"], reason: "Elegant handbag for a polished feminine outfit" },
      { item: "Chandelier Earrings", colors: ["Gold", "Silver", "Crystal"], reason: "Chandelier earrings add drama and movement" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Classic hoops frame the face beautifully" },
      { item: "Chain Bracelet", colors: ["Gold", "Silver", "Rose Gold"], reason: "Elegant chain bracelet for a refined wrist accent" },
      { item: "Tennis Bracelet", colors: ["Silver", "Gold", "Crystal"], reason: "A sparkling tennis bracelet elevates any blouse" },
      { item: "Silk Scarf", colors: ["Printed", "Solid", "Matching"], reason: "A silk scarf adds luxurious feminine detail" },
    ],
  },

  // ── Crop Top ──────────────────────────────────────────────────────────────
  {
    matchKeywords: ["crop top", "crop", "cropped top"],
    matchColors: ["neutral", "pink", "red", "yellow", "green", "blue"],
    bottomWear: [
      { item: "High-Waist Jeans", colors: ["Blue Denim", "Black", "White"], reason: "High-waist jeans balance the crop top silhouette" },
      { item: "Maxi Skirt", colors: ["Black", "White", "Floral"], reason: "Maxi skirt with crop top creates balanced proportions" },
      { item: "Palazzo Pants", colors: ["White", "Black", "Printed"], reason: "Flowy palazzos contrast the fitted crop top" },
      { item: "Mini Skirt", colors: ["Denim", "Black", "Plaid"], reason: "Mini skirt for a bold youthful look" },
      { item: "Paper Bag Waist Pants", colors: ["Beige", "Black", "Olive"], reason: "Trendy paperbag waist highlights the midriff" },
      { item: "Cargo Pants", colors: ["Olive", "Black", "Khaki"], reason: "Streetwear cargo with crop top for an edgy look" },
    ],
    footwear: [
      { item: "Platform Sneakers", colors: ["White", "Black"], reason: "Platform sneakers add height and street style" },
      { item: "Strappy Heels", colors: ["Black", "Nude", "Gold"], reason: "Heels dress up crop top outfits instantly" },
      { item: "Combat Boots", colors: ["Black", "Brown"], reason: "Edgy combat boots contrast the feminine crop top" },
      { item: "Wedge Sandals", colors: ["Tan", "Black"], reason: "Wedges add casual height for summer looks" },
      { item: "Chunky Sneakers", colors: ["White", "Multi"], reason: "Chunky sneakers for a trendy streetwear vibe" },
    ],
    accessories: [
      { item: "Belly Chain", colors: ["Gold", "Silver"], reason: "Belly chain accentuates the exposed midriff" },
      { item: "Layered Necklaces", colors: ["Gold", "Silver"], reason: "Layered chains complement the crop top neckline" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Bold hoops for a confident look" },
      { item: "Mini Bag", colors: ["Black", "Pink", "White"], reason: "Trendy mini bag for a fun youthful outfit" },
      { item: "Anklet", colors: ["Gold", "Silver"], reason: "Anklet adds a playful detail" },
    ],
  },

  // ── Bodysuit ──────────────────────────────────────────────────────────────
  {
    matchKeywords: ["bodysuit"],
    matchColors: ["neutral", "black", "red", "pink", "white"],
    bottomWear: [
      { item: "High-Waist Jeans", colors: ["Blue Denim", "Black", "White"], reason: "Jeans with bodysuits create a sleek tucked-in silhouette" },
      { item: "Leather Pants", colors: ["Black", "Brown", "Burgundy"], reason: "Leather pants with bodysuit for a bold nightout look" },
      { item: "Midi Skirt", colors: ["Black", "Satin", "Leopard"], reason: "Midi skirt creates an elegant evening outfit" },
      { item: "Tailored Trousers", colors: ["Black", "Charcoal", "Navy"], reason: "Smart trousers for a polished bodysuit outfit" },
      { item: "Wide-Leg Pants", colors: ["Black", "Cream", "Navy"], reason: "Wide-leg pants for a sophisticated flowy look" },
    ],
    footwear: [
      { item: "Stiletto Heels", colors: ["Black", "Nude", "Red"], reason: "Stilettos complete the sleek bodysuit look" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Boots add edge to bodysuit outfits" },
      { item: "Pointed Pumps", colors: ["Black", "Nude"], reason: "Classic pumps for a polished finish" },
      { item: "Strappy Sandals", colors: ["Gold", "Black", "Silver"], reason: "Strappy heels for evening bodysuit looks" },
      { item: "Platform Boots", colors: ["Black"], reason: "Platform boots for a bold statement" },
    ],
    accessories: [
      { item: "Statement Earrings", colors: ["Gold", "Silver", "Crystal"], reason: "Bold earrings draw attention to the face" },
      { item: "Choker Necklace", colors: ["Black", "Gold", "Silver"], reason: "Choker enhances the bodysuit neckline" },
      { item: "Clutch Bag", colors: ["Black", "Gold", "Silver"], reason: "Sleek clutch for evening bodysuit looks" },
      { item: "Cuff Bracelet", colors: ["Gold", "Silver"], reason: "Bold cuff for a confident statement" },
      { item: "Ring Set", colors: ["Gold", "Silver", "Mixed"], reason: "Stacked rings add modern detail" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OUTERWEAR
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Blazer / Suit Jacket ──────────────────────────────────────────────────
  {
    matchKeywords: ["blazer", "suit", "sport coat"],
    matchColors: ["neutral", "blue", "brown", "green"],
    bottomWear: [
      { item: "Dress Pants", colors: ["Charcoal", "Navy", "Black"], reason: "Matching formal trousers for a complete suit look" },
      { item: "Tailored Wide-Leg Trousers", colors: ["Cream", "Grey", "Navy"], reason: "2026 wide-leg tailoring for a modern power silhouette" },
      { item: "Slim Trousers", colors: ["Grey", "Black", "Navy"], reason: "Sleek trousers maintain the tailored silhouette" },
      { item: "Pinstripe Pants", colors: ["Charcoal", "Navy", "Black"], reason: "Pinstripes are a 2026 power-dressing comeback trend" },
      { item: "Cropped Dress Pants", colors: ["Beige", "Black", "Navy"], reason: "Cropped trousers for a fresh contemporary blazer look" },
      { item: "Jeans", colors: ["Dark Indigo", "Black"], reason: "Smart-casual blazer-and-jeans for modern versatility" },
    ],
    footwear: [
      { item: "Oxford Shoes", colors: ["Black", "Brown"], reason: "The definitive formal shoe for blazer outfits" },
      { item: "Derby Shoes", colors: ["Brown", "Black", "Tan"], reason: "Slightly less formal but equally polished" },
      { item: "Pointed Chelsea Boots", colors: ["Black", "Burgundy", "Brown"], reason: "2026 pointed-toe Chelseas for sharp modern tailoring" },
      { item: "Loafers", colors: ["Burgundy", "Brown", "Black"], reason: "Smart-casual option when going tieless" },
      { item: "Slingback Heels", colors: ["Black", "Nude", "White"], reason: "Slingbacks trending in 2026 for feminine power dressing" },
      { item: "White Sneakers", colors: ["White"], reason: "Blazer with sneakers for a modern dressed-down approach" },
    ],
    accessories: [
      { item: "Pocket Square", colors: ["White", "Patterned", "Navy"], reason: "Adds a refined touch to any blazer" },
      { item: "Leather Belt", colors: ["Black", "Brown"], reason: "Essential formal accessory — match to shoe color" },
      { item: "Cufflinks", colors: ["Silver", "Gold"], reason: "Elegant detail for formal shirt-and-blazer combos" },
      { item: "Elegant Earrings", colors: ["Gold", "Silver", "Pearl"], reason: "Subtle earrings add polish to formal looks" },
      { item: "Leather Bracelet", colors: ["Black", "Brown"], reason: "A refined leather bracelet adds a personal touch" },
      { item: "Lapel Pin", colors: ["Gold", "Silver", "Floral"], reason: "A lapel pin adds personality to blazers" },
    ],
  },

  // ── Jacket / Coat ─────────────────────────────────────────────────────────
  {
    matchKeywords: ["jacket", "coat", "trench", "parka", "overcoat", "windbreaker"],
    matchColors: ["neutral", "blue", "brown", "green", "black"],
    bottomWear: [
      { item: "Slim Fit Jeans", colors: ["Dark Indigo", "Black"], reason: "Jeans under a jacket is effortlessly stylish" },
      { item: "Tailored Trousers", colors: ["Charcoal", "Navy", "Black"], reason: "Structured trousers complement outerwear beautifully" },
      { item: "Corduroy Pants", colors: ["Brown", "Olive", "Cream"], reason: "Textured corduroy for autumn/winter layering" },
      { item: "Cargo Pants", colors: ["Olive", "Khaki", "Black"], reason: "Utility pants suit casual jacket styles" },
      { item: "Wool Trousers", colors: ["Grey", "Charcoal", "Navy"], reason: "Warm wool trousers for winter coat outfits" },
    ],
    footwear: [
      { item: "Chelsea Boots", colors: ["Black", "Brown"], reason: "Chelsea boots are the go-to shoe for jacket outfits" },
      { item: "Lace-Up Boots", colors: ["Black", "Brown", "Tan"], reason: "Sturdy boots pair perfectly with heavier outerwear" },
      { item: "Loafers", colors: ["Brown", "Black", "Burgundy"], reason: "Loafers for a more refined jacket outfit" },
      { item: "Chunky Sneakers", colors: ["White", "Black"], reason: "Casual sneakers balance heavy outerwear" },
      { item: "Knee-High Boots", colors: ["Black", "Brown"], reason: "Knee-highs create a sleek silhouette under coats" },
    ],
    accessories: [
      { item: "Scarf", colors: ["Camel", "Grey", "Burgundy"], reason: "A scarf adds warmth and style to any coat" },
      { item: "Gloves", colors: ["Black", "Brown"], reason: "Leather gloves for a polished winter look" },
      { item: "Crossbody Bag", colors: ["Black", "Brown", "Tan"], reason: "Practical hands-free bag under coats" },
      { item: "Fedora Hat", colors: ["Black", "Brown", "Grey"], reason: "A fedora adds sophistication to outerwear" },
      { item: "Watch", colors: ["Silver", "Gold"], reason: "A classic watch peeks from under coat sleeves" },
    ],
  },

  // ── Denim Jacket ──────────────────────────────────────────────────────────
  {
    matchKeywords: ["denim jacket", "jean jacket"],
    matchColors: ["blue", "neutral", "black"],
    bottomWear: [
      { item: "Black Jeans", colors: ["Black"], reason: "Avoid Canadian tuxedo — contrast denim with black" },
      { item: "Chinos", colors: ["Khaki", "Olive", "Beige"], reason: "Chinos balance the casual denim jacket" },
      { item: "Floral Skirt", colors: ["Printed", "White", "Pink"], reason: "Floral skirt with denim jacket for a boho vibe" },
      { item: "Cargo Pants", colors: ["Olive", "Khaki"], reason: "Utility meets denim for a rugged look" },
      { item: "Shorts", colors: ["White", "Black", "Denim"], reason: "Shorts with denim jacket for summer layering" },
    ],
    footwear: [
      { item: "White Sneakers", colors: ["White"], reason: "Clean white sneakers are the ultimate denim jacket match" },
      { item: "Ankle Boots", colors: ["Brown", "Tan", "Black"], reason: "Boots add a rugged edge to denim" },
      { item: "Canvas Sneakers", colors: ["White", "Navy", "Red"], reason: "Casual canvas shoes suit the denim vibe" },
      { item: "Cowboy Boots", colors: ["Brown", "Tan"], reason: "Western boots with denim for a trending 2026 look" },
      { item: "Flat Sandals", colors: ["Tan", "Black"], reason: "Simple sandals for a relaxed summer denim outfit" },
    ],
    accessories: [
      { item: "Baseball Cap", colors: ["Black", "Navy", "White"], reason: "Casual cap completes the denim look" },
      { item: "Sunglasses", colors: ["Black", "Tortoise"], reason: "Shades add effortless cool to denim" },
      { item: "Canvas Tote", colors: ["Natural", "Black"], reason: "Casual tote for everyday denim outfits" },
      { item: "Bandana", colors: ["Red", "Blue", "Black"], reason: "Western-inspired bandana for a trending look" },
      { item: "Layered Bracelets", colors: ["Brown", "Black", "Mixed"], reason: "Stacked bracelets add personality" },
    ],
  },

  // ── Leather Jacket ────────────────────────────────────────────────────────
  {
    matchKeywords: ["leather jacket", "biker jacket", "moto jacket"],
    matchColors: ["black", "brown", "neutral"],
    bottomWear: [
      { item: "Skinny Jeans", colors: ["Black", "Dark Indigo"], reason: "Skinny jeans and leather jacket is a rock-and-roll classic" },
      { item: "Leather Pants", colors: ["Black", "Brown"], reason: "Full leather look for maximum edge" },
      { item: "Pleated Skirt", colors: ["Black", "Plaid", "White"], reason: "Feminine skirt contrasts the tough leather" },
      { item: "Straight-Leg Jeans", colors: ["Black", "Blue Denim"], reason: "Relaxed jeans for a modern leather jacket look" },
      { item: "Mini Skirt", colors: ["Black", "Denim", "Plaid"], reason: "Mini skirt with leather for a bold nightout look" },
    ],
    footwear: [
      { item: "Combat Boots", colors: ["Black"], reason: "The iconic leather jacket + combat boots combo" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Ankle boots for a slightly refined edge" },
      { item: "Pointed Pumps", colors: ["Black", "Red"], reason: "Heels dress up a leather jacket instantly" },
      { item: "Chunky Sneakers", colors: ["White", "Black"], reason: "Sneakers for a modern streetwear leather look" },
      { item: "Chelsea Boots", colors: ["Black"], reason: "Sleek Chelseas for a clean biker aesthetic" },
    ],
    accessories: [
      { item: "Chain Necklace", colors: ["Silver"], reason: "Silver chains enhance the edgy leather vibe" },
      { item: "Aviator Sunglasses", colors: ["Silver", "Gold"], reason: "Aviators are the classic leather jacket companion" },
      { item: "Studded Belt", colors: ["Black"], reason: "Studded belt reinforces the biker aesthetic" },
      { item: "Ring Set", colors: ["Silver"], reason: "Chunky rings add rock-and-roll detail" },
      { item: "Crossbody Bag", colors: ["Black"], reason: "Black crossbody for a streamlined look" },
    ],
  },

  // ── Cardigan / Sweater ────────────────────────────────────────────────────
  {
    matchKeywords: ["cardigan", "sweater", "knit", "pullover", "jumper"],
    matchColors: ["neutral", "red", "blue", "green", "brown", "pink"],
    bottomWear: [
      { item: "Slim Fit Jeans", colors: ["Dark Indigo", "Black", "Grey"], reason: "Jeans and sweater is a cozy classic" },
      { item: "Corduroy Pants", colors: ["Brown", "Cream", "Olive"], reason: "Textured cord with knitwear is a top 2026 trend" },
      { item: "Midi Skirt", colors: ["Black", "Plaid", "Camel"], reason: "Midi skirt with cardigan for an elegant cozy look" },
      { item: "Tailored Trousers", colors: ["Grey", "Navy", "Camel"], reason: "Structured trousers elevate a casual sweater" },
      { item: "Leggings", colors: ["Black", "Grey"], reason: "Comfortable leggings for oversized sweater outfits" },
      { item: "Wool Trousers", colors: ["Charcoal", "Cream", "Brown"], reason: "Wool trousers for a premium winter knit look" },
    ],
    footwear: [
      { item: "Ankle Boots", colors: ["Brown", "Black", "Tan"], reason: "Boots are the natural partner for knitwear" },
      { item: "Loafers", colors: ["Brown", "Black", "Burgundy"], reason: "Loafers for a preppy cardigan look" },
      { item: "Chelsea Boots", colors: ["Black", "Brown"], reason: "Chelsea boots for a sleek winter outfit" },
      { item: "Knee-High Boots", colors: ["Black", "Brown"], reason: "Knee-highs with skirts and cardigans are timeless" },
      { item: "Ugg-Style Boots", colors: ["Tan", "Grey", "Black"], reason: "Cozy boots for ultra-casual sweater days" },
    ],
    accessories: [
      { item: "Scarf", colors: ["Matching", "Cream", "Burgundy"], reason: "A scarf layers beautifully over knitwear" },
      { item: "Beret", colors: ["Black", "Red", "Cream"], reason: "A beret adds Parisian charm to sweater outfits" },
      { item: "Leather Belt", colors: ["Brown", "Black"], reason: "A belt cinches oversized sweaters at the waist" },
      { item: "Pendant Necklace", colors: ["Gold", "Silver"], reason: "A simple pendant peeks beautifully from knit necklines" },
      { item: "Stud Earrings", colors: ["Gold", "Silver", "Pearl"], reason: "Small studs complement the cozy knitwear aesthetic" },
    ],
  },

  // ── Hoodie / Sweatshirt ───────────────────────────────────────────────────
  {
    matchKeywords: ["hoodie", "sweatshirt"],
    matchColors: ["neutral", "red", "blue", "green", "yellow", "pink"],
    bottomWear: [
      { item: "Joggers", colors: ["Grey", "Black", "Navy"], reason: "Matching athleisure bottom for a coordinated casual look" },
      { item: "Straight-Leg Jeans", colors: ["Black", "Dark Blue", "Washed Blue"], reason: "2026 straight-leg jeans add structure to casual hoodies" },
      { item: "Cargo Pants", colors: ["Olive", "Khaki", "Black"], reason: "Streetwear-inspired pairing with utility vibes" },
      { item: "Track Pants", colors: ["Black", "Grey", "Navy"], reason: "Sporty track pants with side stripes for athleisure" },
      { item: "Corduroy Pants", colors: ["Brown", "Cream", "Forest Green"], reason: "Corduroy revival in 2026 adds texture and warmth" },
      { item: "Sweatpants", colors: ["Grey", "Black", "Cream"], reason: "Full sweats for maximum comfort" },
    ],
    footwear: [
      { item: "Chunky Sneakers", colors: ["White", "Black", "Grey"], reason: "2026 chunky sneakers are the natural match for hoodies" },
      { item: "High-Top Sneakers", colors: ["White", "Black"], reason: "High-tops add streetwear edge to the casual look" },
      { item: "Trail Runners", colors: ["Olive", "Grey", "Multi"], reason: "Gorpcore trail runners trending in 2026 outdoor-casual style" },
      { item: "Puffer Slides", colors: ["Black", "Cream", "Olive"], reason: "2026 puffer slides for an effortless off-duty look" },
      { item: "Combat Boots", colors: ["Black", "Brown"], reason: "Rugged combat boots add an edgy contrast to soft hoodies" },
    ],
    accessories: [
      { item: "Beanie", colors: ["Black", "Grey", "Navy"], reason: "A beanie completes the cozy casual aesthetic" },
      { item: "Backpack", colors: ["Black", "Grey"], reason: "Practical and stylish for everyday casual outfits" },
      { item: "Digital Watch", colors: ["Black"], reason: "Sporty watch suits the casual athleisure vibe" },
      { item: "Woven Bracelet", colors: ["Black", "Brown", "Mixed"], reason: "Casual woven bracelet adds texture to streetwear" },
      { item: "Chain Necklace", colors: ["Silver", "Gold"], reason: "A chain visible above the hoodie adds edge" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DRESSES & FULL-BODY
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Dress / Gown / Frock ──────────────────────────────────────────────────
  {
    matchKeywords: ["dress", "gown", "frock", "sundress", "bodycon", "maxi", "mini dress", "midi dress", "shift dress", "wrap dress", "a-line dress", "cocktail dress", "evening dress"],
    matchColors: ["neutral", "red", "pink", "purple", "brown", "blue", "green", "yellow", "orange", "black"],
    bottomWear: [],
    footwear: [
      { item: "Strappy Heels", colors: ["Black", "Nude", "Gold"], reason: "Elegant heels that complement any dress beautifully" },
      { item: "Ankle Boots", colors: ["Black", "Brown", "Tan"], reason: "Trendy boots add an edgy contrast to dresses" },
      { item: "Block Heels", colors: ["Black", "Nude", "Burgundy"], reason: "Comfortable yet stylish — perfect for all-day wear" },
      { item: "White Sneakers", colors: ["White", "Off-White"], reason: "Casual-cool pairing for a laid-back dress look" },
      { item: "Pointed Pumps", colors: ["Black", "Red", "Nude"], reason: "Classic pumps for formal dress occasions" },
      { item: "Flat Sandals", colors: ["Tan", "Gold", "Black"], reason: "Easy sandals for casual sundresses" },
      { item: "Wedge Espadrilles", colors: ["Tan", "Black", "Navy"], reason: "Espadrille wedges for summer dress outfits" },
    ],
    accessories: [
      { item: "Statement Earrings", colors: ["Gold", "Silver", "Crystal"], reason: "Earrings draw attention and frame the face beautifully" },
      { item: "Drop Earrings", colors: ["Gold", "Silver", "Pearl"], reason: "Elegant drop earrings add movement and glamour" },
      { item: "Charm Bracelet", colors: ["Gold", "Silver", "Rose Gold"], reason: "A delicate bracelet adds subtle wrist detail" },
      { item: "Bangle Set", colors: ["Gold", "Silver", "Mixed Metal"], reason: "Stacked bangles create a chic layered look" },
      { item: "Clutch Bag", colors: ["Black", "Gold", "Matching"], reason: "A sleek clutch keeps the look polished" },
      { item: "Layered Necklace", colors: ["Gold", "Silver"], reason: "Delicate layers add charm to dress necklines" },
      { item: "Hair Accessories", colors: ["Black", "Gold", "Matching"], reason: "Clips or headbands add a finishing touch" },
    ],
  },

  // ── Saree / Lehenga ───────────────────────────────────────────────────────
  {
    matchKeywords: ["saree", "sari", "lehenga", "anarkali", "ghagra"],
    matchColors: ["neutral", "red", "pink", "purple", "blue", "green", "yellow", "gold"],
    bottomWear: [],
    footwear: [
      { item: "Embellished Heels", colors: ["Gold", "Silver", "Matching"], reason: "Ornate heels complement traditional Indian wear" },
      { item: "Mojari/Juttis", colors: ["Gold", "Brown", "Matching"], reason: "Traditional footwear that completes the ethnic ensemble" },
      { item: "Wedge Sandals", colors: ["Gold", "Silver", "Nude"], reason: "Comfortable yet elegant for long events" },
      { item: "Block Heels", colors: ["Gold", "Silver", "Red"], reason: "Stable heels for dancing at celebrations" },
      { item: "Kolhapuri Sandals", colors: ["Brown", "Tan", "Gold"], reason: "Artisan sandals for casual ethnic looks" },
    ],
    accessories: [
      { item: "Jhumka Earrings", colors: ["Gold", "Silver", "Oxidized"], reason: "Traditional jhumkas are essential for ethnic wear" },
      { item: "Maang Tikka", colors: ["Gold", "Silver", "Kundan"], reason: "Forehead jewelry adds regal Indian elegance" },
      { item: "Statement Necklace", colors: ["Gold", "Kundan", "Polki"], reason: "Bold necklace is central to ethnic styling" },
      { item: "Bangle Set", colors: ["Gold", "Glass", "Matching"], reason: "Bangles are a traditional must-have" },
      { item: "Clutch/Potli", colors: ["Gold", "Matching", "Embroidered"], reason: "Ethnic clutch or potli bag for celebrations" },
      { item: "Anklet/Payal", colors: ["Silver", "Gold"], reason: "Traditional anklet adds charm with every step" },
      { item: "Nose Ring", colors: ["Gold", "Diamond"], reason: "Traditional nose ring for bridal/festive looks" },
    ],
  },

  // ── Jumpsuit / Romper / Overalls ──────────────────────────────────────────
  {
    matchKeywords: ["jumpsuit", "romper", "overalls", "dungarees", "playsuit"],
    matchColors: ["neutral", "blue", "red", "green", "black", "pink"],
    bottomWear: [],
    footwear: [
      { item: "Platform Sneakers", colors: ["White", "Black"], reason: "Casual sneakers for an effortless everyday look" },
      { item: "Wedge Sandals", colors: ["Tan", "Black", "Brown"], reason: "Wedges add height while keeping it comfortable" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Boots give jumpsuits an edgy modern vibe" },
      { item: "Strappy Heels", colors: ["Black", "Nude", "Gold"], reason: "Heels elevate jumpsuits for evening wear" },
      { item: "Flat Sandals", colors: ["Tan", "Gold", "Black"], reason: "Sandals for a casual daytime jumpsuit look" },
    ],
    accessories: [
      { item: "Statement Belt", colors: ["Black", "Brown", "Gold"], reason: "A belt cinches the waist and adds definition" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Hoops add a bold finishing touch" },
      { item: "Cuff Bracelet", colors: ["Gold", "Silver", "Rose Gold"], reason: "A bold cuff bracelet completes the jumpsuit look" },
      { item: "Crossbody Bag", colors: ["Black", "Tan", "Brown"], reason: "Hands-free bag for a practical stylish outfit" },
      { item: "Pendant Necklace", colors: ["Gold", "Silver"], reason: "A simple pendant complements jumpsuit necklines" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BOTTOMS (when user uploads a bottom garment)
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Jeans ─────────────────────────────────────────────────────────────────
  {
    matchKeywords: ["jeans", "denim pants", "denim jeans"],
    matchColors: ["blue", "black", "neutral"],
    bottomWear: [],
    footwear: [
      { item: "White Sneakers", colors: ["White"], reason: "White sneakers with jeans is a universal classic" },
      { item: "Ankle Boots", colors: ["Black", "Brown", "Tan"], reason: "Boots with jeans is effortlessly stylish" },
      { item: "Loafers", colors: ["Brown", "Black", "Burgundy"], reason: "Loafers dress up jeans for smart-casual" },
      { item: "Chelsea Boots", colors: ["Black", "Brown"], reason: "Sleek Chelseas for a refined jeans outfit" },
      { item: "Chunky Sneakers", colors: ["White", "Black", "Multi"], reason: "Chunky sneakers for a streetwear jeans look" },
    ],
    accessories: [
      { item: "Leather Belt", colors: ["Brown", "Black"], reason: "Essential belt for any jeans outfit" },
      { item: "Watch", colors: ["Silver", "Gold", "Black"], reason: "A watch adds polish to casual denim" },
      { item: "Sunglasses", colors: ["Black", "Tortoise"], reason: "Cool shades complete the denim look" },
      { item: "Crossbody Bag", colors: ["Black", "Brown", "Tan"], reason: "Practical bag for everyday jeans outfits" },
      { item: "Stud Earrings", colors: ["Gold", "Silver"], reason: "Simple earrings for a clean casual look" },
    ],
  },

  // ── Skirt ─────────────────────────────────────────────────────────────────
  {
    matchKeywords: ["skirt", "pleated skirt", "mini skirt", "midi skirt", "a-line", "maxi skirt", "pencil skirt"],
    matchColors: ["neutral", "pink", "red", "blue", "green", "black"],
    bottomWear: [
      { item: "Sheer Tights", colors: ["Black", "Nude"], reason: "Tights pair naturally with skirts for a polished look" },
      { item: "Knee-High Socks", colors: ["Black", "White", "Grey"], reason: "Preppy socks add a fun collegiate touch to skirts" },
    ],
    footwear: [
      { item: "Loafers", colors: ["Black", "Brown", "Burgundy"], reason: "Classic loafers for a smart preppy pairing" },
      { item: "Ankle Boots", colors: ["Black", "Brown"], reason: "Boots and skirts create a trendy modern look" },
      { item: "Ballet Flats", colors: ["Black", "Nude", "Red"], reason: "Feminine and comfortable everyday option" },
      { item: "Knee-High Boots", colors: ["Black", "Brown"], reason: "Knee-highs with skirts are a timeless pairing" },
      { item: "Mary Janes", colors: ["Black", "Burgundy"], reason: "Retro Mary Janes for a feminine touch" },
    ],
    accessories: [
      { item: "Tote Bag", colors: ["Brown", "Black", "Canvas"], reason: "Spacious and stylish bag for daily use" },
      { item: "Belt", colors: ["Black", "Brown", "Gold"], reason: "Define the waist for a more structured silhouette" },
      { item: "Dangle Earrings", colors: ["Gold", "Silver", "Pearl"], reason: "Simple earrings complete the feminine look" },
      { item: "Charm Bracelet", colors: ["Gold", "Silver", "Rose Gold"], reason: "A dainty bracelet adds a pretty wrist detail" },
      { item: "Silk Scarf", colors: ["Printed", "Solid"], reason: "A scarf as headband or neck tie adds flair" },
    ],
  },

  // ── Shorts ────────────────────────────────────────────────────────────────
  {
    matchKeywords: ["shorts", "bermuda", "hot pants"],
    matchColors: ["neutral", "blue", "green", "brown", "black"],
    bottomWear: [],
    footwear: [
      { item: "Sneakers", colors: ["White", "Black", "Multi"], reason: "Sneakers are the go-to casual shoe for shorts" },
      { item: "Flat Sandals", colors: ["Tan", "Black", "Brown"], reason: "Sandals for a relaxed summer shorts outfit" },
      { item: "Espadrilles", colors: ["Navy", "White", "Tan"], reason: "Espadrilles for a Mediterranean summer vibe" },
      { item: "Slide Sandals", colors: ["Black", "White"], reason: "Easy slides for casual shorts outfits" },
      { item: "Canvas Sneakers", colors: ["White", "Navy", "Red"], reason: "Casual canvas shoes for everyday comfort" },
    ],
    accessories: [
      { item: "Sunglasses", colors: ["Black", "Tortoise", "Blue"], reason: "Sun protection with style" },
      { item: "Canvas Belt", colors: ["Brown", "Navy", "Black"], reason: "A casual belt for shorts" },
      { item: "Baseball Cap", colors: ["Black", "White", "Navy"], reason: "Sporty cap for outdoor activities" },
      { item: "Watch", colors: ["Silver", "Rubber Band"], reason: "Sporty watch for active summer days" },
      { item: "Anklet", colors: ["Gold", "Silver"], reason: "An anklet adds a summer touch" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ETHNIC / TRADITIONAL
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Kurta / Tunic ─────────────────────────────────────────────────────────
  {
    matchKeywords: ["kurta", "tunic", "ethnic", "kurti", "kaftan"],
    matchColors: ["neutral", "red", "yellow", "green", "blue", "pink", "purple"],
    bottomWear: [
      { item: "Churidar", colors: ["White", "Cream", "Gold"], reason: "Traditional pairing for an authentic ethnic look" },
      { item: "Palazzo Pants", colors: ["White", "Cream", "Matching"], reason: "Modern fusion bottom that complements kurtas" },
      { item: "Slim Pants", colors: ["White", "Black", "Navy"], reason: "Contemporary styling for a modern ethnic look" },
      { item: "Dhoti Pants", colors: ["White", "Cream", "Gold"], reason: "Trendy dhoti pants for a fusion ethnic outfit" },
      { item: "Straight Pants", colors: ["Matching", "White", "Black"], reason: "Clean straight pants for a minimalist ethnic look" },
      { item: "Sharara Pants", colors: ["Gold", "Matching", "Cream"], reason: "Flared sharara for a festive ethnic ensemble" },
    ],
    footwear: [
      { item: "Mojari/Juttis", colors: ["Gold", "Brown", "Matching"], reason: "Traditional footwear that completes the ethnic ensemble" },
      { item: "Kolhapuri Sandals", colors: ["Brown", "Tan"], reason: "Classic Indian sandals for casual ethnic wear" },
      { item: "Loafers", colors: ["Brown", "Tan", "Black"], reason: "Modern fusion footwear for indo-western styling" },
      { item: "Block Heels", colors: ["Gold", "Nude", "Black"], reason: "Comfortable heels for ethnic occasions" },
      { item: "Embellished Flats", colors: ["Gold", "Silver", "Matching"], reason: "Decorated flats for easy ethnic elegance" },
    ],
    accessories: [
      { item: "Stole/Dupatta", colors: ["Contrasting", "Gold", "Cream"], reason: "Adds elegance and traditional completeness" },
      { item: "Ethnic Bracelet", colors: ["Gold", "Silver"], reason: "Traditional jewelry adds authentic charm" },
      { item: "Brooch", colors: ["Gold", "Silver", "Pearl"], reason: "Decorative pin that elevates ethnic wear" },
      { item: "Jhumka Earrings", colors: ["Gold", "Oxidized", "Silver"], reason: "Traditional jhumkas complete ethnic outfits" },
      { item: "Kada/Bangle", colors: ["Gold", "Silver"], reason: "A bold bangle for ethnic styling" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIVEWEAR
  // ═══════════════════════════════════════════════════════════════════════════

  {
    matchKeywords: ["sports", "athletic", "gym", "workout", "activewear", "sports bra", "leggings"],
    matchColors: ["neutral", "black", "blue", "red", "pink", "green"],
    bottomWear: [
      { item: "Athletic Leggings", colors: ["Black", "Grey", "Navy"], reason: "Performance leggings for a coordinated active look" },
      { item: "Running Shorts", colors: ["Black", "Grey", "Navy"], reason: "Breathable shorts for intense workouts" },
      { item: "Yoga Pants", colors: ["Black", "Grey", "Maroon"], reason: "Flexible yoga pants for studio sessions" },
      { item: "Biker Shorts", colors: ["Black", "Grey"], reason: "Biker shorts for a trendy athletic look" },
      { item: "Track Pants", colors: ["Black", "Grey", "Navy"], reason: "Track pants for warm-ups and casual gym days" },
    ],
    footwear: [
      { item: "Running Shoes", colors: ["Black", "White", "Multi"], reason: "Performance running shoes for active workouts" },
      { item: "Cross-Trainers", colors: ["Black", "White", "Grey"], reason: "Versatile trainers for various exercises" },
      { item: "Slip-On Sneakers", colors: ["Black", "Grey"], reason: "Easy slip-ons for light activity and gym commute" },
      { item: "Trail Shoes", colors: ["Grey", "Green", "Multi"], reason: "Trail shoes for outdoor activities" },
      { item: "High-Top Sneakers", colors: ["White", "Black"], reason: "Supportive high-tops for ankle stability" },
    ],
    accessories: [
      { item: "Sports Watch", colors: ["Black", "Grey"], reason: "Fitness tracker for monitoring workouts" },
      { item: "Gym Bag", colors: ["Black", "Grey", "Navy"], reason: "Spacious gym bag for all your gear" },
      { item: "Headband", colors: ["Black", "White", "Matching"], reason: "Keeps hair back during workouts" },
      { item: "Water Bottle", colors: ["Black", "Clear", "Matching"], reason: "Stay hydrated with a stylish bottle" },
      { item: "Stud Earrings", colors: ["Silver"], reason: "Small secure studs safe for exercise" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MISCELLANEOUS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── Corset / Bustier ──────────────────────────────────────────────────────
  {
    matchKeywords: ["corset", "bustier"],
    matchColors: ["black", "red", "neutral", "pink"],
    bottomWear: [
      { item: "High-Waist Trousers", colors: ["Black", "Cream", "Navy"], reason: "Structured trousers balance the fitted corset" },
      { item: "Maxi Skirt", colors: ["Black", "Satin", "White"], reason: "Flowy maxi contrasts the structured corset" },
      { item: "Leather Pants", colors: ["Black", "Brown"], reason: "Full edge with leather and corset combination" },
      { item: "Wide-Leg Jeans", colors: ["Blue Denim", "Black"], reason: "Wide-leg jeans balance the fitted top" },
      { item: "Midi Skirt", colors: ["Black", "Silk", "Satin"], reason: "Elegant midi for an evening corset outfit" },
    ],
    footwear: [
      { item: "Stiletto Heels", colors: ["Black", "Red", "Nude"], reason: "Stilettos amplify the dramatic corset look" },
      { item: "Platform Boots", colors: ["Black"], reason: "Bold platform boots for maximum impact" },
      { item: "Strappy Sandals", colors: ["Gold", "Black", "Silver"], reason: "Delicate straps for an evening corset look" },
      { item: "Pointed Pumps", colors: ["Black", "Red"], reason: "Classic pumps for a sophisticated finish" },
      { item: "Knee-High Boots", colors: ["Black", "Brown"], reason: "Dramatic knee-highs complete the bold look" },
    ],
    accessories: [
      { item: "Choker Necklace", colors: ["Black", "Gold", "Silver"], reason: "A choker enhances the structured neckline" },
      { item: "Statement Earrings", colors: ["Gold", "Silver", "Crystal"], reason: "Bold earrings balance the dramatic silhouette" },
      { item: "Evening Clutch", colors: ["Black", "Gold", "Red"], reason: "Compact clutch for a night-out corset look" },
      { item: "Cuff Bracelet", colors: ["Gold", "Silver"], reason: "A statement cuff adds edge" },
      { item: "Hair Clip", colors: ["Gold", "Pearl", "Crystal"], reason: "An elegant hair accessory completes the look" },
    ],
  },

  // ── Kimono / Poncho / Cape ────────────────────────────────────────────────
  {
    matchKeywords: ["kimono", "poncho", "cape", "shrug"],
    matchColors: ["neutral", "red", "blue", "green", "brown", "pink"],
    bottomWear: [
      { item: "Skinny Jeans", colors: ["Black", "Dark Indigo"], reason: "Slim jeans balance flowing kimono/cape shapes" },
      { item: "Straight-Leg Pants", colors: ["Black", "White", "Navy"], reason: "Clean lines underneath flowing layers" },
      { item: "Leggings", colors: ["Black"], reason: "Simple leggings let the outerwear be the star" },
      { item: "Bodycon Dress", colors: ["Black", "Navy"], reason: "A fitted dress underneath creates beautiful draping" },
      { item: "Wide-Leg Pants", colors: ["White", "Cream", "Black"], reason: "Bohemian wide-legs with flowing layers" },
    ],
    footwear: [
      { item: "Ankle Boots", colors: ["Black", "Brown", "Tan"], reason: "Boots ground the flowy silhouette" },
      { item: "Strappy Sandals", colors: ["Gold", "Black"], reason: "Delicate sandals for a boho vibe" },
      { item: "Pointed Flats", colors: ["Black", "Nude"], reason: "Sleek flats keep the focus on layers" },
      { item: "Platform Sneakers", colors: ["White", "Black"], reason: "Modern sneakers with kimono for street style" },
      { item: "Gladiator Sandals", colors: ["Tan", "Brown", "Gold"], reason: "Gladiators for a bohemian festival look" },
    ],
    accessories: [
      { item: "Long Pendant Necklace", colors: ["Gold", "Silver"], reason: "A long pendant complements flowing layers" },
      { item: "Stackable Rings", colors: ["Gold", "Silver", "Mixed"], reason: "Multiple rings for a boho-chic vibe" },
      { item: "Fringe Bag", colors: ["Brown", "Tan", "Black"], reason: "Fringe bag suits the bohemian aesthetic" },
      { item: "Hoop Earrings", colors: ["Gold", "Silver"], reason: "Hoops peek out beautifully from flowing hair" },
      { item: "Wrap Bracelet", colors: ["Brown Leather", "Beaded"], reason: "Wrap bracelet adds boho detail" },
    ],
  },
];
