"good ver"

"final ver"
import { useState, useEffect, useRef } from "react"
import { useParams, useLocation, useNavigate, Link } from "react-router-dom"
import { Star, Book, Building2, Clock, Linkedin, Github, Phone, ChevronDown, ChevronUp, Send, ChevronLeft, ChevronRight, Pencil, Calendar } from 'lucide-react'
import { supabase } from "../lib/supabase"
import { courseStyles } from "../config/courseStyles" // Import the course styles
import EditPanel from "./EditPanel"
import mockData from "../config/mockData.json" // adjust path if needed

import "react-responsive-carousel/lib/styles/carousel.min.css"

// Add responsive layout style if overlapping occurs
const useResponsiveLayout = () => {
  const [isOverlapping, setIsOverlapping] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkOverlap = () => {
      // Check if screen is small enough that cards would overlap content
      const screenWidth = window.innerWidth
      setIsOverlapping(screenWidth < 768) // Mobile view
      setIsTablet(screenWidth >= 768 && screenWidth < 1024) // Tablet view
    }

    // Initial check
    checkOverlap()

    // Add resize listener
    window.addEventListener("resize", checkOverlap)

    // Cleanup
    return () => window.removeEventListener("resize", checkOverlap)
  }, [])

  return { isOverlapping, isTablet }
}

