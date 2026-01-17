
import { Product, Reward, Transaction } from './types.ts';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Super Synth 5W-30',
    description: 'Advanced full synthetic engine oil for maximum performance and protection. Formulated with high-quality additives to ensure long-lasting engine health.',
    image: 'https://images.unsplash.com/photo-1635848600716-52445e994e63?q=80&w=500&auto=format&fit=crop',
    specs: ['Full Synthetic', 'SAE 5W-30', 'API SP / SN Plus', 'Extended Drain Interval']
  },
  {
    id: 'p2',
    name: 'Heavy Diesel X',
    description: 'Designed for high-mileage diesel engines operating under extreme conditions. Provides superior soot control and wear protection.',
    image: 'https://images.unsplash.com/photo-1597430302784-0797170887e5?q=80&w=500&auto=format&fit=crop',
    specs: ['CK-4 Grade', 'Turbocharged Compatible', 'Anti-Corrosive', 'Heavy Duty']
  },
  {
    id: 'p3',
    name: 'Trans Pro Fluid',
    description: 'Optimal gear shifts and thermal stability for modern automatic transmissions. Reduces friction and heat buildup during heavy towing.',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=500&auto=format&fit=crop',
    specs: ['ATF Compatible', 'Friction Modified', 'Seal Protection', 'Low Viscosity']
  },
  {
    id: 'p4',
    name: 'Premium Braker',
    description: 'High boiling point fluid for reliable braking performance in all conditions. Ensures consistent pedal feel and response.',
    image: 'https://images.unsplash.com/photo-1517524008410-b44510d4a847?q=80&w=500&auto=format&fit=crop',
    specs: ['DOT 4 Plus', 'Moisture Resistant', 'High Boiling Point', 'Anti-Vapor Lock']
  },
  {
    id: 'p5',
    name: 'Coolant Master',
    description: 'Ready-to-use long-life antifreeze and coolant. Protects aluminum and engine components from freezing and overheating.',
    image: 'https://images.unsplash.com/photo-1599256621730-535171e28e50?q=80&w=500&auto=format&fit=crop',
    specs: ['OAT Technology', 'Phosphate Free', 'Year-Round Use', 'Corrosion Protection']
  },
  {
    id: 'p6',
    name: 'Fuel Max Inject',
    description: 'Concentrated cleaner for fuel systems. Improves gas mileage and restores engine power by removing harmful deposits.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=500&auto=format&fit=crop',
    specs: ['PEA Additive', 'Safe for Turbos', 'Single Tank Clean', 'Emissions Reducer']
  }
];

export const MOCK_REWARDS: Reward[] = [
  {
    id: 'r1',
    name: 'Lucky Pro Cap',
    pointsRequired: 500,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=500&auto=format&fit=crop',
    description: 'Durable, breathable, and stylish. The official Lucky Lubricant pro-series cap for enthusiasts.'
  },
  {
    id: 'r2',
    name: 'Team T-Shirt',
    pointsRequired: 1000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=500&auto=format&fit=crop',
    description: '100% premium cotton t-shirt featuring the iconic Lucky Lubricant racing logo.'
  },
  {
    id: 'r3',
    name: 'SafeRide Helmet',
    pointsRequired: 3000,
    image: 'https://images.unsplash.com/photo-1558484663-f62093d88256?q=80&w=500&auto=format&fit=crop',
    description: 'DOT certified full-face helmet with advanced ventilation and Lucky Lubricant branding.'
  },
  {
    id: 'r4',
    name: 'Garage Tool Kit',
    pointsRequired: 5000,
    image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?q=80&w=500&auto=format&fit=crop',
    description: 'Complete 48-piece mechanical tool kit in a heavy-duty portable carrying case.'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    type: 'credit',
    amount: 250,
    description: 'Voucher Scan - Super Synth',
    date: 'Oct 24, 2023',
  },
  {
    id: 't2',
    type: 'debit',
    amount: 500,
    description: 'Redeemed: Lucky Cap',
    date: 'Oct 20, 2023',
  },
  {
    id: 't3',
    type: 'credit',
    amount: 1500,
    description: 'Welcome Bonus',
    date: 'Oct 15, 2023',
  }
];
