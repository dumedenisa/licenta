import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');

  useEffect(() => {
    if (trip?.userSelection?.location?.label) {
      GetPlacePhoto();
    }
  }, [trip]);

  const GetPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.location?.label
    };

    try {
      const resp = await GetPlaceDetails(data);
      const photo = resp?.data?.places?.[0]?.photos?.[0];
      if (photo?.name) {
        const url = PHOTO_REF_URL.replace('{NAME}', photo.name);
        setPhotoUrl(url);
      }
    } catch (error) {
      console.error("❌ Error fetching photo:", error);
    }
  };

  return (
    <Link to={`/view-trip/${trip?.id}`}>
      <div className="hover:scale-105 transition-all w-full">
        <div className="w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
          <img
            src={photoUrl}
            alt={trip?.userSelection?.location?.label}
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
          />
        </div>
        <div className="mt-3 text-center">
          <h2 className="font-bold text-lg">{trip?.userSelection?.location?.label}</h2>
          <p className="text-sm text-gray-500">
            {trip?.userSelection?.noOfDays} days trip with {trip?.userSelection?.budget} Budget
          </p>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
