import { db } from "@/service/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { ExternalLink, Home, AlertTriangle, RotateCw, Hotel, MapPin, Utensils, Ship } from 'lucide-react'; 

import InfoSection from "./components/InfoSection"; 
import Hotels from "./components/Hotels";
import PlacesToVisit from "./components/PlacesToVisit";
import TransportSection from "./components/TransportSection";
import Footer from "@/components/ui/custom/Footer";

const MinimalistCard = ({ title, subtitle, description, actionText, onActionClick, icon: Icon }) => (
    <div className="bg-white border border-stone-200/70 rounded-lg p-5 hover:shadow-sm transition-shadow duration-200">
        {Icon && <Icon className="w-7 h-7 text-amber-600 mb-3" />}
        <h3 className="font-semibold text-lg text-stone-800 mb-0.5">{title}</h3>
        {subtitle && <p className="text-sm text-stone-500 mb-2">{subtitle}</p>}
        {description && <p className="text-xs text-stone-600 leading-relaxed mb-3">{description}</p>}
        {actionText && onActionClick && (
            <Button 
                variant="link" 
                size="sm" 
                className="p-0 text-xs text-amber-600 hover:text-amber-700 font-medium"
                onClick={onActionClick}
            >
                {actionText} <ExternalLink className="h-3 w-3 ml-1"/>
            </Button>
        )}
    </div>
);


function ViewTrip() {
    const {tripId} = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if (tripId) {
            GetTripData();
        } else {
            toast.error("Trip ID is missing!");
            setLoading(false);
            navigate("/"); 
        }

    },[tripId, navigate]);

    const GetTripData = async () => {
        setLoading(true);
        const docRef = doc(db, 'AITrips', tripId);
        try {
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setTrip(docSnap.data());
            } else {
                toast.error('No trip found with this ID!');
                setTrip(null);
            }
        } catch (error) {
            toast.error("Failed to fetch trip data.");
            setTrip(null);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center text-stone-700 p-6">
                <RotateCw className="animate-spin h-10 w-10 text-amber-600 mb-5" />
                <p className="text-lg font-medium">Loading your trip details...</p>
                <p className="text-xs text-stone-500">Just a moment.</p>
            </div>
        );
    }

    if (!trip) {
         return (
            <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center text-stone-700 p-6 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-5" />
                <h2 className="text-2xl font-semibold mb-2 text-amber-700">Trip Not Found</h2>
                <p className="text-stone-500 mb-6 max-w-sm text-sm">
                    The trip you're looking for isn't here. It might have been moved or the link is incorrect.
                </p>
                <Button 
                    onClick={() => navigate("/")}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-md shadow-sm hover:shadow transition-all text-sm"
                >
                    <Home className="h-4 w-4 mr-1.5" />
                    Go to Homepage
                </Button>
            </div>
        );
    }
    
    const tripData = (trip.tripData && typeof trip.tripData === 'object' && !Array.isArray(trip.tripData)) ? trip.tripData : {};
    const userSelection = (trip.userSelection && typeof trip.userSelection === 'object' && !Array.isArray(trip.userSelection)) ? trip.userSelection : {};

    const SectionTitle = ({ children, icon: Icon }) => (
        <div className="flex items-center gap-3 mt-12 mb-6">
            {Icon && <Icon className="w-6 h-6 text-amber-600 shrink-0" />}
            <h2 className="text-xl sm:text-2xl font-semibold text-amber-700 tracking-tight">
                {children}
            </h2>
        </div>
    );
    

    return(
       <div className="min-h-screen bg-[#fdf6ed] text-stone-700 flex flex-col">
            <div className='w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex-grow'>
                <InfoSection trip={trip}/> 
                <div className="space-y-10 sm:space-y-14"> 
                    {tripData.transportToDestination && (
                        <section>
                            <SectionTitle icon={Ship}>Getting There</SectionTitle>
                            <TransportSection transportInfo={tripData.transportToDestination} userSelection={userSelection} />
                        </section>
                    )}
                    
                    {/* Hotels Section */}
                    {tripData.hotelSuggestions && tripData.hotelSuggestions.length > 0 && (
                        <section>
                            <SectionTitle icon={Hotel}>Accommodation Picks</SectionTitle>
                            <Hotels tripData={tripData} /> 
                        </section>
                    )}

                    {/* Places To Visit Section */}
                    <section>
                        <SectionTitle icon={MapPin}>Your Itinerary</SectionTitle>
                        <PlacesToVisit tripData={tripData} />
                    </section>

                    {/* Restaurant Suggestions Section */}
                    {tripData.restaurantSuggestions && tripData.restaurantSuggestions.length > 0 && (
                        <section>
                            <SectionTitle icon={Utensils}>Culinary Suggestions</SectionTitle>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                {tripData.restaurantSuggestions.map((resto, index) => (
                                    <MinimalistCard
                                        key={index}
                                        title={resto.restaurantName || "Restaurant"}
                                        subtitle={`${resto.cuisineType || ''}${resto.cuisineType && resto.priceRange ? ' | ' : ''}${resto.priceRange || ''}`}
                                        description={resto.description}
                                        actionText={resto.infoLinkHint ? "More Info" : undefined}
                                        onActionClick={resto.infoLinkHint ? () => window.open(getRestaurantSearchLink(resto.infoLinkHint, resto.restaurantName), '_blank') : undefined}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </div>
            <Footer className="bg-stone-50 border-t border-stone-200/70 text-stone-500 text-xs" />
        </div>
    )
}

function getRestaurantSearchLink(hint, restaurantName) {
    if (!restaurantName && !hint) return '#';
    const encodedName = encodeURIComponent(restaurantName || '');
    if (hint?.toLowerCase().includes('yelp')) return `https://www.yelp.com/search?find_desc=${encodedName || encodeURIComponent(hint.replace("Search on Yelp for ", ""))}`;
    if (hint?.toLowerCase().includes('tripadvisor')) return `https://www.tripadvisor.com/Search?q=${encodedName || encodeURIComponent(hint.replace("Search on TripAdvisor for ", ""))}`;
    if (hint?.toLowerCase().includes('google maps')) return `https://www.google.com/maps/search/?api=1&query=${encodedName || encodeURIComponent(hint.replace("Search on Google Maps for ", ""))}`;
    if (hint) {
        if (hint.startsWith("http")) return hint;
        return `https://www.google.com/search?q=${encodeURIComponent(hint + " " + restaurantName)}`;
    }
    return `https://www.google.com/search?q=${encodedName}`;
}

export default ViewTrip;


