// Affichage des étapes
function showSignup() {
  document.getElementById('signupStep').classList.add('active');
  document.getElementById('loginStep').classList.remove('active');
  document.getElementById('qrStep').classList.remove('active');
}
function showLogin() {
  document.getElementById('loginStep').classList.add('active');
  document.getElementById('signupStep').classList.remove('active');
  document.getElementById('qrStep').classList.remove('active');
}
function showQr(qrUrl) {
  document.getElementById('qrImage').src = qrUrl;
  document.getElementById('qrStep').classList.add('active');
  document.getElementById('signupStep').classList.remove('active');
  document.getElementById('loginStep').classList.remove('active');
}

// Champs spécifiques pour médecin / chef
document.getElementById('signupRole').addEventListener('change', function() {
  if(this.value === 'medcin') {
    document.getElementById('signupSpecialite').style.display = 'block';
    document.getElementById('signupService').style.display = document.getElementById('signupIsChef').checked ? 'block' : 'none';
  } else {
    document.getElementById('signupSpecialite').style.display = 'none';
    document.getElementById('signupService').style.display = 'none';
  }
});

document.getElementById('signupIsChef').addEventListener('change', function() {
  document.getElementById('signupService').style.display = this.checked ? 'block' : 'none';
});

// ---------------- SIGNUP ----------------
async function signup() {
  const data = {
    username: document.getElementById('signupUsername').value,
    email: document.getElementById('signupEmail').value,
    password: document.getElementById('signupPassword').value,
    type: document.getElementById('signupRole').value,
    specialite: document.getElementById('signupSpecialite').value,
    isChef: document.getElementById('signupIsChef').checked,
    service: document.getElementById('signupService').value,
    mfaEnabled: document.getElementById('signupMfaEnabled').checked
  };

  try {
    const res = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if(res.ok) {
      if(result.mfaQR) {
        showQr(result.mfaQR);
      } else {
        showLogin();
      }
    } else {
      document.getElementById('signupMessage').innerText = result.error;
    }
  } catch(err) {
    document.getElementById('signupMessage').innerText = err.message;
  }
}

// ---------------- LOGIN ----------------
async function login() {
  const data = {
  email: document.getElementById('loginEmail').value,
  password: document.getElementById('loginPassword').value
};

// Ajouter code seulement si l’input existe et n’est pas vide
const codeInput = document.getElementById('loginMfaCode');
if (codeInput && codeInput.value) {
  data.code = codeInput.value;
}

  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();

    if(res.ok) {
      alert(`Login réussi pour ${result.user.username}`);
      // stocker token si nécessaire : localStorage.setItem('token', result.token);
    } else {
      document.getElementById('loginMessage').innerText = result.error;

      // si erreur MFA, afficher le champ MFA
      if(result.error.includes('MFA')) {
        document.getElementById('loginMfaContainer').style.display = 'block';
      }
    }
  } catch(err) {
    document.getElementById('loginMessage').innerText = err.message;
  }
}
