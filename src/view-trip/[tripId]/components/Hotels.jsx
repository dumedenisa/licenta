import React from "react";
import HotelCardItem from "./HotelCardItem";
import { Button } from '@/components/ui/button';


function Hotels({ tripData }) {
  if (!tripData?.hotelSuggestions || tripData.hotelSuggestions.length === 0) {
    return (
        <div className="mt-10 p-4 border rounded-lg bg-gray-50">
            <h2 className="font-bold text-xl mt-5 mb-4 text-left">Hotel Recommendations</h2>
            <p className="text-gray-600 mt-4 text-left">No specific hotel recommendations provided by the AI.</p>
        </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tripData.hotelSuggestions.map((hotel, index) => (
          <HotelCardItem hotel={hotel} key={index} />
        ))}
      </div>
    </div>
  );
}
export default Hotels;