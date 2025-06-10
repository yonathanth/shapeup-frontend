"use client";

import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full fixed top-4 left-0 z-50 px-4">
      <div className="mx-auto max-w-7xl px-6 py-3 sm:py-4 bg-[#d9d9d930] shadow-md backdrop-blur-md text-white rounded-xl flex items-center justify-between">
        {/* Left: Logo */}
        <div className="text-xl md:text-2xl font-bold hover:text-customBlue transition">
          <Link href="/">ShapeUp</Link>
        </div>

        {/* Center: Navigation (hidden on small screens) */}
        <nav className="hidden md:flex gap-8 text-base font-medium">
          <Link href="/en" className="hover:text-customBlue transition py-1">
            Home
          </Link>
          <Link
            href="/en/about"
            className="hover:text-customBlue transition py-1"
          >
            About
          </Link>
          <Link
            href="/en/service"
            className="hover:text-customBlue transition py-1"
          >
            Services
          </Link>
          <Link
            href="/en/faq"
            className="hover:text-customBlue transition py-1"
          >
            FAQ
          </Link>
          <Link
            href="/en/contact"
            className="hover:text-customBlue transition py-1"
          >
            Contact
          </Link>
        </nav>

        {/* Right: Buttons (hidden on small screens) */}
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/en/login">
            <button className="px-5 py-2 text-base rounded-lg hover:text-customBlue hover:bg-white/10 transition">
              Log In
            </button>
          </Link>
          <Link href="/en/signup">
            <button className="px-6 py-2 text-base bg-white text-black rounded-lg hover:bg-customBlue transition font-medium">
              Register
            </button>
          </Link>
        </div>

        {/* Burger Menu Icon (visible on small screens) */}
        <button
          className="md:hidden text-2xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-2 px-6 py-6 bg-[#d9d9d950] shadow-lg backdrop-blur-md text-white rounded-xl flex flex-col gap-5 text-lg font-medium z-50">
          <Link
            href="/en"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-customBlue text-white text-center transition py-2"
          >
            Home
          </Link>
          <Link
            href="/en/about"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-customBlue text-white text-center transition py-2"
          >
            About
          </Link>
          <Link
            href="/en/service"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-customBlue text-white text-center transition py-2"
          >
            Services
          </Link>
          <Link
            href="/en/faq"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-customBlue text-center text-white transition py-2"
          >
            FAQ
          </Link>
          <Link
            href="/en/contact"
            onClick={() => setIsMenuOpen(false)}
            className="hover:text-customBlue text-white text-center transition py-2"
          >
            Contact
          </Link>
          <div className="flex flex-col gap-3 mt-2">
            <Link
              href="/en/login"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-customBlue text-white text-center transition py-3 border-t border-white/20 pt-4"
            >
              Log In
            </Link>
            <Link
              href="/en/signup"
              onClick={() => setIsMenuOpen(false)}
              className="text-black bg-white text-center rounded-lg px-4 py-3 hover:bg-customBlue transition font-medium text-lg"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
