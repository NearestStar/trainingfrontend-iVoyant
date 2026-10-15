export const menuCategories = [
  "All",
  "Meals",
  "Snacks",
  "Drinks",
  "Desserts",
] as const;

export type MenuCategory = (typeof menuCategories)[number];
export type FoodCategory = Exclude<MenuCategory, "All">;

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  isVegetarian: boolean;
  rating: number;
  prepTime: string;
  image: string;
  popular?: boolean;
}

export const foodItems: FoodItem[] = [
  {
    id: 1,
    name: "Masala Dosa",
    description: "Golden, crisp dosa with a gently spiced potato filling.",
    price: 70,
    category: "Meals",
    isVegetarian: true,
    rating: 4.8,
    prepTime: "12 min",
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&w=900&q=85",
    popular: true,
  },
  {
    id: 2,
    name: "Veg Fried Rice",
    description: "Wok-tossed rice, crunchy vegetables and spring onion.",
    price: 90,
    category: "Meals",
    isVegetarian: true,
    rating: 4.6,
    prepTime: "15 min",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
    popular: true,
  },
  {
    id: 3,
    name: "Classic Veg Burger",
    description: "A crispy patty, fresh lettuce and our canteen sauce.",
    price: 85,
    category: "Snacks",
    isVegetarian: true,
    rating: 4.7,
    prepTime: "10 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    popular: true,
  },
  {
    id: 4,
    name: "Paneer Sandwich",
    description: "Grilled bread filled with peppery paneer and cheese.",
    price: 65,
    category: "Snacks",
    isVegetarian: true,
    rating: 4.5,
    prepTime: "8 min",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Cold Coffee",
    description: "Chilled, creamy coffee for a well-earned study break.",
    price: 50,
    category: "Drinks",
    isVegetarian: true,
    rating: 4.7,
    prepTime: "5 min",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=900&q=85",
    popular: true,
  },
  {
    id: 6,
    name: "Masala Chai",
    description: "Freshly brewed tea with warming Indian spices.",
    price: 20,
    category: "Drinks",
    isVegetarian: true,
    rating: 4.9,
    prepTime: "4 min",
    image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Chocolate Brownie",
    description: "Rich chocolate, crisp edges and a soft centre.",
    price: 55,
    category: "Desserts",
    isVegetarian: true,
    rating: 4.6,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Chocolate Cake",
    description: "A little chocolate treat for the afternoon slump.",
    price: 60,
    category: "Desserts",
    isVegetarian: true,
    rating: 4.8,
    prepTime: "3 min",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85",
  },
];
