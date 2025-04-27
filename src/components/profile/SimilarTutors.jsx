import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { Link } from "react-router-dom"
import image from "../../config/user-profile.png"
const TutorComponent = ({ tutors, styles }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleCount, setVisibleCount] = useState(3)
  const carouselRef = useRef(null)

  const isTouchDevice = typeof window !== 'undefined' &&
    (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)

  useEffect(() => {
    const update = () => {
      const useSingle = window.innerWidth < 768 || isTouchDevice
      setVisibleCount(useSingle ? 1 : 3)
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [isTouchDevice])

  const isMobile = visibleCount === 1

  const prevSlide = () => {
    if (isMobile) scrollByCard(-1)
    else if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }
  const nextSlide = () => {
    if (isMobile) scrollByCard(1)
    else if (currentIndex + visibleCount < tutors.length)
      setCurrentIndex((i) => i + 1)
  }

  const scrollByCard = (dir) => {
    const c = carouselRef.current
    if (!c) return
    const card = c.querySelector(".tutor-card")
    if (!card) return
    const gap = 24 // matches gap-6
    c.scrollBy({ left: dir * (card.offsetWidth + gap), behavior: "smooth" })
  }

  const display = isMobile
    ? tutors
    : tutors.slice(currentIndex, currentIndex + visibleCount)

  return (
    <section
    
      className="relative md:max-w-[65rem] max-w-3xl mx-auto py-8 overflow-hidden"
      dir="rtl"
    >
      {tutors.length > 0 && (      
<div className="relative mx-auto -mt-8 ">
      <div className="flex items-center gap-3 border-b pb-6 mb-6 ">
        <Users className={`h-6 w-6 ${styles.iconColor}`} />
        <h2 className={`text-2xl font-bold ${styles.textColor}`}>מורים מומלצים</h2>
      </div>

      {/* Navigation Buttons - positioned outside the cards */}
      {/* Left arrow */}
      <button
        onClick={prevSlide}
        disabled={!isMobile && currentIndex === 0}
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 mt-8
          ${isMobile ? "left-2 p-1" : "left-0 p-2"} rounded-full bg-white shadow-md transition
          ${
            !isMobile && currentIndex === 0
              ? "text-gray-300 cursor-not-allowed"
              : "text-blue-500 hover:bg-blue-50"
          }`}
      >
        <ChevronLeft className={isMobile ? "hidden w-4 h-4" : "w-6 h-6 "} />
      </button>

      {/* Cards container */}
      <div
        ref={carouselRef}
        className={`flex gap-6  ${
          isMobile
            ? "overflow-x-auto touch-pan-x scroll-snap-x snap-mandatory px-8"
            : "justify-center px-4 mt-12"
        }`}
      >
        {display.map((tutor) => {
          const extra = Math.max(0, tutor.subjects.length - 2)
          return (
            <div
              key={tutor.id}
              className="tutor-card snap-start flex-shrink-0 
                         w-4/5 sm:w-[18rem] 
                         bg-white rounded-lg shadow-md p-6 
                         relative flex flex-col hover:shadow-lg transition-all"
            >
              {/* profile image */}
              <div className="absolute top-4 right-4 w-14 h-14 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={tutor.image || image}
                  alt={tutor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* name & rating */}
              <div className="flex flex-col mr-16 items-center mb-4">
                <h3 className={`md:text-lg text-md font-semibold ${styles.textColor}`}>
                  {tutor.name}
                </h3>
                <div className="flex items-center mt-1">
                  <span className={`text-sm ml-2 ${styles.textColor}`}>
                    {tutor.average_rating?.toFixed(1)}
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < tutor.average_rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.810l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.540 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.720c-.783-.570-.380-1.810.588-1.810h3.461a1 1 0 00.951-.690l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              {/* subjects */}
              <div className="flex justify-center flex-wrap gap-2 mb-4">
                {tutor.subjects.slice(0, 2).map((s, i) => (
                  <span
                    key={i}
                    className={`text-xs px-3 py-1 rounded-full ${styles.subjectBg} ${styles.textSecondary}`}
                  >
                    {s}
                  </span>
                ))}
                {extra > 0 && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${styles.subjectBg} ${styles.textSecondary}`}
                  >
                    +{extra}
                  </span>
                )}
              </div>

              {/* view profile btn */}
              <Link
                to={`/tutors/${tutor.name.replace(/\s+/g, "-").toLowerCase()}`}
                state={{ tutor }}
                className={`${styles.buttonSecondary} mt-auto mx-auto px-3 py-1 rounded-full text-sm`}
              >
                צפייה בפרופיל
              </Link>
            </div>
          )
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={nextSlide}
        disabled={!isMobile && currentIndex + visibleCount >= tutors.length}
        className={`absolute top-1/2 transform -translate-y-1/2 z-10 mt-8
          ${isMobile ? "right-2 p-1" : "right-0 p-2"} rounded-full bg-white shadow-md transition
          ${
            !isMobile && currentIndex + visibleCount >= tutors.length
              ? "text-gray-300 cursor-not-allowed"
              : "text-blue-500 hover:bg-blue-50"
          }`}
      >
        <ChevronRight className={isMobile ? "hidden w-4 h-4" : "w-6 h-6"} />
      </button>

      </div>
      )}
    </section>
  )
}

export default TutorComponent
