// Fictional business details. Lacquer & Co. is not a real company; the phone
// number sits in the 555-01xx range reserved for fiction.
export const site = {
  name: "Lacquer & Co.",
  tagline: "Your car, returned better than delivered.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phoneDisplay: "(312) 555-0148",
  phoneHref: "tel:+13125550148",
  email: "studio@lacquer.example",
  timeZone: "America/Chicago",
  address: {
    line1: "Unit 3, 2150 W Carroll Ave",
    line2: "Chicago, IL 60612",
    query: "2150 W Carroll Ave, Chicago, IL 60612",
  },
  // Approximate position of the block, used by the map and its marker.
  coordinates: { lat: 41.8875, lng: -87.6805 },
  hours: [
    { days: "Tuesday to Saturday", time: "8:00 am - 6:00 pm" },
    { days: "Sunday and Monday", time: "Closed" },
  ],
} as const;

export const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  site.address.query,
)}`;
