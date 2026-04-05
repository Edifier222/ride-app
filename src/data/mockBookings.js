// Mock booking/trip data for dashboards
import { listings } from './listings';

export const guestTrips = [
  {
    id: 'RIDE-A1B2C3',
    vehicle: listings[0], // Tesla Model Y
    startDate: '2026-04-10',
    endDate: '2026-04-13',
    status: 'upcoming', // upcoming, active, completed, cancelled
    total: 356,
    protectionPlan: 'Standard',
    verified: true,
    hostMessage: "Looking forward to your trip! Pickup at my driveway. I'll send the address the day before.",
  },
  {
    id: 'RIDE-D4E5F6',
    vehicle: listings[4], // Jeep Wrangler
    startDate: '2026-03-20',
    endDate: '2026-03-23',
    status: 'completed',
    total: 429,
    protectionPlan: 'Premier',
    verified: true,
    rating: 5,
    review: 'Amazing Jeep! Took it to Sedona and had the best time. Marcus was super helpful.',
  },
  {
    id: 'RIDE-G7H8I9',
    vehicle: listings[6], // Corvette
    startDate: '2026-02-14',
    endDate: '2026-02-16',
    status: 'completed',
    total: 610,
    protectionPlan: 'Standard',
    verified: true,
    rating: 5,
    review: 'Bucket list car. PCH was incredible.',
  },
  {
    id: 'RIDE-J0K1L2',
    vehicle: listings[15], // Tesla Model 3
    startDate: '2026-04-20',
    endDate: '2026-04-25',
    status: 'upcoming',
    total: 468,
    protectionPlan: 'Standard',
    verified: false,
    hostMessage: null,
  },
];

export const savedCars = [listings[8], listings[11], listings[18], listings[21]];

export const hostListings = [
  {
    ...listings[0], // Tesla Model Y
    hostStats: {
      totalTrips: 34,
      totalEarnings: 8420,
      monthlyEarnings: 1240,
      activeBookings: 2,
      pendingRequests: 1,
      rating: 4.9,
      responseRate: 98,
    },
  },
  {
    ...listings[3], // Toyota Camry
    hostStats: {
      totalTrips: 63,
      totalEarnings: 9870,
      monthlyEarnings: 890,
      activeBookings: 1,
      pendingRequests: 0,
      rating: 4.6,
      responseRate: 95,
    },
  },
  {
    ...listings[16], // Tesla Model 3
    hostStats: {
      totalTrips: 67,
      totalEarnings: 12450,
      monthlyEarnings: 1560,
      activeBookings: 3,
      pendingRequests: 2,
      rating: 4.9,
      responseRate: 99,
    },
  },
];

export const hostBookingRequests = [
  {
    id: 'REQ-001',
    guest: {
      name: 'Sarah M.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      trips: 12,
      verified: true,
    },
    vehicle: listings[0],
    startDate: '2026-04-15',
    endDate: '2026-04-18',
    total: 356,
    status: 'pending', // pending, approved, declined
    requestedAt: '2026-04-04T10:30:00',
    message: "Hi! We're visiting Phoenix for a family trip and your Tesla looks perfect. We'll take great care of it!",
  },
  {
    id: 'REQ-002',
    guest: {
      name: 'David K.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5.0,
      trips: 28,
      verified: true,
    },
    vehicle: listings[16],
    startDate: '2026-04-12',
    endDate: '2026-04-14',
    total: 195,
    status: 'pending',
    requestedAt: '2026-04-03T16:45:00',
    message: 'Looking for a Tesla for a quick weekend trip to Hill Country. Will return fully charged!',
  },
  {
    id: 'REQ-003',
    guest: {
      name: 'Jennifer L.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 4.6,
      trips: 5,
      verified: true,
    },
    vehicle: listings[3],
    startDate: '2026-04-08',
    endDate: '2026-04-10',
    total: 138,
    status: 'approved',
    requestedAt: '2026-04-02T09:15:00',
    message: 'Need a reliable car for a work trip. Thanks!',
  },
];
