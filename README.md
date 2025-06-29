<div align="center">

# 🤖 WhatsApp Me Bot

### *Advanced WhatsApp Business Automation Solution*

[![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-Web.js-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://github.com/pedroslopez/whatsapp-web.js)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Pterodactyl](https://img.shields.io/badge/Deploy-Pterodactyl-0066CC?style=for-the-badge)](https://pterodactyl.io/)

*Solusi otomasi WhatsApp berbasis Node.js dengan fitur lengkap untuk bisnis modern*

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-documentation) • [🐳 Deployment](#-deployment) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 **Mengapa WhatsApp Me Bot?**

WhatsApp Me Bot adalah solusi otomasi WhatsApp yang dirancang khusus untuk meningkatkan efisiensi layanan pelanggan dan engagement bisnis Anda. Dengan arsitektur modular dan fitur-fitur canggih, bot ini siap menghadapi tantangan komunikasi bisnis modern.

## ✨ **Fitur Unggulan**

### 📩 **Smart Auto-Reply System**
- 🎯 **Anti-Spam Protection** - Balas otomatis hanya 1x per user
- 🎲 **Dynamic Responses** - 3+ variasi pesan acak untuk pengalaman natural
- 📝 **Professional Messaging** - Pesan 100+ kata dengan tone bisnis
- ⏰ **Operational Hours Aware** - Informasi jam kerja dan estimasi respon
- 📊 **User Analytics** - Tracking lengkap interaksi pengguna

### 🎛️ **Interactive Menu System**
- 🎨 **Modern UI/UX** - Desain elegan dengan navigasi intuitif
- 📋 **6 Core Modules** - Info Produk, Kontak, Jadwal, FAQ, Kuis, Polling
- 🔢 **Multi-Input Support** - Navigasi via angka, keyword, atau perintah
- 📱 **Mobile Optimized** - Tampilan responsif di semua perangkat

### 🧠 **Gamification Features**
- 🎯 **Interactive Quizzes** - Sistem kuis dengan scoring real-time
- 📊 **Live Polling** - Survei interaktif dengan statistik langsung
- 🏆 **Engagement Rewards** - Sistem reward untuk partisipasi aktif
- 📈 **Analytics Dashboard** - Tracking performa dan partisipasi

### 💳 **Payment Integration**
- 🔍 **Smart Detection** - Auto-detect keyword pembayaran
- 🎨 **Telegraph UI** - Beautiful payment page dengan custom design
- 🏦 **Multi-Method Support** - Bank Transfer, E-Wallet, QRIS
- 📋 **Payment Templates** - Template konfirmasi otomatis
- 🛡️ **Security Guidelines** - Tips keamanan transaksi
- 📱 **Mobile Optimized** - Responsive design untuk semua device

## 🏗️ **Tech Stack**

<div align="center">

| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-24+-339933?style=flat-square&logo=node.js) | 24+ | Runtime Environment |
| ![WhatsApp](https://img.shields.io/badge/WhatsApp--Web.js-1.23+-25D366?style=flat-square&logo=whatsapp) | 1.23+ | WhatsApp API Integration |
| ![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript) | ES2024 | Programming Language |
| ![JSON](https://img.shields.io/badge/JSON-Database-000000?style=flat-square&logo=json) | - | Data Storage |

</div>

### 📦 **Core Dependencies**
- **whatsapp-web.js** - WhatsApp Web API wrapper
- **qrcode-terminal** - QR Code generation for authentication
- **moment-timezone** - Advanced date/time management
- **node-cron** - Task scheduling and automation
- **fs-extra** - Enhanced file system operations

## 🏛️ **Architecture Overview**

```
📁 WhatsApp Me Bot/
├── 🚀 index.js                    # Application Entry Point
├── ⚙️ config/
│   └── config.js                  # Centralized Configuration
├── 🎯 handlers/                   # Feature Handlers
│   ├── menuHandler.js             # Interactive Menu System
│   ├── quizHandler.js             # Quiz & Polling Engine
│   └── paymentHandler.js          # Payment Processing
├── 🛠️ utils/                      # Utility Modules
│   ├── userManager.js             # User Data Management
│   └── messageFormatter.js        # Message Formatting
├── 💾 data/                       # Data Storage
│   ├── users.json                 # User Analytics & Sessions
│   ├── quiz.json                  # Quiz & Poll Content
│   └── backup/                    # Automated Backups
├── 🔐 session/                    # WhatsApp Authentication
├── 📋 package.json                # Project Configuration
└── 📖 README.md                   # Documentation
```

## 🚀 **Quick Start**

### **Prerequisites**
- Node.js 24+ installed
- WhatsApp account
- Terminal/Command Prompt access

### **Installation**

1. **Clone Repository**
   ```bash
   git clone https://github.com/el-pablos/WhatsAppME.git
   cd WhatsAppME
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Validate Setup**
   ```bash
   npm test
   ```

4. **Configure Bot**

   Edit `config/config.js` with your business details:

   ```javascript
   module.exports = {
     bot: {
       name: "Your Business Bot",
       adminOfflineMessage: true,
       maxAutoReplyPerUser: 1,
     },
     operationalHours: {
       start: "08:00",
       end: "17:00",
       timezone: "Asia/Jakarta",
       workDays: [1, 2, 3, 4, 5], // Monday-Friday
     },
     paymentInfo: {
       methods: [
         {
           name: "BCA",
           type: "Bank Transfer",
           account: "YOUR_ACCOUNT_NUMBER",
           accountName: "YOUR_BUSINESS_NAME"
         }
         // Add more payment methods...
       ]
     }
   };
   ```

5. **Launch Bot**
   ```bash
   # Development Mode
   npm run dev

   # Production Mode
   npm start
   ```

6. **Authenticate WhatsApp**
   - Open WhatsApp on your phone
   - Go to **Settings** > **Linked Devices** > **Link a Device**
   - Scan the QR Code displayed in terminal
   - Wait for "✅ WhatsApp Bot ready!" confirmation

### **First Test**
Send a message to your bot number with keyword `menu` to see the interactive menu!

## 🐳 **Deployment**

### **Pterodactyl Panel** (Recommended)

<details>
<summary><b>📋 Step-by-step Pterodactyl Deployment</b></summary>

#### **Server Configuration**
```yaml
Docker Image: node:24-alpine
Startup Command: npm start
Working Directory: /home/container
Memory: 1024 MB (minimum)
Disk Space: 2048 MB (minimum)
```

#### **Environment Variables**
```bash
NODE_ENV=production
TZ=Asia/Jakarta
PORT=3000
```

#### **Deployment Steps**
1. Create new server in Pterodactyl Panel
2. Upload all project files to `/home/container/`
3. Install dependencies: `npm install --production`
4. Configure bot settings in `config/config.js`
5. Start server: `npm start`
6. Scan QR Code for WhatsApp authentication

📖 **Detailed Guide**: See [pterodactyl-setup.md](pterodactyl-setup.md)

</details>

### **Alternative Deployment Options**

<details>
<summary><b>🔧 PM2 Process Manager</b></summary>

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
npm run pm2:start

# Monitor
pm2 monit

# View logs
npm run pm2:logs
```

</details>

<details>
<summary><b>🐋 Docker Deployment</b></summary>

```dockerfile
FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t whatsapp-me-bot .
docker run -d --name whatsapp-bot whatsapp-me-bot
```

</details>

## 📖 **Documentation**

### **User Guide**

| Command | Description | Example |
|---------|-------------|---------|
| `menu` | Display main menu | `menu`, `bantuan`, `help` |
| `1-6` | Select menu option | `1`, `produk`, `kontak` |
| `kuis` | Start quiz | `kuis`, `kuis 1`, `quiz` |
| `poll` | Join polling | `poll`, `poll 1`, `polling` |
| `payment` | Beautiful payment page | `payment`, `bayar`, `pembayaran` |

### **Admin Features**

<details>
<summary><b>🔧 Administrative Functions</b></summary>

- **Auto-Reply Management** - Automatic responses during offline hours
- **User Analytics** - Comprehensive user interaction tracking
- **Data Backup** - Automated backup every 6 hours
- **Session Management** - Quiz and polling session handling
- **Performance Monitoring** - Real-time bot performance metrics

**Data Storage Locations:**
- User data: `data/users.json`
- Quiz content: `data/quiz.json`
- Backups: `data/backup/`
- Logs: `logs/`

</details>

### **API Reference**

<details>
<summary><b>📚 Core Methods & Classes</b></summary>

#### **MenuHandler**
```javascript
handleMenuCommand(message, command)
handleMenuSelection(message, selection)
sendMainMenu(message)
```

#### **QuizHandler**
```javascript
startQuiz(message, quizIndex)
handleQuizAnswer(message, answer)
startPoll(message, pollIndex)
```

#### **PaymentHandler**
```javascript
handlePaymentRequest(message)
formatPaymentInfo()
generateConfirmationTemplate()
```

#### **UserManager**
```javascript
getUser(userId)
incrementAutoReply(userId)
startQuizSession(userId, sessionData)
```

</details>

## ⚙️ **Configuration**

### **Advanced Settings**

<details>
<summary><b>🎨 Customizing Auto-Reply Messages</b></summary>

Edit `config/config.js` to customize auto-reply behavior:

```javascript
autoReplyMessages: [
  `🤖 *Hello! Thank you for contacting us.*

Our admin is currently unavailable. We'll respond within 1-3 business hours.

📋 *While waiting, you can:*
• Check our main menu by typing *menu*
• Read FAQ for common questions
• View our latest products

⏰ *Business Hours:*
Monday - Friday: 08:00 - 17:00 WIB

Thank you for your patience! 🙏`,

  // Add more variations...
]
```

</details>

<details>
<summary><b>⏰ Operational Hours Configuration</b></summary>

```javascript
operationalHours: {
  start: "08:00",           // Start time (24h format)
  end: "17:00",             // End time (24h format)
  timezone: "Asia/Jakarta", // Timezone
  workDays: [1,2,3,4,5]     // Work days (0=Sunday, 1=Monday, etc.)
}
```

</details>

<details>
<summary><b>🧠 Quiz & Poll Content Management</b></summary>

Edit `data/quiz.json` to add/modify quizzes and polls:

```javascript
{
  "quizzes": [
    {
      "id": "custom_quiz",
      "title": "🎯 Your Custom Quiz",
      "description": "Description of your quiz",
      "questions": [
        {
          "id": 1,
          "question": "Your question here?",
          "options": ["A. Option 1", "B. Option 2", "C. Option 3", "D. Option 4"],
          "correct": "A",
          "explanation": "Explanation for the correct answer"
        }
      ]
    }
  ]
}
```

</details>

## 🔧 **Maintenance & Monitoring**

### **Automated Maintenance**
- ✅ **Daily Reset** - Auto-reply counters reset at 00:00
- ✅ **Session Cleanup** - Old sessions (>1 hour) automatically cleaned
- ✅ **Data Backup** - Automated backup every 6 hours
- ✅ **Performance Monitoring** - Real-time resource usage tracking

### **Manual Maintenance**
```bash
# Manual backup
npm run backup

# Validate setup
npm test

# View logs
tail -f logs/combined.log

# Restart with PM2
npm run pm2:restart
```

## 🐛 **Troubleshooting**

<details>
<summary><b>❌ Common Issues & Solutions</b></summary>

### **Bot Not Responding**
```bash
# Check internet connection
ping google.com

# Restart bot
npm start

# Re-authenticate if needed
rm -rf session/ && npm start
```

### **Session Expired**
```bash
# Clear session data
rm -rf session/

# Restart bot
npm start

# Scan new QR Code
```

### **Memory Issues**
```bash
# Monitor memory usage
free -h

# Restart bot
pm2 restart whatsapp-me-bot

# Check for memory leaks
npm run monitor
```

### **Dependency Issues**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Audit dependencies
npm audit fix
```

</details>

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Setup**
```bash
# Fork the repository
git clone https://github.com/your-username/WhatsAppME.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm test

# Commit changes
git commit -m "Add amazing feature"

# Push to branch
git push origin feature/amazing-feature

# Create Pull Request
```

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) - WhatsApp Web API
- [Node.js](https://nodejs.org/) - JavaScript runtime
- [Pterodactyl Panel](https://pterodactyl.io/) - Server management

---

<div align="center">

**Made with ❤️ for modern businesses**

[![GitHub stars](https://img.shields.io/github/stars/el-pablos/WhatsAppME?style=social)](https://github.com/el-pablos/WhatsAppME/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/el-pablos/WhatsAppME?style=social)](https://github.com/el-pablos/WhatsAppME/network/members)

[⭐ Star this repo](https://github.com/el-pablos/WhatsAppME) • [🐛 Report Bug](https://github.com/el-pablos/WhatsAppME/issues) • [💡 Request Feature](https://github.com/el-pablos/WhatsAppME/issues)

</div>
