import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Layout from '../components/Layout';
import { courseStyles } from '../config/courseStyles';
import Footer from '../components/Footer';

const RefundPolicy = () => {
  const [styles, setStyles] = useState(courseStyles.cs);
  const [courseType, setCourseType] = useState('cs');

  useEffect(() => {
    const storedCourseType = localStorage.getItem('courseType') || 'cs';
    setCourseType(storedCourseType);
    setStyles(courseStyles[storedCourseType] || courseStyles.cs);
  }, []);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Layout>
      <Navbar/>
      <div className="container mx-auto px-4 py-8 pt-24" style={{ maxWidth: '800px', direction: 'rtl', textAlign: 'right' }}>
        <h1 className={`${styles.textSecondary} text-4xl font-bold mb-4`}>מדיניות ביטול עסקה והחזרים</h1>
        <p className="mb-8"><strong>עודכן לאחרונה:</strong> 08.05.2025</p>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>מדיניות ביטול עסקה</h2>
          <div className="space-y-4">
            <p>
              בהתאם לחוק הגנת הצרכן, תשמ"א-1981, אנו מיישמים את המדיניות הבאה בנוגע לביטול עסקאות:
            </p>
            
            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>לפני קבלת גישה לקורס:</h3>
            <ul className="list-disc pr-5 space-y-2">
              <li>ניתן לבטל את העסקה תוך 14 ימים מיום ביצוע העסקה.</li>
              <li>הביטול יתבצע באמצעות פנייה בכתב לכתובת המייל: cs24.hit@gmail.com</li>
              <li>במקרה של ביטול, יוחזר מלוא סכום העסקה ללקוח.</li>
            </ul>

            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>לאחר קבלת גישה לקורס:</h3>
            <ul className="list-disc pr-5 space-y-2">
              <li>בהתאם לחוק הגנת הצרכן, לא ניתן לבטל את העסקה לאחר קבלת גישה לתכני הקורס.</li>
              <li>זאת מכיוון שמדובר בתוכן דיגיטלי אשר נמסר לצרכן ואינו ניתן להחזרה.</li>
              <li>ברגע שניתנה גישה לחומרי הלימוד הדיגיטליים, לא ניתן לבטל את העסקה או לקבל החזר כספי.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>מקרים חריגים</h2>
          <div className="space-y-4">
            <p>במקרים הבאים תישקל אפשרות לביטול העסקה גם לאחר קבלת הגישה:</p>
            <ul className="list-disc pr-5 space-y-2">
              <li>תקלה טכנית מתמשכת שאינה מאפשרת גישה לתכני הקורס.</li>
              <li>אי התאמה מהותית בין תיאור הקורס לתכנים בפועל.</li>
              <li>כל מקרה חריג אחר יבחן לגופו על ידי צוות האתר.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>תהליך הביטול וההחזר</h2>
          <div className="space-y-4">
            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>אופן הגשת בקשת ביטול:</h3>
            <ul className="list-disc pr-5 space-y-2">
              <li>יש לשלוח בקשת ביטול בכתב לכתובת המייל: cs24.hit@gmail.com</li>
              <li>יש לציין בפנייה את פרטי העסקה המלאים ואת סיבת הביטול.</li>
              <li>יש לצרף אסמכתא על ביצוע התשלום.</li>
            </ul>

            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>זמני טיפול:</h3>
            <ul className="list-disc pr-5 space-y-2">
              <li>אנו מתחייבים להשיב לפנייתכם תוך 3 ימי עסקים.</li>
              <li>במקרה של אישור הביטול, ההחזר הכספי יתבצע תוך 14 ימי עסקים.</li>
              <li>ההחזר יתבצע באמצעות אותו אמצעי תשלום בו בוצעה העסקה.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>הבטחת איכות השירות</h2>
          <div className="space-y-4">
            <p>אנו מתחייבים ל:</p>
            <ul className="list-disc pr-5 space-y-2">
              <li>לספק גישה לכל התכנים המובטחים בתיאור הקורס.</li>
              <li>לתת מענה טכני מהיר במקרה של תקלות.</li>
              <li>לעדכן את התכנים באופן שוטף בהתאם לצורך.</li>
              <li>לשמור על רמה אקדמית גבוהה של החומרים.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>יצירת קשר</h2>
          <div className="space-y-4">
            <p>לכל שאלה או פנייה בנושא העסקה או הקורסים, ניתן ליצור קשר:</p>
            <ul className="list-none pr-5 space-y-2">
              <li>דוא"ל: cs24.hit@gmail.com</li>
              <li>כתובת: רחוב יעקב פיכמן 18, חולון 5810201</li>
              <li>זמני מענה: ימים א'-ה', 09:00-17:00</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>הערות חשובות</h2>
          <div className="space-y-4">
            <ul className="list-disc pr-5 space-y-2">
              <li>האמור במסמך זה כפוף לתנאי השימוש המלאים של האתר.</li>
              <li>החברה שומרת לעצמה את הזכות לעדכן את מדיניות הביטולים מעת לעת.</li>
              <li>במקרה של סתירה בין האמור כאן לבין החוק, הוראות החוק יגברו.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* English Section */}
      <div className="container mx-auto px-4 py-8" style={{ maxWidth: '800px', direction: 'ltr', textAlign: 'left' }}>
        <h1 className={`${styles.textSecondary} text-4xl font-bold mb-4`}>Cancellation and Refund Policy</h1>
        <p className="mb-8"><strong>Last Updated:</strong> 08.05.2025</p>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>Transaction Cancellation Policy</h2>
          <div className="space-y-4">
            <p>
              In accordance with the Consumer Protection Law, 1981, we implement the following policy regarding transaction cancellations:
            </p>
            
            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Before Receiving Course Access:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>The transaction can be cancelled within 14 days from the date of purchase.</li>
              <li>Cancellation should be submitted in writing to: cs24.hit@gmail.com</li>
              <li>In case of cancellation, the full transaction amount will be refunded to the customer.</li>
            </ul>

            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>After Receiving Course Access:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>According to Consumer Protection Law, the transaction cannot be cancelled after receiving access to the course content.</li>
              <li>This is because it involves digital content that has been delivered to the consumer and cannot be returned.</li>
              <li>Once access to the digital learning materials has been granted, the transaction cannot be cancelled or refunded.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>Exceptional Cases</h2>
          <div className="space-y-4">
            <p>In the following cases, cancellation may be considered even after access has been granted:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Persistent technical malfunction preventing access to course content.</li>
              <li>Substantial discrepancy between course description and actual content.</li>
              <li>Any other exceptional case will be examined individually by the site team.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>Cancellation and Refund Process</h2>
          <div className="space-y-4">
            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>How to Submit a Cancellation Request:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Send a written cancellation request to: cs24.hit@gmail.com</li>
              <li>Include complete transaction details and reason for cancellation.</li>
              <li>Attach proof of payment.</li>
            </ul>

            <h3 className={`${styles.textSecondary} text-xl font-bold mb-2`}>Processing Times:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>We commit to responding to your request within 3 business days.</li>
              <li>If cancellation is approved, the refund will be processed within 14 business days.</li>
              <li>The refund will be issued through the same payment method used for the original transaction.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>Service Quality Assurance</h2>
          <div className="space-y-4">
            <p>We commit to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide access to all content promised in the course description.</li>
              <li>Provide quick technical support in case of issues.</li>
              <li>Update content regularly as needed.</li>
              <li>Maintain high academic standards for all materials.</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>Contact Information</h2>
          <div className="space-y-4">
            <p>For any questions or inquiries regarding transactions or courses, you can contact us:</p>
            <ul className="list-none pl-5 space-y-2">
              <li>Email: cs24.hit@gmail.com</li>
              <li>Address: 18 Yaakov Fichman St., Holon 5810201</li>
              <li>Response Hours: Sunday-Thursday, 09:00-17:00</li>
            </ul>
          </div>
        </section>

        <section className="mb-8">
          <h2 className={`${styles.textSecondary} text-2xl font-bold mb-4`}>Important Notes</h2>
          <div className="space-y-4">
            <ul className="list-disc pl-5 space-y-2">
              <li>The content of this document is subject to the complete terms of use of the site.</li>
              <li>The company reserves the right to update the cancellation policy from time to time.</li>
              <li>In case of contradiction between this document and the law, the provisions of the law shall prevail.</li>
            </ul>
          </div>
        </section>
      </div>
      </Layout>
    </div>
  );
};

export default RefundPolicy; 