import { useState, useEffect } from "react";
import axios from "axios";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetch() {
      const loginResult = await axios.post("/auth/login", {
        email: "production@mongodb.com",
        password: 12345,
      });

      const result = await axios.get("/api/posts/newsfeed");
      console.log(result.data);
      setPosts(result.data);
    }
    fetch();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
    </div>
  );
}

export default Posts;
