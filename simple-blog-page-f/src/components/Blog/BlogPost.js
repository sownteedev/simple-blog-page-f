import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './BlogPost.css';
import { postService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BlogPost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState(null);
  const [submittingComment, setSubmittingComment] = useState(false);
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const [authorId, setAuthorId] = useState(null);

  useEffect(() => {
    if (user) {
      setAuthorId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postData = await postService.getPost(id);
        setPost(postData);
        
        // Fetch related posts (posts in the same category)
        if (postData && postData.category_id) {
          const allPosts = await postService.getPosts({
            category: postData.category.slug,
            limit: 3
          });
          
          // Filter out the current post and limit to 2 related posts
          const related = allPosts
            .filter(relPost => relPost.id !== parseInt(id))
            .slice(0, 2)
            .map(post => ({
              id: post.id,
              title: post.title,
              image: post.image_url,
              category: post.category.name
            }));
            
          setRelatedPosts(related);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load blog post');
        setLoading(false);
      }
    };

    fetchPost();
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      setCommentError("Comment cannot be empty");
      return;
    }
    try {
      setSubmittingComment(true);
      setCommentError(null);

      // Gửi đúng format: content, post_id, author_id ở cấp cao nhất
      await postService.addComment(id, {
        content: commentText,
        post_id: parseInt(id),
        author_id: authorId
      });

      const updatedPost = await postService.getPost(id);
      setPost(updatedPost);

      setCommentText('');
      setSubmittingComment(false);
    } catch (err) {
      console.error('Error adding comment:', err);
      setCommentError(err.message || 'Failed to add comment. Please try again.');
      setSubmittingComment(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!post) return <div className="error">Post not found</div>;

  return (
    <div className="blog-post-page">
      <div className="blog-post-hero">
        <img src={post.image_url || 'https://source.unsplash.com/1200x600/?blog'} alt={post.title} className="hero-image" />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="post-meta">
            <span className="post-category">{post.category.name}</span>
            <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
            <span className="post-read-time">{post.read_time}</span>
          </div>
          <h1>{post.title}</h1>
        </div>
      </div>

      <div className="blog-post-container">
        <aside className="blog-post-sidebar">
          <div className="author-card">
            <img 
              src={`https://ui-avatars.com/api/?name=${post.author.username}&background=random&size=100`} 
              alt={post.author.username} 
              className="author-image" 
            />
            <h3>{post.author.username}</h3>
            <p>{post.author.email}</p>
            <div className="social-links">
              <a href="#twitter" className="social-link">Twitter</a>
              <a href="#linkedin" className="social-link">LinkedIn</a>
            </div>
          </div>

          <div className="table-of-contents">
            <h3>Table of Contents</h3>
            <ul>
              <li><a href="#challenge">The Challenge</a></li>
              <li><a href="#approach">Our Approach</a></li>
              <li><a href="#initiatives">Key Initiatives</a></li>
              <li><a href="#impact">Impact and Results</a></li>
            </ul>
          </div>
        </aside>

        <article className="blog-post-content">
          <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div className="post-footer">
            <div className="post-tags">
              <span className="tag">{post.category.name}</span>
              <span className="tag">Blog</span>
            </div>
            
            <div className="share-buttons">
              <button className="share-btn twitter">Share on Twitter</button>
              <button className="share-btn linkedin">Share on LinkedIn</button>
            </div>
          </div>
          
          {/* Comments Section */}
          <div className="comments-section">
            <h3 className="comments-title">Comments ({post.comments?.length || 0})</h3>
            
            {/* Comment Form */}
            {isAuthenticated ? (
              <div className="comment-form-container">
                <form onSubmit={handleAddComment} className="comment-form">
                  <div className="comment-form-header">
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=random&size=32`}
                      alt={user.username}
                      className="comment-avatar"
                    />
                    <span className="comment-user-name">{user.username}</span>
                  </div>
                  <div className="comment-form-fields">
                    <textarea
                      name="comment"
                      placeholder="Write your comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      required
                      disabled={submittingComment}
                      className="comment-input"
                    ></textarea>
                  </div>
                  {commentError && <p className="comment-error">{commentError}</p>}
                  <button 
                    type="submit" 
                    className="comment-submit"
                    disabled={submittingComment}
                  >
                    {submittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="comment-login-prompt">
                <p>Please <Link to="/login">login</Link> to leave a comment.</p>
              </div>
            )}
            
            {/* Comments List */}
            <div className="comments-list">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map(comment => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <img 
                        src={`https://ui-avatars.com/api/?name=${comment.author.username}&background=random&size=32`}
                        alt={comment.author.username}
                        className="comment-avatar"
                      />
                      <div className="comment-meta">
                        <span className="comment-author">{comment.author.username}</span>
                        <span className="comment-date">
                          {new Date(comment.created_at).toLocaleDateString()} at {' '}
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet. Be the first to leave a comment!</p>
              )}
            </div>
          </div>
        </article>
      </div>

      {relatedPosts.length > 0 && (
        <div className="related-posts">
          <h2>Related Articles</h2>
          <div className="related-posts-grid">
            {relatedPosts.map(relatedPost => (
              <Link to={`/blog/${relatedPost.id}`} key={relatedPost.id} className="related-post-card">
                <div className="related-post-image">
                  <img src={relatedPost.image || 'https://source.unsplash.com/400x300/?blog'} alt={relatedPost.title} />
                  <span className="related-post-category">{relatedPost.category}</span>
                </div>
                <h3>{relatedPost.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="post-navigation">
        <Link to="/blog" className="back-to-blog">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
};

export default BlogPost; 