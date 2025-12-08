import React, { useEffect, useState } from 'react';
import { getBooks } from '../api/books';
import { getArticles } from '../api/articles';
import { getVideos } from '../api/videos';
import './Resources.css';

export default function Resources({ activeTab, setActiveTab }) {
  const [books, setBooks] = useState([]);
  const [articles, setArticles] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadResources();
  }, []);

  async function loadResources() {
    setLoading(true);
    try {
      const booksData = await getBooks().catch(() => []);
      const articlesData = await getArticles().catch(() => []);
      const videosData = await getVideos().catch(() => []);
      
      console.log('Loaded resources:', { booksData, articlesData, videosData });
      
      setBooks(booksData || []);
      setArticles(articlesData || []);
      setVideos(videosData || []);
      setError('');
    } catch (err) {
      console.error('Error loading resources:', err);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  }

  function openItem(item, type) {
    if (type === 'video') {
      setSelectedVideo(item);
      setShowModal(true);
    } else if (type === 'book') {
      setActiveTab(`view-book-${item._id}`);
    } else if (type === 'article') {
      setActiveTab(`view-article-${item._id}`);
    }
  }

  function closeModal() {
    setShowModal(false);
    setSelectedVideo(null);
  }

  // Check if we're viewing a specific item
  if (activeTab && activeTab.startsWith('view-book-')) {
    const bookId = activeTab.replace('view-book-', '');
    const book = books.find(b => b._id === bookId);
    
    if (!book) return <div className="loading-resources">Loading...</div>;

    return (
      <div className="resource-viewer-page">
        <div className="viewer-title-bar">
          <h2>{book.title}</h2>
          {book.author && <span style={{ marginLeft: '15px', opacity: 0.9, fontSize: '1rem' }}>by {book.author}</span>}
        </div>
        <div className="pdf-viewer-container-page">
          <object 
            data={book.fileUrl}
            type="application/pdf"
            className="pdf-viewer"
            aria-label={book.title}
          >
            <iframe 
              src={`/pdfjs/viewer.html?file=${encodeURIComponent(book.fileUrl)}`}
              className="pdf-viewer"
              title={book.title}
            />
          </object>
        </div>
      </div>
    );
  }

  if (activeTab && activeTab.startsWith('view-article-')) {
    const articleId = activeTab.replace('view-article-', '');
    const article = articles.find(a => a._id === articleId);
    
    if (!article) return <div className="loading-resources">Loading...</div>;

    return (
      <div className="resource-viewer-page">
        <div className="article-viewer-page">
          <div className="article-viewer-header">
            <span className="article-category-badge">{article.category}</span>
            <h1 style={{ color: 'white', fontSize: '2.5rem', margin: '20px 0' }}>
              {article.title}
            </h1>
            <div className="article-meta">
              <span>👁️ {article.views || 0} views</span>
              <span>✍️ {article.author?.name || 'Unknown'}</span>
              <span>📅 {new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="article-viewer-content">
            {article.summary && (
              <div className="article-summary-box">
                <h3>Summary</h3>
                <p>{article.summary}</p>
              </div>
            )}
            <div className="article-body">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List mode
  const allResources = [
    ...books.map(b => ({ ...b, type: 'book' })),
    ...articles.map(a => ({ ...a, type: 'article' })),
    ...videos.map(v => ({ ...v, type: 'video' }))
  ];

  const filteredResources = filter === 'all' 
    ? allResources 
    : allResources.filter(r => r.type === filter);

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Resource Library</h1>
        <p>Explore our curated collection of articles, books, and videos</p>
      </div>

      <div className="resources-filters">
        <button 
          className={filter === 'all' ? 'active' : ''} 
          onClick={() => setFilter('all')}
        >
          All Resources
        </button>
        <button 
          className={filter === 'book' ? 'active' : ''} 
          onClick={() => setFilter('book')}
        >
          📚 Books
        </button>
        <button 
          className={filter === 'article' ? 'active' : ''} 
          onClick={() => setFilter('article')}
        >
          📝 Articles
        </button>
        <button 
          className={filter === 'video' ? 'active' : ''} 
          onClick={() => setFilter('video')}
        >
          🎥 Videos
        </button>
      </div>

      {loading ? (
        <div className="loading-resources">Loading resources...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredResources.length === 0 ? (
        <div className="no-resources">
          <span className="no-resources-icon">📚</span>
          <p>No resources available yet. Check back soon!</p>
          <button onClick={loadResources} style={{ marginTop: '20px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6b5b95', color: 'white', cursor: 'pointer' }}>
            Retry Loading
          </button>
        </div>
      ) : (
        <div className="resources-grid">
          {filteredResources.map((item) => (
            <div 
              key={`${item.type}-${item._id}`}
              className="resource-card" 
              onClick={() => openItem(item, item.type)}
            >
              {item.type === 'book' && (
                <>
                  {item.coverUrl ? (
                    <img src={item.coverUrl} alt={item.title} className="resource-cover" />
                  ) : (
                    <div className="resource-cover-placeholder">📚</div>
                  )}
                  <div className="resource-content">
                    <span className="resource-type-badge book">Book</span>
                    <h3>{item.title}</h3>
                    {item.author && <p className="resource-author">by {item.author}</p>}
                  </div>
                </>
              )}

              {item.type === 'article' && (
                <div className="resource-content article">
                  <span className="resource-type-badge article">Article</span>
                  <h3>{item.title}</h3>
                  <p className="resource-summary">
                    {item.summary || item.content?.substring(0, 100) + '...'}
                  </p>
                  <span className="resource-meta">👁️ {item.views || 0} views</span>
                </div>
              )}

              {item.type === 'video' && (
                <>
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="resource-cover" />
                  ) : (
                    <div className="resource-cover-placeholder">🎥</div>
                  )}
                  <div className="resource-content">
                    <span className="resource-type-badge video">Video</span>
                    <h3>{item.title}</h3>
                    <p className="resource-duration">⏱️ {item.duration || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && selectedVideo && (
        <div className="resource-modal-overlay" onClick={closeModal}>
          <div className="resource-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{selectedVideo.title}</h2>
            {selectedVideo.description && (
              <p className="modal-description">{selectedVideo.description}</p>
            )}
            {selectedVideo.videoUrl && (
              <video controls className="modal-video" autoPlay>
                <source src={selectedVideo.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </div>
      )}
    </div>
  );
}