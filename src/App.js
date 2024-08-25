import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar/Navbar.jsx";
import PostList from "./components/posts/PostList.jsx";
import PostDetail from "./components/posts/PostDetails.jsx";
import "./App.css";
import { AuthProvider, useAuth } from "./hooks/useAuth.js"; // Import useAuth
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewPostForm from "./components/newpost/NewPost.jsx";
import Modal from "./components/Modal/Modal.jsx";
import ProtectedRoute from "./components/protectedRoutes/ProtectedRoute.js";

function AppContent() {  // Separate component for App content
  const [scrolled, setScrolled] = useState(false);
  const [isNewPostForm, setIsNewPostForm] = useState(false);
  const { isAuthenticated } = useAuth(); // Get authentication status

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <header className="nav">
        <Navbar scrolled={scrolled} />
      </header>
      <section className="main">
        {isAuthenticated && (
          <div id="post" onClick={() => setIsNewPostForm(true)}>
            Post something!
          </div>
        )}
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/post/:id" element={<ProtectedRoute element={<PostDetail />} />} />
        </Routes>

        <Modal
          isOpen={isNewPostForm}
          onClose={() => setIsNewPostForm(false)}
        >
          <NewPostForm closeModal={() => setIsNewPostForm(false)} />
        </Modal>
      </section>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
