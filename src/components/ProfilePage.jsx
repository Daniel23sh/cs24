
import { useState, useEffect, useRef } from "react"
import { useParams, useLocation, useNavigate, Link } from "react-router-dom"
import { Star, Book, Building2, Clock, Linkedin, Github, Phone, ChevronDown, ChevronUp, Send, ChevronLeft, ChevronRight, Pencil, Calendar, User } from 'lucide-react'
import { supabase } from "../lib/supabase"
import { courseStyles } from "../config/courseStyles" // Import the course styles
import EditPanel from "./EditPanel"
import mockData from "../config/mockData.json" // adjust path if needed
import { backgroundPath } from "../config/backgroundPath"
import "react-responsive-carousel/lib/styles/carousel.min.css"
import NotFoundPage from "./NotFoundPage"
import ReviewSection from "./profile/ReviewsCard"
import ProfileCard from "./profile/ProfileCard"
import SimilarTutors from "./profile/SimilarTutors"
import EducationProfileSection from "./profile/EducationCard"
import ContactCard from "./profile/ContactCard"
import UpcomingEvents from "./profile/EventsCard"
// Add responsive layout style if overlapping occurs

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

  const similarTutors = tutorData
  ? sectionTutors
      .filter((t) => t.name !== tutorData.name && t.subjects?.some((s) => tutorData.subjects?.includes(s)))
      .map((t) => ({
        ...t,
        price: "₪" + tutorData.private_price,
        quote: "מורה מצוין …",
      }))
  : []

    useEffect(() => {
      if (tutorData) {
        setEvents(tutorData.events || mockEvents)
      }
    }, [tutorData])
    
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
      status: tutorData.status || "זמין",
    })
    setEditedGrades(
      tutorData.grades ? tutorData.grades.map((grade) => ({ ...grade })) : []
    );
    setEditedEvents(
      tutorData.events ? tutorData.events.map((event) => ({ ...event })) : []
    );
    setActiveTab("personal")
    setShowEditModal(true)
  }



  const handleProfileSave = (updatedData, updatedEvents, updatedGrades) => {
    setTutorData({ ...updatedData, grades: updatedGrades, events: updatedEvents });
    setEvents(updatedEvents);
    setShowEditModal(false);
  }
  


  useEffect(() => {
    if (passedTutor) {
      // If tutor data was passed, use it
      console.log("Tutor data taken from passed state:", passedTutor)
      setTutorData(passedTutor)
      setLoading(false) // Set loading to false as data is immediately available
    } else {
      // If no data was passed, fetch it from Supabase using the name.
      const fetchTutor = async () => {
        const { data, error } = await supabase.from("tutors").select("*").eq("name", displayName).maybeSingle()

        if (error) {
          setError(error.message)
        } else {
          console.log("Tutor data fetched from Supabase:", data)
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

  if (error){
    return <NotFoundPage />;
    }

    if (!tutorData) {
         return <NotFoundPage />;
    }

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
    <div className={`min-h-screen  relative`}>
    <svg
      className={`fixed inset-0 w-full h-full z-0 ${styles.bgLight}`}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill= {styles.background}
        fillOpacity="0.49"
        d={backgroundPath}
      />
    </svg>
     <ProfileCard styles={styles} tutorData={tutorData} />

      {/* Main Content Area */}
      <div className={`relative z-10 p-4 mx-auto w-full max-w-screen-xl`}>
        <div className={`bg-white rounded-xl border mb-6 w-full ${styles.cardBorder} max-w-[73rem] mx-auto space-y-8 mt-4 px-4 pb-12`}>
          {/* About Me Section */}
          <section
            className={`bg-white  -mb-12 md:max-w-[65rem] max-w-3xl mx-auto py-8`}
          >
            
            <div className="bg-white p-6 flex items-center gap-3 mb-6 border-b pb-6 ">
              <User className={`h-6 w-6 ${styles.iconColor}`} />
              <h2 className={`text-2xl font-bold  ${styles.textColor}`}>מי אני?</h2>
            </div>
            <p className={` ${styles.textColor} mr-4 whitespace-pre-line leading-relaxed font-bold `}>
              {tutorData.about_me ||
                "היי אני דניאל שצוב,\n בניתי את הדף פרופיל הזה כדי שתוכלו להתרשם מהמורים הפרטיים ולתת לכם אופציית בחירה טובה יותר. "}
            </p>
          </section>
                    
          {/* Desktop: 2-column, Mobile: stacked */}
          <div className="flex  flex-col md:flex-row gap-8 md:max-w-[65rem] max-w-3xl mx-auto py-8">
            <div className="w-full md:w-1/2">
              <UpcomingEvents styles={styles} events={tutorData.events} />
            </div>
            <div className="w-full md:w-1/2 -mt-16 md:mt-0  ">
              <EducationProfileSection styles={styles} tutor={tutorData} />
            </div>
          </div>

          {/* Reviews Section */}
          <ReviewSection
            reviews={tutorData.feedback || []}
            showMoreReviews={showMoreReviews}
            setShowMoreReviews={setShowMoreReviews}
            styles={styles}
          />

          {/* Similar Tutors Section - Only shown if there are similar tutors */}
          <SimilarTutors
            tutors={similarTutors}
            styles={styles}
            courseType={courseType}
            showMoreTutors={showMoreTutors}
            setShowMoreTutors={setShowMoreTutors}
            handlePrevTutor={handlePrevTutor}
            handleNextTutor={handleNextTutor}
            isTransitioning={isTransitioning}
            slideDirection={slideDirection}></SimilarTutors>

            
          {/* Email Section */}
          <section
            className={`bg-white ${styles.cardBorder} p-4 md:p-6 `}
          >
            <ContactCard
              tutor={tutorData}
              styles={styles}></ContactCard>
          </section>


        </div>
      </div>

      {/* Edit Profile Modal using your EditPanel component */}
      {showEditModal && (
        <EditPanel
          showEditModal={showEditModal}
          setShowEditModal={setShowEditModal}
          tutorData={tutorData}
          styles={styles}
          grades={tutorData.grades}
          events={tutorData.events}
          onSave={handleProfileSave}
        />
      )}

     
    </div>
  )
}

export default ProfilePage;