<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>JRC-JCoord Documentation</title>

<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

<style>
:root{
    --bg:#05070d;
    --card:#0b1220;
    --border:#1b2d52;
    --blue:#1d6dff;
    --blue2:#00a8ff;
    --text:#ffffff;
    --muted:#9fb2d9;
}

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
    font-family:'Inter',sans-serif;
}

body{
    background:linear-gradient(180deg,#03050a,#070d19);
    color:var(--text);
    line-height:1.7;
}

.container{
    max-width:1200px;
    margin:auto;
    padding:60px 25px;
}

.hero{
    position:relative;
    overflow:hidden;
    border:1px solid var(--border);
    background:linear-gradient(135deg,#08111f,#04060b);
    border-radius:24px;
    padding:70px;
    margin-bottom:40px;
}

.hero::before{
    content:'';
    position:absolute;
    inset:0;
    background:
    radial-gradient(circle at 15% 50%,rgba(29,109,255,.25),transparent 40%),
    radial-gradient(circle at 85% 20%,rgba(0,168,255,.18),transparent 30%);
    pointer-events:none;
}

.badge{
    display:inline-block;
    border:1px solid rgba(29,109,255,.5);
    color:#8fb5ff;
    padding:8px 16px;
    border-radius:999px;
    font-size:.85rem;
    margin-bottom:20px;
}

h1{
    font-size:4rem;
    font-weight:800;
    letter-spacing:-2px;
}

.highlight{
    color:var(--blue);
}

.subtitle{
    color:var(--muted);
    font-size:1.2rem;
    margin-top:10px;
}

.section{
    background:var(--card);
    border:1px solid var(--border);
    border-radius:20px;
    padding:35px;
    margin-bottom:25px;
}

.section h2{
    margin-bottom:20px;
    font-size:1.8rem;
    color:white;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:20px;
}

.feature{
    background:#09111d;
    border:1px solid #17315f;
    padding:25px;
    border-radius:16px;
    transition:.3s;
}

.feature:hover{
    transform:translateY(-5px);
    border-color:var(--blue);
}

.feature h3{
    margin-bottom:10px;
}

.feature p{
    color:var(--muted);
}

.code{
    background:#03060d;
    border:1px solid #163567;
    border-radius:12px;
    padding:18px;
    overflow:auto;
    margin-top:15px;
    color:#7dc0ff;
    font-family:Consolas,monospace;
}

.table{
    width:100%;
    border-collapse:collapse;
}

.table th,
.table td{
    padding:15px;
    border-bottom:1px solid #163567;
    text-align:left;
}

.table th{
    color:#7eb3ff;
}

.footer{
    text-align:center;
    color:var(--muted);
    margin-top:50px;
}

.logo{
    background:linear-gradient(90deg,var(--blue),var(--blue2));
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
}

@media(max-width:768px){
    h1{
        font-size:2.5rem;
    }

    .hero{
        padding:40px 25px;
    }
}
</style>
</head>
<body>

<div class="container">

    <div class="hero">
        <div class="badge">FIVEM SCRIPT</div>

        <h1>JRC-<span class="logo">JCoord</span></h1>

        <p class="subtitle">
            Advanced Coordinate System for FiveM Developers,
            Mappers and Server Administrators.
        </p>
    </div>

    <div class="section">
        <h2>📌 Overview</h2>

        <p>
            JRC-JCoord is a powerful coordinate utility built for FiveM.
            It provides real-time coordinate tracking, heading detection,
            vector copying, favorite locations, and advanced development tools
            through a modern and optimized interface.
        </p>
    </div>

    <div class="section">
        <h2>✨ Features</h2>

        <div class="grid">

            <div class="feature">
                <h3>📍 Live Coordinates</h3>
                <p>Real-time X, Y, Z tracking with instant updates.</p>
            </div>

            <div class="feature">
                <h3>🧭 Heading Detection</h3>
                <p>Get precise player heading and copy instantly.</p>
            </div>

            <div class="feature">
                <h3>📦 Vector Copy</h3>
                <p>Copy Vector3 and Vector4 values with one click.</p>
            </div>

            <div class="feature">
                <h3>⭐ Favorites</h3>
                <p>Save and manage important development locations.</p>
            </div>

            <div class="feature">
                <h3>🔵 Laser Tool</h3>
                <p>Visual placement assistance for mapping projects.</p>
            </div>

            <div class="feature">
                <h3>⚡ Optimized</h3>
                <p>Lightweight, smooth and performance-friendly.</p>
            </div>

        </div>
    </div>

    <div class="section">
        <h2>⌨️ Commands</h2>

        <table class="table">
            <thead>
                <tr>
                    <th>Command</th>
                    <th>Description</th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <td>/jcoord</td>
                    <td>Open coordinate system</td>
                </tr>

                <tr>
                    <td>/coord</td>
                    <td>Open coordinate system</td>
                </tr>

                <tr>
                    <td>/coords</td>
                    <td>Open coordinate system</td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>📦 Vector Examples</h2>

        <h3>Vector3</h3>

        <div class="code">
vector3(-76.44, -816.47, 326.18)
        </div>

        <h3 style="margin-top:20px;">Vector4</h3>

        <div class="code">
vector4(-76.44, -816.47, 326.18, 229.89)
        </div>

        <h3 style="margin-top:20px;">Coordinates</h3>

        <div class="code">
{-76.44, -816.47, 326.18}
        </div>
    </div>

    <div class="section">
        <h2>🚀 Installation</h2>

        <ol style="padding-left:20px;">
            <li>Download the resource.</li>
            <li>Place it inside your resources folder.</li>
            <li>Add the following line to your server.cfg:</li>
        </ol>

        <div class="code">
ensure JRC-JCoord
        </div>

        <p style="margin-top:15px;">
            Restart your server and enjoy.
        </p>
    </div>

    <div class="section">
        <h2>🛠 Compatibility</h2>

        <ul style="padding-left:20px;">
            <li>FiveM</li>
            <li>ESX</li>
            <li>QBCore</li>
            <li>Standalone</li>
        </ul>
    </div>

    <div class="section">
        <h2>🎯 Perfect For</h2>

        <div class="grid">
            <div class="feature">Server Developers</div>
            <div class="feature">Mappers</div>
            <div class="feature">Administrators</div>
            <div class="feature">Interior Builders</div>
            <div class="feature">Vehicle Spawns</div>
            <div class="feature">NPC Placement</div>
        </div>
    </div>

    <div class="section">
        <h2>📄 License</h2>

        <p>
            Copyright © Jericho Script.
            All rights reserved. Unauthorized redistribution,
            resale or modification without permission is prohibited.
        </p>
    </div>

    <div class="footer">
        JRC-JCoord • Developed by Jericho Script
    </div>

</div>

</body>
</html>
