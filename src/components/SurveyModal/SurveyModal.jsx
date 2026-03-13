import { useState } from 'react';
import toast from 'react-hot-toast';
import { getApiUrl } from '../../utils/api';
import './SurveyModal.css';

// ✅ Helper للحصول على User ID
const getUserId = () => {
  let userId = localStorage.getItem("userId");
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("userId", userId);
  }
  return userId;
};

function SurveyModal({ onComplete }) {
  const [formData, setFormData] = useState({
    userName: '',
    source: '',
    userType: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.source || !formData.userType) {
      toast.error('من فضلك أكمل الحقول المطلوبة');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/api/survey-submit'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: getUserId()
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("surveyCompleted", "true");
        onComplete(data.totalVisitors);
        toast.success(data.message || "شكرًا لك! 🎉");
      } else {
        toast.error(data.message || 'حدث خطأ');
      }
    } catch (error) {
      console.error("❌ Survey error:", error);
      toast.error("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="survey-modal-overlay">
      <div className="survey-modal">
        <h2>استبيان سريع</h2>
        <p>ساعدنا في تحسين موقعنا!</p>

        <form onSubmit={handleSubmit} className="survey-form">
          {/*  الاسم */}
           <div className="form-group">
            <label>الاسم: *</label>
            <input
              type="text"
              placeholder="أدخل اسمك"
              value={formData.userName}
              onChange={(e) => setFormData({...formData, userName: e.target.value})}
              disabled={loading}
            />
          </div>
          {/* كيف عرفتنا */}
          <div className="form-group">
            <label>عرفتني ازاي؟: *</label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({...formData, source: e.target.value})}
              required
              disabled={loading}
            >
              <option value="">اختر...</option>
              <option value="google">Google</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter / X</option>
              <option value="linkedin">LinkedIn</option>
              <option value="github">GitHub</option>
              <option value="friend">صديق</option>
              <option value="mostaql">موقع مستقل</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {/* نوع المستخدم */}
          <div className="form-group">
            <label>من انت: *</label>
            <select
              value={formData.userType}
              onChange={(e) => setFormData({...formData, userType: e.target.value})}
              required
              disabled={loading}
            >
              <option value="">اختر...</option>
              <option value="client">عميل محتمل</option>
              <option value="recruiter">مسؤول توظيف</option>
              <option value="developer">مطور</option>
              <option value="student">طالب</option>
              <option value="other">أخرى</option>
            </select>
          </div>

          {/* البريد (اختياري) */}
          <div className="form-group">
            <label>البريد الإلكتروني (اختياري)</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? '⏳ جاري الإرسال...' : '✅ إرسال'}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default SurveyModal;