const patientsData = {
  "Dupont Marie": { tel: "06 12 34 56 78", adresse: "12 rue des Lilas, 75015 Paris", sang: "O+", lastConsult: "08/12/2025" },
  "Durand Paul": { tel: "06 98 76 54 32", adresse: "45 av. de la République, 69000 Lyon", sang: "A-", lastConsult: "05/12/2025" },
  "Leroy Sophie": { tel: "07 55 44 33 22", adresse: "8 impasse des Roses, 33000 Bordeaux", sang: "AB+", lastConsult: "03/12/2025" }
};

let currentPatient = "";

// === OUVERTURE PATIENT ===
document.querySelectorAll('.patient-row').forEach(row => {
  row.addEventListener('click', () => {
    const name = row.dataset.name;
    const age = row.dataset.age;
    const data = patientsData[name];
    currentPatient = name;

    document.getElementById('patientHeader').textContent = `${name} – ${age} ans`;
    document.getElementById('tel').textContent = data.tel;
    document.getElementById('adresse').textContent = data.adresse;
    document.getElementById('sang').textContent = data.sang;
    document.getElementById('lastConsult').textContent = data.lastConsult;
    document.getElementById('chatName').textContent = name;

    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('patientPage').classList.add('active');
    showTab('historique');
  });
});

// === RETOUR ===
document.getElementById('backBtn').addEventListener('click', () => {
  document.getElementById('patientPage').classList.remove('active');
  document.getElementById('dashboard').classList.add('active');
});

// === ONGLETS ===
document.querySelectorAll('[data-tab]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-tab]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-card').forEach(c => c.classList.remove('active'));
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

function showTab(tabName) {
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
  document.querySelectorAll('.tab-card').forEach(c => c.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
}

// ===================== CHAT AVEC FICHIERS =====================
const chatMessages = document.querySelector('.chat-messages');
const chatInput = document.querySelector('.chat-input input');
const sendBtn = document.querySelector('.chat-input button');

// Bouton pièce jointe
const attachBtn = document.createElement('label');
attachBtn.innerHTML = '<i class="fas fa-paperclip"></i>';
attachBtn.style.cssText = 'cursor:pointer; font-size:1.4rem; color:#27ae60; margin-right:8px;';
attachBtn.title = "Joindre un fichier";

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = ".pdf,.jpg,.jpeg,.png,.doc,.docx";
fileInput.style.display = 'none';
attachBtn.appendChild(fileInput);

chatInput.parentNode.insertBefore(attachBtn, chatInput);

function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return 'fa-file-image text-blue-600';
  if (ext === 'pdf') return 'fa-file-pdf text-red-600';
  if (['doc','docx'].includes(ext)) return 'fa-file-word text-blue-600';
  return 'fa-file text-gray-600';
}

function addMessage(text = null, file = null, type = 'sent') {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${type}`;

  const now = new Date();
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (file) {
    const iconClass = getFileIcon(file.name);
    msgDiv.innerHTML = `
      <div class="file-msg">
        <i class="fas ${iconClass} text-2xl"></i>
        <div>
          <p class="font-medium text-sm">${file.name}</p>
          <p class="text-xs text-gray-500">${(file.size / 1024).toFixed(1)} Ko</p>
        </div>
      </div>
      <span>${time}</span>
    `;
  } else {
    msgDiv.innerHTML = `<p>${text}</p><span>${time}</span>`;
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Envoi texte
function sendMessage() {
  const text = chatInput.value.trim();
  if (text) {
    addMessage(text, null, 'sent');
    chatInput.value = '';
    autoReply();
  }
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// Envoi fichier
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) {
    addMessage(null, fileInput.files[0], 'sent');
    autoReplyWithFile();
    fileInput.value = '';
  }
});

// Réponses auto
function autoReply() {
  setTimeout(() => {
    const replies = ["Merci docteur !", "C’est reçu", "Parfait", "Je prends le traitement", "À bientôt"];
    addMessage(replies[Math.floor(Math.random() * replies.length)], null, 'received');
  }, 1500 + Math.random() * 2000);
}

function autoReplyWithFile() {
  setTimeout(() => {
    const files = ["carte_vitale.jpg", "ordonnance_scan.pdf", "photo_peau.png"];
    const fake = {
      name: files[Math.floor(Math.random() * files.length)],
      size: Math.floor(Math.random() * 900) + 100
    };
    addMessage(null, fake, 'received');
  }, 3000 + Math.random() * 2000);
}

// BOUTON NOUVELLE ORDONNANCE (PLACÉ AU BON ENDROIT !)
document.getElementById('newOrdonnanceBtn')?.addEventListener('click', () => {
  const now = new Date();
  const date = now.toLocaleDateString('fr-FR');
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  addMessage(`Nouvelle ordonnance envoyée le ${date} à ${time}`, null, 'sent');

  const ordonnanceFile = {
    name: `ordonnance_${currentPatient.replaceAll(' ', '_')}_${date.replaceAll('/', '-')}.pdf`,
    size: 342
  };
  addMessage(null, ordonnanceFile, 'sent');

  setTimeout(() => {
    addMessage("Merci docteur ! Je passe à la pharmacie demain", null, 'received');
  }, 2000);
});