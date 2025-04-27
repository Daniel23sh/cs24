
import { useState, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import { User } from 'lucide-react'
import { supabase } from "../lib/supabase"
import { courseStyles } from "../config/courseStyles" // Import the course styles
import EditPanel from "./EditPanel"
import mockData from "../config/mockData.json" // adjust path if needed
import { backgroundPath } from "../config/backgroundPath"
import NotFoundPage from "./NotFoundPage"
import ReviewSection from "./profile/ReviewsCard"
import ProfileCard from "./profile/ProfileCard"
import SimilarTutors from "./profile/SimilarTutors"
import EducationProfileSection from "./profile/EducationCard"
import ContactCard from "./profile/ContactCard"
import UpcomingEvents from "./profile/EventsCard"
// Add responsive layout style if overlapping occurs
const isDevMode = process.env.REACT_APP_DEV
const ProfilePage = () => {
  const { tutorName } = useParams()
  const location = useLocation()

  const displayName = tutorName.replace(/-/g, " ")

  // Check if tutor data was passed via Link state
  const passedTutor = location.state?.tutor

  const [tutorData, setTutorData] = useState(passedTutor)
  const [loading, setLoading] = useState(!passedTutor)
  const [error, setError] = useState(null)
  const [reviews, setReviews] = useState([])
 
  const [showEditModal, setShowEditModal] = useState(false)
  const [events, setEvents] = useState([])




  // Determine course type based on tutor data or default to 'cs'
  const stateCourseType = location.state?.courseType
  const courseType = tutorData?.course_type || stateCourseType || "cs"
  const styles = courseStyles[courseType] // Get the appropriate styles 


  const sectionKey = courseType + "Tutors" // e.g. csTutors, eeTutors
  const sectionTutors = mockData[sectionKey] || []
  const similarTutors = tutorData
  ? sectionTutors
      .filter((t) => t.name !== tutorData.name && t.subjects?.some((s) => tutorData.subjects?.includes(s)))
      .map((t) => ({
        ...t,
      }))
  : []

    useEffect(() => {
      if (tutorData) {
        setEvents(tutorData.events || [])
      }
    }, [tutorData])



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

 

  return (
    <div className={`min-h-screen relative`}>
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
            styles={styles}
          />

          {/* Similar Tutors Section - Only shown if there are similar tutors */}
          <SimilarTutors
            tutors={similarTutors}
            styles={styles}
            courseType={courseType}
          ></SimilarTutors>

            
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
      {isDevMode === 'true' && showEditModal && (
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