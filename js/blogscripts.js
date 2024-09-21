if (document.location.pathname.endsWith("blog.html")) {
  const blogContainer = document.getElementById("blog-container");
  const tagsContainer = document.getElementById("tags-container");

  // Get URL parameters to see if we're viewing a specific post
  const urlParams = new URLSearchParams(window.location.search);
  const postFile = urlParams.get("post");

  fetch("posts/posts.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const posts = data.posts;
      if (postFile) {
        const selectedPost = posts.find((post) => post.file === postFile);
        if (selectedPost) {
          renderMarkdown(`posts/${postFile}`, selectedPost.image); // Pass the image URL
        }
      } else {
        const allowedTags = data.allowedTags;

        renderBlogList(posts, allowedTags);
        renderTagsList(allowedTags, posts);
      }
    })
    .catch((err) => {
      blogContainer.innerHTML = `<p>Error loading blog list...</p>`;
      console.error("Error loading posts.json:", err);
    });

  // Function to render the markdown content of a blog post
  function renderMarkdown(filePath, imageUrl) {
    fetch(filePath)
      .then((response) => response.text())
      .then((mdContent) => {
        const postContainer = document.getElementById("post-content");
        const blogContainer = document.getElementById("blog-container"); // Hide blog list, show post content
        blogContainer.style.display = "none";
        postContainer.innerHTML = ""; // Clear previous post content
        postContainer.style.display = "block";

        // Add image at the top of the post
        if (imageUrl) {
          const postImage = document.createElement("img");
          postImage.src = imageUrl;
          postImage.alt = "Post Image";
          postImage.classList.add("post-image"); // Optional: Add a class for styling
          postImage.style.width = "80%"; // Adjust width as needed
          postImage.style.maxWidth = "600px"; // Maximum width
          postImage.style.height = "auto"; // Maintain aspect ratio
          postImage.style.display = "block"; // Center the image
          postImage.style.margin = "0 auto 20px auto";
          postContainer.appendChild(postImage);
        }

        // Convert and render markdown
        const converter = new showdown.Converter();
        const htmlContent = converter.makeHtml(mdContent);
        postContainer.innerHTML += htmlContent; // Append the markdown content
        // Adjust margins for the post content
        postContainer.style.padding = "0 10%"; // Add padding on the left and right
        postContainer.style.marginTop = "20px"; // Add a margin at the top
      })
      .catch((err) => {
        postContainer.innerHTML = `<p>Error loading blog post...</p>`;
        console.error("Error loading markdown file:", err);
      });
  }

  function renderBlogList(posts, allowedTags) {
    const blogContainer = document.getElementById("blog-container");
    blogContainer.innerHTML = ""; // Clear existing content

    const validTags = new Set(allowedTags);

    posts.forEach((post) => {
      // Validate tags
      post.tags = post.tags.filter((tag) => validTags.has(tag));
      if (post.tags.length === 0) {
        console.warn(`Post ${post.title} contains invalid tags.`);
      }

      const postPreview = document.createElement("div");
      postPreview.classList.add("post-preview");

      // Create and append image
      if (post.image) {
        const postImage = document.createElement("img");
        postImage.src = post.image; // Use the image from the JSON
        postImage.alt = post.title;
        postImage.classList.add("post-image"); // Class for styling
        postImage.style.width = "100px"; // Set a width for the image
        postImage.style.height = "auto"; // Maintain aspect ratio
        postImage.style.marginRight = "10px"; // Space between image and text
        postPreview.appendChild(postImage);
      }

      // Create and append title
      const postTitle = document.createElement("h2");
      postTitle.textContent = post.title;
      postPreview.appendChild(postTitle);

      // Create and append description/excerpt
      const postDescription = document.createElement("p");
      postDescription.textContent = post.description;
      postPreview.appendChild(postDescription);

      // Create and append tags
      if (post.tags && Array.isArray(post.tags)) {
        const tagsContainer = document.createElement("div");
        tagsContainer.classList.add("tags-container");

        post.tags.forEach((tag) => {
          const tagElement = document.createElement("span");
          tagElement.classList.add("tag-in-list");
          tagElement.textContent = tag;
          tagsContainer.appendChild(tagElement);
        });

        postPreview.appendChild(tagsContainer); // Append tags at the bottom
      }

      // Add click event to navigate to the post URL
      postPreview.addEventListener("click", () => {
        const postUrl = `?post=${post.file}`;
        window.location.href = postUrl;
      });

      // Append the post preview to the blog container
      blogContainer.appendChild(postPreview);
    });
  }

  function renderTagsList(allowedTags, posts) {
    const tagsContainer = document.getElementById("tags-filter");
    tagsContainer.innerHTML = ""; // Clear existing tags

    const tagsSet = new Set();

    posts.forEach((post) => {
      post.tags.forEach((tag) => tagsSet.add(tag));
    });

    allowedTags.forEach((tag) => {
      if (tagsSet.has(tag)) {
        const tagElement = document.createElement("div");
        tagElement.classList.add("tag");
        tagElement.textContent = tag;

        // Add click event to filter posts by tag
        tagElement.addEventListener("click", () => {
          filterPostsByTag(tag);
        });

        tagsContainer.appendChild(tagElement);
      }
    });
  }

  function filterPostsByTag(selectedTag) {
    console.warn(selectedTag);
    const posts = Array.from(document.querySelectorAll(".post-preview"));
    posts.forEach((post) => {
      const tags = Array.from(post.querySelectorAll(".tag-in-list")).map(
        (tag) => tag.textContent
      );
      if (tags.includes(selectedTag)) {
        post.style.display = "block";
      } else {
        console.warn(post);
        post.style.display = "none";
      }
    });
  }
}
