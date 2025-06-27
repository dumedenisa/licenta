import { Button } from '@/components/ui/button'
import { GetPlaceDetails, PHOTO_REF_URL } from '@/service/GlobalApi';
import React, { useEffect, useState } from 'react'
import { IoIosSend } from "react-icons/io";

function InfoSection({trip}) {

  const [photoUrl, setPhotoUrl] = useState('/placeholder.jpg');
const [photoError, setPhotoError] = useState(false);

useEffect(() => {
  setPhotoError(false);
  if (trip?.userSelection?.location?.label?.trim()) {
    GetPlacePhoto();
  } else {
    setPhotoUrl('/placeholder.jpg');
    setPhotoError(true);
  }
}, [trip]);

const GetPlacePhoto = async () => {
  const data = {
    textQuery: trip?.userSelection?.location?.label,
  };

  try {
    const resp = await GetPlaceDetails(data);
    const photo = resp?.data?.places?.[0]?.photos?.[0];
    if (photo?.name) {
      const url = PHOTO_REF_URL.replace('{NAME}', photo.name);
      setPhotoUrl(url);
      setPhotoError(false);
    } else {
      setPhotoUrl('/placeholder.jpg');
      setPhotoError(true);
    }
  } catch (error) {
    console.error("❌ Error fetching photo:", error);
    setPhotoUrl('/placeholder.jpg');
    setPhotoError(true);
  }
};
  
  return (
    <div>
        <img src={photoUrl ? photoUrl : '/placeholder.jpg'} className='h-[340px] w-full object-cover rounded-xl'/>

        <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
            <h2 className='font-bold text-2xl text-left'>{trip?.userSelection?.location?.label}</h2>
            <div className='flex gap-5'>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>📅 {trip.userSelection?.noOfDays} Days</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>💰 {trip.userSelection?.budget} Budget</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>🥂 No. of traveler: {trip.userSelection?.traveler}</h2>

            </div>
        </div>
       
        </div>
    </div>
  )
}

export default InfoSection