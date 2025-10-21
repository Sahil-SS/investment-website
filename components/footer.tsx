"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6 md:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Column 1: Company Description */}
        <div>
          <h2 className="text-xl font-bold mb-4">InvestWise</h2>
          <p className="text-gray-400 text-sm">
            InvestWise is your ultimate investment companion, providing insights,
            analytics, and tools to make smarter financial decisions.
          </p>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            {["Home", "About Us", "Opportunity", "Ecosystem", "Contact Us"].map(
              (item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    className="hover:text-blue-500 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Column 3: Contact Details */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-400 text-sm">Email: info@investwise.com</p>
          <p className="text-gray-400 text-sm mt-2">Phone: +91 9876543210</p>
          <p className="text-gray-400 text-sm mt-2">Address: 123 Finance Street, Mumbai, India</p>
        </div>

        {/* Column 4: Contact Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Send a Message</h3>
          <form className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              className="bg-gray-900 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="bg-gray-900 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Message"
              className="bg-gray-900 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            ></textarea>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-4 py-2 rounded-md"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} InvestWise. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
