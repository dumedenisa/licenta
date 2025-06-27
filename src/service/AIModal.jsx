import { GoogleGenerativeAI } from "@google/generative-ai";

  const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  
    export const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            { text: "Generate Travel Plan for Location: Las Vegas, for 3 Days for Couple with a Cheap budget. Give me a Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, time travel each of the location for 3 days with each day plan with best time to visit in JSON format." },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: `\u0060\u0060\u0060json
  {
    "hotels": [
      {
        "hotelName": "The D Las Vegas",
        "hotelAddress": "301 Fremont Street, Las Vegas, NV 89101",
        "price": "$50-$100 per night",
        "hotelImageUrl": "https://www.thedcasino.com/images/hero/main-hero-02.jpg",
        "geoCoordinates": "36.1695, -115.1438",
        "rating": "3.5 stars",
        "description": "A budget-friendly hotel located in downtown Las Vegas with a retro vibe. It features a casino, a pool, and several dining options."
      },
      {
        "hotelName": "Circus Circus Hotel & Casino",
        "hotelAddress": "2880 Las Vegas Blvd S, Las Vegas, NV 89109",
        "price": "$40-$80 per night",
        "hotelImageUrl": "https://www.circuscircus.com/content/dam/caesars/circus-circus/home/hero-image.jpg",
        "geoCoordinates": "36.1207, -115.1687",
        "rating": "3 stars",
        "description": "A classic Las Vegas hotel with a circus theme. It features a large casino, a midway with carnival rides, and several dining options."
      },
      {
        "hotelName": "Golden Nugget Las Vegas",
        "hotelAddress": "129 E Fremont St, Las Vegas, NV 89101",
        "price": "$70-$150 per night",
        "hotelImageUrl": "https://www.goldennugget.com/las-vegas/media/images/gnl-home-hero-image-large.jpg",
        "geoCoordinates": "36.1695, -115.1438",
        "rating": "4 stars",
        "description": "A luxurious hotel located in downtown Las Vegas. It features a world-class casino, a pool, and several dining options."
      },
      {
        "hotelName": "The Strat Hotel, Casino & SkyPod",
        "hotelAddress": "2000 Las Vegas Blvd S, Las Vegas, NV 89104",
        "price": "$60-$120 per night",
        "hotelImageUrl": "https://www.thestrat.com/content/dam/caesars/strat/home/hero-image.jpg",
        "geoCoordinates": "36.1708, -115.1498",
        "rating": "3.5 stars",
        "description": "A hotel located on the Strip with a towering observation deck. It features a casino, a pool, and several dining options."
      }
    ],
    "itinerary": [
      {
        "day": "Day 1",
        "plan": [
          {
            "time": "9:00 AM - 12:00 PM",
            "placeName": "Fremont Street Experience",
            "placeDetails": "A pedestrian-friendly street in downtown Las Vegas with a canopy of lights and street performers.",
            "placeImageUrl": "https://www.fremontstreetexperience.com/images/fremont-street-experience.jpg",
            "geoCoordinates": "36.1695, -115.1438",
            "ticketPricing": "Free",
            "timeToTravel": "1 hour"
          },
          {
            "time": "12:00 PM - 2:00 PM",
            "placeName": "Heart Attack Grill",
            "placeDetails": "A restaurant known for its outrageous burgers and unhealthy food.",
            "placeImageUrl": "https://images.squarespace-cdn.com/.../buffet.jpg",
            "geoCoordinates": "36.1691, -115.1424",
            "ticketPricing": "Varies",
            "timeToTravel": "15 minutes"
          },
          {
            "time": "2:00 PM - 4:00 PM",
            "placeName": "Neon Museum",
            "placeDetails": "A museum showcasing vintage neon signs from Las Vegas.",
            "placeImageUrl": "https://www.neonmuseum.org/images/content/hero-neon-museum.jpg",
            "geoCoordinates": "36.1722, -115.1465",
            "ticketPricing": "$25",
            "timeToTravel": "30 minutes"
          },
          {
            "time": "4:00 PM - 6:00 PM",
            "placeName": "The LINQ Promenade",
            "placeDetails": "An outdoor shopping and dining promenade on the Strip.",
            "placeImageUrl": "https://www.caesars.com/content/dam/caesars/linq/home/hero-image.jpg",
            "geoCoordinates": "36.1139, -115.1723",
            "ticketPricing": "Free",
            "timeToTravel": "30 minutes"
          },
          {
            "time": "6:00 PM - 8:00 PM",
            "placeName": "Dinner at a buffet",
            "placeDetails": "Las Vegas is famous for its buffets.",
            "placeImageUrl": "https://www.casino.com/blog/wp-content/uploads/2018/03/buffet.jpg",
            "geoCoordinates": "None",
            "ticketPricing": "Varies",
            "timeToTravel": "None"
          }
        ]
      },
      {
        "day": "Day 2",
        "plan": [
          {
            "time": "9:00 AM - 11:00 AM",
            "placeName": "Hoover Dam",
            "placeDetails": "A massive concrete arch-gravity dam on the Colorado River.",
            "placeImageUrl": "https://www.nps.gov/hoba/planyourvisit/images/Hoover-Dam-Panorama_Photo.jpg",
            "geoCoordinates": "36.0047, -114.9896",
            "ticketPricing": "$30",
            "timeToTravel": "1 hour 30 minutes"
          },
          {
            "time": "11:00 AM - 1:00 PM",
            "placeName": "Lake Mead National Recreation Area",
            "placeDetails": "A vast recreation area surrounding Lake Mead.",
            "placeImageUrl": "https://www.nps.gov/lake/learn/nature/images/lakemeadnra-boatlaunch.jpg",
            "geoCoordinates": "36.0887, -114.8983",
            "ticketPricing": "Free",
            "timeToTravel": "30 minutes"
          },
          {
            "time": "1:00 PM - 3:00 PM",
            "placeName": "Lunch at a local diner",
            "placeDetails": "There are many great diners in Las Vegas.",
            "placeImageUrl": "https://www.restaurant.com/images/restaurants/29825/1/lg.jpg",
            "geoCoordinates": "None",
            "ticketPricing": "Varies",
            "timeToTravel": "None"
          },
          {
            "time": "3:00 PM - 5:00 PM",
            "placeName": "Bellagio Conservatory & Botanical Garden",
            "placeDetails": "A stunning botanical garden located inside the Bellagio Hotel.",
            "placeImageUrl": "https://www.bellagio.com/content/dam/mgmresorts/bellagio/images/conservatory/conservatory-hero-mobile.jpg",
            "geoCoordinates": "36.1101, -115.1747",
            "ticketPricing": "Free",
            "timeToTravel": "30 minutes"
          },
          {
            "time": "5:00 PM - 7:00 PM",
            "placeName": "Fountains of Bellagio",
            "placeDetails": "A spectacular water and light show in front of the Bellagio Hotel.",
            "placeImageUrl": "https://www.bellagio.com/content/dam/mgmresorts/bellagio/images/fountains/fountains-hero-mobile.jpg",
            "geoCoordinates": "36.1101, -115.1747",
            "ticketPricing": "Free",
            "timeToTravel": "5 minutes"
          }
        ]
      },
      {
        "day": "Day 3",
        "plan": [
          {
            "time": "9:00 AM - 11:00 AM",
            "placeName": "Red Rock Canyon",
            "placeDetails": "A scenic area with beautiful red rock formations perfect for hiking and photography.",
            "placeImageUrl": "https://www.redrockcanyonlv.org/wp-content/uploads/2019/03/RRC-Scenic-Drive-768x432.jpg",
            "geoCoordinates": "36.1358, -115.4270",
            "ticketPricing": "$15",
            "timeToTravel": "40 minutes"
          },
          {
            "time": "11:00 AM - 1:00 PM",
            "placeName": "Springs Preserve",
            "placeDetails": "A cultural and historical attraction featuring museums, galleries, and botanical gardens.",
            "placeImageUrl": "https://www.springspreserve.org/images/explore/gardens/gardens-hero.jpg",
            "geoCoordinates": "36.1721, -115.1897",
            "ticketPricing": "$9.95",
            "timeToTravel": "25 minutes"
          },
          {
            "time": "1:00 PM - 3:00 PM",
            "placeName": "Lunch at Shake Shack",
            "placeDetails": "A casual burger joint located at the New York-New York Hotel.",
            "placeImageUrl": "https://cdn.shakeshack.com/images/locations/nyny.jpg",
            "geoCoordinates": "36.1024, -115.1736",
            "ticketPricing": "Varies",
            "timeToTravel": "20 minutes"
          },
          {
            "time": "3:00 PM - 5:00 PM",
            "placeName": "The High Roller",
            "placeDetails": "A giant Ferris wheel offering panoramic views of the Las Vegas Strip.",
            "placeImageUrl": "https://www.caesars.com/content/dam/total-rewards/high-roller/hr-desktop-hero.jpg",
            "geoCoordinates": "36.1170, -115.1697",
            "ticketPricing": "$23.50",
            "timeToTravel": "10 minutes"
          },
          {
            "time": "5:00 PM - 7:00 PM",
            "placeName": "Evening Walk on the Strip",
            "placeDetails": "Take in the sights and sounds of the Las Vegas Strip during sunset.",
            "placeImageUrl": "https://cdn.britannica.com/03/94303-050-4A9F7682/Las-Vegas-Strip.jpg",
            "geoCoordinates": "36.1147, -115.1728",
            "ticketPricing": "Free",
            "timeToTravel": "None"
          }
        ]
      }
    ]
  }
  \u0060\u0060\u0060`
            }
          ],
        },
      ],
    });
