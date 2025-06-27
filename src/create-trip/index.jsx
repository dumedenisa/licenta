import React, { useEffect, useState } from "react";
import Footer from "@/components/ui/custom/Footer";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelesList,
  SelectTransportOptions,
} from "@/constants/options";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { chatSession } from "@/service/AIModal";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"; // Added CheckCircle, ArrowRight, ArrowLeft
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STEPS = [
  { id: 1, name: "Trip Basics", fields: ["departureCity", "location", "dates", "noOfDays"] },
  { id: 2, name: "Travel Style", fields: ["budget", "traveler"] },
  { id: 3, name: "Logistics", fields: ["transport"] },
];

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({
    location: null,
    departureCity: "",
    noOfDays: "",
    budget: "",
    traveler: "",
    dates: null,
    transport: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); 

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === "noOfDays" ? Number(value) : value,
    }));
  };

  const handleDateChange = (dateRange) => {
    setFormData((prev) => ({
      ...prev,
      dates: dateRange,
    }));
  };

  useEffect(() => {
    if (formData.dates?.from && formData.dates?.to) {
      const diffTime = Math.abs(
        new Date(formData.dates.to) - new Date(formData.dates.from)
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      if (formData.noOfDays !== diffDays.toString()) {
        handleInputChange("noOfDays", diffDays.toString());
      }
    }
  }, [formData.dates]);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => GetUserProfile(tokenInfo),
    onError: (error) => console.error("❌ Login failed:", error),
  });

  const validateStep = (stepNumber) => {
    const currentStepFields = STEPS.find(step => step.id === stepNumber)?.fields || [];
    for (const field of currentStepFields) {
        if (field === "dates") {
            if (!formData.dates?.from || !formData.dates?.to) return false;
        } else if (!formData[field]) {
            return false;
        }
    }
    if (stepNumber === 1 && (formData?.noOfDays > 30 || formData?.noOfDays < 1)) {
        toast.warning("Number of days must be between 1 and 30.");
        return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) {
        toast.error("Please fill all required fields for this step.");
        return;
    }
    if (currentStep < STEPS.length) {
        setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
        setCurrentStep(prev => prev - 1);
    }
  };


  const OnGenerateTrip = async () => {
    if (!validateStep(currentStep)) { 
        toast.error("Please ensure all details are correctly filled.");
        return;
    }

    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    setLoading(true);
    const formattedStartDate = formData.dates.from ? format(formData.dates.from, "PPP") : "anytime";
    const formattedEndDate = formData.dates.to ? format(formData.dates.to, "PPP") : "anytime";

    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location?.label)
      .replace("{departureCity}", formData?.departureCity)
      .replace("{totalDays}", formData?.noOfDays.toString())
      .replace("{traveler}", formData?.traveler)
      .replace("{budget}", formData?.budget)
      .replace("{startDate}", formattedStartDate)
      .replace("{endDate}", formattedEndDate)
      .replace("{transportPreference}", formData?.transport || "any available");

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);
      setLoading(false);
      SaveAiTrip(result?.response?.text());
    } catch (error) {
      console.error("Error generating trip with AI:", error);
      toast.error("Error generating trip. The AI might be busy. Please try again.");
      setLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docID = Date.now().toString();
    try {
      const parsedTripData = JSON.parse(TripData);
      await setDoc(doc(db, "AITrips", docID), {
        userSelection: formData,
        tripData: parsedTripData,
        userEmail: user?.email,
        id: docID,
      });
      setLoading(false);
      toast.success("Your trip has been generated successfully!");
      navigate("/view-trip/" + docID);
    } catch (error) {
      console.error("Error parsing AI response or saving trip:", error);
      toast.error("Received an invalid response from AI. Could not save trip.");
      setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: { Authorization: `Bearer ${tokenInfo.access_token}`, Accept: "application/json" },
      })
      .then((resp) => {
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        window.dispatchEvent(new Event("userLoggedIn")); 
        OnGenerateTrip(); 
      })
      .catch((error) => {
        toast.error("Failed to fetch user profile after login.");
      });
  };

  const googlePlacesAutocompleteStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'hsl(var(--background))', 
      borderColor: 'hsl(var(--input))', 
      boxShadow: 'none',
      borderRadius: '0.375rem', 
      minHeight: '2.5rem', 
      '&:hover': { borderColor: 'hsl(var(--ring))' }, 
    }),
    singleValue: (provided) => ({ ...provided, color: 'hsl(var(--foreground))' }), 
    input: (provided) => ({ ...provided, color: 'hsl(var(--foreground))', margin: '0px', paddingBottom: '0px', paddingTop: '0px'}),
    menu: (provided) => ({ ...provided, backgroundColor: 'hsl(var(--popover))', zIndex: 20 }), 
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? 'hsl(var(--accent))' : 'hsl(var(--popover))', 
      color: state.isFocused ? 'hsl(var(--accent-foreground))' : 'hsl(var(--foreground))', 
      '&:active': { backgroundColor: 'hsl(var(--accent))' },
    }),
    placeholder: (provided) => ({...provided, color: 'hsl(var(--muted-foreground))' }), 
  };

  return (
    <>
    <div className="min-h-screen bg-[#fdf6ed] text-stone-800 flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
        <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl flex overflow-hidden">
          {/* Stepper Sidebar */}
          <div className="w-1/3 bg-stone-100 p-8 border-r border-stone-200">
            <img src="/logo.svg" alt="App Logo" className="h-10 mb-10" /> 
            <h2 className="text-2xl font-semibold text-amber-700 mb-8">Create Your Trip</h2>
            <nav>
              <ul>
                {STEPS.map((step, index) => (
                  <li key={step.id} className="relative mb-7">
                    {index < STEPS.length -1 && (
                        <div className={`absolute left-[13px] top-10 h-full w-0.5 ${currentStep > step.id ? 'bg-amber-600' : 'bg-stone-300'}`} />
                    )}
                    <div className="flex items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mr-4 shrink-0
                                    ${currentStep > step.id ? 'bg-amber-600 text-white' : 
                                    currentStep === step.id ? 'bg-amber-600 text-white ring-4 ring-amber-200' : 
                                    'bg-stone-300 text-stone-500'}`}
                      >
                        {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                      </div>
                      <span className={`font-medium ${currentStep === step.id ? 'text-amber-700' : currentStep > step.id ? 'text-stone-700' : 'text-stone-500'}`}>
                        {step.name}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Form Content Area */}
          <div className="w-2/3 p-8 sm:p-12 overflow-y-auto">
            {/* Step 1: Trip Basics */}
            {currentStep === 1 && (
              <section className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-amber-700 mb-1">Let's start with the basics!</h3>
                  <p className="text-sm text-stone-500 mb-6">Tell us about your departure and destination.</p>
                </div>
                <div>
                  <label htmlFor="departureCity" className="block text-sm font-medium text-stone-700 mb-1.5">From where are you departing?</label>
                  <Input id="departureCity" placeholder="E.g., Bucharest" value={formData.departureCity} onChange={(e) => handleInputChange("departureCity", e.target.value)} className="border-stone-300 focus:ring-amber-500 focus:border-amber-500" />
                </div>
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-stone-700 mb-1.5">Where would you like to travel?</label>
                  <GooglePlacesAutocomplete apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                    selectProps={{ id:"destination", place, onChange: (v) => { setPlace(v); handleInputChange("location", v); }, styles: googlePlacesAutocompleteStyles, placeholder: "Search for a city or country..."}}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">When are you planning to travel?</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"outline"} className={`w-full justify-start text-left font-normal border-stone-300 hover:bg-stone-50 text-stone-800 ${!formData.dates && "text-stone-500"}`}>
                        <CalendarIcon className="mr-2 h-4 w-4 text-amber-600" />
                        {formData.dates?.from ? (formData.dates.to ? (<>{format(formData.dates.from, "LLL dd, y")} - {format(formData.dates.to, "LLL dd, y")}</>) : format(formData.dates.from, "LLL dd, y")) : (<span>Pick a date range</span>)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-stone-200 shadow-lg" align="start">
                      <Calendar initialFocus mode="range" defaultMonth={formData.dates?.from} selected={formData.dates} onSelect={handleDateChange} numberOfMonths={2} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} 
                        className="[&_button]:text-stone-700 [&_button:hover]:bg-amber-100 [&_.rdp-day_selected]:bg-amber-600 [&_.rdp-day_selected:hover]:bg-amber-700 [&_.rdp-day_selected]:text-white"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <label htmlFor="noOfDays" className="block text-sm font-medium text-stone-700 mb-1.5">How many days for this adventure?</label>
                  <Input id="noOfDays" placeholder="Ex. 3" type="number" value={formData.noOfDays} onChange={(e) => handleInputChange("noOfDays", e.target.value)} className="border-stone-300 focus:ring-amber-500 focus:border-amber-500" />
                  {formData.dates?.from && formData.dates?.to && Number(formData.noOfDays) > 0 && (
                    <p className="text-xs text-stone-500 mt-1">
                        Selected date range implies {Math.ceil(Math.abs(new Date(formData.dates.to) - new Date(formData.dates.from)) / (1000 * 60 * 60 * 24)) +1 } days. Your input: {formData.noOfDays} days.
                    </p>
                  )}
                </div>
              </section>
            )}

            {/* Step 2: Travel Style */}
            {currentStep === 2 && (
              <section className="space-y-8">
                 <div>
                  <h3 className="text-xl font-semibold text-amber-700 mb-1">Define your travel style.</h3>
                  <p className="text-sm text-stone-500 mb-6">Let us know your budget and who you're traveling with.</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-700 mb-2.5">What is your budget?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SelectBudgetOptions.map((item, index) => (
                      <div key={index} onClick={() => handleInputChange("budget", item.title)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-amber-500
                                    ${formData?.budget === item.title ? "shadow-lg border-amber-600 ring-2 ring-amber-500 bg-amber-50" : "border-stone-300 bg-white"}`}>
                        <h2 className="text-3xl text-amber-600">{item.icon}</h2>
                        <h2 className="font-semibold text-md text-stone-800 mt-1.5">{item.title}</h2>
                        <h2 className="text-xs text-stone-500">{item.desc}</h2>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-stone-700 mb-2.5">Who do you plan on traveling with?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {SelectTravelesList.map((item, index) => (
                      <div key={index} onClick={() => handleInputChange("traveler", item.people)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:border-amber-500
                                    ${formData?.traveler === item.people ? "shadow-lg border-amber-600 ring-2 ring-amber-500 bg-amber-50" : "border-stone-300 bg-white"}`}>
                        <h2 className="text-3xl text-amber-600">{item.icon}</h2>
                        <h2 className="font-semibold text-md text-stone-800 mt-1.5">{item.title}</h2>
                        <h2 className="text-xs text-stone-500">{item.desc}</h2>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Step 3: Logistics */}
            {currentStep === 3 && (
              <section className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-amber-700 mb-1">Final Touches</h3>
                  <p className="text-sm text-stone-500 mb-6">Any transport preferences?</p>
                </div>
                <div>
                  <label htmlFor="transport" className="block text-sm font-medium text-stone-700 mb-1.5">Preferred mode of transport to the destination? (Optional)</label>
                  <Select onValueChange={(value) => handleInputChange("transport", value)} defaultValue={formData.transport}>
                    <SelectTrigger id="transport" className="w-full border-stone-300 focus:ring-amber-500 focus:border-amber-500 data-[placeholder]:text-stone-500">
                      <SelectValue placeholder="Select transport mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-stone-200">
                      {SelectTransportOptions.map((option, index) => (
                        <SelectItem key={index} value={option.value} className="hover:bg-amber-50 focus:bg-amber-100 data-[state=checked]:bg-amber-100 data-[state=checked]:text-amber-700">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </section>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-12 pt-8 border-t border-stone-200 flex justify-between items-center">
                <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 1} className="border-stone-300 text-stone-600 hover:bg-stone-100 disabled:opacity-50">
                    <ArrowLeft size={18} className="mr-2" /> Previous
                </Button>
                {currentStep < STEPS.length ? (
                    <Button onClick={handleNextStep} className="bg-amber-600 hover:bg-amber-700 text-white">
                        Next <ArrowRight size={18} className="ml-2" />
                    </Button>
                ) : (
                    <Button disabled={loading} onClick={OnGenerateTrip} className="bg-green-600 hover:bg-green-700 text-white">
                        {loading ? <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin mr-2" /> : <CheckCircle size={18} className="mr-2" />}
                        Generate Trip
                    </Button>
                )}
            </div>

          </div>
        </div>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white sm:max-w-md rounded-lg p-8">
          <DialogHeader className="text-center">
            <img src="/logo.svg" alt="Logo" className="mx-auto mb-5 h-12 w-auto" />
            <DialogTitle className="font-semibold text-xl text-amber-700">Sign In Required</DialogTitle>
            <DialogDescription className="my-3 text-stone-600 text-sm">
              Please sign in with Google to craft and save your amazing trips.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={login} className="w-full mt-4 py-2.5 bg-stone-700 hover:bg-stone-800 text-white font-medium flex items-center justify-center gap-2.5 rounded-md transition-colors duration-200">
            <FcGoogle className="h-5 w-5" /> Sign In with Google
          </Button>
        </DialogContent>
      </Dialog>
     
    </div>
    
     <Footer className="bg-stone-100 border-t border-stone-200 text-stone-600" />
     </>
  );
}
export default CreateTrip;