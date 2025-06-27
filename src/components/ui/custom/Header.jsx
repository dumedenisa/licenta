import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; 
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

import { Home, PlusSquare, Briefcase, LogOut, UserCircle } from "lucide-react";

function Header() {
  let initialUser = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      initialUser = JSON.parse(storedUser);
    } else if (storedUser === "undefined") {
        localStorage.removeItem("user");
    }
  } catch (error) {
    console.error("Error parsing user from localStorage on initial load:", error);
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(initialUser);
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
  const handleUserLogin = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      setUser(JSON.parse(storedUser));
    }
  };

  window.addEventListener("userLoggedIn", handleUserLogin);
  return () => window.removeEventListener("userLoggedIn", handleUserLogin);
}, []);

  const login = useGoogleLogin({
    onSuccess: (tokenInfo) => {
      console.log("✅ Login successful:", tokenInfo);
      GetUserProfile(tokenInfo);
    },
    onError: (error) => console.error("❌ Login failed:", error),
  });

  const GetUserProfile = (tokenInfo) => {
    if (!tokenInfo || !tokenInfo.access_token) {
        console.error("GetUserProfile called with invalid tokenInfo");
        return;
    }
    axios
      .get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
          Authorization: `Bearer ${tokenInfo.access_token}`,
          Accept: "application/json",
        },
      })
      .then((resp) => {
        if (resp.data) {
            localStorage.setItem("user", JSON.stringify(resp.data));
            setUser(resp.data); 
            setOpenDialog(false);
            window.location.reload(); 
        } else {
            console.error("User profile data is empty");
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching user info:", error.response || error);
      });
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem("user");
    setUser(null); 
    window.location.href = '/'; 
  };

  return (
    <header className="w-full bg-white shadow-sm py-3 sticky top-0 z-50 border-b border-stone-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a href="/"> {/* Logo ca link către Home cu <a> */}
          <img src="/logo.svg" alt="Logo" className="h-9 sm:h-10" />
        </a>

        <nav>
          {user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="/" title="Home">
                <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-amber-100 hover:text-amber-700 rounded-full">
                  <Home className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                </Button>
              </a>
              <a href="/create-trip" title="Create Trip">
                <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-amber-100 hover:text-amber-700 rounded-full">
                  <PlusSquare className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                </Button>
              </a>
              <a href="/my-trips" title="My Trips">
                <Button variant="ghost" size="icon" className="text-stone-600 hover:bg-amber-100 hover:text-amber-700 rounded-full">
                  <Briefcase className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
                </Button>
              </a>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1 sm:ml-2 rounded-full p-0.5 hover:bg-amber-100 focus-visible:ring-1 focus-visible:ring-amber-500 focus-visible:ring-offset-1">
                    {user.picture ? (
                      <img
                        src={user.picture}
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                        alt="user avatar"
                      />
                    ) : (
                      <UserCircle className="h-8 w-8 sm:h-9 sm:w-9 text-amber-700" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 bg-white border-stone-200 shadow-lg rounded-md p-0 mt-2">
                   <div className="px-3 py-2 border-b border-stone-100">
                    <p className="text-sm font-medium text-stone-700 truncate">{user.name || "User"}</p>
                  </div>
                  <button
                    className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2 rounded-b-md"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <Button
              onClick={() => setOpenDialog(true)}
              className="bg-amber-600 text-white hover:bg-amber-700 px-5 py-2 rounded-lg text-sm shadow-sm"
            >
              Sign In
            </Button>
          )}
        </nav>

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="bg-white sm:max-w-xs md:max-w-sm rounded-xl p-6">
            <DialogHeader className="text-center mb-2">
              <img src="/logo.svg" alt="Logo" className="mx-auto h-10 mb-5" />
              <DialogTitle className="font-semibold text-xl text-amber-700">Sign In with Google</DialogTitle>
              <DialogDescription className="text-xs text-stone-500 mt-1">
                Securely access your travel plans.
              </DialogDescription>
            </DialogHeader>
            <Button
              onClick={() => login()}
              className="w-full mt-4 py-2.5 bg-stone-700 hover:bg-stone-800 text-white font-medium flex items-center justify-center gap-2 rounded-md"
            >
              <FcGoogle className="h-5 w-5" />
              Sign In with Google
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}

export default Header;
