/**
 * User Manager - Mengelola data user dan session
 */

const fs = require('fs-extra');
const path = require('path');
const config = require('../config/config');

class UserManager {
  constructor() {
    this.dataFile = config.files.userData;
    this.data = this.loadUserData();
  }

  /**
   * Load user data dari file JSON
   */
  loadUserData() {
    try {
      if (!fs.existsSync(this.dataFile)) {
        // Create default data structure
        const defaultData = {
          autoReplySent: {},
          userSessions: {},
          quizSessions: {},
          pollSessions: {},
          userStats: {}
        };
        this.saveUserData(defaultData);
        return defaultData;
      }
      return fs.readJsonSync(this.dataFile);
    } catch (error) {
      console.error('❌ Error loading user data:', error);
      return {
        autoReplySent: {},
        userSessions: {},
        quizSessions: {},
        pollSessions: {},
        userStats: {}
      };
    }
  }

  /**
   * Save user data ke file JSON
   */
  saveUserData(data = null) {
    try {
      const dataToSave = data || this.data;
      fs.ensureDirSync(path.dirname(this.dataFile));
      fs.writeJsonSync(this.dataFile, dataToSave, { spaces: 2 });
    } catch (error) {
      console.error('❌ Error saving user data:', error);
    }
  }

  /**
   * Get user data
   */
  getUser(userId) {
    if (!this.data.userStats[userId]) {
      this.data.userStats[userId] = {
        firstContact: Date.now(),
        lastContact: Date.now(),
        messageCount: 0,
        autoReplySent: 0,
        quizzesTaken: 0,
        pollsParticipated: 0
      };
    }
    
    // Update last contact
    this.data.userStats[userId].lastContact = Date.now();
    this.data.userStats[userId].messageCount++;
    
    this.saveUserData();
    return this.data.userStats[userId];
  }

  /**
   * Increment auto-reply counter
   */
  incrementAutoReply(userId) {
    if (!this.data.autoReplySent[userId]) {
      this.data.autoReplySent[userId] = 0;
    }
    
    this.data.autoReplySent[userId]++;
    
    // Update user stats
    const user = this.getUser(userId);
    user.autoReplySent++;
    
    this.saveUserData();
  }

  /**
   * Reset daily auto-reply counters
   */
  resetDailyCounters() {
    this.data.autoReplySent = {};
    this.saveUserData();
    console.log('✅ Daily auto-reply counters reset');
  }

  /**
   * Start quiz session
   */
  startQuizSession(userId, sessionData) {
    this.data.quizSessions[userId] = {
      ...sessionData,
      startTime: Date.now()
    };
    
    // Update user stats
    const user = this.getUser(userId);
    user.quizzesTaken++;
    
    this.saveUserData();
  }

  /**
   * Get quiz session
   */
  getQuizSession(userId) {
    return this.data.quizSessions[userId] || null;
  }

  /**
   * Update quiz session
   */
  updateQuizSession(userId, sessionData) {
    if (this.data.quizSessions[userId]) {
      this.data.quizSessions[userId] = {
        ...this.data.quizSessions[userId],
        ...sessionData
      };
      this.saveUserData();
    }
  }

  /**
   * End quiz session
   */
  endQuizSession(userId) {
    if (this.data.quizSessions[userId]) {
      // Save quiz result to history
      const session = this.data.quizSessions[userId];
      this.saveQuizResult(userId, session);
      
      delete this.data.quizSessions[userId];
      this.saveUserData();
    }
  }

  /**
   * Save quiz result to history
   */
  saveQuizResult(userId, session) {
    if (!this.data.userStats[userId].quizHistory) {
      this.data.userStats[userId].quizHistory = [];
    }
    
    const result = {
      quizId: session.quizId,
      score: session.score,
      totalQuestions: session.answers.length,
      percentage: Math.round((session.score / session.answers.length) * 100),
      completedAt: Date.now(),
      duration: Date.now() - session.startTime
    };
    
    this.data.userStats[userId].quizHistory.push(result);
    
    // Keep only last 10 quiz results
    if (this.data.userStats[userId].quizHistory.length > 10) {
      this.data.userStats[userId].quizHistory = 
        this.data.userStats[userId].quizHistory.slice(-10);
    }
  }

