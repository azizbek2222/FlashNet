function loadPage() {
    let urlInput = document.getElementById('url-input');
    let url = urlInput.value.trim();
    let viewport = document.getElementById('browser-viewport');
    let welcome = document.getElementById('welcome-msg');
    let loader = document.getElementById('loader');

    if (url === "") return;
    loader.style.width = "40%";

    const isUrl = url.includes('.') && !url.includes(' ');

    if (isUrl) {
        url = url.startsWith('http') ? url : 'https://' + url;
        viewport.src = url;
    } else {
        // Google qidiruv igu=1 bilan iframe bloklanishini oldini oladi
        viewport.src = `https://www.google.com/search?q=${encodeURIComponent(url)}&igu=1`;
    }

    welcome.style.display = "none";
    viewport.style.display = "block";
    loader.style.width = "100%";
    setTimeout(() => { loader.style.width = "0%"; }, 500);
}

// Menyuni boshqarish
function toggleMenu() {
    document.getElementById("dropdown-menu").classList.toggle("show");
}

// Desktop versiya simulyatsiyasi
function toggleDesktopMode() {
    document.getElementById('browser-viewport').classList.toggle('desktop-mode');
    toggleMenu();
}

// Developer Tools - Kodni ko'rish
function openDevTools() {
    const viewport = document.getElementById('browser-viewport');
    const display = document.getElementById('code-display');
    const panel = document.getElementById('dev-tools-panel');
    
    let sourceCode = "";
    try {
        // Agar srcdoc (qidiruv natijasi) bo'lsa uni oladi, bo'lmasa xabar beradi
        sourceCode = viewport.srcdoc || "Xavfsizlik qoidalari (CORS) tufayli tashqi sayt kodini ko'rib bo'lmaydi.\nFaqat qidiruv natijalari kodini ko'rish imkoniyati mavjud.";
    } catch (e) {
        sourceCode = "Kodga kirish taqiqlandi.";
    }

    display.textContent = sourceCode;
    panel.style.display = "block";
    toggleMenu();
}

function closeDevTools() {
    document.getElementById('dev-tools-panel').style.display = "none";
}

function goHome() {
    document.getElementById('welcome-msg').style.display = "flex";
    document.getElementById('browser-viewport').style.display = "none";
    document.getElementById('url-input').value = "";
    document.getElementById('browser-viewport').classList.remove('desktop-mode');
}

function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}

document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPage();
});

// Menyu tashqarisini bossa yopish
window.onclick = function(event) {
    if (!event.target.matches('.menu-btn') && !event.target.matches('.fa-ellipsis-v')) {
        document.getElementById("dropdown-menu").classList.remove("show");
    }
}
