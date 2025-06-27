import React from 'react';
import { Button } from '@/components/ui/button';
import { Plane, Train, Car, Bus, ExternalLink } from 'lucide-react';

function getTransportIcon(type) {
    switch (type?.toLowerCase()) {
        case 'flight':
        case 'plane':
            return <Plane className="h-5 w-5 mr-2 text-blue-500" />;
        case 'train':
            return <Train className="h-5 w-5 mr-2 text-green-500" />;
        case 'car':
            return <Car className="h-5 w-5 mr-2 text-red-500" />;
        case 'bus':
            return <Bus className="h-5 w-5 mr-2 text-yellow-500" />;
        default:
            return <ExternalLink className="h-5 w-5 mr-2 text-gray-500" />;
    }
}

function getSearchLink(hint, departureCity, destinationLocation, startDate, endDate, suggestionType, originCodeHint, destinationCodeHint) {
    const queryDestination = encodeURIComponent(destinationLocation?.label || destinationLocation || '');
    const queryDeparture = encodeURIComponent(departureCity || "YOUR-ORIGIN"); 

    const formatDateForSkyscanner = (dateStr) => {
        if (!dateStr) return '';
        try {
            const dateObj = new Date(dateStr);
            if (isNaN(dateObj.getTime())) return ''; 
            const year = dateObj.getFullYear().toString().slice(-2);
            const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
            const day = dateObj.getDate().toString().padStart(2, '0');
            return `${year}${month}${day}`;
        } catch (e) { return ''; }
    };

    const skyscannerStartDate = formatDateForSkyscanner(startDate);
    const skyscannerEndDate = formatDateForSkyscanner(endDate);

    if (hint?.toLowerCase().includes('skyscanner') && (suggestionType?.toLowerCase() === 'flight' || suggestionType?.toLowerCase() === 'plane')) {
        const origin = (originCodeHint || queryDeparture).toLowerCase();
        const destination = (destinationCodeHint || queryDestination).toLowerCase();
        let skyscannerUrl = `https://www.skyscanner.net/transport/flights/${origin.substring(0,4)}/${destination.substring(0,4)}/`;
        if (skyscannerStartDate) {
            skyscannerUrl += `${skyscannerStartDate}/`;
            if (skyscannerEndDate) {
                skyscannerUrl += `${skyscannerEndDate}/`;
            }
        }
        skyscannerUrl += `?adults=1&children=0&adultsv2=1&childrenv2=&infants=0&cabinclass=economy&rtn=${skyscannerEndDate ? 1 : 0}¤cy=EUR&market=RO&locale=en-GB`;
        return skyscannerUrl;
    }
    if (hint?.toLowerCase().includes('google flights') && (suggestionType?.toLowerCase() === 'flight' || suggestionType?.toLowerCase() === 'plane')) {
        const gFlightsStartDate = startDate ? new Date(startDate).toISOString().split('T')[0] : '*';
        const gFlightsEndDate = endDate ? new Date(endDate).toISOString().split('T')[0] : '';
        let googleFlightsUrl = `https://www.google.com/flights#flt=${queryDeparture}.${queryDestination}.${gFlightsStartDate}`;
        if (gFlightsEndDate && queryDeparture && queryDestination) { 
            googleFlightsUrl += `*${queryDestination}.${queryDeparture}.${gFlightsEndDate}`;
        }
        googleFlightsUrl += `;c:EUR;e:1;sd:1;t:f`;
        return googleFlightsUrl;
    }
    if (hint?.toLowerCase().includes('trainline') || hint?.toLowerCase().includes('eurail')) {
        return `https://www.thetrainline.com/`; 
    }
    if (hint?.toLowerCase().includes('rentalcars.com')) {
        return `https://www.rentalcars.com/`;
    }
    if (hint?.toLowerCase().includes('booking.com')) {
        return `https://www.booking.com/searchresults.html?ss=${queryDestination}`;
    }
    if (hint?.toLowerCase().includes('tripadvisor')) {
        return `https://www.tripadvisor.com/Search?q=${queryDestination}`;
    }
    if (hint?.toLowerCase().includes('yelp')) {
        return `https://www.yelp.com/search?find_loc=${queryDestination}`;
    }
    if (hint) {
        return `https://www.google.com/search?q=${encodeURIComponent(hint + " " + (departureCity || "") + " to " + (destinationLocation?.label || destinationLocation || ""))}`;
    }
    return `https://www.google.com/search?q=${encodeURIComponent((departureCity || "") + " to " + (destinationLocation?.label || destinationLocation || "") + " " + (suggestionType || ""))}`;
}


function TransportSection({ transportInfo, userSelection }) {
  if (!transportInfo || !transportInfo.suggestions || transportInfo.suggestions.length === 0) {
    return (
        <div className="mt-10 p-4 border rounded-lg bg-gray-50">
             <p className="text-gray-600 text-left">No specific transport suggestions provided by the AI for this trip.</p>
        </div>
    );
  }

  const { location, dates, departureCity } = userSelection || {};

  return (
    <div className="mt-10">
      <p className="text-sm text-gray-600 mb-3 text-left">
        User Preference: <span className="font-semibold">{transportInfo.preference || 'Not specified'}</span>
      </p>
      <div className="space-y-4">
        {transportInfo.suggestions.map((suggestion, index) => (
          <div key={index} className="p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center mb-2">
                {getTransportIcon(suggestion.type)}
                <h3 className="font-semibold text-lg text-left capitalize">{suggestion.type || 'Suggestion'}</h3>
            </div>
            <p className="text-gray-700 my-2 text-left text-sm">{suggestion.details}</p>
            {suggestion.bookingLinkHint && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(getSearchLink(
                    suggestion.bookingLinkHint, 
                    departureCity, 
                    location, 
                    dates?.from, 
                    dates?.to, 
                    suggestion.type,
                    suggestion.originCityCodeHint, 
                    suggestion.destinationCityCodeHint 
                ), '_blank')}
                className="mt-2"
              >
                Find Tickets on {suggestion.bookingLinkHint.split(' ')[2] || suggestion.bookingLinkHint.split(' ')[0] || 'Partner Site'}
                <ExternalLink className="h-4 w-4 ml-2"/>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export default TransportSection;