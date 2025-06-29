# 🐳 Panduan Deployment di Pterodactyl Panel

Panduan lengkap untuk deploy WhatsApp Bot di Pterodactyl Panel dengan Node.js 24.

## 📋 Persyaratan

- ✅ Akses ke Pterodactyl Panel
- ✅ Server dengan minimal 1GB RAM
- ✅ Node.js 20+ support (16+ minimum)
- ✅ Port yang tersedia untuk aplikasi

## 🚀 Langkah-langkah Deployment

### 1. Buat Server Baru

**Server Settings:**
```
Name: WhatsApp Me Bot
Description: WhatsApp Bot dengan fitur lengkap
Docker Image: node:20-alpine
Startup Command: npm start
```

**Resource Allocation:**
```
Memory: 1024 MB (minimum)
Disk Space: 2048 MB (minimum)
CPU Limit: 100%
```

### 2. Konfigurasi Environment

**Environment Variables:**
```bash
NODE_ENV=production
TZ=Asia/Jakarta
PORT=3000
```

**Startup Configuration:**
```bash
# Startup Command
npm start

# Working Directory
/home/container

# Stop Command
^C
```

### 3. Upload Project Files

Upload semua file project ke server:

```
📁 Upload ke /home/container/
├── 📄 index.js
├── 📄 package.json
├── 📁 config/
├── 📁 handlers/
├── 📁 utils/
├── 📁 data/
└── 📄 README.md
```

### 4. Install Dependencies

Jalankan di console Pterodactyl:

```bash
# Install dependencies
npm install --production

# Verify installation
npm list --depth=0

# Check Node.js version
node --version
```

### 5. Konfigurasi Bot

Edit `config/config.js` sesuai kebutuhan server:

```javascript
module.exports = {
  bot: {
    name: "WhatsApp Me Bot",
    version: "1.0.0",
    adminOfflineMessage: true,
    maxAutoReplyPerUser: 1,
  },
  
  operationalHours: {
    start: "08:00",
    end: "17:00",
    timezone: "Asia/Jakarta", // Sesuaikan timezone server
    workDays: [1, 2, 3, 4, 5],
  },
  
  // Sesuaikan info pembayaran
  paymentInfo: {
    methods: [
      {
        name: "BCA",
        type: "Bank Transfer", 
        account: "GANTI_DENGAN_NOMOR_REKENING",
        accountName: "GANTI_DENGAN_NAMA_PENERIMA"
      }
    ]
  }
};
```

### 6. Start Bot

```bash
# Start bot
npm start

# Bot akan menampilkan QR Code untuk login WhatsApp
```

### 7. Login WhatsApp

1. **Buka WhatsApp** di smartphone
2. **Pilih Menu** > **Linked Devices**
3. **Tap "Link a Device"**
4. **Scan QR Code** yang muncul di console Pterodactyl
5. **Tunggu konfirmasi** "WhatsApp Bot siap digunakan!"

## 🔧 Konfigurasi Lanjutan

### Auto-Restart Configuration

**Pterodactyl Startup Settings:**
```json
{
  "startup": "npm start",
  "stop": "^C",
  "logs": {},
  "environment": {
    "NODE_ENV": "production",
    "TZ": "Asia/Jakarta"
  }
}
```

### Memory Management

**Recommended Settings:**
```
Memory Limit: 1024 MB
Memory Overallocation: 0%
Swap: 512 MB
```

### Disk Space Management

**File Structure:**
```
/home/container/
├── node_modules/     (~200MB)
├── session/          (~50MB)
├── data/            (~10MB)
├── logs/            (~50MB)
└── project files    (~10MB)
```

## 📊 Monitoring & Maintenance

### 1. Log Monitoring

**Console Output:**
```bash
# Real-time logs
tail -f /home/container/logs/app.log

# Error logs
grep "ERROR" /home/container/logs/app.log
```

### 2. Performance Monitoring

**Memory Usage:**
```bash
# Check memory usage
free -h

# Check Node.js process
ps aux | grep node
```

### 3. Backup Strategy

**Automated Backup (Cron Job):**
```bash
# Backup data setiap 6 jam (sudah built-in di bot)
# Manual backup jika diperlukan:
cp -r data/ backup/data_$(date +%Y%m%d_%H%M%S)/
```

## 🛠️ Troubleshooting

### Bot Tidak Start

**Cek Dependencies:**
```bash
npm install --production
npm audit fix
```

**Cek Node.js Version:**
```bash
node --version  # Harus 20+
npm --version
```

### Session Issues

**Reset Session:**
```bash
# Hapus session lama
rm -rf session/

# Restart bot
npm start

# Scan QR Code baru
```

### Memory Issues

**Monitor Memory:**
```bash
# Cek penggunaan memory
free -h
ps aux --sort=-%mem | head

# Restart jika perlu
npm start
```

### Port Issues

**Cek Port Usage:**
```bash
# Cek port yang digunakan
netstat -tulpn | grep :3000

# Kill process jika perlu
pkill -f "node"
```

## 🔒 Security Best Practices

### 1. File Permissions
```bash
# Set proper permissions
chmod 755 /home/container/
chmod 644 /home/container/*.js
chmod 600 /home/container/config/config.js
```

### 2. Environment Security
```bash
# Jangan expose sensitive data di logs
# Gunakan environment variables untuk data sensitif
export ADMIN_PHONE="+628123456789"
export BOT_NAME="Your Bot Name"
```

### 3. Session Security
```bash
# Backup session secara berkala
# Jangan share session files
# Monitor login activities
```

## 📈 Optimization Tips

### 1. Performance
- Gunakan `--production` flag saat install
- Monitor memory usage secara berkala
- Restart bot setiap 24 jam untuk optimal performance

### 2. Reliability
- Setup auto-restart di Pterodactyl
- Monitor logs untuk error patterns
- Backup data secara rutin

### 3. Scalability
- Monitor jumlah user aktif
- Upgrade resources jika diperlukan
- Optimize database queries

## 📞 Support & Maintenance

### Regular Maintenance Tasks

**Daily:**
- ✅ Cek status bot
- ✅ Monitor memory usage
- ✅ Review error logs

**Weekly:**
- ✅ Backup data
- ✅ Update dependencies (jika ada)
- ✅ Clean old logs

**Monthly:**
- ✅ Review performance metrics
- ✅ Update bot features
- ✅ Security audit

### Emergency Procedures

**Bot Crash:**
1. Check logs: `tail -f logs/error.log`
2. Restart: `npm start`
3. Monitor: Watch for recurring issues

**High Memory Usage:**
1. Check processes: `ps aux --sort=-%mem`
2. Restart bot: `npm start`
3. Monitor: Upgrade resources if needed

**Session Expired:**
1. Delete session: `rm -rf session/`
2. Restart bot: `npm start`
3. Re-scan QR Code

---

**🎉 Bot siap digunakan di Pterodactyl Panel!**

Untuk support lebih lanjut, cek dokumentasi di README.md atau hubungi developer.
