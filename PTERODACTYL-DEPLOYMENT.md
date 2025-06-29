# 🐳 Pterodactyl Deployment Guide - FIXED

## ❌ Error yang Diperbaiki

**Error sebelumnya:**
```
Error: Cannot find module 'moment-timezone'
```

**✅ Solusi yang diterapkan:**
1. ➕ Menambahkan `moment-timezone` ke dependencies
2. 🛡️ Membuat robust startup wrapper
3. 🔍 Environment validation sebelum start
4. 📦 Script khusus untuk Pterodactyl

---

## 🚀 Langkah Deployment di Pterodactyl

### 1. **Server Configuration**

**Docker Image:** `ghcr.io/parkervcp/yolks:nodejs_24`

**Startup Command:**
```bash
npm run start:pterodactyl
```

**Alternative Startup Commands:**
```bash
# Option 1 (Recommended)
npm run start:pterodactyl

# Option 2
npm install --production && npm start

# Option 3 (Direct)
npm install --production && node start-robust.js
```

### 2. **Environment Variables**

```bash
NODE_ENV=production
TZ=Asia/Jakarta
```

### 3. **Resource Requirements**

```
Memory: 1024 MB (minimum)
Disk: 2048 MB (minimum)
CPU: 100%
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start with robust wrapper |
| `npm run start:direct` | Start directly without wrapper |
| `npm run start:pterodactyl` | Install deps + start (for Pterodactyl) |
| `npm run env-check` | Check environment and dependencies |
| `npm run install-prod` | Install production dependencies only |

---

## 🛡️ Robust Features

### **Environment Check**
- ✅ Node.js version validation (24+)
- ✅ Required files verification
- ✅ Dependencies check
- ✅ Automatic error reporting

### **Error Handling**
- 🔄 Graceful shutdown on errors
- 📝 Detailed error logging
- 💡 Helpful error messages
- 🛠️ Recovery suggestions

### **Startup Process**
1. **Environment Check** - Validate system requirements
2. **Dependency Check** - Ensure all modules are available
3. **Directory Creation** - Create necessary folders
4. **Permission Setup** - Set proper file permissions
5. **Bot Launch** - Start WhatsApp Me Bot

---

## 🐛 Troubleshooting

### **Common Issues & Solutions**

#### **1. Module Not Found Error**
```bash
Error: Cannot find module 'moment-timezone'
```
**Solution:**
```bash
npm run install-prod
# or
npm install --production
```

#### **2. Permission Denied**
```bash
EACCES: permission denied
```
**Solution:**
```bash
npm run fix-permissions
# or
chmod -R 755 .
```

#### **3. Environment Check Failed**
```bash
❌ Environment check failed
```
**Solution:**
```bash
npm run env-check
# Check the output and fix reported issues
```

#### **4. Bot Crashes on Startup**
**Check logs and run:**
```bash
node env-check.js
```

---

## 📋 Deployment Checklist

### **Before Upload:**
- [ ] ✅ All files present in project directory
- [ ] ✅ `package.json` contains all dependencies
- [ ] ✅ `moment-timezone` is in dependencies
- [ ] ✅ Config files are properly configured

### **After Upload:**
- [ ] ✅ Set Docker image to `nodejs_24`
- [ ] ✅ Set startup command to `npm run start:pterodactyl`
- [ ] ✅ Configure environment variables
- [ ] ✅ Allocate sufficient resources (1GB+ RAM)

### **Testing:**
- [ ] ✅ Run environment check: `npm run env-check`
- [ ] ✅ Test startup: `npm start`
- [ ] ✅ Verify QR code appears
- [ ] ✅ Test WhatsApp connection

---

## 🎯 Quick Start Commands

### **For Fresh Deployment:**
```bash
# 1. Upload all files to Pterodactyl
# 2. Set startup command in panel
npm run start:pterodactyl

# 3. Or run manually in console
npm install --production
npm run env-check
npm start
```

### **For Debugging:**
```bash
# Check environment
npm run env-check

# Install dependencies
npm run install-prod

# Test direct start
npm run start:direct
```

---

## 📊 Monitoring

### **Log Locations:**
- **Startup logs:** Console output
- **Bot logs:** `logs/` directory
- **Error logs:** Console + `logs/error.log`

### **Health Checks:**
```bash
# Check if bot is running
ps aux | grep node

# Check memory usage
free -h

# Check disk usage
df -h
```

---

## 🔄 Updates & Maintenance

### **Updating Bot:**
1. Upload new files to server
2. Restart server in Pterodactyl panel
3. Bot will auto-install dependencies

### **Backup Important Files:**
- `data/users.json` - User data
- `data/quiz.json` - Quiz content
- `config/config.js` - Configuration
- `session/` - WhatsApp session (if needed)

---

## ✅ Success Indicators

**Bot is working correctly when you see:**
```
✅ Environment check passed!
✅ Ready to start WhatsApp Me Bot
🤖 Loading main application...
🚀 Starting WhatsApp Bot...
🔗 Scan QR Code di bawah ini untuk login:
[QR CODE APPEARS]
📱 Buka WhatsApp > Linked Devices > Link a Device
```

---

## 🆘 Support

**If you still encounter issues:**

1. **Check Environment:**
   ```bash
   npm run env-check
   ```

2. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install --production
   ```

3. **Manual Dependency Install:**
   ```bash
   npm install moment-timezone --save
   npm install whatsapp-web.js --save
   ```

4. **Contact Support:**
   - Check GitHub Issues
   - Review error logs
   - Provide full error output

---

**🎉 Bot is now ready for production deployment on Pterodactyl!**
