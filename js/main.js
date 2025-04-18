document.addEventListener("DOMContentLoaded", function () {
  Promise.all([loadNavbar(), loadFooter()])
    .then(() => {
      setActiveLink();
    });
});


function loadNavbar() {
  return fetch("/navbar.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("navbar-placeholder").innerHTML = data;
      initializeDarkMode();
      setupSearchFunctionality();
    })
    .catch((error) => console.error("Error loading navbar:", error));
}

function loadFooter() {
  return fetch("/footer.html")
    .then((response) => response.text())
    .then((data) => {
      document.getElementById("footer-placeholder").innerHTML = data;
    })
    .catch((error) => console.error("Error loading footer:", error));
}

function setActiveLink() {
  const currentUrl = new URL(window.location.href).pathname.replace(/^\/+/, '');
  const navbarLinks = document.querySelectorAll('.navbar-nav .nav-link');

  navbarLinks.forEach(link => {
    const linkHref = new URL(link.href, window.location.origin).pathname.replace(/^\/+/, '');
    if (currentUrl === linkHref || (currentUrl === '' && linkHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const moreDropdown = document.querySelector('.nav-item.dropdown');
  const moreDropdownLinks = moreDropdown?.querySelectorAll('.dropdown-item');

  let isMoreActive = false;
  moreDropdownLinks?.forEach(link => {
    const linkHref = new URL(link.href, window.location.origin).pathname.replace(/^\/+/, '');
    if (currentUrl === linkHref) {
      isMoreActive = true;
    }
  });

  if (isMoreActive) {
    moreDropdown.querySelector('.nav-link').classList.add('active');
  } else {
    moreDropdown.querySelector('.nav-link').classList.remove('active');
  }

  const currentPage = currentUrl.split('/').pop() || 'index.html';
  const sidebarLinks = document.querySelectorAll('#sidebar-placeholder .nav-link');

  sidebarLinks.forEach(link => {
    const linkHref = new URL(link.href, window.location.origin).pathname.split('/').pop();
    if (linkHref === currentPage) {
      link.classList.add('active');
      link.classList.remove('text-white');
    } else {
      link.classList.remove('active');
      link.classList.add('text-white');
    }
  });
}


function toggleDarkMode() {
  const htmlElement = document.documentElement;
  const isDarkMode = document.querySelector("#darkModeToggle").checked;

  htmlElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
  localStorage.setItem("theme", isDarkMode ? "dark" : "light");
}

function loadThemePreference() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-bs-theme", savedTheme);
  const darkModeToggle = document.querySelector("#darkModeToggle");
  if (darkModeToggle) darkModeToggle.checked = savedTheme === "dark";
}

function initializeDarkMode() {
  loadThemePreference();
  const darkModeToggle = document.querySelector("#darkModeToggle");
  if (darkModeToggle) darkModeToggle.addEventListener("change", toggleDarkMode);
}

function setupSearchFunctionality() {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.closest("form").addEventListener("submit", function (event) {
      event.preventDefault();
      searchTutorials();
    });
  }
}

function searchTutorials() {
  const input = document.getElementById("searchInput").value.trim();
  if (input) {
    window.location.href = `/search.html?query=${encodeURIComponent(input)}`;
  }
}


const gaScript = document.createElement('script');
gaScript.async = true;
gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-1K1KMDF6ND';
document.head.appendChild(gaScript);

gaScript.onload = function () {
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', 'G-1K1KMDF6ND');
};


(function () {
  const bootstrapLink = document.createElement('link');
  bootstrapLink.rel = 'stylesheet';
  bootstrapLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/css/bootstrap.min.css';
  bootstrapLink.integrity = 'sha384-SgOJa3DmI69IUzQ2PVdRZhwQ+dy64/BUtbMJw1MZ8t5HZApcHrRKUc4W0kG879m7';
  bootstrapLink.crossOrigin = 'anonymous';

  const head = document.head;

  const metaTags = head.getElementsByTagName('meta');
  if (metaTags.length > 0) {
    head.insertBefore(bootstrapLink, metaTags[metaTags.length - 1].nextSibling);
  } else {
    head.insertBefore(bootstrapLink, head.firstChild);
  }

  const bootstrapScript = document.createElement('script');
  bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.5/dist/js/bootstrap.bundle.min.js';
  bootstrapScript.integrity = 'sha384-k6d4wzSIapyDyv1kpU366/PK5hCdSbCRGRCMv+eplOQJWyd1fbcAu9OCUj5zNLiq';
  bootstrapScript.crossOrigin = 'anonymous';
  bootstrapScript.defer = true;

  window.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(bootstrapScript);
  });
})();
