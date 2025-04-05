document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('query');
  const resultsContainer = document.getElementById('results');

  function escapeHtml(str) {
    const div = document.createElement('div');
    if (str) {
      div.innerText = str;
      div.textContent = str;
    }
    return div.innerHTML;
  }

  const tutorials = [
    { title: "Python", description: "Learn Python, the most popular programming language for web and data science.", image: "/assets/images/python.png", link: "/learn/python/what_is_python.html" },
    { title: "Ethical Hacking", description: "Secure systems and networks with ethical hacking techniques.", image: "/assets/images/ethical_hacking.png", link: "/learn/ethical_hacking/what_is_ethical_hacking.html" },
  ];

  if (query) {
    const escapedQuery = escapeHtml(query);
    const filteredTutorials = tutorials.filter(tutorial =>
      tutorial.title.toLowerCase().includes(query.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(query.toLowerCase())
    );

    if (filteredTutorials.length > 0) {
      filteredTutorials.forEach(tutorial => {
        const card = `
          <div class="col">
            <div class="card h-100">
              <img src="${tutorial.image}" class="card-img-top" alt="${tutorial.title}">
              <div class="card-body">
                <h5 class="card-title">${tutorial.title}</h5>
                <p class="card-text">${tutorial.description}</p>
                <a href="${tutorial.link}" class="btn btn-primary">Learn ${tutorial.title}</a>
              </div>
            </div>
          </div>
        `;
        resultsContainer.innerHTML += card;
      });
    } else {
      resultsContainer.innerHTML = `<p class="text-center">No results found for "${escapedQuery}"</p>`;
    }
  } else {
    resultsContainer.innerHTML = `<p class="text-center">Please enter a search term.</p>`;
  }
});
