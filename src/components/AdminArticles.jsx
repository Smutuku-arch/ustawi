import React, { useState, useEffect } from 'react';
import { getAllArticlesAdmin, createArticle, updateArticle, deleteArticle } from '../api/articles';
import './AdminArticles.css';

export default function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('general');
  const [published, setPublished] = useState(false);
  const [coverImage, setCoverImage] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    try {
      const data = await getAllArticlesAdmin();
      setArticles(data);
    } catch (err) {
      setError('Failed to load articles');
    }
  }

  function resetForm() {
    setTitle('');
    setContent('');
    setExcerpt('');
    setCategory('general');
    setPublished(false);
    setCoverImage(null);
    setEditingArticle(null);
    setShowForm(false);
  }

  function handleEdit(article) {
    setEditingArticle(article);
    setTitle(article.title);
    setContent(article.content);
    setExcerpt(article.excerpt || '');
    setCategory(article.category);
    setPublished(article.published);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('excerpt', excerpt);
      formData.append('category', category);
      formData.append('published', published);
      if (coverImage) formData.append('coverImage', coverImage);

      if (editingArticle) {
        await updateArticle(editingArticle._id, formData);
      } else {
        await createArticle(formData);
      }

      resetForm();
      await loadArticles();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      await deleteArticle(id);
      await loadArticles();
    } catch (err) {
      setError('Failed to delete article');
    }
  }

  return (
    <div className="admin-articles">
      <div className="articles-header">
        <h1>Manage Articles</h1>
        <button className="btn-new-article" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Article'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="article-form-card">
          <h2>{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="general">General</option>
                  <option value="mental-health">Mental Health</option>
                  <option value="career">Career</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>

              <div className="form-group">
                <label>Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImage(e.target.files[0])}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short description (optional)"
                rows="2"
              />
            </div>

            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content..."
                rows="12"
                required
              />
            </div>

            <div className="form-group-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                />
                Publish article
              </label>
            </div>

            <button type="submit" className="btn-save-article" disabled={loading}>
              {loading ? 'Saving...' : editingArticle ? 'Update Article' : 'Create Article'}
            </button>
          </form>
        </div>
      )}

      <div className="articles-list">
        <h2>All Articles ({articles.length})</h2>
        {articles.length === 0 ? (
          <div className="no-articles">No articles yet. Create your first one!</div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <div key={article._id} className="article-admin-card">
                {article.coverImage && (
                  <img src={article.coverImage} alt={article.title} className="article-thumb" />
                )}
                <div className="article-info">
                  <h3>{article.title}</h3>
                  <p className="article-meta">
                    {article.category} • {article.views} views
                  </p>
                  <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="article-actions">
                  <button className="btn-edit" onClick={() => handleEdit(article)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(article._id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
