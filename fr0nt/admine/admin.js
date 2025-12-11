// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    // Retirer active
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Charger le template
    const tab = item.dataset.tab;
    const template = document.getElementById('tpl-' + tab);
    if (template) {
      document.getElementById('mainContent').innerHTML = template.innerHTML;
    }
  });
});

// Chargement par défaut
document.querySelector('[data-tab="dashboard"]').click();

// Déconnexion
document.querySelector('.logout').addEventListener('click', () => {
  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    window.location.href = "../login.html";
  }
});