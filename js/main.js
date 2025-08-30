document.addEventListener("DOMContentLoaded", function () {
  Promise.all([loadNavbar(), loadFooter()])
    .then(() => {
      setActiveLink();
      initMobileSidebar();
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
  const currentPage = currentUrl.split('/').pop() || 'index.html';

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
    moreDropdown?.querySelector('.nav-link').classList.add('active');
  } else {
    moreDropdown?.querySelector('.nav-link').classList.remove('active');
  }

  function updateSidebarLinks(container) {
    const sidebarLinks = container.querySelectorAll('.nav-link');
    sidebarLinks.forEach(link => {
      const linkHref = new URL(link.href, window.location.origin).pathname.split('/').pop();

      link.classList.remove('active', 'text-white', 'mobile-active');

      if (linkHref === currentPage) {
        link.classList.add('active');
        if (container.closest('.offcanvas')) {
          link.classList.add('mobile-active');
        }
      } else {
        link.classList.add('text-white');
      }
    });
  }

  const desktopSidebar = document.querySelector('.sidebar-fixed');
  if (desktopSidebar) {
    updateSidebarLinks(desktopSidebar);
  }

  const mobileSidebar = document.querySelector('#offcanvasSidebar');
  if (mobileSidebar) {
    updateSidebarLinks(mobileSidebar);
  }
}

function initMobileSidebar() {
  if (isTouchDevice()) {
    addTouchFeedback();
  }

  const offcanvas = document.getElementById('offcanvasSidebar');
  if (offcanvas) {
    offcanvas.addEventListener('shown.bs.offcanvas', function () {
      setTimeout(() => {
        setActiveLink();
        console.log('Mobile sidebar active states updated');
      }, 100);
    });

    offcanvas.addEventListener('show.bs.offcanvas', function () {
      setActiveLink();
    });
  }

  setupMobileLinkHandlers();
}

function isTouchDevice() {
  return (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0));
}

function addTouchFeedback() {
  const mobileLinks = document.querySelectorAll('.offcanvas .nav-link');

  mobileLinks.forEach(link => {
    link.addEventListener('touchstart', function (e) {
      this.style.transform = 'scale(0.98) translateX(6px)';
      this.style.transition = 'all 0.1s ease';
    }, { passive: true });

    link.addEventListener('touchend', function (e) {
      this.style.transform = '';
      this.style.transition = 'all 0.3s ease';
    }, { passive: true });

    link.addEventListener('touchcancel', function (e) {
      this.style.transform = '';
      this.style.transition = 'all 0.3s ease';
    }, { passive: true });
  });
}

function setupMobileLinkHandlers() {
  const mobileLinks = document.querySelectorAll('.offcanvas .nav-link');

  mobileLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      mobileLinks.forEach(l => {
        l.classList.remove('active', 'mobile-active');
        l.classList.add('text-white');
      });

      this.classList.add('active', 'mobile-active');
      this.classList.remove('text-white');

      setTimeout(() => {
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasSidebar'));
        if (offcanvas) {
          offcanvas.hide();
        }
      }, 300);
    });
  });
}

window.addEventListener('focus', function () {
  if (window.innerWidth <= 991) {
    setTimeout(() => {
      setActiveLink();
    }, 100);
  }
});

window.addEventListener('orientationchange', function () {
  setTimeout(() => {
    setActiveLink();
  }, 300);
});

function debugMobileSidebar() {
  console.log('=== Mobile Sidebar Debug Info ===');
  console.log('Current URL:', window.location.href);
  console.log('Current page:', window.location.pathname.split('/').pop() || 'index.html');
  console.log('Is touch device:', isTouchDevice());
  console.log('Window width:', window.innerWidth);

  const mobileLinks = document.querySelectorAll('.offcanvas .nav-link');
  console.log('Mobile sidebar links found:', mobileLinks.length);

  mobileLinks.forEach((link, index) => {
    console.log(`Link ${index}:`, {
      href: link.href,
      text: link.textContent.trim(),
      classes: link.className,
      active: link.classList.contains('active')
    });
  });
}

window.debugMobileSidebar = debugMobileSidebar;

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

  const fontPreconnect1 = document.createElement('link');
  fontPreconnect1.rel = 'preconnect';
  fontPreconnect1.href = 'https://fonts.googleapis.com';

  const fontPreconnect2 = document.createElement('link');
  fontPreconnect2.rel = 'preconnect';
  fontPreconnect2.href = 'https://fonts.gstatic.com';
  fontPreconnect2.crossOrigin = 'anonymous';

  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap';
  fontLink.rel = 'stylesheet';

  const head = document.head;
  const metaTags = head.getElementsByTagName('meta');

  if (metaTags.length > 0) {
    head.insertBefore(bootstrapLink, metaTags[metaTags.length - 1].nextSibling);
    head.insertBefore(fontPreconnect1, bootstrapLink.nextSibling);
    head.insertBefore(fontPreconnect2, fontPreconnect1.nextSibling);
    head.insertBefore(fontLink, fontPreconnect2.nextSibling);
  } else {
    head.insertBefore(bootstrapLink, head.firstChild);
    head.insertBefore(fontPreconnect1, bootstrapLink.nextSibling);
    head.insertBefore(fontPreconnect2, fontPreconnect1.nextSibling);
    head.insertBefore(fontLink, fontPreconnect2.nextSibling);
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