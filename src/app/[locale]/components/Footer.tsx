"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
  faYoutube,
  faTiktok,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import React, { useState } from "react";
import Image from "next/image";
import logo from "@/assets/logos/yello logo-1.png";
import { useTranslations } from "next-intl";
import { Link } from "../../../i18n/routing";
import TermsAndConditionsModal from "./TermsAndConditionsModal";

const Footer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const t = useTranslations("home_Page.footerSection");

  return (
    <footer className="bg-customBlue text-black py-10 font-jost">
      <div className="container mx-auto items-center px-4 sm:px-6 md:px-10 max-w-screen-2xl">
        <div className="flex flex-col md:flex-row md:justify-between ">
          <div className="mb-8 md:mb-0 w-40">
            <Image
              src={logo}
              alt="logo"
              className="sm:w-24 w-14 h-14 sm:h-24"
            ></Image>
          </div>
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:flex md:flex-wrap md:justify-between md:gap-16 text-xs md:text-sm lg:text-sm w-full md:w-auto">
            <div>
              <h2 className="font-bold">{t("support.title")}</h2>
              <ul className="mt-6 space-y-2">
                <li className="cursor-pointer">
                  <Link href="/#contact" className="hover:underline">
                    Address
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/#contact" className="hover:underline">
                    Phone
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/#contact" className="hover:underline">
                    Email
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/#contact" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold">{t("company.title")}</h2>
              <ul className="mt-6 space-y-2">
                <li className="cursor-pointer">
                  <Link href="/about" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/about#philosophy" className="hover:underline">
                    Our Philosophy
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/about#facilities" className="hover:underline">
                    Our Facilities
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/about#team" className="hover:underline">
                    Our Team
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="font-bold">{t("explore.title")}</h2>
              <ul className="mt-6 space-y-2">
                <li className="cursor-pointer">
                  <Link href="/services" className="hover:underline">
                    Membership Plans
                  </Link>
                </li>
                <li className="cursor-pointer">
                  <Link href="/Register" className="hover:underline">
                    Register Now
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="border-t border-black my-6 mt-20" />
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            {/* <div className="text-sm mb-4 md:mb-0">
              <button onClick={openModal} className="mr-6 hover:underline">
                {t("support.links.5")}
              </button>
            </div> */}

            {/* Modal component */}
            {/* <TermsAndConditionsModal
              isOpen={isModalOpen}
              onClose={closeModal}
            /> */}
          </div>
          <div className="text-sm  font-light flex items-center justify-center space-x-2 p-4 bg-gradient-to-r order-last md:order-none">
            <span>Made by</span>
            <Link
              className="animate-pulse"
              href="https://shalops.com"
              target="_blank"
            >
              <span className="bg-[#382859] text-white px-2 py-1 font-semibold rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105">
                ShalOps Digitals
              </span>
            </Link>
          </div>

          <div className="flex space-x-4">
            <a
              href="https://www.instagram.com/shapeup_gymandfitness/"
              aria-label="Instagram"
              target="_blank"
              className="transition-transform duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>

            <a
              href="https://www.facebook.com/profile.php?id=61562896362190"
              aria-label="Facebook"
              target="_blank"
              className="transition-transform duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a
              href="https://www.tiktok.com/@.shape_up?is_from_webapp=1&sender_device=pc"
              aria-label="TikTok"
              target="_blank"
              className="transition-transform duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faTiktok} size="lg" />
            </a>
            {/* <a
              href="https://t.me/musclefitness"
              aria-label="Telegram"
              target="_blank"
              className="transition-transform duration-200 hover:scale-110"
            >
              <FontAwesomeIcon icon={faTelegram} size="lg" />
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
