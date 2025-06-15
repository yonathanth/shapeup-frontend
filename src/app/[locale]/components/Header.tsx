"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full fixed top-4 left-0 z-50 sm:px-16 px-2">
      <div className="mx-auto max-w-7xl px-8  py-1 sm:py-2 bg-white/20  shadow-md backdrop-blur-xl text-white rounded-xl flex items-center justify-between">
        {/* Left: Logo */}
        <div className="hover:opacity-80 transition-opacity">
          <Link href="/">
            <Image
              src="/shapeup-logo 1.svg"
              alt="ShapeUp"
              width={40}
              height={40}
              className="w-10 h-10 sm:w-16 sm:h-16  object-contain"
              priority
            />
          </Link>
        </div>

        {/* Center: Navigation (hidden on small screens) */}
        <nav className="hidden md:flex gap-8 text-base font-medium">
          <Link
            href="/en"
            className={`hover:text-customBlue transition py-1 ${
              pathname === "/en" ? "text-customBlue" : ""
            }`}
          >
            Home
          </Link>
          <Link
            href="/en/about"
            className={`hover:text-customBlue transition py-1 ${
              pathname === "/en/about" ? "text-customBlue" : ""
            }`}
          >
            About
          </Link>
          <Link
            href="/en/services"
            className={`hover:text-customBlue transition py-1 ${
              pathname === "/en/services" ? "text-customBlue" : ""
            }`}
          >
            Packages
          </Link>
          <Link
            href="/en/faq"
            className={`hover:text-customBlue transition py-1 ${
              pathname === "/en/faq" ? "text-customBlue" : ""
            }`}
          >
            FAQ
          </Link>
          <Link
            href="/en/Contact"
            className={`hover:text-customBlue transition py-1 ${
              pathname === "/en/Contact" ? "text-customBlue" : ""
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Right: Buttons (hidden on small screens) */}
        <div className="hidden md:flex gap-4 items-center">
          <Link href="/en/Login">
            <button className="px-5 py-2 text-base rounded-lg hover:text-customBlue hover:bg-white/10 transition">
              Log In
            </button>
          </Link>
          <Link href="/en/Register">
            <button className="px-6 py-2 text-base bg-customBlue text-black rounded-lg hover:bg-white transition font-medium">
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
            className={`hover:text-customBlue text-center transition py-2 ${
              pathname === "/en" ? "text-customBlue" : "text-white"
            }`}
          >
            Home
          </Link>
          <Link
            href="/en/about"
            onClick={() => setIsMenuOpen(false)}
            className={`hover:text-customBlue text-center transition py-2 ${
              pathname === "/en/about" ? "text-customBlue" : "text-white"
            }`}
          >
            About
          </Link>
          <Link
            href="/en/services"
            onClick={() => setIsMenuOpen(false)}
            className={`hover:text-customBlue text-center transition py-2 ${
              pathname === "/en/services" ? "text-customBlue" : "text-white"
            }`}
          >
            Services
          </Link>
          <Link
            href="/en/faq"
            onClick={() => setIsMenuOpen(false)}
            className={`hover:text-customBlue text-center transition py-2 ${
              pathname === "/en/faq" ? "text-customBlue" : "text-white"
            }`}
          >
            FAQ
          </Link>
          <Link
            href="/en/Contact"
            onClick={() => setIsMenuOpen(false)}
            className={`hover:text-customBlue text-center transition py-2 ${
              pathname === "/en/Contact" ? "text-customBlue" : "text-white"
            }`}
          >
            Contact
          </Link>
          <div className="flex flex-col gap-3 mt-2">
            <Link
              href="/en/Login"
              onClick={() => setIsMenuOpen(false)}
              className="hover:text-customBlue text-white text-center transition py-3 border-t border-white/20 pt-4"
            >
              Log In
            </Link>
            <Link
              href="/en/Register"
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
