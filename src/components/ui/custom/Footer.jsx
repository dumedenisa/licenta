import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#3b2f2f] text-white pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 sm:grid-cols-2 gap-8 text-sm">
        {/* Branding */}
        <div>
          <h3 className="text-xl font-bold font-serif mb-4">Golden Getaways</h3>
          <p className="text-[#e6ddd3] leading-relaxed">
            Premium AI-powered travel planning. Unique experiences, handpicked stays, and expert guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4 text-[#d1bfa4]">Quick Links</h4>
          <ul className="space-y-2 text-[#e6ddd3]">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/create-trip" className="hover:underline">Create Trip</Link></li>
            <li><Link to="/my-trips" className="hover:underline">Your Trips</Link></li>
            <li><a href="#contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4 text-[#d1bfa4]">Contact</h4>
          <ul className="space-y-2 text-[#e6ddd3]">
            <li>Email: hello@goldengetaways.com</li>
            <li>Phone: +09 098 765 432</li>
            <li>Address: 350 5th Ave, New York, NY 10118</li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h4 className="font-semibold mb-4 text-[#d1bfa4]">Follow Us</h4>
          <ul className="space-y-2 text-[#e6ddd3]">
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Facebook</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-xs border-t border-[#5c4747] pt-4 text-[#d1bfa4]">
        &copy; {new Date().getFullYear()} Golden Getaways. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

