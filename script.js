let balance = parseInt(localStorage.getItem('balance')) || 2000; // LocalStorage'dan bakiye oku veya 2000'e ayarla
let webhookUrl = "https://discord.com/api/webhooks/1261700539175927838/vFMgOQHI31qt9pjv8g2xUmNA3kK3cBVIRy1dQiPHJTRwzvKWdAa6ky93nqLd_fKPbzsQ";
let usedCodes = JSON.parse(localStorage.getItem('usedCodes')) || []; // LocalStorage'dan kullanılan kodları oku veya boş diziye ayarla

document.addEventListener('DOMContentLoaded', (event) => {
  updateBalance();
});

function deposit() {
  let depositCode = document.getElementById('depositCode').value;

  if (usedCodes.includes(depositCode)) {
    showAlert("Bu kod zaten kullanıldı.");
    return;
  }

  let amount = 0;

  switch (depositCode) {
    case '123':
      amount = 1000;
      break;
    case '999':
      amount = 2000;
      break;
    case '300':
      amount = 500;
      break;
      case 'admin':
      amount = 1000000000;
      break;
    default:
      showAlert("Geçersiz yatırma kodu.");
      return;
  }

  usedCodes.push(depositCode);
  localStorage.setItem('usedCodes', JSON.stringify(usedCodes)); // Kullanılan kodları kaydet

  balance += amount;
  updateBalance();
  showAlert(`${amount} para başarıyla yatırıldı. Şimdiki Bakiye: ${balance} para`);
}

function sendMessage() {
  let message = document.getElementById('message').value;
  let fileInput = document.getElementById('fileInput');
  let file = fileInput.files[0];

  if (!message.trim() && !file) {
    showAlert("Lütfen bir mesaj veya fotoğraf seçin.");
    return;
  }

  let formData = new FormData();
  formData.append('content', message);

  if (file) {
    formData.append('file', file, file.name);
  }

  if (message.trim()) {
    balance -= 300; // Mesaj göndermek 300 para düşüyor
    updateBalance();
  }

  fetch(webhookUrl, {
    method: "POST",
    body: formData
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    return response.json();
  })
  .then(data => {
    showAlert("Mesaj ve/veya fotoğraf başarıyla Discord'a gönderildi.");
  })
  .catch(error => {
    showAlert("Discord'a gönderirken hata oluştu: " + error.message);
  });
}

function updateBalance() {
  let balanceAmount = document.getElementById('balanceAmount');
  balanceAmount.textContent = balance;
  localStorage.setItem('balance', balance); // Yeni bakiyeyi kaydet
}

function showAlert(message) {
  let alertDiv = document.getElementById('alert');
  alertDiv.textContent = message;
  alertDiv.style.display = 'block';

  setTimeout(() => {
    alertDiv.style.display = 'none';
  }, 3000); // 3 saniye sonra alert kaybolacak
}