const ProfilePage = () => {
  const { tutorName } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const displayName = tutorName.replace(/-/g, " ")

  // Check if tutor data was passed via Link state
  const passedTutor = location.state?.tutor

  const [tutorData, setTutorData] = useState(passedTutor)
  const [loading, setLoading] = useState(!passedTutor)
  const [error, setError] = useState(null)
  const [showMoreReviews, setShowMoreReviews] = useState(false)
  const [showMoreTutors, setShowMoreTutors] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [reviews, setReviews] = useState([])
  const [showPrices, setShowPrices] = useState(false)
  const [currentTutorIndex, setCurrentTutorIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchCurrentX, setTouchCurrentX] = useState(0)
  const [isTouching, setIsTouching] = useState(false)
  const [slideDirection, setSlideDirection] = useState("right") // "left" or "right"
  const [showEditModal, setShowEditModal] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [editedGrades, setEditedGrades] = useState([])
  const [newGrade, setNewGrade] = useState({ subject: "", grade: "", year: "" })
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events, setEvents] = useState([])
  const [editedEvents, setEditedEvents] = useState([])
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    description: "",
  })
  const [activeTab, setActiveTab] = useState("personal")
  const { isOverlapping, isTablet } = useResponsiveLayout()

  // Determine course type based on tutor data or default to 'cs'
  const stateCourseType = location.state?.courseType
  const courseType = tutorData?.course_type || stateCourseType || "cs"
  const styles = courseStyles[courseType] // Get the appropriate styles
  const priceToggleRef = useRef(null)
 
  // Mock grades data
  const grades = [
    { subject: "Arabic Language", grade: "A+", year: "2015" },
    { subject: "Arabic Literature", grade: "A", year: "2015" },
    { subject: "Middle Eastern Studies", grade: "A", year: "2016" },
    { subject: "Teaching Methodology", grade: "A+", year: "2017" },
  ]

  // Mock events data
  const mockEvents = [
    {
      id: 4,
      title: "שיעור אנגלית מתקדמים",
      startDate: "2025-04-01",
      startTime: "10:00",
      endDate: "2025-04-01",
      endTime: "11:30",
      description: "שיעור אנגלית לרמת מתקדמים",
    },
    {
      id: 1,
      title: "שיעור פרטי - מתמטיקה",
      startDate: "2025-04-09",
      startTime: "10:00",
      endDate: "2025-04-10",
      endTime: "11:30",
      description: "שיעור פרטי במתמטיקה לתלמיד כיתה י'",
    },
    {
      id: 2,
      title: "סדנת פיזיקה קבוצתית",
      startDate: "2025-04-16",
      startTime: "10:00",
      endDate: "2025-04-16",
      endTime: "12:00",
      description: "סדנה קבוצתית בנושא חוקי ניוטון",
    },
    {
      id: 3,
      title: "שיעור אנגלית מתקדמים",
      startDate: "2025-04-28",
      startTime: "10:00",
      endDate: "2025-05-01",
      endTime: "11:30",
      description: "שיעור אנגלית לרמת מתקדמים",
    },
  ]

  const sectionKey = courseType + "Tutors" // e.g. csTutors, eeTutors
  const sectionTutors = mockData[sectionKey] || []

  const handlePriceToggle = () => {
    const rect = priceToggleRef.current?.getBoundingClientRect()
    const spaceBelow = window.innerHeight - (rect?.bottom || 0)

    if (!showPrices && spaceBelow < 150) {
      setShowPriceModal(true) // open modal instead
      return
    }

    setShowPrices((prev) => !prev)
  }

  const similarTutors = sectionTutors
    .filter((t) => t.name !== tutorData.name && t.subjects?.some((subject) => tutorData.subjects?.includes(subject)))
    .map((t) => ({
      ...t,
      price: "₪" + (Math.floor(Math.random() * 60) + 80), // fake price: 80-140₪
      quote: "מורה מצוין עם ניסיון בהכנה למבחנים", // placeholder quote
    }))

  useEffect(() => {
    // Initialize events with mock data
    setEvents(mockEvents)
  }, [])

  const getDisplayedTutors = () => {
    if (!similarTutors || similarTutors.length === 0) return []
    const result = []
    for (let i = 0; i < 3; i++) {
      // Use modular arithmetic to wrap around the array:
      const index = (currentTutorIndex + i) % similarTutors.length
      result.push(similarTutors[index])
    }
    return result
  }

  const handlePrevTutor = () => {
    if (similarTutors.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection("right")
    setCurrentTutorIndex((prev) => (prev - 1 + similarTutors.length) % similarTutors.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const handleNextTutor = () => {
    if (similarTutors.length === 0 || isTransitioning) return
    setIsTransitioning(true)
    setSlideDirection("left")
    setCurrentTutorIndex((prev) => (prev + 1) % similarTutors.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }


  // Calendar functions
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay()
  }

  const formatMonth = (date) => {
    const months = [
      "ינואר",
      "פברואר",
      "מרץ",
      "אפריל",
      "מאי",
      "יוני",
      "יולי",
      "אוגוסט",
      "ספטמבר",
      "אוקטובר",
      "נובמבר",
      "דצמבר",
    ]
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const getEventsForDay = (day) => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate
      const currentDate = new Date(dateStr)

      return currentDate >= eventStartDate && currentDate <= eventEndDate
    })
  }

  const hasEventsOnDay = (day) => {
    return getEventsForDay(day).length > 0
  }

  // Open edit modal
  const handleOpenEditModal = () => {
    setEditedData({
      name: tutorData.name || "",
      location: tutorData.location || "",
      role: tutorData.role || "",
      subjects: tutorData.subjects ? [...tutorData.subjects] : [],
      phone: tutorData.phone || "",
      linkedin: tutorData.linkedin || "",
      github: tutorData.github || "",
      about_me: tutorData.about_me || "",
      private_price: tutorData.private_price || "150",
      group_price: tutorData.group_price || "80",
      profile_image_url: tutorData.profile_image_url || "",
    })
    setEditedGrades(grades.map((grade) => ({ ...grade })))
    setEditedEvents(events.map((event) => ({ ...event })))
    setActiveTab("personal")
    setShowEditModal(true)
  }



  const handleProfileSave = (updatedData, updatedEvents, updatedGrades) => {
    setTutorData(updatedData)
    setEvents(updatedEvents)
    // (Update grades state too, if needed)
    setShowEditModal(false)
  }


  useEffect(() => {
    if (!passedTutor) {
      // If no data was passed, fetch it from Supabase using the name.
      const fetchTutor = async () => {
        const { data, error } = await supabase.from("tutors").select("*").eq("name", displayName).single()

        if (error) {
          setError(error.message)
        } else {
          setTutorData(data)
        }
        setLoading(false)
      }

      fetchTutor()
    }
  }, [passedTutor, displayName])

  // Instead of always fetching, if tutorData already has feedback, use it
  useEffect(() => {
    if (tutorData) {
      if (tutorData.feedback && tutorData.feedback.length > 0) {
        const reviewsWithComments = tutorData.feedback.filter((fb) => fb.comment?.trim())
        const sortedReviews = [...reviewsWithComments].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        setReviews(sortedReviews)
      } else {
        // Fetch reviews from Supabase if tutorData doesn't contain feedback
        const fetchReviews = async () => {
          const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .eq("tutor_id", tutorData.id)
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Error fetching reviews: ", error)
          } else {
            const reviewsWithComments = data?.filter((fb) => fb.comment?.trim()) || []
            setReviews(reviewsWithComments)
          }
        }
        fetchReviews()
      }
    }
  }, [tutorData])

  const displayedReviews = showMoreReviews ? reviews : reviews.slice(0, 3)
  const displayedTutors = showMoreTutors ? similarTutors : similarTutors.slice(0, 3)

  const handleSendEmail = () => {
    if (!emailSubject) {
      alert("Please select a subject for your email")
      return
    }
    if (!emailMessage.trim()) {
      alert("Please enter a message for your email")
      return
    }
    // In a real application, this would send the email
    alert("Your message has been sent to the tutor")
    setEmailMessage("")
  }

  const linke = "https://www.linkedin.com/in/daniel-shatzov/"
  const githu = "https://github.com/Daniel23sh"

  if (loading)
    return (
      <div className={`text-center mt-10 ${styles.textColor}`}>
        <div
          className="animate-spin h-10 w-10 border-4 border-t-transparent rounded-full mx-auto mb-4"
          style={{ borderColor: `currentColor transparent currentColor currentColor` }}
        ></div>
        טוען...
      </div>
    )

  if (error)
    return (
      <div className="text-center mt-10 text-red-500">
        <div className="text-xl mb-2">שגיאה</div>
        {error}
      </div>
    )

  if (!tutorData) return <div className={`text-center mt-10 ${styles.textColor}`}>המורה לא נמצא.</div>

  // Generate calendar days
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  // Adjust for Sunday as first day (0 in JavaScript)
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1

  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < adjustedFirstDay; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: "long", day: "numeric", month: "long" }
    return new Date(date).toLocaleDateString("he-IL", options)
  }


  // 1. Add a function to filter events for the current month
  const getEventsForCurrentMonth = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()

    return events.filter((event) => {
      const eventStartDate = new Date(event.startDate)
      const eventEndDate = event.endDate ? new Date(event.endDate) : eventStartDate

      // Check if the event overlaps with the current month
      return (
        (eventStartDate.getFullYear() === year && eventStartDate.getMonth() === month) ||
        (eventEndDate.getFullYear() === year && eventEndDate.getMonth() === month) ||
        (eventStartDate < new Date(year, month, 1) && eventEndDate > new Date(year, month + 1, 0))
      )
    })
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${styles.bgGradient}`}>
      {/* Mobile/Tablet Version: Profile card above the about section */}
      <div className={isOverlapping || isTablet ? "block p-4" : "hidden"}>
        <div
          className={`bg-white border ${styles.cardBorder} shadow-lg rounded-xl p-5 flex flex-col items-center relative ${
            isTablet ? "max-w-[81%] mx-auto" : ""
          }`}
        >
          {/* Edit button for mobile/tablet */}
          <button
            onClick={handleOpenEditModal}
            className={`absolute top-3 left-3 p-2 rounded-full ${styles.editBg} text-white hover:opacity-90 transition-opacity`}
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Profile Photo */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-full ${styles.bgLight} blur-md -z-10 scale-90 opacity-70`}></div>
            <img
              src={
                tutorData.profile_image_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(tutorData.name) || "/placeholder.svg"}&background=0D8ABC&color=fff`
              }
              alt={tutorData.name}
              className={`rounded-full object-cover border-2 border-white shadow-md z-10 ${
                isTablet ? "w-40 h-40" : "w-32 h-32"
              } mb-4`}
            />
          </div>
          {/* Tutor Name */}
          <h2 className={`${isTablet ? "text-2xl" : "text-xl"} font-bold text-center ${styles.textColor}`}>{tutorData.name}</h2>
          {/* Star Rating and Review Count */}
          <div className="flex items-center mt-2 mb-3">
            <Star className={`${isTablet ? "h-6 w-6" : "h-5 w-5"} ${styles.starColor} fill-current`} />
            <span className={`mr-1 ml-1 font-semibold ${styles.textColor}`}>
              {tutorData.average_rating ? tutorData.average_rating.toFixed(2) : "N/A"}
            </span>
            <span className={`ml-1 ${isTablet ? "text-base" : "text-sm"} text-gray-500`}>
              ({tutorData.feedback ? tutorData.feedback.length : 0} ביקורות)
            </span>
          </div>
          {/* Tutor Role */}
          <div className="flex items-center mt-3 justify-start w-full">
            <div className={`p-1.5 rounded-full ${styles.linksIconBg} mr-2`}>
              <Book className={`h-4 w-4 ${styles.iconColor}`} />
            </div>
            <p className={`text-sm ${styles.textColor}`}>{tutorData.role || "Tutor"}</p>
          </div>
          {/* Subjects Taught */}
          <div className="flex items-start mt-2 justify-start w-full">
            <div className={`p-1.5 rounded-full ${styles.linksIconBg} mr-2 mt-0.5 flex-shrink-0`}>
              <Building2 className={`h-4 w-4 ${styles.iconColor}`} />
            </div>
            <p className={`text-xs ${styles.textColor} text-center leading-tight mr-2 mt-2`}>
              {tutorData.subjects ? tutorData.subjects.join(", ") : "N/A"}
            </p>
          </div>
          {/* Hours with Orcas */}
          <div className="flex items-center mt-2 justify-start w-full">
            <div className={`p-1.5 rounded-full ${styles.linksIconBg} mr-2`}>
              <Clock className={`h-4 w-4 ${styles.iconColor}`} />
            </div>
            <p className="text-xs mr-2">זמין</p>
          </div>
          {/* Phone Number */}
          {tutorData.phone && (
            <div className="flex items-center mt-2 justify-start w-full">
              <div className={`p-1.5 rounded-full ${styles.linksIconBg} mr-2`}>
                <Phone className={`h-4 w-4 ${styles.iconColor}`} />
              </div>
              <p className="text-xs mr-2">{tutorData.phone}</p>
            </div>
          )}
          {/* Social Links */}
          {(linke || githu) && ( //tutorData.linkedin || tutorData.github
            <div className="flex gap-4 mt-3">
              {linke && (
                <a
                  href={linke}
                  className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {githu && (
                <a
                  href={githu}
                  className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all`}
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
          {/* "Book Now" Button */}
          <button
            className={`${styles.buttonPrimary} w-full py-2.5 px-4 rounded-lg mt-4 shadow-md hover:shadow-lg transition-all font-medium ${
              isTablet ? "text-lg" : ""
            }`}
          >
            הזמן שיעור עם {tutorData.name}
          </button>
        </div>
      </div>
      
      {/* Mobile/Tablet Version: Price card below the profile card */}
      <div className={isOverlapping || isTablet ? "block p-4" : "hidden"}>
        <div className={`bg-white border ${styles.cardBorder} shadow-lg rounded-xl p-5 flex flex-col items-center ${
          isTablet ? "max-w-[81%] mx-auto" : ""
        }`}>
          <h3 className={`${isTablet ? "text-2xl" : "text-xl"} font-bold mb-3 ${styles.textColor}`}>מחירים</h3>
          {showPrices && (
            <>
              {/* Individual Lessons */}
              <div className="w-full border-b pb-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${styles.textColor}`}>שיעור פרטי</span>
                  <span className={`text-xl font-bold ${styles.textSecondary}`}>
                    {tutorData.private_price || "150"}₪ / שעה
                  </span>
                </div>
                <p className="text-sm text-gray-500">שיעור אישי מותאם לצרכים שלך</p>
              </div>

              {/* Group Lessons */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${styles.textColor}`}>שיעור קבוצתי</span>
                  <span className={`text-xl font-bold ${styles.textSecondary}`}>
                    {tutorData.group_price || "80"}₪ / שעה
                  </span>
                </div>
                <p className="text-sm text-gray-500">2-5 תלמידים בקבוצה</p>
              </div>
            </>
          )}
          <button
            onClick={() => setShowPrices(!showPrices)}
            className={`${styles.buttonSecondary} w-full py-2 px-4 rounded-lg mt-4 shadow-md hover:shadow-lg transition-all`}
          >
            {showPrices ? "הסתר מחירים" : "לפרטים נוספים"}
          </button>
        </div>
      </div>

      {/* Desktop Version: Fixed right side profile card – visible only on lg+ screens */}
      <div className={isOverlapping || isTablet ? "hidden" : "block fixed right-0 top-0 w-[30%] p-4 max-w-[550px]"}>
        <div
          className={`bg-white border ${styles.cardBorder} shadow-lg rounded-xl p-6 max-h-[550px] flex flex-col items-center justify-start mt-4 mr-8 overflow-y-auto relative`}
        >
          {/* Edit button */}
          <button
            onClick={handleOpenEditModal}
            className={`absolute top-3 left-3 p-2 rounded-full ${styles.editBg} text-white hover:opacity-90 transition-opacity`}
            aria-label="Edit profile"
          >
            <Pencil className="h-4 w-4" />
          </button>

          {/* Profile Image */}
          <div className="relative">
            <div className={`absolute inset-0 rounded-full ${styles.bgLight} blur-md -z-10 scale-90 opacity-70`}></div>
            <img
              src={
                tutorData.profile_image_url ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(tutorData.name) || "/placeholder.svg"}&background=0D8ABC&color=fff`
              }
              alt={tutorData.name}
              className="rounded-full w-32 h-32 object-cover mb-4 border-2 border-white shadow-md z-10"
            />
          </div>

          <h2 className={`text-2xl font-bold text-center ${styles.textColor}`}>{tutorData.name}</h2>

          <div className="flex items-center mt-2">
            <Star className={`h-5 w-5 ${styles.starColor} fill-current`} />
            <span className={`mr-1 ml-1 font-semibold ${styles.textColor}`}>
              {tutorData.average_rating ? tutorData.average_rating.toFixed(2) : "N/A"}
            </span>
            <span className="ml-1 text-base text-gray-500">
              ({tutorData.feedback ? tutorData.feedback.length : 0} ביקורות)
            </span>
          </div>

          <div className="flex items-center mt-4 w-full">
            <div className={`p-2 rounded-full ${styles.linksIconBg} mr-3`}>
              <Book className={`h-5 w-5 ${styles.iconColor}`} />
            </div>
            <p className={`text-base mr-2 ${styles.textColor}`}>{tutorData.role || "Tutor"}</p>
          </div>

          <div className="flex items-start mt-3 w-full">
            <div className={`p-2 rounded-full ${styles.linksIconBg} mr-3 mt-0.5 flex-shrink-0`}>
              <Building2 className={`h-5 w-5 ${styles.iconColor}`} />
            </div>
            <p className={`text-sm ${styles.textColor} leading-tight mr-2 mt-2`}>
              {tutorData.subjects ? tutorData.subjects.join(", ") : "N/A"}
            </p>
          </div>

          <div className="flex items-center mt-3 w-full">
            <div className={`p-2 rounded-full ${styles.linksIconBg} mr-3`}>
              <Clock className={`h-5 w-5 ${styles.iconColor}`} />
            </div>
            <p className="text-sm mr-2">זמין</p>
          </div>

          {tutorData.phone && (
            <div className="flex items-center mt-3 w-full">
              <div className={`p-2 rounded-full ${styles.linksIconBg} mr-3`}>
                <Phone className={`h-5 w-5 ${styles.iconColor}`} />
              </div>
              <p className="text-sm mr-2">{tutorData.phone}</p>
            </div>
          )}

          {/* NEW Footer: Social links (left) and Meeting button (right) */}
          <div className="w-full flex items-center justify-between mt-6">
            <button
              className={`${styles.buttonPrimary} w-auto mr-24 ml-4 py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg transition-all font-medium text-base`}
            >
              הזמן שיעור
            </button>
            <div className="flex gap-2">
              {linke && (
                <a
                  href={linke}
                  className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all bg-blue-50`}
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {githu && (
                <a
                  href={githu}
                  className={`${styles.iconColorReverse} p-2 rounded-full hover:shadow-md transition-all bg-blue-50`}
                  aria-label="GitHub Profile"
                >
                  <Github className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Version: Fixed price card below profile card */}
      <div className={isOverlapping || isTablet ? "hidden" : "block fixed right-0 top-[570px] w-[30%] p-4 max-w-[550px]"}>
        <div
          className={`bg-white border ${styles.cardBorder} shadow-lg rounded-xl p-6 flex flex-col items-center justify-start mr-8 overflow-y-auto`}
        >
          <h3 className={`text-xl font-bold mb-4 ${styles.textColor}`}>מחירים</h3>
          {showPrices && (
            <>
              {/* Individual Lessons */}
              <div className="w-full border-b pb-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${styles.textColor}`}>שיעור פרטי</span>
                  <span className={`text-xl font-bold ${styles.textSecondary}`}>
                    {tutorData.private_price || "150"}₪ / שעה
                  </span>
                </div>
                <p className="text-sm text-gray-500">שיעור אישי מותאם לצרכים שלך</p>
              </div>

              {/* Group Lessons */}
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${styles.textColor}`}>שיעור קבוצתי</span>
                  <span className={`text-xl font-bold ${styles.textSecondary}`}>
                    {tutorData.group_price || "80"}₪ / שעה
                  </span>
                </div>
                <p className="text-sm text-gray-500">2-5 תלמידים בקבוצה</p>
              </div>
            </>
          )}
          <button
            ref={priceToggleRef}
            onClick={handlePriceToggle}
            className={`${styles.buttonSecondary} w-full py-2 px-4 rounded-lg mt-4 shadow-md hover:shadow-lg transition-all`}
          >
            {showPrices ? "הסתר מחירים" : "לפרטים נוספים"}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`pt-4 ${isOverlapping || isTablet ? "" : "md:pr-[33%] lg:pr-[30%]"} md:pl-0`}>
        <div className={`${isTablet ? "max-w-2xl" : "max-w-[70rem]"} mx-auto space-y-8 mt-4 px-4 pb-12`}>
          {/* About Me Section */}
          <section
            className={`bg-white border ${styles.cardBorder} p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${styles.textColor} flex items-center `}>
              <span className={`inline-block w-2 h-6 ${styles.bgLight} mr-2 rounded-full`}></span>
              מי אני?
            </h2>
            <p className={` ${styles.textColor} mr-4 whitespace-pre-line leading-relaxed font-bold `}>
              {tutorData.about_me ||
                "היי אני דניאל שצוב,\n בניתי את הדף פרופיל הזה כדי שתוכלו להתרשם מהמורים הפרטיים ולתת לכם אופציית בחירה טובה יותר. "}
            </p>
          </section>

          {/* Events Calendar Section */}
          <section
            className={`bg-white border ${styles.cardBorder} p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${styles.textColor} flex items-center`}>
              <span className={`inline-block w-2 h-6 ${styles.bgLight} mr-2 rounded-full`}></span>
              אירועים קרובים
            </h2>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Calendar */}
              <div className="w-full md:w-1/2">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <h3 className={`text-xl font-bold ${styles.textColor}`}>{formatMonth(currentMonth)}</h3>
                  <button onClick={nextMonth} className="p-2 rounded-full hover:bg-gray-100">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {["א", "ב", "ג", "ד", "ה", "ו", "ש"].map((day, index) => (
                    <div key={index} className="font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`h-10 flex items-center justify-center rounded-full relative ${
                        day ? "cursor-pointer" : ""
                      } ${hasEventsOnDay(day) ? `${styles.bgLight} bg-opacity-20` : ""}`}
                    >
                      {day && (
                        <>
                          <span
                            className={
                              hasEventsOnDay(day)
                                ? `font-bold rounded-full w-8 h-8 flex items-center justify-center ${styles.eventBg}`
                                : ""
                            }
                          >
                            {day}
                          </span>
                          {hasEventsOnDay(day) && (
                            <span className={`absolute bottom-1 w-1 h-1 rounded-full ${styles.bgLight}`}></span>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Events List */}
              <div className="w-full md:w-1/2 mt-6 md:mt-0">
                <h3 className={`text-lg font-bold mb-4 mr-2 ${styles.textColor}`}>אירועי החודש</h3>

                {getEventsForCurrentMonth().length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {getEventsForCurrentMonth().map((event) => (
                      <div
                        key={event.id}
                        className={`border-2 ${styles.cardBorder} ${styles.bgLight} rounded-xl p-4 shadow-sm hover:shadow-md transition-all justify-center`}
                      >
                        <div className="flex items-start ">
                          {event.startDate === event.endDate ? (
                            // Single day event
                            <div
                              className={`${styles.eventBg} text-white rounded-xl p-3 text-center ml-4 flex-shrink-0`}
                            >
                              <div className="text-2xl font-bold">{new Date(event.startDate).getDate()}</div>
                              <div className="text-xs">
                                {new Date(event.startDate).toLocaleDateString("he-IL", { month: "short" })}
                              </div>
                            </div>
                          ) : (
                            // Multi-day event
                            <div
                              className={`${styles.eventBg} text-white rounded-xl p-3 text-center ml-4 flex-shrink-0`}
                            >
                              {/* Start and End dates in one row */}
                              <div className="flex items-center justify-center gap-1 text-lg font-bold">
                                <span>{new Date(event.endDate).getDate()}</span>
                                <span className="text-xs font-normal mr-1 ml-1">-</span>
                                <span>{new Date(event.startDate).getDate()}</span>
                              </div>

                              {/* Month names below */}
                              <div className="flex items-center justify-center gap-1 text-xs mt-1">
                                {new Date(event.startDate).getMonth() !== new Date(event.endDate).getMonth() ? (
                                  <>
                                    <span>
                                      {new Date(event.endDate).toLocaleDateString("he-IL", { month: "short" })}
                                    </span>
                                    <span className="w-[12px]"></span>
                                    <span>
                                      {new Date(event.startDate).toLocaleDateString("he-IL", { month: "short" })}
                                    </span>
                                  </>
                                ) : (
                                  <span>
                                    {new Date(event.startDate).toLocaleDateString("he-IL", { month: "short" })}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <div className="flex-1">
                            <h4 className="font-bold text-lg">{event.title}</h4>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <Clock className="h-4 w-4 ml-1 mt-0.5" />
                              <span className="mt-0.5">
                                {event.startTime} - {event.endTime || event.startTime}
                              </span>
                            </div>
                            {event.description && <p className="mt-2 text-sm text-gray-700">{event.description}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 mt-0 md:mt-8">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>אין אירועים מתוכננים לחודש זה</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Grades Section */}
          <section
            className={`bg-white border ${styles.cardBorder} p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${styles.textColor} flex items-center`}>
              <span className={`inline-block w-2 h-6 ${styles.bgLight} mr-2 rounded-full`}></span>
              ציונים
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b ${styles.cardBorder}`}>
                    <th className={`text-right py-3 px-4 ${styles.textColor}`}>קורס</th>
                    <th className={`text-right py-3 px-4 ${styles.textColor}`}>ציון</th>
                    <th className={`text-right py-3 px-4 ${styles.textColor}`}>שנה</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade, index) => (
                    <tr key={index} className={index % 2 === 0 ? `${styles.bgLight}` : ""}>
                      <td className={`py-3 px-4 ${styles.textColor}`}>{grade.subject}</td>
                      <td className={`py-3 px-4 font-medium ${styles.textSecondary}`}>{grade.grade}</td>
                      <td className={`py-3 px-4 ${styles.textColor}`}>{grade.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reviews Section */}
          <section
            className={`bg-white border ${styles.cardBorder} p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-2xl font-bold ${styles.textColor} flex items-center`}>
                <span className={`inline-block w-2 h-6 ${styles.bgLight} mr-2 rounded-full`}></span>
                המלצות
              </h2>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {displayedReviews.map((review, index) => (
                  <div key={review.id || index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start">
                      {review.student_image ? (
                        <img
                          src={review.student_image || "/placeholder.svg"}
                          alt={review.student_name || "תלמיד"}
                          className="w-10 h-10 rounded-full mr-3 flex-shrink-0 "
                        />
                      ) : (
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mr-3 flex-shrink-0 mt-1 ml-2">
                          {review.student_name ? review.student_name.charAt(0).toUpperCase() : "ת"}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold mr-2">{review.student_name || "תלמיד"}</h3>
                        <p className="mt-1 text-gray-700 mr-2">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {reviews.length > 3 && (
                  <button
                    className={`mt-4 w-full py-2.5 px-4 border ${styles.cardBorder} rounded-lg ${styles.bgLight} ${styles.textColor} hover:shadow-md transition-all flex items-center justify-center`}
                    onClick={() => setShowMoreReviews(!showMoreReviews)}
                  >
                    {showMoreReviews ? (
                      <span className="flex items-center">
                        הצג פחות <ChevronUp className="mr-2 h-4 w-4" />
                      </span>
                    ) : (
                      <span className="flex items-center">
                        הצג עוד המלצות <ChevronDown className="mr-2 h-4 w-4" />
                      </span>
                    )}
                  </button>
                )}
              </div>
            ) : (
              <div className={`text-center py-8 ${styles.textColor}`}>
                <p>אין המלצות עדיין</p>
              </div>
            )}
          </section>

          {/* Email Section */}
          <section
            className={`bg-white border ${styles.cardBorder} p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            <h2 className={`text-2xl font-bold mb-4 ${styles.textColor} flex items-center`}>
              <span className={`inline-block w-2 h-6 ${styles.bgLight} mr-2 rounded-full`}></span>
              צור קשר
            </h2>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${styles.textColor}`}>נושא</label>
                <select
                  className={`w-full p-3 border ${styles.cardBorder} rounded-lg focus:ring-2 focus:ring-opacity-50 focus:${styles.bgLight} focus:border-transparent`}
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  dir="rtl"
                >
                  <option value="">בחר תחום</option>
                  {tutorData.subjects?.map((subject, index) => (
                    <option key={index} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${styles.textColor}`}>הודעה</label>
                <textarea
                  placeholder="כתוב את ההודעה שלך כאן..."
                  className={`w-full min-h-[100px] md:min-h-[150px] p-3 border ${styles.cardBorder} rounded-lg focus:ring-2 focus:ring-opacity-50 focus:${styles.bgLight} focus:border-transparent`}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  dir="rtl"
                />
              </div>
              <button
                className={`w-full ${styles.buttonPrimary} py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all`}
                onClick={handleSendEmail}
              >
                <Send className="h-4 w-4" />
                שלח מייל
              </button>
            </div>
          </section>

          {/* Similar Tutors Section - Only shown if there are similar tutors */}
          {similarTutors && similarTutors.length > 0 && (
            <section
              className={`bg-white border ${styles.cardBorder} p-6 rounded-xl shadow-md hover:shadow-lg transition-all`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${styles.textColor} flex items-center`}>
                <span className={`inline-block w-2 h-6 ${styles.bgLight} mr-2 rounded-full`}></span>
                מורים מומלצים
              </h2>

              {/* Desktop view */}
              <div className="relative hidden md:block">
                {/* Navigation buttons - Only shown if there are multiple tutors */}
                {similarTutors.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevTutor}
                      className={`absolute right-[-10px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-md transition-colors ${styles.buttonThird}`}
                      aria-label="Previous tutor"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    <button
                      onClick={handleNextTutor}
                      className={`absolute left-[-10px] top-1/2 -translate-y-1/2 z-10 rounded-full p-2 shadow-md transition-colors ${styles.buttonThird}`}
                      aria-label="Next tutor"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                  </>
                )}

                {/* Tutors carousel */}
                <div className="flex justify-between gap-4 px-8 overflow-hidden">
                  {getDisplayedTutors().map((tutor) => (
                    <div key={tutor.id} className="flex-1 min-w-0 border border-gray-200 rounded-lg overflow-hidden">
                      <div className="flex flex-col items-center p-4">
                        <div className="relative mb-2">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-lg">
                            <img
                              src={
                                tutor.profile_image_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name) || "/placeholder.svg"}&background=0D8ABC&color=fff`
                              }
                              alt={tutor.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {tutor.id % 2 === 0 && (
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                              <svg
                                className="h-4 w-4 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </div>
                          )}
                        </div>

                        <h3 className="text-xl font-bold text-center">{tutor.name}</h3>
                        <div className={`text-center mt-1 font-bold text-blue-600 ${styles.linksIconColor}`}>
                          {tutor.price}/שעה
                        </div>

                        <div className="bg-gray-100 p-3 rounded-lg mt-5 text-sm italic text-center">
                          <blockquote>{tutor.quote}</blockquote>
                        </div>

                        <div className="flex flex-col items-center mt-3">
                          <div className="flex mr-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`h-4 w-4 ${styles.starColor} fill-current`} />
                            ))}
                            <span className="text-sm text-gray-600 mr-1">(5)</span>
                          </div>

                          {/* Visit Profile Button */}
                          <Link
                            to={`/tutors/${tutor.name.replace(/\s+/g, "-").toLowerCase()}`}
                            state={{ tutor, courseType }}
                            className={`mt-3 py-1 px-4 text-sm rounded-full shadow ${styles.buttonSecondary} hover:shadow-md transition-all`}
                          >
                            בקר בפרופיל
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile view */}
              <div className="md:hidden">
                {getDisplayedTutors().length > 0 && (
                  <div className="relative bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex justify-between items-center mb-4">
                      {similarTutors.length > 1 && (
                        <button
                          onClick={handlePrevTutor}
                          className={`rounded-full p-1.5 ${styles.buttonThird} shadow-md transition-colors`}
                          aria-label="Previous tutor"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}

                      <h3 className="text-lg font-bold text-center text-blue-950">מורים מומלצים</h3>

                      {similarTutors.length > 1 && (
                        <button
                          onClick={handleNextTutor}
                          className={`rounded-full p-1.5 ${styles.buttonThird} shadow-md transition-colors`}
                          aria-label="Next tutor"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {getDisplayedTutors()
                      .slice(0, 1)
                      .map((tutor) => (
                        <div key={tutor.id} className="flex flex-col items-center">
                          <div className="relative mb-2">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow-lg">
                              <img
                                src={
                                  tutor.profile_image_url ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name) || "/placeholder.svg"}&background=0D8ABC&color=fff`
                                }
                                alt={tutor.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {tutor.id % 2 === 0 && (
                              <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                <svg
                                  className="h-3 w-3 text-white"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            )}
                          </div>

                          <h3 className="text-lg font-bold text-center">{tutor.name}</h3>

                          <div className="text-center mt-1">
                            <div className="font-bold text-blue-600">{tutor.price}/שעה</div>
                          </div>

                          <div className="text-xs text-center mt-2 line-clamp-1">{tutor.role}</div>

                          <div className="bg-gray-100 p-2 rounded-lg mt-3 text-xs italic text-center">
                            <blockquote className="line-clamp-2">{tutor.quote}</blockquote>
                          </div>

                          <div className="flex items-center mt-2">
                            <div className="flex mr-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${styles.starColor} fill-current`} />
                              ))}
                              <span className="text-xs text-gray-600">(5)</span>
                            </div>
                          </div>

                          {/* Visit Profile Button */}
                          <Link
                            to={`/tutors/${tutor.name.replace(/\s+/g, "-").toLowerCase()}`}
                            state={{ tutor, courseType }}
                            className={`mt-3 py-1.5 px-4 text-xs rounded-full shadow ${styles.buttonSecondary} hover:shadow-md transition-all`}
                          >
                            בקר בפרופיל
                          </Link>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Edit Profile Modal using your EditPanel component */}
      {showEditModal && (
        <EditPanel
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          tutorData={tutorData}
          styles={styles}
          grades={grades}
          events={events}
          onSave={handleProfileSave}
        />
      )}

      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowPriceModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              ✕
            </button>
            <h3 className={`text-xl font-bold mb-4 ${styles.textColor}`}>מחירים</h3>

            <div className="w-full border-b pb-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${styles.textColor}`}>שיעור פרטי</span>
                <span className={`text-xl font-bold ${styles.textSecondary}`}>
                  {tutorData.private_price || "150"}₪ / שעה
                </span>
              </div>
              <p className="text-sm text-gray-500">שיעור אישי מותאם לצרכים שלך</p>
            </div>

            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-medium ${styles.textColor}`}>שיעור קבוצתי</span>
                <span className={`text-xl font-bold ${styles.textSecondary}`}>
                  {tutorData.group_price || "80"}₪ / שעה
                </span>
              </div>
              <p className="text-sm text-gray-500">2-5 תלמידים בקבוצה</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfilePage;