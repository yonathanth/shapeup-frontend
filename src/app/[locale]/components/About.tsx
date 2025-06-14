"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaWeight,
  FaRulerVertical,
} from "react-icons/fa";
import {
  Dumbbell,
  Zap,
  Activity,
  Users,
  UserCheck,
  Trophy,
  Coffee,
  Waves,
  Target,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const FitnessComponent = () => {
  // Testimonial carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isJumping, setIsJumping] = useState(true);
  const nextSectionRef = useRef<HTMLDivElement>(null);

  // BMI Calculator State
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [suggestedServices, setSuggestedServices] = useState<string[]>([]);

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

  const testimonials = [
    {
      leftImg: "/Images/Manger.jpg",
      rightImg: "/Images/Manger.jpg",
      text: "This gym transformed my life. The trainers are knowledgeable and the community keeps me motivated. I've never felt stronger!",
      name: "Hannah K.",
      title: "Bodybuilding Champion",
    },
    {
      leftImg: "/Images/Manger.jpg",
      rightImg: "/Images/Manger.jpg",
      text: "The facilities are top-notch and the classes are challenging yet accessible. I look forward to every workout session!",
      name: "Michael T.",
      title: "Fitness Enthusiast",
    },
    {
      leftImg: "/Images/Manger.jpg",
      rightImg: "/Images/Manger.jpg",
      text: "The facilities are top-notch and the classes are challenging yet accessible. I look forward to every workout session!",
      name: "Michael T.",
      title: "Fitness Enthusiast",
    },
  ];

  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < testimonials.length - 1;

  const goPrev = () => canGoPrev && setCurrentIndex(currentIndex - 1);
  const goNext = () => canGoNext && setCurrentIndex(currentIndex + 1);

  // BMI Calculation Function
  const calculateBMI = () => {
    if (!height || !weight) return;

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || isNaN(weightNum)) return;

    const heightInMeters = heightNum / 100;
    const bmiValue = weightNum / (heightInMeters * heightInMeters);
    const bmiRounded = parseFloat(bmiValue.toFixed(1));
    setBmi(bmiRounded);

    let category = "";
    let services: string[] = [];

    if (bmiRounded < 18.5) {
      category = "Underweight";
      services = ["Body Building", "Strength Training", "Nutrition Planning"];
    } else if (bmiRounded >= 18.5 && bmiRounded < 25) {
      category = "Normal Weight";
      services = ["Aerobics", "Futsal", "Yoga", "Maintenance Programs"];
    } else if (bmiRounded >= 25 && bmiRounded < 30) {
      category = "Overweight";
      services = ["Cardio Training", "HIIT Classes", "Weight Management"];
    } else {
      category = "Obese";
      services = [
        "Personal Training",
        "Medical Fitness",
        "Nutrition Counseling",
      ];
    }

    setBmiCategory(category);
    setSuggestedServices(services);
  };

  // Reset BMI Calculator
  const resetCalculator = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setBmiCategory("");
    setSuggestedServices([]);
  };

  return (
    <div className="bg-black text-white">
      {/* About Section */}
      <div ref={nextSectionRef} className="bg-gray-950">
        <div className="text-white flex flex-col md:flex-row items-center px-6 justify-center gap-8 md:gap-16 py-16 md:py-24 mx-auto max-w-7xl">
          <motion.div
            className="w-full md:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-[550px] overflow-hidden rounded-lg border border-gray-800 hover:border-customBlue/30 transition-all">
              <Image
                src="/photo.png"
                alt="Professional trainers at our gym"
                width={600}
                height={500}
                className="object-cover w-full h-auto md:h-[450px] transition-transform duration-500 hover:scale-[1.02]"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 px-0 md:px-4 py-8 text-center md:text-left"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Welcome To Our <br />
              <span className="text-customBlue">Fitness Gym</span>
            </h2>
            <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed">
              At ShapeUp, we're dedicated to helping you achieve your fitness
              goals with state-of-the-art facilities, expert trainers, and a
              supportive community. Our personalized approach ensures every
              member gets the attention they need to transform their health and
              wellness.
            </p>
            <div className="flex justify-center md:justify-start">
              <Link href="/en/Register">
                <button className="bg-customBlue hover:bg-customHoverBlue text-black font-medium px-8 py-3 rounded-lg transition-all duration-300 hover:scale-[1.02] shadow hover:shadow-customBlue/20">
                  Join Us Now
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Services Section */}
      <section className="px-6 lg:px-40 py-10 lg:py-20 bg-gray-900">
        <motion.h2
          className="text-3xl lg:text-4xl font-bold mb-12 lg:mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          Explore Our <span className="text-customBlue">Offerings</span>
        </motion.h2>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard
            title="Strength Training"
            description="Build muscle and increase power with our comprehensive strength training programs."
            icon={Dumbbell}
          />

          <ServiceCard
            title="Kickbox Training"
            description="High-intensity kickboxing classes that combine cardio and self-defense techniques."
            icon={Zap}
          />

          <ServiceCard
            title="CrossFit Training"
            description="Functional fitness workouts that challenge your entire body and build endurance."
            icon={Activity}
          />

          <ServiceCard
            title="Muay Thai Training"
            description="Learn the art of eight limbs with our authentic Muay Thai training programs."
            icon={Target}
          />

          <ServiceCard
            title="Group Exercise"
            description="Join energizing group classes designed to motivate and challenge you."
            icon={Users}
          />

          <ServiceCard
            title="Women's Only"
            description="Dedicated training space and programs designed specifically for women."
            icon={UserCheck}
          />

          <ServiceCard
            title="Sports Courts"
            description="Professional futsal and basketball courts for competitive play and training."
            icon={Trophy}
          />

          <ServiceCard
            title="Juice Bar"
            description="Fresh, healthy smoothies and juices to fuel your workouts and recovery."
            icon={Coffee}
          />

          <ServiceCard
            title="Recovery Center"
            description="Steam bath, ice bath, and massage services for optimal recovery and relaxation."
            icon={Waves}
          />
        </div>
      </section>

      {/* Testimonials Carousel - Responsive Version */}
      <div className="px-4 py-12 lg:py-20 bg-gray-950">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <h2 className="lg:hidden text-2xl md:text-3xl font-bold text-center mb-2">
            What Our Members Say
          </h2>
          <h2 className="lg:hidden text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
            About Us
          </h2>

          <div className="relative">
            {/* Mobile Layout (stacked) */}
            <div className="lg:hidden">
              <div className="flex flex-col items-center">
                {/* Combined image for mobile */}
                <div className="relative w-full max-w-xs h-64 mb-6">
                  <div className="absolute inset-0 rounded-lg overflow-hidden">
                    <Image
                      src={testimonials[currentIndex].leftImg}
                      alt="Member"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Testimonial content */}
                <div className="text-center px-4">
                  <h3 className="text-xl font-bold text-customBlue mb-2">
                    {testimonials[currentIndex].name}
                  </h3>
                  <p className="text-gray-300 italic mb-3">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <p className="text-gray-400 text-sm">
                    {testimonials[currentIndex].title}
                  </p>
                </div>
              </div>

              {/* Mobile arrows */}
              <div className="flex justify-center mt-8 gap-4">
                <button
                  onClick={goPrev}
                  disabled={!canGoPrev}
                  className={`p-3 text-black text-lg rounded-full transition ${
                    canGoPrev ? "bg-customBlue" : "bg-gray-600"
                  }`}
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <button
                  onClick={goNext}
                  disabled={!canGoNext}
                  className={`p-3 text-black text-lg rounded-full transition ${
                    canGoNext ? "bg-customBlue" : "bg-gray-600"
                  }`}
                >
                  <FaArrowRight className="text-xl" />
                </button>
              </div>
            </div>

            {/* Desktop Layout (side-by-side) */}
            <div className="hidden lg:flex p-8 lg:p-20 bg-gray-950">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="max-w-6xl mx-auto"
              >
                <h2 className="text-3xl font-bold text-center mb-4">
                  What Our Members Say
                </h2>
                <h2 className="text-3xl font-bold mb-12 text-center">
                  About Us
                </h2>

                <div className="flex items-center justify-center gap-4">
                  {canGoPrev && (
                    <motion.button
                      onClick={goPrev}
                      className="p-3 mr-4 lg:mr-16 text-black text-lg bg-customBlue rounded-full transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowLeft className="text-2xl font-extralight" />
                    </motion.button>
                  )}

                  <div className="flex items-center">
                    <motion.div
                      className="relative mb-20 w-40 h-56 z-0"
                      key={`left-${currentIndex}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={testimonials[currentIndex].leftImg}
                        alt="Member photo"
                        fill
                        className="object-cover rounded-l-lg"
                      />
                    </motion.div>

                    <motion.div
                      className="relative w-40 h-56 z-10 -ml-8 mr-20"
                      key={`right-${currentIndex}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Image
                        src={testimonials[currentIndex].rightImg}
                        alt="Member in action"
                        fill
                        className="object-cover rounded-r-lg border-l-2 border-white"
                      />
                    </motion.div>

                    <motion.div
                      className="ml-8 w-52 lg:w-64"
                      key={`text-${currentIndex}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <h2 className="text-2xl lg:text-3xl font-bold pb-4 text-customBlue">
                        {testimonials[currentIndex].name}
                      </h2>
                      <p className="text-gray-300 italic mb-4">
                        "{testimonials[currentIndex].text}"
                      </p>
                      <p className="text-gray-400 text-sm">
                        {testimonials[currentIndex].title}
                      </p>
                    </motion.div>
                  </div>

                  {canGoNext && (
                    <motion.button
                      onClick={goNext}
                      className="p-3 ml-4 lg:ml-16 text-black text-lg bg-customBlue rounded-full transition"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <FaArrowRight className="text-2xl font-extralight" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Dots indicator for mobile */}
          <div className="lg:hidden flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition ${
                  currentIndex === index ? "bg-customBlue" : "bg-gray-600"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* BMI Calculator Section */}
      <section className="px-6 py-16 lg:py-24 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Personalized Fitness Assessment
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Discover your BMI and get personalized service recommendations
            tailored to your body composition
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="bg-gray-800 rounded-2xl p-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-6 text-customBlue">
                BMI Calculator
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FaRulerVertical className="mr-2" />
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
                    placeholder="Enter your height"
                  />
                </div>

                <div>
                  <label className="flex items-center text-gray-300 mb-2">
                    <FaWeight className="mr-2" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-customBlue"
                    placeholder="Enter your weight"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={calculateBMI}
                    className="bg-customBlue hover:bg-customHoverBlue text-black font-medium px-6 py-3 rounded-lg flex-1 transition-all"
                  >
                    Calculate
                  </button>
                  <button
                    onClick={resetCalculator}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 rounded-lg flex-1 transition-all"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-gray-800 rounded-2xl p-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {bmi ? (
                <>
                  <h3 className="text-2xl font-bold mb-6 text-customBlue">
                    Your Results
                  </h3>

                  <div className="flex items-center mb-8">
                    <div className="text-5xl font-bold mr-6">{bmi}</div>
                    <div>
                      <div className="font-semibold text-lg">{bmiCategory}</div>
                      <div className="text-gray-400 text-sm">
                        Body Mass Index
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-3">
                      Recommended For You:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {suggestedServices.map((service, index) => (
                        <div
                          key={index}
                          className="bg-gray-700 rounded-lg px-4 py-3 flex items-center"
                        >
                          <div className="w-2 h-2 bg-customBlue rounded-full mr-3"></div>
                          {service}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link href="/en/services">
                    <button className="bg-customBlue hover:bg-customHoverBlue text-black font-medium w-full py-3 rounded-lg transition-all">
                      Explore Our Services{" "}
                    </button>
                  </Link>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl text-customBlue mb-4">?</div>
                  <h3 className="text-xl font-bold mb-2">Calculate Your BMI</h3>
                  <p className="text-gray-400">
                    Enter your height and weight to get personalized fitness
                    recommendations
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="px-6 py-16 lg:py-24 bg-gray-950" ref={nextSectionRef}>
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl lg:text-4xl font-bold mb-4 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Get In Touch
          </motion.h2>
          <motion.p
            className="text-gray-400 text-center mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We're here to answer any questions and help you start your fitness
            journey
          </motion.p>

          <div className="grid  grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                <div className="bg-customBlue text-black p-3 rounded-full mb-4 sm:mb-0 sm:mr-4">
                  <MapPin className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Our Location</h3>
                  <p className="text-gray-400">
                    Sarbet
                    <br />
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                <div className="bg-customBlue text-black p-3 rounded-full mb-4 sm:mb-0 sm:mr-4">
                  <Phone className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Phone</h3>
                  <p className="text-gray-400">
                    Main: 0944221314
                    <br />
                    Support: 0941668383
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
                <div className="bg-customBlue text-black p-3 rounded-full mb-4 sm:mb-0 sm:mr-4">
                  <Mail className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-gray-400">shapeup162@gmail.com</p>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="text-xl font-bold mb-4">Operating Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-gray-400">Monday - Friday</div>
                    <div className="font-medium">5:00 AM - 11:00 PM</div>
                  </div>
                  <div>
                    <div className="text-gray-400">Saturday - Sunday</div>
                    <div className="font-medium">7:00 AM - 9:00 PM</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="rounded-xl overflow-hidden h-[400px] border border-gray-700"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d116734.48539100694!2d38.658202651863945!3d9.000052085683395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8569a11086b7%3A0xea63b40c40e6be97!2sShape%20Up%20Gym%20%26%20Fitness!5e0!3m2!1sen!2set!4v1749879020552!5m2!1sen!2set"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[50%] hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Reusable Service Card Component
interface ServiceCardProps {
  title: string;
  icon: React.ComponentType<any>;
  description: string;
}

const ServiceCard = ({ title, icon: Icon, description }: ServiceCardProps) => {
  return (
    <Link href="/en/services" className="h-full">
      <motion.div
        className="group bg-gray-800 hover:bg-gray-750 p-6 rounded-xl transition-all duration-300 border border-gray-700 hover:border-customBlue/30 text-center cursor-pointer h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
      >
        <div className="text-4xl text-customBlue mb-4 group-hover:scale-110 group-hover:text-white transition-all duration-300 flex justify-center">
          <Icon />
        </div>
        <h3 className="text-lg font-bold mb-3 text-white group-hover:text-customBlue transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed flex-grow">
          {description}
        </p>
      </motion.div>
    </Link>
  );
};

export default FitnessComponent;
