import React, { useState } from "react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { AiFillLike } from "react-icons/ai";
import { FaHotel } from "react-icons/fa6";
import { PiHandshakeThin } from "react-icons/pi";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { db } from "@/service/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function Hero() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "contacts"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  const testimonials = [
    {
      text: "This AI trip planner made our honeymoon a dream. Every detail was perfect and we didn’t lift a finger.",
      name: "JOHN SMITH",
    },
    {
      text: "Incredible experience. Loved the luxury recommendations tailored to our preferences!",
      name: "SARAH WILL",
    },
    {
      text: "Best vacation planning tool ever. Saved us so much time and stress.",
      name: "GEORGE HILL",
    },
  ];

  return (
    <div className="w-full text-[#3b2f2f] font-sans bg-[#fdf6ed]">
      {/* HERO SECTION */}
      <section className="relative h-[60vh] bg-[#fdf6ed] flex items-center justify-center text-center rounded-b-xl overflow-hidden w-full shadow-lg">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/rome.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-[#fdf6ed]/70 backdrop-blur-sm"></div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Explore Dream Destinations
          </h1>
          <p className="text-lg mb-6 text-[#6e5c4f]">
            Tailored luxury travel experiences curated by AI and guided by your
            preferences.
          </p>
          <Link to="/create-trip">
            <Button className="bg-[#bfa88f] text-white hover:bg-[#3b2f2f] px-8 py-3 text-lg rounded-md shadow-md mt-4">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-20 px-6 bg-[#fdf6ed]">
        <h2 className="text-3xl font-bold text-center mb-10 font-serif">
          Popular Tour Places
        </h2>

        {/* scroll container with extra top padding */}
        <div className="overflow-x-auto pt-6 pb-4 hide-scrollbar">
          <div className="flex gap-6 px-4 max-w-7xl mx-auto overflow-visible relative">
            {[
              { img: "/italy-village.jpg", name: "Positano, Italy" },
              { img: "/paris.jpg", name: "Paris, France" },
              { img: "/santorini.jpg", name: "Santorini, Greece" },
              { img: "/venice.jpg", name: "Venice, Italy" },
              { img: "/rome.jpg", name: "Rome, Italy" },
              { img: "/newyork.jpg", name: "New York, USA" },
              { img: "/bali.jpg", name: "Bali, Indonesia" },
              { img: "/dubai.jpg", name: "Dubai, UAE" },
              { img: "/tokyo.jpg", name: "Tokyo, Japan" },
            ].map((place, index) => (
              <div
                key={index}
                className="min-w-[250px] bg-white rounded-xl shadow-xl transform transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={place.img}
                  alt={place.name}
                  className="h-[200px] w-full object-cover rounded-t-xl"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{place.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#3b2f2f] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-[#4e403f] rounded-xl p-6 shadow-md hover:scale-105 transition">
              <AiFillLike className="text-4xl text-[#d1bfa4] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Highly Qualified Service
              </h3>
              <p className="text-center text-sm text-[#e6ddd3]">
                Our team ensures seamless planning with expert guidance tailored
                to your travel goals.
              </p>
            </div>
            <div className="flex flex-col items-center bg-[#4e403f] rounded-xl p-6 shadow-md hover:scale-105 transition">
              <FaHotel className="text-4xl text-[#d1bfa4] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Handpicked Hotels</h3>
              <p className="text-center text-sm text-[#e6ddd3]">
                Only the finest boutique and luxury hotels, personally reviewed
                for comfort and experience.
              </p>
            </div>
            <div className="flex flex-col items-center bg-[#4e403f] rounded-xl p-6 shadow-md hover:scale-105 transition">
              <PiHandshakeThin className="text-4xl text-[#d1bfa4] mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Best Price Guarantee
              </h3>
              <p className="text-center text-sm text-[#e6ddd3]">
                Exceptional experiences without compromise. We guarantee the
                best rates for premium travel.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT CLIENTS SAY */}
      <section className="bg-[#fdfaf6] text-[#3b2f2f] py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">What Clients Say</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((client, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.2 }}
                className="flex flex-col items-center text-center bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <span className="text-5xl text-gray-300 mb-4 leading-none">
                  “
                </span>
                <p className="text-sm text-[#5e524d]">{client.text}</p>
                <span className="mt-4 text-[#d4a95f] font-semibold text-sm">
                  {client.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT US SECTION */}
      <section className="bg-[#f9f7f3] py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div>
            <h2 className="text-3xl font-bold font-serif mb-6">Contact Us</h2>
            <p className="mb-4 text-[#3b2f2f]">hello@goldengetaways.com</p>
            <p className="mb-4 text-[#3b2f2f]">+09 098 765 432</p>
            <p className="text-[#3b2f2f]">
              350 5th Ave, New York, <br />
              NY 10118, USA
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="name"
                className="border-b border-gray-400 focus:outline-none py-2 bg-transparent"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="email"
                placeholder="e-mail"
                className="border-b border-gray-400 focus:outline-none py-2 bg-transparent"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <input
              type="text"
              placeholder="your message"
              className="border-b border-gray-400 focus:outline-none py-2 w-full bg-transparent"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="text-[#3b2f2f] font-semibold tracking-wide hover:underline"
              >
                SEND →
              </button>
            </div>
          </form>
        </div>

        <div className="mt-16">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.886555700759!2d-73.98949498460133!3d40.74844017932783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18dd6d7b%3A0xdea79a6b6c040c89!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1675881769123!5m2!1sen!2sus"
            width="100%"
            height="300"
            className="w-full rounded shadow"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#3b2f2f] text-white pt-12 pb-6 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8 text-sm">
          <div>
            <h3 className="text-xl font-bold mb-4">Golden Getaways</h3>
            <p>
              Premium AI-powered travel planning. Unique experiences, handpicked
              stays, and expert guidance.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-trip" className="hover:underline">
                  Create Trip
                </Link>
              </li>
              <li>
                <Link to="/my-trips" className="hover:underline">
                  Your Trips
                </Link>
              </li>
              <li>
                <a href="#contact" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              <li>Email: hello@goldengetaways.com</li>
              <li>Phone: +09 098 765 432</li>
              <li>Address: 350 5th Ave, New York, NY 10118</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 text-center text-xs border-t border-[#5c4747] pt-4 text-[#d1bfa4]">
          &copy; {new Date().getFullYear()} Golden Getaways. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}

export default Hero;
