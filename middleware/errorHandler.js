const errorHandler = (err, req, res, next) => {
    console.error(`Error details:`, err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // If it's an API request, return JSON
    if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(statusCode).json({
            success: false,
            error: message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }

    // Otherwise, render a clean error response
    res.status(statusCode);
    
    // We can render a error EJS view or send HTML
    return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Error - Ravi's Expense Tracker</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap');
                :root {
                    --light-x: 50%;
                    --light-y: 50%;
                }
                body {
                    font-family: 'Outfit', sans-serif;
                    background: radial-gradient(circle at var(--light-x) var(--light-y), #1e1b4b 0%, #0f172a 40%, #020617 100%);
                }
            </style>
        </head>
        <body class="text-slate-100 min-h-screen flex items-center justify-center p-4">
            <!-- Ethereal Shadows Background -->
            <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <!-- Liquid Fluid SVG Shadow Layer -->
                <div id="liquid-shadow" class="absolute inset-[-50px]" style="filter: url(#ethereal-filter) blur(4px);">
                    <div style="background-color: rgba(244, 63, 94, 0.25); mask-image: url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png'); mask-size: cover; mask-repeat: no-repeat; mask-position: center; width: 100%; height: 100%;"></div>
                </div>
                <!-- Noise Texture Overlay -->
                <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png'); background-size: 200px; background-repeat: repeat;"></div>
            </div>

            <!-- Hidden SVG Filter Definition -->
            <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">
                <defs>
                    <filter id="ethereal-filter">
                        <feTurbulence
                            id="turbulence"
                            result="undulation"
                            numOctaves="2"
                            baseFrequency="0.001,0.004"
                            seed="0"
                            type="turbulence"
                        />
                        <feColorMatrix
                            id="colorMatrix"
                            in="undulation"
                            type="hueRotate"
                            values="0"
                        />
                        <feColorMatrix
                            in="dist"
                            result="circulation"
                            type="matrix"
                            values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="circulation"
                            scale="50"
                            result="dist"
                        />
                        <feDisplacementMap
                            in="dist"
                            in2="undulation"
                            scale="50"
                            result="output"
                        />
                    </filter>
                </defs>
            </svg>

            <div class="max-w-md w-full text-center bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-8 rounded-3xl shadow-2xl z-10 relative">
                <h1 class="text-5xl font-black text-rose-500 mb-4">Oops!</h1>
                <p class="text-xl font-bold text-slate-300 mb-6">${message}</p>
                <div class="text-left bg-slate-950/70 p-4 rounded-xl mb-6 overflow-x-auto text-xs text-rose-400/80 font-mono">
                    Status: ${statusCode}
                    ${process.env.NODE_ENV === 'development' ? '<br>Stack: ' + err.stack : ''}
                </div>
                <a href="/" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25">
                    Return Dashboard
                </a>
            </div>

            <script>
                // Animate the feColorMatrix hueRotate in the liquid background
                const colorMatrix = document.getElementById('colorMatrix');
                let hueVal = 0;
                const animateLiquidShadow = () => {
                    hueVal = (hueVal + 0.15) % 360;
                    if (colorMatrix) {
                        colorMatrix.setAttribute('values', hueVal);
                    }
                    requestAnimationFrame(animateLiquidShadow);
                };
                animateLiquidShadow();

                // Background holographic mouse tracking
                let ticking = false;
                document.addEventListener('mousemove', e => {
                    if (!ticking) {
                        window.requestAnimationFrame(() => {
                            const w = window.innerWidth;
                            const h = window.innerHeight;
                            const xPercent = Math.round((e.clientX / w) * 100);
                            const yPercent = Math.round((e.clientY / h) * 100);
                            
                            document.documentElement.style.setProperty('--light-x', xPercent + '%');
                            document.documentElement.style.setProperty('--light-y', yPercent + '%');
                            ticking = false;
                        });
                        ticking = true;
                    }
                });
            </script>
        </body>
        </html>
    `);
};

module.exports = errorHandler;
