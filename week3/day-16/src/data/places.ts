export type PlaceCategory =
  | "Cafes"
  | "Nature"
  | "Culture"
  | "Food"
  | "Creative";

export type Place = {
  id: number;
  name: string;
  category: PlaceCategory;
  location: string;
  rating: number;
  image: string;
  description: string;
  hours: string;
  price: string;
  featured?: boolean;
};

export const places: Place[] = [
  {
    id: 1,
    name: "The Slow Chapter",
    category: "Cafes",
    location: "Old Town",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=85",
    description:
      "A quiet coffee corner with carefully brewed coffee, warm wood, and enough space to lose track of time.",
    hours: "8 AM – 8 PM",
    price: "₹₹",
    featured: true,
  },
  {
    id: 2,
    name: "Fern & Field",
    category: "Nature",
    location: "Riverside",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=85",
    description:
      "A leafy escape for slow walks, fresh air, and a little distance from the noise of everyday life.",
    hours: "6 AM – 6 PM",
    price: "Free",
    featured: true,
  },
  {
    id: 3,
    name: "Sunday Table",
    category: "Food",
    location: "Market Lane",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
    description:
      "Comfort food, seasonal ingredients, and a menu that makes a long lunch feel like a good idea.",
    hours: "12 PM – 10 PM",
    price: "₹₹₹",
  },
  {
    id: 4,
    name: "The Paper Room",
    category: "Culture",
    location: "Arts Quarter",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=900&q=85",
    description:
      "An intimate book-filled space for curious readers, independent publications, and unhurried afternoons.",
    hours: "10 AM – 7 PM",
    price: "Free",
    featured: true,
  },
  {
    id: 5,
    name: "Clay House",
    category: "Creative",
    location: "Studio District",
    rating: 4.6,
    image:
        "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=900&q=85",
    description:
      "A creative studio inspired by handmade objects, tactile materials, and the beauty of imperfect things.",
    hours: "11 AM – 7 PM",
    price: "₹₹",
  },
  {
    id: 6,
    name: "Golden Hour Point",
    category: "Nature",
    location: "West Ridge",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85",
    description:
      "An open landscape for evening walks, golden light, and watching the sky change colour.",
    hours: "Open during daylight",
    price: "Free",
    featured: true,
  },
  {
    id: 7,
    name: "Little Olive",
    category: "Cafes",
    location: "Garden Street",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
    description:
      "A neighbourhood cafe with simple plates, natural textures, and a welcoming little patio.",
    hours: "9 AM – 9 PM",
    price: "₹₹",
  },
  {
    id: 8,
    name: "The Green Fork",
    category: "Food",
    location: "Station Road",
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85",
    description:
      "A fresh take on everyday meals with colourful produce and satisfying seasonal combinations.",
    hours: "11 AM – 9 PM",
    price: "₹₹",
  },
  {
    id: 9,
    name: "Open Studio",
    category: "Creative",
    location: "Arts Quarter",
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=85",
    description:
      "A relaxed creative space where art, experiments, and small independent projects come together.",
    hours: "10 AM – 6 PM",
    price: "₹₹",
  },
];