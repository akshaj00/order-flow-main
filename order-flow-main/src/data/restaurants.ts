import burger from "@/assets/r-burger.jpg";
import indian from "@/assets/r-indian.jpg";
import pizza from "@/assets/r-pizza.jpg";
import sushi from "@/assets/r-sushi.jpg";
import dessert from "@/assets/r-dessert.jpg";
import healthy from "@/assets/r-healthy.jpg";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  veg: boolean;
};

export type Restaurant = {
  id: string;
  name: string;
  cuisine: string;
  tags: string[];
  image: string;
  rating: number;
  deliveryMins: number;
  priceForTwo: number;
  phone: string;
  address: string;
  coords: { lat: number; lng: number };
  prepMins: number;
  menu: MenuItem[];
};

export const restaurants: Restaurant[] = [
  {
    id: "spice-garden",
    name: "Spice Garden",
    cuisine: "North Indian",
    tags: ["Indian", "Curry", "Biryani"],
    image: indian,
    rating: 4.6,
    deliveryMins: 28,
    priceForTwo: 450,
    phone: "+91 98450 11122",
    address: "MG Road, Bangalore",
    coords: { lat: 12.9719, lng: 77.6412 },
    prepMins: 20,
    menu: [
      { id: "m1", name: "Butter Chicken", description: "Creamy tomato gravy, tandoori chicken", price: 320, veg: false },
      { id: "m2", name: "Paneer Tikka Masala", description: "Charred paneer in spiced gravy", price: 260, veg: true },
      { id: "m3", name: "Chicken Biryani", description: "Hyderabadi dum biryani with raita", price: 280, veg: false },
      { id: "m4", name: "Garlic Naan", description: "Fresh from the tandoor", price: 70, veg: true },
    ],
  },
  {
    id: "burger-bros",
    name: "Burger Bros",
    cuisine: "American",
    tags: ["Burgers", "Fries", "Shakes"],
    image: burger,
    rating: 4.4,
    deliveryMins: 22,
    priceForTwo: 380,
    phone: "+91 98450 22233",
    address: "Indiranagar, Bangalore",
    coords: { lat: 12.9784, lng: 77.6408 },
    prepMins: 15,
    menu: [
      { id: "b1", name: "Classic Cheeseburger", description: "Beef patty, cheddar, pickles", price: 220, veg: false },
      { id: "b2", name: "Chicken Burger", description: "Crispy chicken, slaw", price: 180, veg: false },
      { id: "b3", name: "French Fries", description: "Hand-cut, sea salt", price: 120, veg: true },
      { id: "b4", name: "Chocolate Shake", description: "Belgian chocolate, whipped cream", price: 150, veg: true },
    ],
  },
  {
    id: "pizza-forno",
    name: "Pizza Forno",
    cuisine: "Italian",
    tags: ["Pizza", "Pasta", "Wood-fired"],
    image: pizza,
    rating: 4.7,
    deliveryMins: 32,
    priceForTwo: 600,
    phone: "+91 98450 33344",
    address: "Koramangala, Bangalore",
    coords: { lat: 12.9352, lng: 77.6245 },
    prepMins: 25,
    menu: [
      { id: "p1", name: "Margherita", description: "San Marzano tomato, mozzarella, basil", price: 380, veg: true },
      { id: "p2", name: "Pepperoni", description: "Spicy pepperoni, mozzarella", price: 460, veg: false },
      { id: "p3", name: "Truffle Pasta", description: "Tagliatelle, black truffle, parmesan", price: 520, veg: true },
    ],
  },
  {
    id: "sakura",
    name: "Sakura Sushi",
    cuisine: "Japanese",
    tags: ["Sushi", "Ramen", "Asian"],
    image: sushi,
    rating: 4.8,
    deliveryMins: 35,
    priceForTwo: 900,
    phone: "+91 98450 44455",
    address: "UB City, Bangalore",
    coords: { lat: 12.9719, lng: 77.5946 },
    prepMins: 22,
    menu: [
      { id: "s1", name: "Salmon Nigiri (6pc)", description: "Fresh Norwegian salmon", price: 480, veg: false },
      { id: "s2", name: "Spicy Tuna Roll", description: "Tuna, sriracha, cucumber", price: 420, veg: false },
      { id: "s3", name: "Tonkotsu Ramen", description: "Pork bone broth, chashu, egg", price: 520, veg: false },
    ],
  },
  {
    id: "sweet-spot",
    name: "Sweet Spot",
    cuisine: "Desserts",
    tags: ["Cakes", "Ice cream"],
    image: dessert,
    rating: 4.5,
    deliveryMins: 20,
    priceForTwo: 300,
    phone: "+91 98450 55566",
    address: "HSR Layout, Bangalore",
    coords: { lat: 12.9116, lng: 77.6473 },
    prepMins: 10,
    menu: [
      { id: "d1", name: "Chocolate Lava Cake", description: "Molten center, vanilla ice cream", price: 220, veg: true },
      { id: "d2", name: "Tiramisu", description: "Mascarpone, espresso, cocoa", price: 240, veg: true },
    ],
  },
  {
    id: "green-bowl",
    name: "Green Bowl",
    cuisine: "Healthy",
    tags: ["Bowls", "Salads", "Vegan"],
    image: healthy,
    rating: 4.3,
    deliveryMins: 25,
    priceForTwo: 500,
    phone: "+91 98450 66677",
    address: "Whitefield, Bangalore",
    coords: { lat: 12.9698, lng: 77.7499 },
    prepMins: 15,
    menu: [
      { id: "g1", name: "Salmon Poke Bowl", description: "Sushi rice, salmon, avocado, edamame", price: 420, veg: false },
      { id: "g2", name: "Buddha Bowl", description: "Quinoa, roasted veg, tahini", price: 320, veg: true },
    ],
  },
];

export const cuisines = ["All", "Indian", "American", "Italian", "Japanese", "Desserts", "Healthy"];
