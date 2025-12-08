import React, { useEffect, useState } from 'react';
import { listUsers, setUserRole, uploadBook, listBooks, deleteBook, createArticle, listArticles, deleteArticle, updateArticle, uploadVideo, listVideos, deleteVideo } from '../api/admin';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [articleCategory, setArticleCategory] = useState('mental-health');
  const [videoFile, setVideoFile] = useState(null);
  const [videoThumbnail, setVideoThumbnail] = useState(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoDuration, setVideoDuration] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('users');
  const [editingArticle, setEditingArticle] = useState(null);

  async function loadAll() {
    setError('');
    setLoading(true);
    try {
      const [u, b, a, v] = await Promise.all([listUsers(), listBooks(), listArticles(), listVideos()]);
      setUsers(u);
      setBooks(b);
      setArticles(a);
      setVideos(v);
    } catch (err) {
      setError(err.message || 'Load error');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  async function onRoleChange(userId, role) {
    try {
      await setUserRole(userId, role);
      setSuccess('User role updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Role change failed');
    }
  }

  async function onUpload(e) {
    e.preventDefault();
    if (!file) return setError('Select a book file');
    
    const fd = new FormData();
    fd.append('file', file);
    if (cover) fd.append('cover', cover);
    fd.append('title', title);
    fd.append('author', author);
    
    setLoading(true);
    try {
      await uploadBook(fd);
      setFile(null);
      setCover(null);
      setTitle('');
      setAuthor('');
      setSuccess('Book uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
      await deleteBook(id);
      setSuccess('Book deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  }

  async function onCreateArticle(e) {
    e.preventDefault();
    if (!articleTitle || !articleContent) return setError('Title and content required');
    
    setLoading(true);
    try {
      await createArticle({
        title: articleTitle,
        content: articleContent,
        summary: articleSummary,
        category: articleCategory
      });
      setArticleTitle('');
      setArticleContent('');
      setArticleSummary('');
      setArticleCategory('mental-health');
      setSuccess('Article created successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Article creation failed');
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteArticle(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await deleteArticle(id);
      setSuccess('Article deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  }

  async function onUploadVideo(e) {
    e.preventDefault();
    if (!videoFile) return setError('Select a video file');
    
    const fd = new FormData();
    fd.append('file', videoFile);
    if (videoThumbnail) fd.append('thumbnail', videoThumbnail);
    fd.append('title', videoTitle);
    fd.append('description', videoDescription);
    fd.append('duration', videoDuration);
    
    setLoading(true);
    try {
      await uploadVideo(fd);
      setVideoFile(null);
      setVideoThumbnail(null);
      setVideoTitle('');
      setVideoDescription('');
      setVideoDuration('');
      setSuccess('Video uploaded successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  async function onDeleteVideo(id) {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      await deleteVideo(id);
      setSuccess('Video deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
    } catch (err) {
      setError(err.message || 'Delete failed');
    }
  }

  async function onUpdateArticle(e) {
    e.preventDefault();
    if (!articleTitle || !articleContent) return setError('Title and content required');
    
    setLoading(true);
    try {
      await updateArticle(editingArticle._id, {
        title: articleTitle,
        content: articleContent,
        summary: articleSummary,
        category: articleCategory
      });
      setArticleTitle('');
      setArticleContent('');
      setArticleSummary('');
      setArticleCategory('mental-health');
      setEditingArticle(null);
      setSuccess('Article updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      await loadAll();
      setActiveSection('articles');
    } catch (err) {
      setError(err.message || 'Article update failed');
    } finally {
      setLoading(false);
    }
  }

  function onEditArticle(article) {
    setArticleTitle(article.title);
    setArticleContent(article.content);
    setArticleSummary(article.summary || '');
    setArticleCategory(article.category);
    setEditingArticle(article);
    setActiveSection('write-article');
  }

  function cancelEdit() {
    setArticleTitle('');
    setArticleContent('');
    setArticleSummary('');
    setArticleCategory('mental-health');
    setEditingArticle(null);
  }

  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    totalBooks: books.length,
    totalArticles: articles.length,
    totalVideos: videos.length
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users, content, and system settings</p>
        </div>
        <div className="admin-stats-mini">
          <div className="stat-mini">
            <span className="stat-mini-value">{stats.totalUsers}</span>
            <span className="stat-mini-label">Users</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-value">{stats.admins}</span>
            <span className="stat-mini-label">Admins</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-value">{stats.totalBooks}</span>
            <span className="stat-mini-label">Books</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-value">{stats.totalArticles}</span>
            <span className="stat-mini-label">Articles</span>
          </div>
          <div className="stat-mini">
            <span className="stat-mini-value">{stats.totalVideos}</span>
            <span className="stat-mini-label">Videos</span>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="admin-tabs">
        <button 
          className={activeSection === 'users' ? 'active' : ''} 
          onClick={() => setActiveSection('users')}
        >
          <span className="tab-icon">👥</span> Users
        </button>
        <button 
          className={activeSection === 'upload' ? 'active' : ''} 
          onClick={() => setActiveSection('upload')}
        >
          <span className="tab-icon">📤</span> Upload Book
        </button>
        <button 
          className={activeSection === 'books' ? 'active' : ''} 
          onClick={() => setActiveSection('books')}
        >
          <span className="tab-icon">📚</span> Books
        </button>
        <button 
          className={activeSection === 'write-article' ? 'active' : ''} 
          onClick={() => setActiveSection('write-article')}
        >
          <span className="tab-icon">✍️</span> Write Article
        </button>
        <button 
          className={activeSection === 'articles' ? 'active' : ''} 
          onClick={() => setActiveSection('articles')}
        >
          <span className="tab-icon">📝</span> Articles
        </button>
        <button 
          className={activeSection === 'upload-video' ? 'active' : ''} 
          onClick={() => setActiveSection('upload-video')}
        >
          <span className="tab-icon">🎥</span> Upload Video
        </button>
        <button 
          className={activeSection === 'videos' ? 'active' : ''} 
          onClick={() => setActiveSection('videos')}
        >
          <span className="tab-icon">📹</span> Videos
        </button>
      </div>

      {loading && activeSection === 'users' ? (
        <div className="loading-section">Loading users...</div>
      ) : activeSection === 'users' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>User Management</h2>
            <p>View and manage user roles</p>
          </div>
          <div className="users-grid">
            {users.map(u => (
              <div key={u._id} className="user-card">
                <div className="user-avatar-large">
                  {u.name ? u.name[0].toUpperCase() : u.email[0].toUpperCase()}
                </div>
                <div className="user-details">
                  <h3>{u.name || 'No Name'}</h3>
                  <p className="user-email">{u.email}</p>
                  <span className={`role-badge ${u.role}`}>
                    {u.role === 'admin' ? '⚙️ Admin' : '👤 User'}
                  </span>
                </div>
                <div className="user-actions">
                  <label>Change Role</label>
                  <select 
                    value={u.role} 
                    onChange={(e) => onRoleChange(u._id, e.target.value)}
                    className="role-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'upload' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Upload New Book</h2>
            <p>Add resources to the library</p>
          </div>
          <form onSubmit={onUpload} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text"
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Author</label>
                <input 
                  type="text"
                  value={author} 
                  onChange={e => setAuthor(e.target.value)} 
                  placeholder="Enter author name"
                />
              </div>
            </div>
            
            <div className="file-upload-section">
              <div className="file-upload-box">
                <input 
                  type="file" 
                  id="book-file"
                  onChange={e => setFile(e.target.files[0])}
                  accept=".pdf,.epub,.mobi"
                  required
                />
                <label htmlFor="book-file" className="file-upload-label">
                  <span className="upload-icon">📄</span>
                  <span className="upload-text">
                    {file ? file.name : 'Choose Book File (PDF, EPUB, MOBI)'}
                  </span>
                </label>
              </div>
              
              <div className="file-upload-box">
                <input 
                  type="file" 
                  id="cover-file"
                  onChange={e => setCover(e.target.files[0])}
                  accept="image/*"
                />
                <label htmlFor="cover-file" className="file-upload-label">
                  <span className="upload-icon">🖼️</span>
                  <span className="upload-text">
                    {cover ? cover.name : 'Choose Cover Image (Optional)'}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-upload" disabled={loading}>
              {loading ? 'Uploading...' : '📤 Upload Book'}
            </button>
          </form>
        </div>
      )}

      {activeSection === 'books' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Book Library</h2>
            <p>Manage uploaded resources</p>
          </div>
          {books.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📚</span>
              <p>No books uploaded yet</p>
            </div>
          ) : (
            <div className="books-grid">
              {books.map(b => (
                <div key={b._id} className="book-card-admin">
                  {b.coverUrl ? (
                    <img src={b.coverUrl} alt={b.title} className="book-cover-admin" />
                  ) : (
                    <div className="book-cover-placeholder-admin">📚</div>
                  )}
                  <div className="book-info-admin">
                    <h3>{b.title}</h3>
                    {b.author && <p className="book-author-admin">by {b.author}</p>}
                    <p className="book-uploader">Uploaded by {b.uploadedBy?.name || 'Unknown'}</p>
                    <div className="book-actions-admin">
                      <a 
                        href={b.fileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-view"
                      >
                        View
                      </a>
                      <button 
                        onClick={() => onDeleteBook(b._id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'write-article' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>{editingArticle ? 'Edit Article' : 'Write New Article'}</h2>
            <p>{editingArticle ? 'Update the article content' : 'Create and publish articles for the community'}</p>
          </div>
          <form onSubmit={editingArticle ? onUpdateArticle : onCreateArticle} className="article-form">
            <div className="form-group">
              <label>Article Title *</label>
              <input 
                type="text"
                value={articleTitle} 
                onChange={e => setArticleTitle(e.target.value)} 
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select 
                  value={articleCategory}
                  onChange={e => setArticleCategory(e.target.value)}
                >
                  <option value="mental-health">🧠 Mental Health</option>
                  <option value="career">💼 Career</option>
                  <option value="wellness">🌿 Wellness</option>
                  <option value="other">📌 Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Summary</label>
              <textarea
                value={articleSummary} 
                onChange={e => setArticleSummary(e.target.value)} 
                placeholder="Brief summary of the article"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={articleContent} 
                onChange={e => setArticleContent(e.target.value)} 
                placeholder="Write your article content here..."
                rows="10"
                required
              />
              <p className="char-count">{articleContent.length} characters</p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-publish" disabled={loading}>
                {loading ? (editingArticle ? 'Updating...' : 'Publishing...') : (editingArticle ? '💾 Update Article' : '✍️ Publish Article')}
              </button>
              {editingArticle && (
                <button type="button" onClick={cancelEdit} className="btn-cancel">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {activeSection === 'articles' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Articles</h2>
            <p>Manage published articles</p>
          </div>
          {articles.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <p>No articles published yet</p>
            </div>
          ) : (
            <div className="articles-list">
              {articles.map(a => (
                <div key={a._id} className="article-card-admin">
                  <div className="article-header-admin">
                    <h3>{a.title}</h3>
                    <span className={`category-badge ${a.category}`}>{a.category}</span>
                  </div>
                  <p className="article-summary-admin">{a.summary || a.content.substring(0, 100)}...</p>
                  <div className="article-meta-admin">
                    <span>👁️ {a.views || 0} views</span>
                    <span>✍️ {a.author?.name || 'Unknown'}</span>
                    <span>📅 {new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="article-actions-admin">
                    <button className="btn-view-text">View</button>
                    <button 
                      onClick={() => onEditArticle(a)} 
                      className="btn-edit"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => onDeleteArticle(a._id)} 
                      className="btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeSection === 'upload-video' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Upload New Video</h2>
            <p>Add video resources to the library</p>
          </div>
          <form onSubmit={onUploadVideo} className="upload-form">
            <div className="form-row">
              <div className="form-group">
                <label>Title *</label>
                <input 
                  type="text"
                  value={videoTitle} 
                  onChange={e => setVideoTitle(e.target.value)} 
                  placeholder="Enter video title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (e.g., 10:30)</label>
                <input 
                  type="text"
                  value={videoDuration} 
                  onChange={e => setVideoDuration(e.target.value)} 
                  placeholder="MM:SS"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={videoDescription} 
                onChange={e => setVideoDescription(e.target.value)} 
                placeholder="Describe the video content"
                rows="3"
              />
            </div>
            
            <div className="file-upload-section">
              <div className="file-upload-box">
                <input 
                  type="file" 
                  id="video-file"
                  onChange={e => setVideoFile(e.target.files[0])}
                  accept="video/*"
                  required
                />
                <label htmlFor="video-file" className="file-upload-label">
                  <span className="upload-icon">🎥</span>
                  <span className="upload-text">
                    {videoFile ? videoFile.name : 'Choose Video File (MP4, WebM, etc.)'}
                  </span>
                </label>
              </div>
              
              <div className="file-upload-box">
                <input 
                  type="file" 
                  id="video-thumbnail"
                  onChange={e => setVideoThumbnail(e.target.files[0])}
                  accept="image/*"
                />
                <label htmlFor="video-thumbnail" className="file-upload-label">
                  <span className="upload-icon">🖼️</span>
                  <span className="upload-text">
                    {videoThumbnail ? videoThumbnail.name : 'Choose Thumbnail (Optional)'}
                  </span>
                </label>
              </div>
            </div>

            <button type="submit" className="btn-upload" disabled={loading}>
              {loading ? 'Uploading...' : '🎥 Upload Video'}
            </button>
          </form>
        </div>
      )}

      {activeSection === 'videos' && (
        <div className="admin-section">
          <div className="section-header">
            <h2>Video Library</h2>
            <p>Manage uploaded videos</p>
          </div>
          {videos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🎥</span>
              <p>No videos uploaded yet</p>
            </div>
          ) : (
            <div className="books-grid">
              {videos.map(v => (
                <div key={v._id} className="book-card-admin">
                  {v.thumbnailUrl ? (
                    <img src={v.thumbnailUrl} alt={v.title} className="book-cover-admin" />
                  ) : (
                    <div className="book-cover-placeholder-admin">🎥</div>
                  )}
                  <div className="book-info-admin">
                    <h3>{v.title}</h3>
                    {v.duration && <p className="book-author-admin">⏱️ {v.duration}</p>}
                    <p className="book-uploader">Uploaded by {v.uploadedBy?.name || 'Unknown'}</p>
                    <div className="book-actions-admin">
                      <a 
                        href={v.videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-view"
                      >
                        Watch
                      </a>
                      <button 
                        onClick={() => onDeleteVideo(v._id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
