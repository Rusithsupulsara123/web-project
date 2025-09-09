import React, { useState, useEffect } from "react";
import PostCard from "../post/postcard"; 
import UploadPost from "../post/UploadPost";
import axios from "axios";

const HomeSection = () => {
  const [posts, setPosts] = useState([]);

  // Fetch posts from backend
  const fetchPosts = () => {
    axios
      .get("http://localhost:5454/api/posts")
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="space-y-5 dark:bg-gray-900">
      {/* Upload Post Form */}
      <br></br>
      <UploadPost onPostCreated={fetchPosts} />

      {/* Posts List */}
      <section className="space-y-4">
        <br></br>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id}
            content={post.content}
            mediaUrl={post.imageUrl || post.mediaUrl}
            mediaType={post.mediaType}
            onEdit={() => {}}
            onDelete={() => {}}
          />
        ))}
      </section>
    </div>
  );
};

export default HomeSection;
