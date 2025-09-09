import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import * as Yup from "yup";
import PostCard from "./postcard";
import { useSelector } from "react-redux";

const validationSchema = Yup.object().shape({
  content: Yup.string().required("Description is required"),
  mediaUrl: Yup.string().nullable().required("Upload an image or video"),
});

const API_URL = "http://localhost:5454/posts";

const UploadPost = () => {
  const [posts, setPosts] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedMediaPreview, setSelectedMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const { auth } = useSelector(store => store);

  // Fetch posts from backend on mount
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setPosts(data.reverse())) // reverse to show latest first
      .catch((err) => console.error("Failed to fetch posts", err));
  }, []);

  const formik = useFormik({
    initialValues: {
      content: "",
      mediaUrl: null,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: values.content,
            mediaUrl: values.mediaUrl,
            mediaType: mediaType,
          }),
        });

        if (!response.ok) throw new Error("Failed to save post");

        const savedPost = await response.json();
        setPosts([savedPost, ...posts]);
        resetForm();
        setSelectedMediaPreview(null);
        setMediaType("");
      } catch (error) {
        alert(error.message);
      }
    },
  });

  const uploadToCloudinary = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "mjqmabah");
    data.append("cloud_name", "dhxfhjo5r");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dhxfhjo5r/auto/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const json = await res.json();
    return json.secure_url;
  };

  const handleSelectMedia = async (event) => {
    const mediaFile = event.target.files[0];
    if (!mediaFile) return;

    setUploadingMedia(true);
    const fileType = mediaFile.type;

    if (fileType.startsWith("image/")) {
      setMediaType("image");
    } else if (fileType.startsWith("video/")) {
      setMediaType("video");

      const videoElement = document.createElement("video");
      videoElement.src = URL.createObjectURL(mediaFile);

      await new Promise((resolve, reject) => {
        videoElement.onloadedmetadata = () => {
          if (videoElement.duration > 30) {
            alert("Video duration cannot exceed 30 seconds.");
            setUploadingMedia(false);
            reject("Video too long");
          } else {
            resolve();
          }
        };
      });
    }

    try {
      const uploadedUrl = await uploadToCloudinary(mediaFile);
      formik.setFieldValue("mediaUrl", uploadedUrl);
      setSelectedMediaPreview(uploadedUrl);
    } catch (error) {
      alert("Upload failed. Please try again.");
    }

    setUploadingMedia(false);
  };

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`${API_URL}/${postId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter((post) => post.id !== postId));
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEdit = (postId) => {
    const postToEdit = posts.find((post) => post.id === postId);
    if (!postToEdit) return;

    formik.setFieldValue("content", postToEdit.content);
    formik.setFieldValue("mediaUrl", postToEdit.mediaUrl);
    setSelectedMediaPreview(postToEdit.mediaUrl);
    setMediaType(postToEdit.mediaType);

    // Remove post from list so it won't duplicate on submit
    setPosts(posts.filter((post) => post.id !== postId));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Post Upload Section */}
      <section className="rounded-xl p-4">
        <div className="flex space-x-3">
          <Avatar 
            alt={auth.user?.fullName} 
            src={auth.user?.profilepic} 
            sx={{ width: 40, height: 40 }} 
            className="rounded-full" 
          />

          <div className="w-full">
            <form onSubmit={formik.handleSubmit}>
              {/* Text Input */}
              <div className="relative">
                <div className="relative">
                  <textarea
                    name="content"
                    placeholder="What is happening?"
                    className="w-full min-h-[100px] p-3 text-sm bg-transparent text-gray-800 dark:text-white dark:placeholder-gray-400 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none transition-all duration-200"
                    {...formik.getFieldProps("content")}
                  />
                  <div className="absolute bottom-2 left-2 flex items-center space-x-1 text-gray-400 dark:text-gray-500">
                    <span className="text-xs">Share your thoughts...</span>
                  </div>
                </div>
                {formik.touched.content && formik.errors.content && (
                  <span className="text-red-500 dark:text-red-400 text-xs mt-1 block">{formik.errors.content}</span>
                )}
              </div>

              {/* Media Preview */}
              {selectedMediaPreview && (
                <div className="mt-3 relative group">
                  {mediaType === "image" ? (
                    <div className="relative">
                      <img
                        src={selectedMediaPreview}
                        alt="Preview"
                        className="w-40 rounded-xl border dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMediaPreview(null);
                          formik.setFieldValue("mediaUrl", null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <video
                        src={selectedMediaPreview}
                        controls
                        className="w-40 rounded-xl border dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMediaPreview(null);
                          formik.setFieldValue("mediaUrl", null);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-between items-center mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
                <div className="flex space-x-4 items-center">
                  <label className="flex items-center space-x-2 rounded-md cursor-pointer group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50 dark:group-hover:bg-gray-700 transition-colors duration-200">
                      <ImageIcon className="text-[#1d9bf0] dark:text-blue-400" sx={{ fontSize: 20 }} />
                    </div>
                    <input
                      type="file"
                      name="mediaFile"
                      className="hidden"
                      onChange={handleSelectMedia}
                      accept="image/*,video/*"
                    />
                  </label>
                  <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                    <FmdGoodIcon className="text-[#1d9bf0] dark:text-blue-400" sx={{ fontSize: 20 }} />
                  </div>
                  <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                    <TagFacesIcon className="text-[#1d9bf0] dark:text-blue-400" sx={{ fontSize: 20 }} />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-full px-6 py-1.5 text-sm font-medium hover:bg-blue-700 transition-all duration-200 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={uploadingMedia || !formik.values.content.trim()}
                >
                  {uploadingMedia ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Uploading...</span>
                    </span>
                  ) : (
                    "Post"
                  )}
                </button>
              </div>

              {formik.touched.mediaUrl && formik.errors.mediaUrl && (
                <span className="text-red-500 dark:text-red-400 text-xs mt-1 block">{formik.errors.mediaUrl}</span>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Posts Display Section */}
      <section className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            postId={post.id}
            content={post.content}
            mediaUrl={post.mediaUrl}
            mediaType={post.mediaType}
            username={auth.user?.fullName}
            userAvatarUrl={auth.user?.profilepic}
            onEdit={() => handleEdit(post.id)}
            onDelete={() => handleDelete(post.id)}
          />
        ))}
      </section>
    </div>
  );
};

export default UploadPost;
