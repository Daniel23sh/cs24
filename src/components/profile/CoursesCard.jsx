import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from 'framer-motion';

const CoursesCard = ({ styles, tutorData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const slides = Array.from({ length: 6 }, (_, i) => i + 1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getTransformValue = () => {
    return currentSlide * (isMobile ? -85 : -33.333);
  };

  const nextSlide = () => {
    const maxSlides = isMobile ? slides.length : 4;
    setCurrentSlide((prev) => (prev + 1) % maxSlides);
  };

  const prevSlide = () => {
    const maxSlides = isMobile ? slides.length : 4;
    setCurrentSlide((prev) => (prev - 1 + maxSlides) % maxSlides);
  };

  const goToSlide = (index) => {
    const maxSlides = isMobile ? slides.length : 4;
    setCurrentSlide(Math.min(index, maxSlides - 1));
  };

  // Minimum swipe distance for triggering slide change (in pixels)
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  if (!tutorData.subjects?.length) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.005 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className={`bg-white -mb-12 md:max-w-[65rem] max-w-3xl mx-auto py-8 text-center`}
    >
      <div className="flex items-center gap-3 border-b pb-4 mb-6 justify-center">
        <h2 className={`text-2xl font-bold ${styles.textColor}`}>קורסים</h2>
      </div>

      <div className="relative w-full max-w-4xl mx-auto md:px-12" dir="ltr">
        {/* Carousel container */}
        <div className="overflow-hidden">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(${getTransformValue()}%)` }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {slides.map((number, index) => (
              <div
                key={index}
                className="w-[85%] md:w-1/3 flex-shrink-0 px-2"
              >
                <div className={`h-48 border border-gray-300 rounded-xl flex items-center justify-center text-4xl font-bold ${styles.cardBorder} bg-white`}>
                  {number}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons - hidden on mobile */}
        <button
          onClick={prevSlide}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full ${styles.buttonPrimary} items-center justify-center hidden md:flex`}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full ${styles.buttonPrimary} items-center justify-center hidden md:flex`}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots navigation */}
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: isMobile ? slides.length : 4 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full border transition-colors ${
                currentSlide === index
                ? `${styles.buttonPrimary} border-transparent` 
                : 'bg-transparent border-gray-400'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CoursesCard; 