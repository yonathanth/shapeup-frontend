"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import heroImage from "../../../../assets/images/about.jpeg";

const ContactPage = () => {
  const [isJumping, setIsJumping] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const nextSectionRef = useRef<HTMLDivElement | null>(null);

  const scrollToNextSection = () => {
    if (nextSectionRef.current) {
      nextSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isJumping) {
      timeoutId = setTimeout(() => {
        setIsJumping(false);
      }, 1200);
    } else {
      timeoutId = setTimeout(() => {
        setIsJumping(true);
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
  }, [isJumping]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      alert("Thank you for your message! We will get back to you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: FaPhone,
      title: "Phone",
      details: ["+251 911 123 456", "+251 922 654 321"],
      color: "text-customBlue",
    },
    {
      icon: FaEnvelope,
      title: "Email",
      details: ["info@shapeupgym.com", "support@shapeupgym.com"],
      color: "text-customBlue",
    },
    {
      icon: FaMapMarkerAlt,
      title: "Address",
      details: ["Bole Road, Addis Ababa", "Near Bole Airport"],
      color: "text-customBlue",
    },
    {
      icon: FaClock,
      title: "Hours",
      details: [
        "Mon - Fri: 6:00 AM - 10:00 PM",
        "Sat - Sun: 7:00 AM - 9:00 PM",
      ],
      color: "text-customBlue",
    },
  ];

  return (
    <>
      <Header />
      <div className="bg-black text-white scroll-container relative">
        {/* Hero Section */}
        <div
          className="relative w-full h-screen bg-fixed bg-center bg-cover"
          style={{
            backgroundImage: `url(${heroImage.src})`,
            backgroundAttachment: "fixed",
          }}
        >
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white text-center mb-8"
            >
              Contact Us
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-base md:text-xl text-white/90 max-w-xs md:max-w-2xl text-center mb-12"
            >
              Get in touch with us for any questions about memberships, classes,
              or facilities
            </motion.p>
            <motion.div
              onClick={scrollToNextSection}
              className="border-2 border-white/50 rounded-full p-3 cursor-pointer hover:border-customBlue transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              animate={isJumping ? { y: [0, -15, 0] } : {}}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: isJumping ? Infinity : 0,
              }}
            >
              <FontAwesomeIcon
                icon={faArrowUp}
                className="text-white text-xl rotate-180 hover:text-customBlue transition-colors"
              />
            </motion.div>
          </div>
        </div>

        {/* Main Content Section */}
        <div ref={nextSectionRef} className="relative z-10 bg-black">
          {/* Contact Information Section */}
          <section className="py-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <motion.div
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Get in <span className="text-customBlue">Touch</span>
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Ready to start your fitness journey? Contact us today and
                  let's help you achieve your goals.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-900 p-6 rounded-xl text-center hover:bg-gray-800 transition-all duration-300"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 ${info.color} mb-4`}
                    >
                      <info.icon className="text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                    {info.details.map((detail, detailIndex) => (
                      <p
                        key={detailIndex}
                        className="text-gray-400 text-sm mb-1"
                      >
                        {detail}
                      </p>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form and Map Section */}
          <section className="pb-20 px-4 md:px-8 lg:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div
                  className="bg-gray-900 p-8 rounded-xl"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-customBlue focus:border-transparent outline-none transition-all"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-customBlue focus:border-transparent outline-none transition-all"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-customBlue focus:border-transparent outline-none transition-all"
                          placeholder="+251 911 123 456"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium mb-2"
                        >
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-customBlue focus:border-transparent outline-none transition-all"
                          placeholder="What's this about?"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-2"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-customBlue focus:border-transparent outline-none transition-all resize-vertical"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-customBlue hover:bg-customHoverBlue text-black py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </motion.div>

                {/* Map and Social Media */}
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  {/* Map Placeholder */}
                  <div className="bg-gray-900 rounded-xl overflow-hidden">
                    <div className="h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <FaMapMarkerAlt className="text-4xl text-customBlue mb-4 mx-auto" />
                        <p className="text-gray-400">Interactive Map</p>
                        <p className="text-sm text-gray-500">
                          Bole Road, Addis Ababa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="bg-gray-900 p-6 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                    <p className="text-gray-400 mb-6">
                      Stay connected and get the latest updates
                    </p>
                    <div className="flex space-x-4">
                      <a
                        href="https://www.facebook.com/profile.php?id=61562896362190"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-customBlue hover:text-black p-3 rounded-lg transition-all duration-300"
                      >
                        <FaFacebook className="text-xl" />
                      </a>
                      <a
                        href="https://www.instagram.com/shapeup_gymandfitness/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-customBlue hover:text-black p-3 rounded-lg transition-all duration-300"
                      >
                        <FaInstagram className="text-xl" />
                      </a>
                      <a
                        href="https://www.tiktok.com/@.shape_up?is_from_webapp=1&sender_device=pc"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gray-800 hover:bg-customBlue hover:text-black p-3 rounded-lg transition-all duration-300"
                      >
                        <FaTiktok className="text-xl" />
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactPage;
