// Navigation onglets
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.nav-item.active')?.classList.remove('active');
    item.classList.add('active');

    const tabId = item.dataset.tab;
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  });
});

// Déconnexion
document.querySelector('.logout').addEventListener('click', () => {
  if (confirm("Déconnexion ?")) window.location.href = "../login.html";
});

// ===================== MESSAGERIE =====================
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const fileInput = document.getElementById('fileInput');

function addMessage(content, type = 'sent', file = null) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${type}`;

  const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (file) {
    const icon = file.type.includes('image') ? 'fa-file-image text-blue-600' : 'fa-file-pdf text-red-600';
    msgDiv.innerHTML = `
      <div class="file-msg">
        <i class="fas ${icon} text-2xl"></i>
        <div>
          <p class="font-medium text-sm">${file.name}</p>
          <p class="text-xs text-gray-500">${(file.size/1024).toFixed(1)} Ko</p>
        </div>
      </div>
      <span>${time}</span>
    `;
  } else {
    msgDiv.innerHTML = `<p>${content}</p><span>${time}</span>`;
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chat.scrollHeight;
}

// Envoi message
function sendMessage() {
  const text = messageInput.value.trim();
  if (text) {
    addMessage(text, 'sent');
    messageInput.value = '';
    setTimeout(doctorReply, 1500 + Math.random() * 2000);
  }
}

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') sendMessage();
});

// Envoi fichier
fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) {
    addMessage(null, 'sent', fileInput.files[0]);
    setTimeout(doctorReplyWithFile, 3000);
    fileInput.value = '';
  }
});

// Réponse auto du médecin
function doctorReply() {
  const replies = [
    "Parfait, continuez comme ça !",
    "Je vous envoie la nouvelle ordonnance dans un instant",
    "Prenez bien vos médicaments",
    "On se voit la semaine prochaine ?",
    "Tout va bien de mon côté aussi, merci !"
  ];
  addMessage(replies[Math.floor(Math.random() * replies.length)], 'received');
}

function doctorReplyWithFile() {
  const fakeFile = {
    name: "nouvelle_ordonnance.pdf",
    size: 456789,
    type: "application/pdf"
  };
  addMessage(null, 'received', fakeFile);
}