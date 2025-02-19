import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use a space-themed image URL instead of local file
const SPACE_IMAGE = 'https://images.nasa.gov/images/as11-40-5874~orig.jpg';

interface NewsArticle {
  id: number;
  title: string;
  url: string;
  imageUrl: string;
  summary: string;
  publishedAt: string;
  newsSite: string;
}

// Add a date formatter function
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Date not available';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Date not available';
  }
};

const SpaceNews: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://api.spaceflightnewsapi.net/v4/articles?limit=10', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.results && Array.isArray(data.results)) {
          // Override all article images with space image
          const articlesWithLocalImage = data.results.map(article => ({
            ...article,
            imageUrl: SPACE_IMAGE
          }));
          setArticles(articlesWithLocalImage);
        } else {
          setArticles([{
            id: 1,
            title: "Space Exploration",
            url: "https://nasa.gov",
            imageUrl: SPACE_IMAGE,
            summary: "Discover the latest in space exploration and astronomical findings.",
            publishedAt: new Date().toISOString(),
            newsSite: "Space Explorer"
          }]);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Unable to load space news. Showing backup content.');
        setArticles([{
          id: 1,
          title: "Space Exploration",
          url: "https://nasa.gov",
          imageUrl: SPACE_IMAGE,
          summary: "Discover the latest in space exploration and astronomical findings.",
          publishedAt: new Date().toISOString(),
          newsSite: "Space Explorer"
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = SPACE_IMAGE;  // Use space image as fallback
    e.currentTarget.onerror = null;
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white' 
      }}>
        Loading space news...
      </div>
    );
  }

  return (
    <div style={{ 
      width: "100vw",
      minHeight: "100vh",
      background: "black",
      position: "relative",
      overflow: "hidden"
    }}>
      <div className="stars" />
      <div className="twinkling" />

      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 15px",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          zIndex: 1000,
        }}
      >
        ⬅ Back to Stars
      </button>

      <div style={{ 
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 1
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          marginTop: '60px',
          color: '#64ffda'
        }}>
          Space News
        </h1>

        {error && (
          <div style={{
            textAlign: 'center',
            color: '#ff6b6b',
            marginBottom: '20px',
            padding: '10px',
            background: 'rgba(255, 107, 107, 0.1)',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          padding: '20px'
        }}>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '15px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
              onClick={() => window.open(article.url, '_blank')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                overflow: 'hidden'
              }}>
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  onError={handleImageError}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.3s ease'
                  }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h3 style={{ 
                  marginBottom: '10px',
                  color: '#64ffda' 
                }}>
                  {article.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9em',
                  marginBottom: '10px',
                  opacity: 0.7 
                }}>
                  {article.newsSite} • {formatDate(article.publishedAt)}
                </p>
                <p style={{ 
                  fontSize: '0.95em',
                  lineHeight: '1.5' 
                }}>
                  {article.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpaceNews; 