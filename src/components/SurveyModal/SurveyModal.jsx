import { useState } from "react";
import './SurveyModal.css'; // ✅ للستايل

function SurveyModal({ onComplete }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    source: "",
    userType: "",
    email: ""
  });
  const [loading, setLoading] = useState(false);

  const sources = [
    { value: "facebook", label: "Facebook", icon: "fa-facebook" },
    { value: "linkedin", label: "LinkedIn", icon: "fa-linkedin" },
    { value: "twitter", label: "Twitter / X", icon: "fa-twitter" },
    { value: "instagram", label: "Instagram", icon: "fa-instagram" },
    { value: "google", label: "Google Search", icon: "fa-google" },
    { value: "friend", label: "صديق", icon: "fa-user-friends" },
    { value: "other", label: "آخر", icon: "fa-ellipsis-h" }
  ];

  const userTypes = [
    { value: "client", label: "عميل محتمل", icon: "fa-shopping-cart", desc: "أبحث عن خدمات" },
    { value: "business", label: "صاحب شركة", icon: "fa-briefcase", desc: "أبحث عن موظف" },
    { value: "visitor", label: "زائر", icon: "fa-eye", desc: "أتصفح فقط" },
    { value: "developer", label: "مطور", icon: "fa-code", desc: "أبحث عن أفكار" }
  ];

  const getUserId = () => {
    let userId = localStorage.getItem("surveyUserId");
    if (!userId) {
      userId = crypto.randomUUID();
      localStorage.setItem("surveyUserId", userId);
    }
    return userId;
  };

  const handleSubmit = async () => {
    if (!formData.source || !formData.userType) {
      alert("من فضلك أكمل جميع الحقول المطلوبة");
      return;
    }

    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}api/survey/submit`, {
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
        
        // رسالة شكر
        alert("شكرًا لك! 🎉 نتمنى لك تجربة ممتعة");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="survey-overlay">
      <div className="survey-modal">
        
        {/* Welcome Step */}
        {step === 0 && (
          <div className="survey-step welcome-step">
            <div className="survey-emoji">👋</div>
            <h2 className="survey-title">مرحبًا بك!</h2>
            <p className="survey-desc">
              نحن سعداء بزيارتك. من فضلك خذ دقيقة للإجابة على بعض الأسئلة البسيطة
            </p>
            <button
              onClick={() => setStep(1)}
              className="survey-btn survey-btn-primary"
            >
              ابدأ الآن ✨
            </button>
          </div>
        )}

        {/* Question 1 - Source */}
        {step === 1 && (
          <div className="survey-step">
            <h3 className="survey-question">من أين عرفت عنّا؟</h3>
            <div className="survey-options">
              {sources.map((source) => (
                <button
                  key={source.value}
                  onClick={() => {
                    setFormData({ ...formData, source: source.value });
                    setTimeout(() => setStep(2), 300);
                  }}
                  className={`survey-option ${
                    formData.source === source.value ? "active" : ""
                  }`}
                >
                  <i className={`fab ${source.icon}`}></i>
                  <span>{source.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 2 - User Type */}
        {step === 2 && (
          <div className="survey-step">
            <h3 className="survey-question">أنت هنا كـ...</h3>
            <div className="survey-types">
              {userTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setFormData({ ...formData, userType: type.value });
                    setTimeout(() => setStep(3), 300);
                  }}
                  className={`survey-type ${
                    formData.userType === type.value ? "active" : ""
                  }`}
                >
                  <i className={`fas ${type.icon}`}></i>
                  <h4>{type.label}</h4>
                  <p>{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question 3 - Email (Optional) */}
        {step === 3 && (
          <div className="survey-step">
            <h3 className="survey-question">البريد الإلكتروني (اختياري)</h3>
            <p className="survey-subdesc">لو حابب نتواصل معاك بعروض خاصة</p>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your-email@example.com"
              className="survey-input"
            />
            <div className="survey-actions">
              <button
                onClick={() => {
                  setFormData({ ...formData, email: "" });
                  handleSubmit();
                }}
                disabled={loading}
                className="survey-btn survey-btn-secondary"
              >
                تخطي
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="survey-btn survey-btn-primary"
              >
                {loading ? "جاري الإرسال..." : "إنهاء ✓"}
              </button>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="survey-progress">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`progress-dot ${i <= step ? "active" : ""}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SurveyModal;