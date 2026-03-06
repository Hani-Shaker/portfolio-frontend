import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getApiUrl } from '../../utils/api';
import './AdminPanel.css';

function AdminPanel() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: '',
    tools: '',
    repo: '',
    view: '',
    category: '',
    body: '',
    urlImg: ''
  });

  // ✅ عند تحميل الصفحة - بس نشوف لو في Token
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    if (savedToken) {
      setAdminToken(savedToken);
      setIsAuthenticated(true);
    }
    setPageLoading(false);
  }, []);


  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch(getApiUrl('/api/projects'));

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log('✅ Projects loaded:', data.length);
      setProjects(data);
    } catch (error) {
      console.error('❌ Fetch error:', error);
      toast.error('فشل جلب المشاريع');
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated, fetchProjects]);

  // ✅ تسجيل الدخول - بس نحفظ الـ Token
  const handleLogin = (e) => {
    e.preventDefault();
    const token = e.target.token.value.trim();

    if (!token) {
      toast.error('من فضلك أدخل Token');
      return;
    }

    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    setIsAuthenticated(true);
    toast.success('تم تسجيل الدخول! 🎉');
  };

  // ✅ تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken('');
    setIsAuthenticated(false);
    setProjects([]);
    toast.success('تم تسجيل الخروج');
  };

  // ✅ لو الـ Token غلط، Backend هيرجع 401/403 وهنعمل logout تلقائي
  const handleApiError = (status) => {
    if (status === 401 || status === 403) {
      toast.error('انتهت الجلسة، سجل دخول مرة أخرى');
      handleLogout();
      return true;
    }
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category) {
      toast.error('العنوان والفئة مطلوبان');
      return;
    }

    setLoading(true);

    const url = editingProject
      ? getApiUrl(`/api/projects?id=${editingProject._id}`)
      : getApiUrl('/api/projects');

    const method = editingProject ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(formData)
      });

      // ✅ لو الـ Token غلط
      if (handleApiError(res.status)) return;

      const data = await res.json();

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

  const handleEdit = (project) => {
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

  const handleDelete = async (projectId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;

    setLoading(true);

    try {
      const res = await fetch(getApiUrl(`/api/projects?id=${projectId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      // ✅ لو الـ Token غلط
      if (handleApiError(res.status)) return;

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || 'تم الحذف');
        await fetchProjects();
      } else {
        toast.error(data.message || 'فشل الحذف');
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
      toast.error('فشل الحذف');
    } finally {
      setLoading(false);
    }
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

async function uploadImage() {

  const file = document.getElementById("imageUpload").files[0];

  const dataForm = new FormData();
  dataForm.append("file", file);
  dataForm.append("upload_preset", "portfolio_upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dns5icwyq/image/upload",
    {
      method: "POST",
      body: dataForm
    }
  );

  const data = await res.json();

  setFormData({
    ...formData,
    urlImg: data.secure_url
  });

  toast.success("تم رفع الصورة ✅");
}

  // ✅ Loading أثناء تحميل الصفحة
  if (pageLoading) {
    return (
      <div className="admin-loading">
        <i className="fas fa-spinner fa-spin text-4xl text-[#19cee6]"></i>
        <p>جاري التحميل...</p>
      </div>
    );
  }

  // ✅ صفحة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <form onSubmit={handleLogin} className="login-form">
          <div className="login-icon">🔐</div>
          <h2>Admin Login</h2>
          <p>أدخل الـ Token للدخول</p>
          <input
            type="password"
            name="token"
            placeholder="Admin Token"
            required
            className="login-input"
            autoComplete="off"
          />
          <button type="submit" className="login-btn">
            🚀 دخول
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <header className="admin-header my-20">
        <h1>📊 Admin Panel</h1>
        <div className="admin-actions">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            disabled={loading}
          >
            ➕ إضافة مشروع
          </button>
          <button onClick={handleLogout} className="btn-secondary">
            🚪 خروج
          </button>
        </div>
      </header>

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
                type="text"
                placeholder="رابط GitHub"
                value={formData.repo}
                onChange={(e) => setFormData({...formData, repo: e.target.value})}
                disabled={loading}
              />
              <input
                type="text"
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
                type="text"
                placeholder="رابط الصورة"
                value={formData.urlImg}
                onChange={(e) => setFormData({...formData, urlImg: e.target.value})}
                disabled={loading}
              />

              <input type="file" id="imageUpload" />

              <button
                type="button"
                onClick={uploadImage}
                className='btn-secondary upload-btn'
              >
              Upload Image
              </button>

              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? '⏳ جاري الحفظ...' : (editingProject ? '💾 تحديث' : '➕ إضافة')}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary" disabled={loading}>
                  ✕ إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                            e.target.src = 'https://placehold.co/60x60?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="project-thumb-placeholder">📷</div>
                      )}
                    </td>
                    <td className="project-title">{project.title}</td>
                    <td><span className="category-badge">{project.category}</span></td>
                    <td className="project-tools">{project.tools || '-'}</td>
                    <td>{project.views || 0}</td>
                    <td>{project.likedBy?.length || 0}</td>
                    <td>
                      <div className="action-btns">
                        <button onClick={() => handleEdit(project)} className="btn-edit" disabled={loading}>✏️</button>
                        <button onClick={() => handleDelete(project._id)} className="btn-delete" disabled={loading}>🗑️</button>
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