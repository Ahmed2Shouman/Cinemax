function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const toggleButton = document.querySelector('.toggle-btn');
  sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
  toggleButton.style.display = toggleButton.style.display === 'block' ? 'none' : 'block';
}
