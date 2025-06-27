import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Star, AlertTriangle } from 'lucide-react';

function getSearchLink(hint, hotelName) {
    if (!hotelName && !hint) return '#';
    const encodedHotelName = encodeURIComponent(hotelName || '');

    if (hint?.toLowerCase().includes('booking.com')) {
         return `https://www.booking.com/searchresults.html?ss=${encodedHotelName || encodeURIComponent(hint.replace("Search on Booking.com for ",""))}&group_adults=2`; // Added adults=2
    }
    if (hint?.toLowerCase().includes('tripadvisor')) {
        return `https://www.tripadvisor.com/Search?q=${encodedHotelName || encodeURIComponent(hint.replace("Search on TripAdvisor for ",""))}`;
    }
    if (hint) {
        const commonSites = ["expedia.com", "hotels.com", "agoda.com", "official website"];
         if (commonSites.some(site => hint.toLowerCase().includes(site)) || hint.startsWith("http")) {
            return hint;
        }
        return `https://www.google.com/search?q=${encodeURIComponent(hint + " " + hotelName)}`;
    }
    return `https://www.google.com/search?q=${encodedHotelName}`;
}


function HotelCardItem({ hotel }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');
  const [photoError, setPhotoError] = useState(false);


  useEffect(() => {
    setPhotoError(false);
    if (hotel?.hotelName && typeof hotel.hotelName === 'string' && hotel.hotelName.trim() !== '') {
        GetPlacePhoto();
    } else {
        setPhotoUrl('/placeholder.jpg');
    }
  }, [hotel]);

  const GetPlacePhoto = async () => {
    const data = { textQuery: hotel.hotelName };
    try {
      const resp = await GetPlaceDetails(data);
      const photo = resp?.data?.places?.[0]?.photos?.[0];
      if (photo?.name) {
        setPhotoUrl(PHOTO_REF_URL.replace('{NAME}', photo.name));
        setPhotoError(false);
      } else {
        setPhotoUrl('/placeholder.jpg'); 
        setPhotoError(true);
      }
    } catch (error) {
      setPhotoUrl('/placeholder.jpg');
      setPhotoError(true);
    }
  };

  const hotelName = hotel?.hotelName || "Hotel Name Not Available";
  const hotelAddress = hotel?.hotelAddress;
  const priceRange = hotel?.priceRange;
  const rating = hotel?.rating;
  const description = hotel?.description || "No description available.";

  const googleMapsLink = hotelName !== "Hotel Name Not Available"
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelName)}${hotelAddress ? '+' + encodeURIComponent(hotelAddress) : ''}`
    : '#';

  return (
    <div className='border rounded-xl p-3 md:p-4 hover:shadow-xl transition-shadow flex flex-col h-full bg-white'>
        <div className="relative w-full h-[180px] md:h-[200px] flex-shrink-0 mb-3">
            <img
                src={photoUrl}
                onError={() => {
                    setPhotoUrl('/placeholder.jpg');
                    setPhotoError(true);
                }}
                className='rounded-lg w-full h-full object-cover'
                alt={hotelName}
            />
            {photoError && photoUrl === '/placeholder.jpg' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg p-2">
                    <AlertTriangle className="h-8 w-8 text-yellow-400 mb-1" />
                    <p className="text-white text-sm text-center">Image not found</p>
                </div>
            )}
        </div>
        
        <div className='flex flex-col gap-1 flex-grow min-w-0'> 
          <h3 className='font-semibold text-left text-md md:text-lg truncate' title={hotelName}>{hotelName}</h3>
          {hotelAddress && <p className='text-xs text-gray-500 text-left flex items-center mb-1 truncate' title={hotelAddress}><MapPin className="h-3 w-3 mr-1 flex-shrink-0" /> {hotelAddress}</p>}
          
          <div className="flex items-center text-xs md:text-sm text-left mt-1">
            {priceRange && <span className='mr-3'>💰 Price: {priceRange}</span>}
            {rating && (
                <span className='flex items-center'>
                    <Star className="h-3.5 w-3.5 md:h-4 md:w-4 mr-0.5 text-yellow-400 fill-yellow-400" /> {rating}
                </span>
            )}
          </div>
          <p className='text-xs md:text-sm text-gray-600 text-left mt-2 flex-grow overflow-hidden line-clamp-3 md:line-clamp-4'>
            {description}
          </p>
        </div>

        <div className="mt-auto pt-3 flex flex-wrap gap-2 items-center justify-start">
            <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.open(googleMapsLink, '_blank')}
                disabled={googleMapsLink === '#'}
                className="text-xs px-2 py-1"
            >
                <MapPin className="h-3.5 w-3.5 mr-1" />
                Map
            </Button>
            {hotel?.bookingLinkHint && (
                 <Button 
                    variant="default"
                    size="sm"
                    onClick={() => window.open(getSearchLink(hotel.bookingLinkHint, hotel.hotelName), '_blank')}
                    className="text-xs px-2 py-1"
                >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Availability
                </Button>
            )}
        </div>
    </div>
  );
}
export default HotelCardItem;