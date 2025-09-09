import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareIcon from "@mui/icons-material/Share";
import { useSelector } from "react-redux";

const PostCard = ({
  postId,
  content,
  mediaUrl,
  mediaType,
  username,
  userAvatarUrl,
  onEdit = () => {},
  onDelete = () => {},
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { auth } = useSelector(store => store);
  
  const open = Boolean(anchorEl);

  useEffect(() => {
    const storedLikes = localStorage.getItem(`post-${postId}-liked`);
    const storedLikeCount = localStorage.getItem(`post-${postId}-likeCount`);
    const storedComments = localStorage.getItem(`post-${postId}-comments`);

    if (storedLikes !== null) setLiked(JSON.parse(storedLikes));
    if (storedLikeCount !== null) setLikeCount(Number(storedLikeCount));
    if (storedComments !== null) setComments(JSON.parse(storedComments));
  }, [postId]);

  useEffect(() => {
    localStorage.setItem(`post-${postId}-liked`, JSON.stringify(liked));
    localStorage.setItem(`post-${postId}-likeCount`, likeCount);
  }, [liked, likeCount, postId]);

  useEffect(() => {
    localStorage.setItem(`post-${postId}-comments`, JSON.stringify(comments));
  }, [comments, postId]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    onEdit(postId);
  };

  const handleDelete = () => {
    handleMenuClose();
    if (window.confirm("Are you sure you want to delete this post?")) {
      onDelete(postId);
    }
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((count) => (newLiked ? count + 1 : count - 1));
  };

  const handleToggleCommentBox = () => {
    setShowCommentBox((prev) => !prev);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments((prev) => [...prev, comment.trim()]);
    setComment("");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Post link copied to clipboard!");
  };

  const renderMedia = () => {
    if (!mediaUrl || !mediaType) return null;

    const commonClasses = "w-full max-w-xl border border-gray-300 dark:border-gray-600 rounded-md mt-3";

    return mediaType === "image" ? (
      <img className={commonClasses} src={mediaUrl} alt="Shared post media" />
    ) : mediaType === "video" ? (
      <video className={commonClasses} controls>
        <source src={mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : null;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <article
        className="border border-gray-200 dark:border-gray-700 p-4 rounded-xl"
        role="region"
        aria-labelledby={`post-${postId}-username`}
      >
        <header className="flex items-center space-x-3">
          <Avatar 
            alt={username || auth.user?.fullName} 
            src={userAvatarUrl || auth.user?.profilepic} 
            sx={{ width: 40, height: 40 }} 
          />
          <div className="flex-1">
            <h2 id={`post-${postId}-username`} className="font-semibold dark:text-white text-base">
              {username || auth.user?.fullName}
            </h2>
            <time
              className="text-xs text-gray-500 dark:text-gray-400"
              dateTime={new Date().toISOString()}
            >
              @{(username || auth.user?.fullName)?.toLowerCase().split(" ").join("_")} · just now
            </time>
          </div>
          <IconButton
            aria-label="Post options"
            onClick={handleMenuOpen}
            size="small"
            className="dark:text-gray-300"
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              className: 'dark:bg-gray-800 dark:text-white'
            }}
          >
            <MenuItem onClick={handleEdit} className="dark:text-white dark:hover:bg-gray-700">Edit</MenuItem>
            <MenuItem onClick={handleDelete} className="dark:text-white dark:hover:bg-gray-700">Delete</MenuItem>
          </Menu>
        </header>

        <section className="mt-3">
          <p className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed">{content}</p>
          {renderMedia()}
        </section>

        <section className="flex items-center space-x-6 mt-4 text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200"
            aria-label={liked ? "Unlike post" : "Like post"}
          >
            {liked ? (
              <FavoriteIcon className="text-red-500" sx={{ fontSize: 20 }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 20 }} />
            )}
            <span>{likeCount}</span>
          </button>

          <button
            onClick={handleToggleCommentBox}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200"
            aria-label="Comment on post"
          >
            <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />
            <span>{comments.length}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors duration-200"
            aria-label="Share post"
          >
            <ShareIcon sx={{ fontSize: 20 }} />
          </button>
        </section>

        {showCommentBox && (
          <section className="mt-4 space-y-3 border-t border-gray-100 dark:border-gray-700 pt-3">
            <form onSubmit={handleCommentSubmit} className="flex space-x-2">
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="dark:bg-gray-700"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgb(75, 85, 99)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgb(107, 114, 128)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'rgb(229, 231, 235)',
                    fontSize: '0.875rem',
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgb(156, 163, 175)',
                  },
                }}
              />
              <Button type="submit" variant="contained" color="primary" size="small">
                Post
              </Button>
            </form>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {comments.map((c, i) => (
                <p key={i} className="text-xs bg-gray-100 dark:bg-gray-700 p-2 rounded dark:text-gray-200">
                  {c}
                </p>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

PostCard.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  content: PropTypes.string.isRequired,
  mediaUrl: PropTypes.string,
  mediaType: PropTypes.oneOf(["image", "video"]),
  username: PropTypes.string,
  userAvatarUrl: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default PostCard;
