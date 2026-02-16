import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import './AdminPanel.css';

function AdminPanel() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    tools: '',
    repo: '',
    view: '',
    category: '',
    body: '',
    urlImg: ''
  });

  useEffect(() => {
    if (adminToken) {
      setIsAuthenticated(true);
      fetchProjects();
    }
  }, [adminToken]);

  const fetchProjects = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const res = await fetch(`${API_URL}api/projects`);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      console.log('✅ Projects loaded:', data);
      setProjects(data);
    } catch (error) {
      console.error('❌ Fetch projects error:', error);
      toast.error('فشل جلب المشاريع');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const token = e.target.token.value;
    
    if (!token) {
      toast.error('من فضلك أدخل Token');
      return;
    }
    
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAuthenticated(true);
    toast.success('تم تسجيل الدخول');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setIsAuthenticated(false);
    setProjects([]);
    toast.success('تم تسجيل الخروج');
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!formData.title || !formData.category) {
    toast.error('العنوان والفئة مطلوبان');
    return;
  }
  
  setLoading(true);
  
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
  
  // ✅ تحديد الـ URL
  const url = editingProject 
    ? `${API_URL}api/projects?id=${editingProject._id}`  // ✅ Query param
    : `${API_URL}api/projects`;
  
  const method = editingProject ? 'PUT' : 'POST';

  console.log('📤 Request:', { url, method });

  try {
    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(formData)
    });

    console.log('📥 Status:', res.status);

    let data;
    const contentType = res.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('❌ Response:', text);
      throw new Error('استجابة غير صحيحة من السيرفر');
    }

    console.log('📥 Data:', data);

    if (res.ok) {
      toast.success(data.message || 'تم بنجاح!');
      await fetchProjects();
      resetForm();
    } else {
      toast.error(data.message || `خطأ ${res.status}`);
    }
  } catch (error) {
    console.error('❌ Error:', error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (projectId) => {
  if (!window.confirm('هل أنت متأكد؟')) return;
  
  setLoading(true);

  try {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const res = await fetch(`${API_URL}api/projects?id=${projectId}`, {  // ✅
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });

    const data = await res.json();

    if (res.ok) {
      toast.success(data.message);
      await fetchProjects();
    } else {
      toast.error(data.message);
    }
  } catch  {
    toast.error('فشل الحذف');
  } finally {
    setLoading(false);
  }
};
  const handleEdit = (project) => {
    console.log('✏️ Editing project:', project);
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      tools: project.tools || '',
      repo: project.repo || '',
      view: project.view || '',
      category: project.category || '',
      body: project.body || '',
      urlImg: project.urlImg || ''
    });
    setShowForm(true);
  };



  const resetForm = () => {
    setFormData({
      title: '',
      tools: '',
      repo: '',
      view: '',
      category: '',
      body: '',
      urlImg: ''
    });
    setEditingProject(null);
    setShowForm(false);
  };

  // صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin} className="login-form">
          <h2>🔐 Admin Login</h2>
          <input
            type="password"
            name="token"
            placeholder="Admin Token"
            required
            className="login-input"
            autoComplete="off"
          />
          <button type="submit" className="login-btn">
            دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>📊 Admin Panel</h1>
        <div className="admin-actions">
          <button 
            onClick={() => setShowForm(true)} 
            className="btn-primary"
            disabled={loading}
          >
            ➕ إضافة مشروع
          </button>
          <button 
            onClick={handleLogout} 
            className="btn-secondary"
          >
            🚪 خروج
          </button>
        </div>
      </header>

      {/* نموذج الإضافة/التعديل */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProject ? '✏️ تعديل المشروع' : '➕ مشروع جديد'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="project-form">
              <input
                type="text"
                placeholder="عنوان المشروع *"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                disabled={loading}
              />
              
              <input
                type="text"
                placeholder="الأدوات (مثال: React, Node.js)"
                value={formData.tools}
                onChange={(e) => setFormData({...formData, tools: e.target.value})}
                disabled={loading}
              />
              
              <input
                type="url"
                placeholder="رابط GitHub"
                value={formData.repo}
                onChange={(e) => setFormData({...formData, repo: e.target.value})}
                disabled={loading}
              />
              
              <input
                type="url"
                placeholder="رابط المشروع الحي"
                value={formData.view}
                onChange={(e) => setFormData({...formData, view: e.target.value})}
                disabled={loading}
              />
              
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                required
                disabled={loading}
              >
                <option value="">اختر الفئة *</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Mobile">Mobile</option>
                <option value="UI/UX">UI/UX</option>
              </select>
              
              <textarea
                placeholder="وصف المشروع"
                value={formData.body}
                onChange={(e) => setFormData({...formData, body: e.target.value})}
                rows="4"
                disabled={loading}
              />
              
              <input
                type="url"
                placeholder="رابط الصورة"
                value={formData.urlImg}
                onChange={(e) => setFormData({...formData, urlImg: e.target.value})}
                disabled={loading}
              />
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? '⏳ جاري الحفظ...' : (editingProject ? '💾 تحديث' : '➕ إضافة')}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm} 
                  className="btn-secondary"
                  disabled={loading}
                >
                  ✕ إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* قائمة المشاريع */}
      <div className="projects-section">
        <h3>المشاريع ({projects.length})</h3>
        
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>📭 لا توجد مشاريع</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              ➕ إضافة مشروع
            </button>
          </div>
        ) : (
          <div className="projects-table">
            <table>
              <thead>
                <tr>
                  <th>الصورة</th>
                  <th>العنوان</th>
                  <th>الفئة</th>
                  <th>الأدوات</th>
                  <th>👁️ Views</th>
                  <th>❤️ Likes</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => (
                  <tr key={project._id}>
                    <td>
                      {project.urlImg ? (
                        <img 
                          src={project.urlImg} 
                          alt={project.title} 
                          className="project-thumb" 
                          onError={(e) => {
                            e.target.src = '';
                          }}
                        />
                      ) : (
                        <div className="project-thumb-placeholder">📷</div>
                      )}
                    </td>
                    <td className="project-title">{project.title}</td>
                    <td>
                      <span className="category-badge">{project.category}</span>
                    </td>
                    <td className="project-tools">{project.tools || '-'}</td>
                    <td>{project.views || 0}</td>
                    <td>{project.likedBy?.length || 0}</td>
                    <td>
                      <div className="action-btns">
                        <button 
                          onClick={() => handleEdit(project)} 
                          className="btn-edit"
                          title="تعديل"
                          disabled={loading}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(project._id)} 
                          className="btn-delete"
                          title="حذف"
                          disabled={loading}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;