"use client";
import React, { useState } from "react";
import styles from "../styles/ButtonStyles.module.css";
import Image from "next/image";
import logo from "@/assets/logos/logo (3).svg";
import { Link } from "../../../i18n/routing";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations } from "next-intl";

const Header: React.FC = () => {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="bg-transparent p-2 md:p-0 text-white flex items-center justify-between px-8 md:px-20 mx-auto absolute top-0 left-0 right-0 z-10 font-jost">
      <div className="sm:w-24 w-14 h-14 sm:h-24 flex items-center justify-center">
        <Link href="/">
          <Image src={logo} alt="logo" className="sm:w-20 w-14 h-14 sm:h-20" />
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="relative flex lg:hidden z-20">
        <button
          onClick={toggleMenu}
          className="focus:outline-none flex items-center justify-center w-10 h-10"
        >
          {menuOpen ? (
            // X icon when menu is open
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger icon when menu is closed
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav
        className={`lg:flex ${
          menuOpen ? "block" : "hidden"
        } absolute md:static bg-[#000000ce] md:bg-transparent w-full md:w-auto top-0 right-0 md:right-auto z-10`}
      >
        <ul className="pt-20 flex flex-col items-center md:flex-row text-base space-y-4 md:space-y-0 md:space-x-10 lg:space-x-14 p-6 md:p-0 ml-auto md:ml-0">
          <li className="cursor-pointer relative group">
            <Link href="/">{t("home_Page.nav.links.0")}</Link>
            <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 h-[2px] w-0 bg-[#871818] transition-all duration-300 group-hover:w-8"></span>
          </li>
          <li className="cursor-pointer relative group">
            <Link href="/about">{t("home_Page.nav.links.1")}</Link>
            <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 h-[2px] w-0 bg-[#871818] transition-all duration-300 group-hover:w-8"></span>
          </li>
          <li className="cursor-pointer relative group">
            <Link href="/services">{t("home_Page.nav.links.2")}</Link>
            <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 h-[2px] w-0 bg-[#871818] transition-all duration-300 group-hover:w-8"></span>
          </li>
          {/* <li className="cursor-pointer relative group">
            <Link href="/Shop">{t("home_Page.nav.links.3")}</Link>
            <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 h-[2px] w-0 bg-[#871818] transition-all duration-300 group-hover:w-8"></span>
          </li> */}
          <li className="cursor-pointer relative group">
            <Link href="/Contact">{t("home_Page.nav.links.4")}</Link>
            <span className="absolute left-1/2 bottom-0 transform -translate-x-1/2 h-[2px] w-0 bg-[#871818] transition-all duration-300 group-hover:w-8"></span>
          </li>
          <li className="lg:hidden cursor-pointer relative group">
            {/* <LanguageSwitcher /> */}
          </li>
          {/* Sign-up Button in Mobile Menu */}
          <li className="mt-4 md:hidden">
            <Link href="/Register">
              <button className={`${styles.customButton} w-full`}>
                {t("home_Page.nav.links.5")}
              </button>
            </Link>
            <Link href="/Login">
              <button className="bg-black text-customBlue w-full py-2 rounded-br-[1rem] hover:translate-y-1">
                {t("home_Page.nav.links.6")}
              </button>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sign-up and Login Buttons for Desktop */}
      <div className="hidden lg:flex">
        {/* <LanguageSwitcher /> */}
        <Link href="/Register">
          {" "}
          <button className={`${styles.customButton} `}>
            {t("home_Page.nav.links.5")}
          </button>
        </Link>
        <Link href="/Login">
          <button className="bg-black py-[0.38rem] px-[1.8rem] rounded-br-[1rem] font-bold text-customBlue hover:shadow-[rgba(0, 0, 0, .3) 2px 8px 8px -5px] hover:translate-y-1">
            {t("home_Page.nav.links.6")}
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
