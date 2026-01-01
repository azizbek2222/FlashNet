function loadPage() {
    let urlInput = document.getElementById('url-input');
    let url = urlInput.value.trim();
    let viewport = document.getElementById('browser-viewport');
    let loader = document.getElementById('loader');
    let welcome = document.getElementById('welcome-msg');

    if (url === "") return;

    // To'liq link tekshiruvi
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    // Vizual effektlar
    loader.style.width = "40%";
    welcome.style.opacity = "0";
    
    setTimeout(() => {
        welcome.style.display = "none";
        viewport.src = url;
        loader.style.width = "100%";
        
        // Linkni tozalash yoki qisqartirish (ixtiyoriy)
        urlInput.blur(); 
    }, 500);

    // Yuklanish chizig'ini yashirish
    setTimeout(() => {
        loader.style.width = "0%";
    }, 1200);
}

// Tezkor havolalar uchun funksiya
function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}

// Enter tugmasini kuzatish
document.getElementById('url-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        loadPage();
    }
});
