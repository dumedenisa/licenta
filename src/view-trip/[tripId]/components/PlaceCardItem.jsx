import { Button } from '@/components/ui/button';
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { ExternalLink, MapPin, AlertTriangle } from 'lucide-react';

function getSearchLink(hint, query) {
  if (!query && !hint) return '#';
  const encodedQuery = encodeURIComponent(query || '');

  if (hint?.toLowerCase().includes('tripadvisor')) {
    return `https://www.tripadvisor.com/Search?q=${encodedQuery}`;
  }
  if (hint?.toLowerCase().includes('yelp')) {
    return `https://www.yelp.com/search?find_desc=${encodedQuery}`;
  }
  if (hint?.toLowerCase().includes('google maps')) {
    return `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  }
  if (hint) {
    const commonSites = ["wikipedia.org", "booking.com", ".gov", ".edu", "official website"];
    if (commonSites.some(site => hint.toLowerCase().includes(site)) || hint.startsWith("http")) {
      return hint;
    }
    return `https://www.google.com/search?q=${encodeURIComponent(hint + " " + query)}`;
  }
  return `https://www.google.com/search?q=${encodedQuery}`;
}

function PlaceCardItem({ place }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    setPhotoError(false);
    if (place?.activity && typeof place.activity === 'string' && place.activity.trim() !== '') {
      GetPlacePhoto();
    } else {
      setPhotoUrl('/placeholder.jpg');
    }
  }, [place]);

  const GetPlacePhoto = async () => {
    const data = { textQuery: place.activity };
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

  const googleMapsQuery = place?.locationHint || place?.activity;
  const googleMapsLink = googleMapsQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(googleMapsQuery)}`
    : '#';

  const activityName = place?.activity || "Activity";
  const activityDetails = place?.details || "No specific details provided.";

  return (
    <div className="border rounded-xl p-4 flex flex-col sm:flex-row gap-4 hover:shadow-lg transition-shadow bg-white h-full min-h-[170px]">
      {/* Imagine */}
      <div className="relative w-full sm:w-[130px] h-[130px] flex-shrink-0">
        <img
          src={photoUrl}
          onError={() => {
            setPhotoUrl('/placeholder.jpg');
            setPhotoError(true);
          }}
          className="rounded-lg w-full h-full object-cover"
          alt={activityName}
        />
        {photoError && photoUrl === '/placeholder.jpg' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg p-2">
            <AlertTriangle className="h-6 w-6 text-yellow-400 mb-1" />
            <p className="text-white text-xs text-center">Image not available</p>
          </div>
        )}
      </div>

      {/* Conținut */}
      <div className="flex-grow flex flex-col min-w-0">
        <h3 className="font-semibold text-md md:text-lg text-left truncate" title={activityName}>
          {activityName}
        </h3>
        <p className="text-sm text-gray-600 text-left my-1 flex-grow overflow-hidden line-clamp-2">
          {activityDetails}
        </p>

        {place?.transportSuggestion && (
          <div className="mt-1 text-left text-xs text-gray-500 flex items-center">
            <MapPin className="h-3 w-3 mr-1 text-blue-500 flex-shrink-0" />
            <span className="truncate" title={place.transportSuggestion}>
              {place.transportSuggestion}
            </span>
          </div>
        )}

        <div className="mt-auto pt-2 flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(googleMapsLink, '_blank')}
            disabled={!googleMapsQuery || googleMapsQuery === '#'}
            className="text-xs px-2 py-1"
          >
            <MapPin className="h-3.5 w-3.5 mr-1" />
            Map
          </Button>
          {place?.infoLinkHint && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700"
              onClick={() =>
                window.open(
                  getSearchLink(place.infoLinkHint, place.activity),
                  '_blank'
                )
              }
            >
              More Info <ExternalLink className="h-3 w-3 ml-0.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlaceCardItem;