  /**
   * Start poll session
   */
  startPollSession(userId, pollId) {
    this.data.pollSessions[userId] = {
      pollId: pollId,
      startTime: Date.now()
    };
    
    // Update user stats
    const user = this.getUser(userId);
    user.pollsParticipated++;
    
    this.saveUserData();
  }

  /**
   * Get poll session
   */
  getPollSession(userId) {
    const session = this.data.pollSessions[userId];
    return session ? session.pollId : null;
  }

  /**
   * End poll session
   */
  endPollSession(userId) {
    if (this.data.pollSessions[userId]) {
      delete this.data.pollSessions[userId];
      this.saveUserData();
    }
  }

  /**
   * Get user statistics
   */
  getUserStats(userId) {
    return this.data.userStats[userId] || null;
  }

  /**
   * Get all users statistics
   */
  getAllUsersStats() {
    return this.data.userStats;
  }

  /**
   * Get active sessions count
   */
  getActiveSessionsCount() {
    return {
      quizSessions: Object.keys(this.data.quizSessions).length,
      pollSessions: Object.keys(this.data.pollSessions).length,
      totalUsers: Object.keys(this.data.userStats).length
    };
  }

  /**
   * Clean up old sessions (older than 1 hour)
   */
  cleanupOldSessions() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    let cleaned = 0;

    // Clean quiz sessions
    Object.keys(this.data.quizSessions).forEach(userId => {
      const session = this.data.quizSessions[userId];
      if (session.startTime < oneHourAgo) {
        delete this.data.quizSessions[userId];
        cleaned++;
      }
    });

    // Clean poll sessions
    Object.keys(this.data.pollSessions).forEach(userId => {
      const session = this.data.pollSessions[userId];
      if (session.startTime < oneHourAgo) {
        delete this.data.pollSessions[userId];
        cleaned++;
      }
    });

    if (cleaned > 0) {
      this.saveUserData();
      console.log(`🧹 Cleaned up ${cleaned} old sessions`);
    }
  }

  /**
   * Backup user data
   */
  backupData() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = `./data/backup/users_${timestamp}.json`;
      
      fs.ensureDirSync(path.dirname(backupFile));
      fs.copySync(this.dataFile, backupFile);
      
      console.log(`💾 User data backed up to: ${backupFile}`);
      
      // Keep only last 7 backups
      this.cleanupOldBackups();
      
    } catch (error) {
      console.error('❌ Error creating backup:', error);
    }
  }

  /**
   * Clean up old backup files
   */
  cleanupOldBackups() {
    try {
      const backupDir = './data/backup';
      if (!fs.existsSync(backupDir)) return;

      const files = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('users_') && file.endsWith('.json'))
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          time: fs.statSync(path.join(backupDir, file)).mtime
        }))
        .sort((a, b) => b.time - a.time);

      // Keep only last 7 backups
      if (files.length > 7) {
        const filesToDelete = files.slice(7);
        filesToDelete.forEach(file => {
          fs.removeSync(file.path);
          console.log(`🗑️ Deleted old backup: ${file.name}`);
        });
      }
    } catch (error) {
      console.error('❌ Error cleaning up backups:', error);
    }
  }

  /**
   * Export user statistics for analysis
   */
  exportStats() {
    const stats = {
      totalUsers: Object.keys(this.data.userStats).length,
      activeQuizSessions: Object.keys(this.data.quizSessions).length,
      activePollSessions: Object.keys(this.data.pollSessions).length,
      totalAutoRepliesSent: Object.values(this.data.autoReplySent)
        .reduce((sum, count) => sum + count, 0),
      exportTime: new Date().toISOString(),
      userDetails: this.data.userStats
    };

    return stats;
  }
}

module.exports = UserManager;
