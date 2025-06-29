# 🚀 Pterodactyl Quick Setup - FIXED VERSION

## ✅ Error Sudah Diperbaiki!

**Error sebelumnya:** `Cannot find module 'moment-timezone'`  
**Status:** ✅ **RESOLVED**

---

## 🎯 Quick Setup (5 Menit)

### **1. Server Settings di Pterodactyl Panel**

```yaml
Docker Image: ghcr.io/parkervcp/yolks:nodejs_20
Startup Command: npm run start:pterodactyl
Working Directory: /home/container
```

### **2. Resource Allocation**

```yaml
Memory: 1024 MB (minimum)
Disk: 2048 MB (minimum)  
CPU: 100%
```

### **3. Environment Variables**

```bash
NODE_ENV=production
TZ=Asia/Jakarta
```

---

## 📁 Upload Files

Upload semua file dari repository ke `/home/container/` di Pterodactyl:

```
✅ package.json (dengan moment-timezone dependency)
✅ index.js
✅ start-robust.js (startup wrapper)
✅ env-check.js (environment validator)
✅ config/ folder
✅ handlers/ folder  
✅ utils/ folder
✅ data/ folder
✅ Semua file lainnya
```

---

## 🚀 Start Server

**Di Pterodactyl Panel:**
1. Klik **"Start"** button
2. Bot akan otomatis:
   - Install dependencies
   - Validate environment
   - Start WhatsApp Bot
3. QR Code akan muncul di console

**Expected Output:**
```
✅ Environment check passed!
✅ Ready to start WhatsApp Me Bot
🤖 Loading main application...
🚀 Starting WhatsApp Bot...
🔗 Scan QR Code di bawah ini untuk login:
[QR CODE MUNCUL]
📱 Buka WhatsApp > Linked Devices > Link a Device
```

---

## 🔧 Manual Commands (Jika Diperlukan)

**Di Console Pterodactyl:**

```bash
# Check environment
npm run env-check

# Install dependencies
npm install --production

# Start bot
npm start

# Alternative startup
npm run start:pterodactyl
```

---

## ✅ Success Checklist

- [ ] ✅ Server created dengan Docker image `nodejs_20` (atau 20+)
- [ ] ✅ Startup command: `npm run start:pterodactyl`
- [ ] ✅ Memory minimal 1GB allocated
- [ ] ✅ Semua file uploaded ke server
- [ ] ✅ Environment variables configured
- [ ] ✅ Server started successfully
- [ ] ✅ QR Code muncul di console
- [ ] ✅ WhatsApp connected

---

## 🆘 Jika Masih Error

**1. Check Dependencies:**
```bash
npm run env-check
```

**2. Reinstall:**
```bash
npm install --production
```

**3. Manual Install:**
```bash
npm install moment-timezone --save
```

**4. Check Logs:**
Lihat console output untuk error details

---

## 📞 Test Bot

Setelah QR Code di-scan dan connected:

1. **Kirim pesan:** `menu`
2. **Expected response:** Menu interaktif muncul
3. **Test payment:** Ketik `payment`
4. **Expected response:** Telegraph link + payment info

---

## 🎉 SELESAI!

Bot WhatsApp Me Bot dengan fitur:
- ✅ Auto-reply system
- ✅ Interactive menu
- ✅ Quiz & polling
- ✅ Telegraph payment page
- ✅ TAM Store payment integration

**Siap digunakan di Pterodactyl Panel!** 🚀

---

**📋 Startup Command untuk Copy-Paste:**
```
npm run start:pterodactyl
```

**🐳 Docker Image untuk Copy-Paste:**
```
ghcr.io/parkervcp/yolks:nodejs_20
```

**🔄 Alternative Docker Images:**
```
ghcr.io/parkervcp/yolks:nodejs_21
ghcr.io/parkervcp/yolks:nodejs_22
```
