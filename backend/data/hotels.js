const hotels = [
  // =========================================================
  // 🌿 NATURE MOOD — 6 HOTELS
  // =========================================================

  {
    name: "Green Valley Retreat",
    location: "Munnar, Kerala",
    price: 3200,
    rate: 4.8,
    status: "Available",
    image: "/uploads/hotels/nature-1.jpg",
    category: "nature",
  },

  {
    name: "Forest Haven Resort",
    location: "Wayanad, Kerala",
    price: 2800,
    rate: 4.6,
    status: "Available",
    image: "/uploads/hotels/nature-2.jpg",
    category: "nature",
  },

  {
    name: "Mountain Mist Resort",
    location: "Manali, Himachal Pradesh",
    price: 3500,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/nature-3.jpg",
    category: "nature",
  },

  {
    name: "Lakeside Nature Resort",
    location: "Udaipur, Rajasthan",
    price: 3000,
    rate: 4.5,
    status: "Available",
    image: "/uploads/hotels/nature-4.jpg",
    category: "nature",
  },

  {
    name: "Pine Forest Lodge",
    location: "Shimla, Himachal Pradesh",
    price: 2600,
    rate: 4.6,
    status: "Available",
    image: "/uploads/hotels/nature-5.jpg",
    category: "nature",
  },

  {
    name: "Valley View Escape",
    location: "Kasauli, Himachal Pradesh",
    price: 2900,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/nature-6.jpg",
    category: "nature",
  },

  // =========================================================
  // 🏙️ URBAN MOOD — 6 HOTELS
  // =========================================================

  {
    name: "Metro Grand Hotel",
    location: "Mumbai, Maharashtra",
    price: 4200,
    rate: 4.5,
    status: "Available",
    image: "/uploads/hotels/urban-1.jpg",
    category: "urban",
  },

  {
    name: "Cityscape Residency",
    location: "Bengaluru, Karnataka",
    price: 3800,
    rate: 4.4,
    status: "Available",
    image: "/uploads/hotels/urban-2.jpg",
    category: "urban",
  },

  {
    name: "Downtown Elite Hotel",
    location: "Delhi, India",
    price: 4500,
    rate: 4.6,
    status: "Available",
    image: "/uploads/hotels/urban-3.jpg",
    category: "urban",
  },

  {
    name: "Skyline Business Hotel",
    location: "Hyderabad, Telangana",
    price: 3600,
    rate: 4.5,
    status: "Available",
    image: "/uploads/hotels/urban-4.jpg",
    category: "urban",
  },

  {
    name: "Central Park Residency",
    location: "Pune, Maharashtra",
    price: 3400,
    rate: 4.3,
    status: "Available",
    image: "/uploads/hotels/urban-5.jpg",
    category: "urban",
  },

  {
    name: "City Lights Premium",
    location: "Ahmedabad, Gujarat",
    price: 3100,
    rate: 4.4,
    status: "Available",
    image: "/uploads/hotels/urban-6.jpg",
    category: "urban",
  },

  // =========================================================
  // 🌊 OCEAN MOOD — 6 HOTELS
  // =========================================================

  {
    name: "Azure Beach Resort",
    location: "Goa, India",
    price: 4800,
    rate: 4.8,
    status: "Available",
    image: "/uploads/hotels/ocean-1.jpg",
    category: "ocean",
  },

  {
    name: "Ocean Breeze Resort",
    location: "Kovalam, Kerala",
    price: 4200,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/ocean-2.jpg",
    category: "ocean",
  },

  {
    name: "Coral Bay Retreat",
    location: "Andaman Islands, India",
    price: 5500,
    rate: 4.9,
    status: "Available",
    image: "/uploads/hotels/ocean-3.jpg",
    category: "ocean",
  },

  {
    name: "Blue Horizon Hotel",
    location: "Puri, Odisha",
    price: 3300,
    rate: 4.5,
    status: "Available",
    image: "/uploads/hotels/ocean-4.jpg",
    category: "ocean",
  },

  {
    name: "Seaside Palm Resort",
    location: "Varkala, Kerala",
    price: 3900,
    rate: 4.6,
    status: "Available",
    image: "/uploads/hotels/ocean-5.jpg",
    category: "ocean",
  },

  {
    name: "Sunset Coast Resort",
    location: "Diu, Gujarat",
    price: 3000,
    rate: 4.4,
    status: "Available",
    image: "/uploads/hotels/ocean-6.jpg",
    category: "ocean",
  },

  // =========================================================
  // ❤️ ROMANTIC MOOD — 6 HOTELS
  // =========================================================

  {
    name: "The Romantic Hideaway",
    location: "Udaipur, Rajasthan",
    price: 5200,
    rate: 4.9,
    status: "Available",
    image: "/uploads/hotels/romantic-1.webp",
    category: "romantic",
  },

  {
    name: "Love Valley Resort",
    location: "Manali, Himachal Pradesh",
    price: 4600,
    rate: 4.8,
    status: "Available",
    image: "/uploads/hotels/romantic-2.webp",
    category: "romantic",
  },

  {
    name: "Moonlight Lake Resort",
    location: "Nainital, Uttarakhand",
    price: 4300,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/romantic-3.webp",
    category: "romantic",
  },

  {
    name: "Couples Paradise",
    location: "Goa, India",
    price: 5000,
    rate: 4.8,
    status: "Available",
    image: "/uploads/hotels/romantic-4.webp",
    category: "romantic",
  },

  {
    name: "Sunset Romance Resort",
    location: "Mount Abu, Rajasthan",
    price: 3700,
    rate: 4.6,
    status: "Available",
    image: "/uploads/hotels/romantic-5.webp",
    category: "romantic",
  },

  {
    name: "Whispering Pines Retreat",
    location: "Mussoorie, Uttarakhand",
    price: 4100,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/romantic-6.webp",
    category: "romantic",
  },

  // =========================================================
  // 👑 ROYAL MOOD — 6 HOTELS
  // =========================================================

  {
    name: "Royal Palace Heritage",
    location: "Jaipur, Rajasthan",
    price: 6500,
    rate: 4.9,
    status: "Available",
    image: "/uploads/hotels/royal-1.jpg",
    category: "royal",
  },

  {
    name: "Maharaja Grand Palace",
    location: "Jodhpur, Rajasthan",
    price: 7200,
    rate: 4.9,
    status: "Available",
    image: "/uploads/hotels/royal-2.jpg",
    category: "royal",
  },

  {
    name: "Heritage Royal Haveli",
    location: "Udaipur, Rajasthan",
    price: 5800,
    rate: 4.8,
    status: "Available",
    image: "/uploads/hotels/royal-3.jpg",
    category: "royal",
  },

  {
    name: "The Grand Rajputana",
    location: "Jaisalmer, Rajasthan",
    price: 6200,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/royal-4.jpg",
    category: "royal",
  },

  {
    name: "Imperial Heritage Hotel",
    location: "Delhi, India",
    price: 7000,
    rate: 4.8,
    status: "Available",
    image: "/uploads/hotels/royal-5.jpg",
    category: "royal",
  },

  {
    name: "Royal Courtyard Palace",
    location: "Mysuru, Karnataka",
    price: 5400,
    rate: 4.7,
    status: "Available",
    image: "/uploads/hotels/royal-6.jpg",
    category: "royal",
  },
];

module.exports = hotels;
