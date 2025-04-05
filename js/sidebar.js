  fetch('sidebar.html')
    .then(response => {
      return response.text();
    })
    .then(data => {
      document.getElementById('sidebar-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading sidebar:', error));
