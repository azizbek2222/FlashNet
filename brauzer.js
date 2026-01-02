const API_KEY = "AIzaSyDbWSvtOGrdO9RsWjMmpbgY1Ttht-O7O8c";
const CX_ID = "9514406a63f704399";

async function loadPage() {
    let urlInput = document.getElementById('url-input');
    let url = urlInput.value.trim();
    let viewport = document.getElementById('browser-viewport');
    let welcome = document.getElementById('welcome-msg');
    let loader = document.getElementById('loader');

    if (url === "") return;

    loader.style.width = "30%";

    // Matn URL yoki qidiruv so'zi ekanini aniqlash
    const isUrl = url.includes('.') && !url.includes(' ');

    if (!isUrl && !url.startsWith('http')) {
        // Shaxsiy qidiruv tizimini ishga tushirish
        welcome.style.display = "none";
        viewport.style.display = "block";
        viewport.src = "about:blank"; // Tozalash
        executeFlashSearch(url);
        return;
    }

    // Linkni ochish
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    welcome.style.display = "none";
    viewport.style.display = "block";
    viewport.srcdoc = ""; 
    viewport.src = url;

    loader.style.width = "100%";
    setTimeout(() => loader.style.width = "0%", 500);
}

async function executeFlashSearch(query) {
    const viewport = document.getElementById('browser-viewport');
    const loader = document.getElementById('loader');
    
    // API so'rovi URL manzili
    const endpoint = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(query)}`;

    loader.style.width = "60%";

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        // Konsolda xatolikni tekshirish uchun
        console.log("Google API javobi:", data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.items && data.items.length > 0) {
            let resultsHtml = data.items.map((item, index) => `
                <div class="result-card" style="animation-delay: ${index * 0.1}s">
                    <a href="${item.link}" target="_blank" class="result-title">${item.title}</a>
                    <div class="result-link">${item.displayLink}</div>
                    <p class="result-desc">${item.snippet}</p>
                </div>
            `).join('');

            const finalUI = `
                <html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    <style>
                        body { background: #0f0f1a; color: white; padding: 30px; font-family: 'Segoe UI', sans-serif; }
                        .result-card { 
                            background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; 
                            margin-bottom: 20px; border: 1px solid rgba(0,210,255,0.1);
                            animation: slideIn 0.5s ease forwards; opacity: 0;
                        }
                        .result-title { color: #00d2ff; text-decoration: none; font-size: 18px; font-weight: bold; }
                        .result-link { color: #28c840; font-size: 12px; margin: 5px 0; }
                        .result-desc { color: #bdc1c6; font-size: 14px; line-height: 1.5; }
                        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                        h2 { border-bottom: 2px solid #00d2ff; padding-bottom: 10px; margin-bottom: 25px; }
                    </style>
                </head>
                <body>
                    <h2><i class="fas fa-search"></i> Natijalar: ${query}</h2>
                    ${resultsHtml}
                </body>
                </html>
            `;
            viewport.srcdoc = finalUI;
        } else {
            viewport.srcdoc = "<body style='background:#0f0f1a;color:white;text-align:center;padding-top:100px;'><h1>Hech narsa topilmadi.</h1></body>";
        }
    } catch (error) {
        console.error("Xatolik tafsiloti:", error);
        viewport.srcdoc = `<body style='background:#0f0f1a;color:red;text-align:center;padding-top:100px;'><h1>Xatolik: ${error.message}</h1></body>`;
    }

    loader.style.width = "100%";
    setTimeout(() => loader.style.width = "0%", 500);
}

// Enter tugmasini bosish
document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPage();
});

function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}

function goHome() {
    document.getElementById('welcome-msg').style.display = "flex";
    document.getElementById('browser-viewport').style.display = "none";
    document.getElementById('url-input').value = "";
}
