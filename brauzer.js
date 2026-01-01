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
    
    // QIDIRUV MANTIG'I: Agar nuqta bo'lmasa yoki Youtube kabi so'z bo'lsa
    if (!url.includes('.') && !url.startsWith('http')) {
        welcome.style.opacity = "0";
        setTimeout(() => {
            welcome.style.display = "none";
            executeFlashSearch(url);
        }, 500);
        return;
    }

    // SAYTNI OCHISH MANTIG'I
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    welcome.style.opacity = "0";
    setTimeout(() => {
        welcome.style.display = "none";
        viewport.style.display = "block";
        viewport.src = url;
        loader.style.width = "100%";
        setTimeout(() => loader.style.width = "0%", 500);
        urlInput.blur();
    }, 500);
}

async function executeFlashSearch(query) {
    const viewport = document.getElementById('browser-viewport');
    const loader = document.getElementById('loader');
    // API so'rovi
    const endpoint = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX_ID}&q=${encodeURIComponent(query)}`;

    loader.style.width = "60%";

    try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.items) {
            let resultsHtml = data.items.map((item, index) => `
                <div class="result-item" style="animation: fadeIn 0.4s ease forwards ${index * 0.1}s; opacity: 0;">
                    <a href="${item.link}" target="_parent">${item.title}</a>
                    <div class="result-url">${item.displayLink}</div>
                    <p class="result-snippet">${item.snippet}</p>
                </div>
            `).join('');

            const finalUI = `
                <html>
                <head>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    <style>
                        body { 
                            background: #0f0f1a; 
                            color: white; 
                            padding: 40px; 
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            line-height: 1.6;
                        }
                        .header { 
                            border-bottom: 2px solid #00d2ff; 
                            padding-bottom: 15px; 
                            margin-bottom: 30px; 
                            display: flex; 
                            align-items: center; 
                            gap: 15px;
                        }
                        .result-item { margin-bottom: 30px; }
                        .result-item a { 
                            color: #00d2ff; 
                            text-decoration: none; 
                            font-size: 20px; 
                            font-weight: 600; 
                        }
                        .result-item a:hover { text-decoration: underline; }
                        .result-url { color: #28c840; font-size: 13px; margin: 4px 0; }
                        .result-snippet { color: #bdc1c6; font-size: 14px; margin: 5px 0; max-width: 800px; }
                        @keyframes fadeIn { 
                            from { opacity: 0; transform: translateY(15px); } 
                            to { opacity: 1; transform: translateY(0); } 
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <i class="fas fa-search" style="color: #00d2ff; font-size: 24px;"></i>
                        <h2 style="margin:0;">FlashNet Natijalari: "${query}"</h2>
                    </div>
                    ${resultsHtml}
                </body>
                </html>
            `;
            viewport.style.display = "block";
            viewport.srcdoc = finalUI;
        } else {
            viewport.srcdoc = "<body style='background:#0f0f1a;color:white;text-align:center;padding-top:100px;font-family:sans-serif;'><h1>Hech narsa topilmadi 😕</h1><p>Boshqa kalit so'z bilan urinib ko'ring.</p></body>";
        }
    } catch (error) {
        console.error("Xato:", error);
        viewport.srcdoc = "<body style='background:#0f0f1a;color:red;text-align:center;padding-top:100px;font-family:sans-serif;'><h1>API ulanishda xato!</h1><p>Internetni yoki API limitini tekshiring.</p></body>";
    }

    loader.style.width = "100%";
    setTimeout(() => loader.style.width = "0%", 500);
}

function quickLoad(site) {
    document.getElementById('url-input').value = site;
    loadPage();
}

document.getElementById('url-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') loadPage();
});
