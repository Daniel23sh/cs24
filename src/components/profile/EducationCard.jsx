import { GraduationCap, Calendar, BookOpen } from "lucide-react"

export default function EducationCard({ tutor, styles }) {
  if (!tutor || !tutor.education || tutor.education.length === 0) return null;
  
  const average =
    tutor.grades?.length > 0
      ? (
          tutor.grades.reduce((sum, g) => sum + Number(g.grade), 0) /
          tutor.grades.length
        ).toFixed(1)
      : "N/A";

  return (
    <section className="py-8  -mb-12" dir="rtl">
      <div className="w-full">
        <div className="flex items-center gap-3 border-b pb-6 mb-8">
          <GraduationCap className={`h-6 w-6 ${styles.iconColor}`} />
          <h2 className={`text-2xl font-bold ${styles.textColor}`}>השכלה</h2>
        </div>

        <div className="mb-8">
          {tutor.education[0] && (
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 ${styles.subjectBg} p-4 rounded-lg`}>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{tutor.education[0].degree_name}</h3>
                <div className="flex items-center mt-1 text-gray-600">
                  <BookOpen className="h-4 w-4 mr-2 ml-2" />
                  <span className="mb-1">{tutor.education[0].academy_name}</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-2 ml-8 sm:mt-0">
                <Calendar className={`h-4 w-4 mr-2 ml-2 ${styles.iconColor}`} />
                <span>
                  {new Date(tutor.education[0].endDate).getFullYear()} — {new Date(tutor.education[0].startDate).getFullYear()}
                </span>
              </div>
            </div>
          )}

          {tutor.grades && tutor.grades.length > 0 && (
            <>
              <div className="relative overflow-x-auto">
                <div className="overflow-y-auto" style={{ maxHeight: '250px' }}>
                  <table className="w-full text-right border-collapse">
                    <thead className="sticky top-0 bg-white shadow-sm z-10">
                      <tr className={`border-b ${styles.cardBorder}`}>
                        <th className={`px-4 py-3 text-sm font-bold ${styles.textColor} bg-white`}>מקצוע</th>
                        <th className={`px-4 py-3 text-sm font-bold ${styles.textColor} bg-white`}>שנה</th>
                        <th className={`px-4 py-3 text-sm font-bold ${styles.textColor} bg-white`}>ציון</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tutor.grades.map((grade, index) => (
                        <tr key={index} className={`${index % 2 === 0 ? styles.bgLight : ""}`}>
                          <td className={`px-4 py-3 text-sm ${styles.textColor}`}>{grade.course_name}</td>
                          <td className={`px-4 py-3 text-sm ${styles.textColor}`}>{grade.year}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-bold ${styles.textSecondary}`}>
                              {grade.grade}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm">
                <div className={`flex items-center gap-1 text-lg ${styles.textColor}`}>
                  <span className="font-bold">ממוצע:</span> {average}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
