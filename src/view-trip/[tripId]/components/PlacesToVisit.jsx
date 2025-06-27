import React from 'react';
import PlaceCardItem from './PlaceCardItem';
import { Button } from '@/components/ui/button';
import { Utensils, Coffee, Soup, ExternalLink, VenetianMask } from 'lucide-react';

function getRestaurantSearchLink(hint, restaurantName) {
    if (!restaurantName) return hint || '#';
    const encodedName = encodeURIComponent(restaurantName);
    if (hint?.toLowerCase().includes('yelp')) return `https://www.yelp.com/search?find_desc=${encodedName}`;
    if (hint?.toLowerCase().includes('tripadvisor')) return `https://www.tripadvisor.com/Search?q=${encodedName}`;
    if (hint?.toLowerCase().includes('google maps')) return `https://www.google.com/maps/search/?api=1&query=${encodedName}`;
    return `https://www.google.com/search?q=${encodedName}`;
}

function MealSuggestion({ mealType, mealData, icon }) {
    if (!mealData || !mealData.restaurantName) return null;
    const IconComponent = icon || Utensils;

    return (
        <div className="mb-3 p-3 border rounded-lg bg-slate-50 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-1">
                <IconComponent className="h-5 w-5 mr-2 text-orange-500 flex-shrink-0" />
                <h4 className="font-semibold text-md text-left text-orange-600">
                    {mealType}: {mealData.restaurantName}
                </h4>
            </div>
            {(mealData.cuisineType || mealData.priceRange) && (
                <p className="text-sm text-gray-600 text-left">
                    {mealData.cuisineType && `Cuisine: ${mealData.cuisineType}`}
                    {mealData.cuisineType && mealData.priceRange && " | "}
                    {mealData.priceRange && `Price: ${mealData.priceRange}`}
                </p>
            )}
            {mealData.infoLinkHint && (
                <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800 mt-1"
                    onClick={() =>
                        window.open(getRestaurantSearchLink(mealData.infoLinkHint, mealData.restaurantName), '_blank')
                    }
                >
                    More Info <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
            )}
        </div>
    );
}

function PlacesToVisit({ tripData }) {
    if (!tripData || !Array.isArray(tripData.itinerary) || tripData.itinerary.length === 0) {
        return (
            <div className="mt-10 p-4 border rounded-lg bg-gray-50">
                <p className="text-gray-600 mt-4 text-left">
                    No daily itinerary details available for this trip. The AI might not have provided this information.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-10">
            <div className="space-y-8">
                {tripData.itinerary.map((item, dayIndex) => (
                    <div className="p-4 md:p-6 border rounded-xl shadow-lg bg-white min-h-[600px] mb-10" key={dayIndex}>
                        <div className="flex items-center mb-1">
                            <h3 className="font-bold text-2xl text-left text-bg-[#3b2f2f]">{item.day}</h3>
                        </div>
                        {item.theme && (
                            <p className="text-lg text-gray-700 text-left mb-6 flex items-center">
                                <VenetianMask className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
                                {item.theme}
                            </p>
                        )}

                        {/* Meal Suggestions */}
                        {item.meals && (item.meals.breakfast || item.meals.lunch || item.meals.dinner) && (
                            <div className="mb-6">
                                <h4 className="font-semibold text-lg text-left mb-3 text-gray-800">Meal Suggestions:</h4>
                                <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4">
                                    <MealSuggestion mealType="Breakfast" mealData={item.meals.breakfast} icon={Coffee} />
                                    <MealSuggestion mealType="Lunch" mealData={item.meals.lunch} icon={Soup} />
                                    <MealSuggestion mealType="Dinner" mealData={item.meals.dinner} icon={Utensils} />
                                </div>
                            </div>
                        )}

                        {/* Activities */}
                        {Array.isArray(item.activities) && item.activities.length > 0 ? (
                            <div>
                                <h4 className="font-semibold text-lg text-left mb-3 text-gray-800">Activities:</h4>
                                <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-5 items-start">
                                    {item.activities.map((activityItem, activityIndex) => (
                                        <div key={activityIndex}> 
                                            {activityItem.timeSlot && (
                                                <h5 className="font-semibold text-sm text-left text-[#B8860B] mb-1">
                                                    🕒 {activityItem.timeSlot}
                                                </h5>
                                            )}
                                            <PlaceCardItem place={activityItem} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-left mt-4">
                                No specific activities listed for this day by the AI.
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlacesToVisit;
