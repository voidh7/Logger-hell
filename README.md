# Logger Hell


## 📥 Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/voidh7/Logger-hell && cd Logger-hell
npm install
```

## ▶️ Running the Logger

Start the logger locally:

```bash
node index.loggergger
```

By default, it will run on port `3000`.

---

## 🌐 Hosting with Ngrok

You can expose your logger to the internet using **Ngrok**.

### 1. Install Ngrok

If you don't have Ngrok installed yet:

```bash
npm install -g ngrok
```

Or download it from: [https://ngrok.com/download](https://ngrok.com/download)

### 2. Authenticate (First Time Only)

Get your auth token from [https://dashboard.ngrok.com/get-started/setup](https://dashboard.ngrok.com/get-started/setup)

Then run:

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

### 3. Start Ngrok

With your logger already running (`node index.js`), open a new terminal and run:

```bash
ngrok http 3000
```

You’ll see something like:

```
Forwarding http://xxxxxx.ngrok.io -> http://localhost:3000
```

That public link is now accessible to anyone — you can use it to test your logger remotely.

---

## 📌 Example Usage

Send the `ngrok.io` link to the target and wait for a connection on your terminal.

## ⚠️ Legal Disclaimer

This project is for **educational and research purposes only**.

The author is **not responsible** for any misuse, damage, or illegal activities caused by this code.  
**Use it at your own risk.**

> Unauthorized use against others may lead to **legal consequences** or **account bans**.
