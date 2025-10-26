document.addEventListener("DOMContentLoaded", () => {
  const postsContainer = document.getElementById("posts-container");

  fetch("posts.json")
    .then(res => res.json())
    .then(posts => {
      postsContainer.innerHTML = "";

      posts.forEach(post => {
        const postCard = document.createElement("article");
        postCard.classList.add("post-card");

        postCard.innerHTML = `
          <h2>${post.titulo}</h2>
          <p class="post-date">📅 ${post.fecha}</p>
          <p>${post.contenido}</p>
        `;

        postsContainer.appendChild(postCard);
      });
    })
    .catch(err => {
      postsContainer.innerHTML = "<p>No se pudieron cargar los posts 😢</p>";
      console.error(err);
    });
});
