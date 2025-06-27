import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";
import Footer from "@/components/ui/custom/Footer";

function MyTrips() {
  const navigate = useNavigate();
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    try {
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map((doc) => doc.data());
      setUserTrips(trips);
    } catch (error) {
      console.error("❌ Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">
        {userTrips?.length>0?userTrips.map((trip, index) => (
          <UserTripCardItem trip={trip}  key={index}/>
        ))
        :[1,2,3,4,5,6].map((item,index)=>(
            <div key={index} className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl">

            </div>
        ))
    }
      </div>
    </div>
    <Footer />
    </>
  );
}

export default MyTrips;
