export const AI_PROMPT = `
Generate a Travel Itinerary in JSON format.
Your response MUST be a valid JSON object. Do not include any text or markdown formatting before or after the JSON object.

The user is planning a trip from {departureCity} to {location} for {totalDays} days, from {startDate} to {endDate}.
The travelers are: {traveler}.
The budget is {budget}.
Their preferred mode of transport to the destination is {transportPreference}.

Consider the typical weather and season for {location} between {startDate} and {endDate} when making suggestions.

The JSON output should include the following keys:
1.  "tripTitle": A catchy title for the trip, e.g., "Adventure in {location} from {departureCity}".
2.  "destinationInfo": A brief overview of {location}, including why it's interesting for the specified dates.
3.  "weatherConsiderations": Brief notes about typical weather for the period and what to pack (e.g., "Expect sunny days and cool evenings. Pack layers and sunscreen.").
4.  "transportToDestination": {
        "preference": "{transportPreference}", 
        "suggestions": [ 
            { "type": "flight", "details": "Check flights from {departureCity} to {location} on Skyscanner or Google Flights. Airlines like X, Y often fly this route.", "bookingLinkHint": "https://www.skyscanner.net", "originCityCodeHint": "OTP", "destinationCityCodeHint": "PAR" }, 
            { "type": "train", "details": "High-speed trains are available from {departureCity} to {location}. Check [Local Train Operator] for schedules and tickets.", "bookingLinkHint": "https://www.eurail.com" }
        ]
    },
5.  "hotelSuggestions": [
    { "hotelName": "Grand Hotel Central", "priceRange": "$$$", "description": "Luxury hotel with city views.", "bookingLinkHint": "Search on Booking.com" },
    { "hotelName": "Cozy Inn", "priceRange": "$$", "description": "Charming B&B near attractions.", "bookingLinkHint": "Search on Booking.com" }
],
6.  "itinerary": [
    {
        "day": "Day 1",
        "theme": "Arrival & Old Town Charm",
        "meals": {
            "breakfast": { "restaurantName": "Cafe Morning", "cuisineType": "Local, Coffee", "priceRange": "$", "infoLinkHint": "Search on Yelp for Cafe Morning" },
            "lunch": { "restaurantName": "Midday Eatery", "cuisineType": "International", "priceRange": "$$", "infoLinkHint": "Search on TripAdvisor for Midday Eatery" },
            "dinner": { "restaurantName": "Evening Feast", "cuisineType": "Fine Dining", "priceRange": "$$$", "infoLinkHint": "Search on Google Maps for Evening Feast" }
        },
        "activities": [
            { "timeSlot": "Morning", "activity": "Explore the Roman Forum", "details": "Allow 2-3 hours. Wear comfortable shoes.", "locationHint": "Via della Salara Vecchia, 5/6, Roma", "transportSuggestion": "Walk from hotel or Metro Colosseo.", "infoLinkHint": "Official website" },
            { "timeSlot": "Morning", "activity": "Visit Palatine Hill", "details": "Offers great views of the Forum.", "locationHint": "Adjacent to Roman Forum", "transportSuggestion": "Walk from Roman Forum.", "infoLinkHint": "Official website" },
            { "timeSlot": "Afternoon", "activity": "Tour the Colosseum", "details": "Book tickets in advance!", "locationHint": "Piazza del Colosseo, 1, Roma", "transportSuggestion": "Short walk from Palatine Hill.", "infoLinkHint": "Official website" },
            { "timeSlot": "Afternoon", "activity": "Relax at Villa Borghese Gardens", "details": "Rent a rowboat on the lake.", "locationHint": "Piazzale Napoleone I, Roma", "transportSuggestion": "Taxi or Bus from Colosseum area.", "infoLinkHint": "TripAdvisor" }
        ]
    }
],
7.  "restaurantSuggestions": [
    { "restaurantName": "Bistro Local", "cuisineType": "Italian", "priceRange": "$$", "description": "Charming and cozy with local wines.", "infoLinkHint": "https://www.yelp.com" }
],
8.  "packingListSuggestion": "List of essential items based on the weather and duration.",
9.  "budgetBreakdownSuggestion": "Accommodation: 40%, Food: 25%, Activities: 20%, Transport: 10%, Miscellaneous: 5%"

Ensure the entire output is a single, valid JSON object. Do not add any introductory or concluding text outside the JSON structure.
`;

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💰",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💸",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about cost",
    icon: "🤑",
  },
];

export const SelectTravelesList = [
  {
    id: 1,
    title: "Just Me",
    people: "1",
    desc: "A solo journey of exploration",
    icon: "✈️",
  },
  {
    id: 2,
    title: "A Couple",
    people: "2",
    desc: "Two travelers on an adventure",
    icon: "🥂",
  },
  {
    id: 3,
    title: "Family",
    people: "3-5",
    desc: "A group of fun-loving people",
    icon: "🏡",
  },
  {
    id: 4,
    title: "Friends",
    people: "5-10",
    desc: "A large group of thrill-seekers",
    icon: "🎉",
  },
];

export const SelectTransportOptions = [
    { value: "plane", label: "✈️ Plane" },
    { value: "train", label: "🚆 Train" },
    { value: "car", label: "🚗 Car" },
    { value: "bus", label: "🚌 Bus" },
    { value: "any", label: "🌍 Any / Flexible" },
];
