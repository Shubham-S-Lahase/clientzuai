import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DOMPurify from "dompurify";
import styles from "./NewPost.module.css";
import { createPost } from "../../services/api";

const NewPostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(DOMPurify.sanitize(e.target.value));
  };

  const handleContentChange = (e) => {
    setContent(DOMPurify.sanitize(e.target.value));
  };

  const validateInputs = () => {
    let errors = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    }
    if (!content.trim()) {
      errors.content = "Content is required";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateInputs();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      await createPost(formData);

      toast.success("Post created successfully!");
      setTitle("");
      setContent("");
      setImage(null);
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to create post.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Create a New Post</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            className={styles.input}
            placeholder="Enter your post title"
          />
          {errors.title && <span className={styles.error}>{errors.title}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="content" className={styles.label}>
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            className={styles.textarea}
            placeholder="Write your post content here"
          />
          {errors.content && (
            <span className={styles.error}>{errors.content}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image" className={styles.label}>
            Upload Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className={styles.inputFile}
            accept="image/*"
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Post
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default NewPostForm;
