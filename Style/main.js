function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const icon = document.querySelector('.sidebar-icon');
  sidebar.style.display = sidebar.style.display === 'flex' ? 'none' : 'flex';
}
