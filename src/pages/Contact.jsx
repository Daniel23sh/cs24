import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Mail, Send, MapPin, Phone } from 'lucide-react';
import { showNotification } from '../components/ui/notification';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission to your backend
    console.log('Form submitted:', formData);
    showNotification('ההודעה נשלחה בהצלחה!', 'success');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <Layout>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 mt-16">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="shadow-lg border-2 transform transition-all duration-300 hover:scale-[1.02] hover:border-blue-400 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] bg-white hover:bg-blue-50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-blue-200">
                <Mail className="w-6 h-6 text-blue-600 transition-transform duration-300 hover:scale-110" />
              </div>
              <CardTitle className="text-3xl font-bold text-right">צור קשר</CardTitle>
              <p className="text-gray-600 mt-2 text-right">
                יש לך שאלה? נשמח לעזור!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    שם מלא
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="הכנס את שמך המלא"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    אימייל
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your@email.com"
                    dir="ltr"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    הודעה
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="כתוב את הודעתך כאן..."
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-2 rounded-md transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>שלח הודעה</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-2 transform transition-all duration-300 hover:scale-[1.02] hover:border-purple-400 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)] bg-white hover:bg-purple-50">
            <CardHeader className="text-center pb-6">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-purple-200">
                <MapPin className="w-6 h-6 text-purple-600 transition-transform duration-300 hover:scale-110" />
              </div>
              <CardTitle className="text-3xl font-bold text-right">פרטי התקשרות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 text-right" dir="rtl">
                <div>
                  <h3 className="text-lg font-semibold mb-2">כתובת</h3>
                  <p className="text-gray-600">דניאל זיו</p>
                  <p className="text-gray-600">רחוב יעקב פיכמן 18</p>
                  <p className="text-gray-600">חולון 5810201</p>
                  <p className="text-gray-600">ישראל</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">אימייל</h3>
                  <a 
                    href="mailto:cs24.hit@gmail.com"
                    className="text-purple-600 hover:text-purple-700 hover:underline"
                  >
                    cs24.hit@gmail.com
                  </a>
                </div>

                <div className="pt-6">
                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-gray-500 text-sm">
                      אנחנו משתדלים להגיב לכל הפניות בתוך 24-48 שעות.
                      <br />
                      במקרים דחופים, מומלץ לשלוח גם אימייל ישירות.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </Layout>

  );
};

export default Contact; 