const API_KEY = "AIzaSyDbWSvtOGrdO9RsWjMmpbgY1Ttht-O7O8c";
const CX_ID = "9514406a63f704399";

async function loadPage() {
    let urlInput = document.getElementById('url-input');
    let url = urlInput.value.trim();
    let viewport = document.getElementById('browser-viewport');
    let loader = document.getElementById('loader');
    let welcome = document.getElementById('welcome-msg');

    if (url === "") return;

    loader.style.width = "30%";

    // QIDIRUV MANTIG'I: Agar matnda nuqta bo'lmasa yoki nuqta oxirida bo'lmasa
    const isUrl = url.includes('.') && url.split('.').pop().length > 1;

    if (!isUrl && !url.startsWith('http')) {
        // Qidiruvni boshlash
        welcome.style.display = "none";
        viewport.style.display = "block";
        viewport.src = "about:blank"; // Tozalash
        executeFlashSearch(url);
        return;
    }

    // SAYTNI OCHISH MANTIG'I
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    welcome.style.display = "none";
    viewport.style.display = "block";
    viewport.srcdoc = ""; // Avvalgi qidiruv natijasini tozalash
    viewport.src = url;

    loader.style.width = "100%";
    setTimeout(() => loader.style.width = "0%", 500);
}

async function executeFlashSearch(query) {
    const viewport = document.getElementById('browser-viewport');
    const loader = document.getElementById('loader');
    const endpoint = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(query)}`;

    loader.style.width = "60%";

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.items) {
            let resultsHtml = data.items.map((item, index) => `
                <div class="result-item" style="animation: fadeIn 0.4s ease forwards ${index * 0.1}s; opacity: 0; margin-bottom: 25px;">
                    <a href="${item.link}" target="_parent" style="color: #00d2ff; text-decoration: none; font-size: 20px; font-weight: bold; font-family: sans-serif;">${item.title}</a>
                    <div style="color: #28c840; font-size: 13px; margin: 4px 0;">${item.displayLink}</div>
                    <p style="color: #bdc1c6; font-size: 14px; margin: 5px 0; font-family: sans-serif;">${item.snippet}</p>
                </div>
            `).join('');

            const finalUI = `
                <html>
                <head>
                    <style>
                        body { background: #0f0f1a; color: white; padding: 30px; line-height: 1.6; }
                        .header { border-bottom: 2px solid #00d2ff; padding-bottom: 15px; margin-bottom: 30px; font-family: sans-serif; }
                        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>FlashNet Natijalari: "${query}"</h2>
                    </div>
                    ${resultsHtml}
                </body>
                </html>
            `;
            viewport.srcdoc = finalUI;
        } else {
            viewport.srcdoc = "<body style='background:#0f0f1a;color:white;text-align:center;padding-top:100px;font-family:sans-serif;'><h1>Hech narsa topilmadi 😕</h1></body>";
        }
    } catch (error) {
        console.error("Xato:", error);
        viewport.srcdoc = "<body style='background:#0f0f1a;color:red;text-align:center;padding-top:100px;font-family:sans-serif;'><h1>API ulanishda xato!</h1></body>";
    }

    loader.style.width = "100%";
    setTimeout(() => loader.style.width = "0%", 500);
}

function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}

function goHome() {
    document.getElementById('welcome-msg').style.display = "flex";
    document.getElementById('browser-viewport').style.display = "none";
    document.getElementById('url-input').value = "";
}

document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPage();
});
