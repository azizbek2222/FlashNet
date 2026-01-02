function loadPage() {
    let urlInput = document.getElementById('url-input');
    let url = urlInput.value.trim();
    let viewport = document.getElementById('browser-viewport');
    let welcome = document.getElementById('welcome-msg');
    let loader = document.getElementById('loader');

    if (url === "") return;

    loader.style.width = "40%";

    // URL yoki oddiy so'z ekanini aniqlash
    const isUrl = url.includes('.') && !url.includes(' ');

    if (isUrl) {
        // SAYTNI OCHISH
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        welcome.style.display = "none";
        viewport.style.display = "block";
        viewport.src = url;
    } else {
        // GOOGLE QIDIRUV (Natija aynan Googleda chiqadi)
        welcome.style.display = "none";
        viewport.style.display = "block";
        
        // Iframe ichida Google qidiruv natijalarini chiqarish uchun havola
        viewport.src = `https://www.google.com/search?q=${encodeURIComponent(url)}&igu=1`;
    }

    loader.style.width = "100%";
    setTimeout(() => {
        loader.style.width = "0%";
    }, 500);
}

// Enter tugmasi bosilganda
document.getElementById('url-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') loadPage();
});

// Uyga qaytish
function goHome() {
    document.getElementById('welcome-msg').style.display = "flex";
    document.getElementById('browser-viewport').style.display = "none";
    document.getElementById('url-input').value = "";
}

// Tezkor yuklash
function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}
