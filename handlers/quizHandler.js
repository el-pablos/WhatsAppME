/**
 * Quiz Handler - Menangani kuis dan polling interaktif
 */

const fs = require('fs-extra');
const config = require('../config/config');
const UserManager = require('../utils/userManager');

class QuizHandler {
  constructor() {
    this.userManager = new UserManager();
    this.quizData = this.loadQuizData();
  }

  /**
   * Load data kuis dari file JSON
   */
  loadQuizData() {
    try {
      return fs.readJsonSync('./data/quiz.json');
    } catch (error) {
      console.error('❌ Error loading quiz data:', error);
      return { quizzes: [], polls: [] };
    }
  }

  /**
   * Save data kuis ke file JSON
   */
  saveQuizData() {
    try {
      fs.writeJsonSync('./data/quiz.json', this.quizData, { spaces: 2 });
    } catch (error) {
      console.error('❌ Error saving quiz data:', error);
    }
  }

  /**
   * Handle quiz commands
   */
  async handleQuizCommand(message, command) {
    const userId = message.from;
    
    if (command.includes('kuis') || command.includes('quiz')) {
      // Extract quiz number
      const match = command.match(/(?:kuis|quiz)\s*(\d+)/);
      if (match) {
        const quizNumber = parseInt(match[1]);
        await this.startQuiz(message, quizNumber - 1);
      } else {
        await this.showQuizList(message);
      }
    } else if (command.includes('poll') || command.includes('polling')) {
      // Extract poll number
      const match = command.match(/(?:poll|polling)\s*(\d+)/);
      if (match) {
        const pollNumber = parseInt(match[1]);
        await this.startPoll(message, pollNumber - 1);
      } else {
        await this.showPollList(message);
      }
    }
  }

  /**
   * Tampilkan daftar kuis
   */
  async showQuizList(message) {
    let quizListText = `🧠 *DAFTAR KUIS TERSEDIA*\n\n`;
    
    this.quizData.quizzes.forEach((quiz, index) => {
      quizListText += `${index + 1}️⃣ *${quiz.title}*\n`;
      quizListText += `   ${quiz.description}\n`;
      quizListText += `   📝 ${quiz.questions.length} pertanyaan\n\n`;
    });

    quizListText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    quizListText += `🎮 *Cara Main:*\n`;
    quizListText += `Ketik: *kuis 1*, *kuis 2*, dst.\n\n`;
    quizListText += `🔄 Menu utama: ketik *menu*`;

    await message.reply(quizListText);
  }

  /**
   * Tampilkan daftar polling
   */
  async showPollList(message) {
    let pollListText = `📊 *DAFTAR POLLING TERSEDIA*\n\n`;
    
    this.quizData.polls.forEach((poll, index) => {
      pollListText += `${index + 1}️⃣ *${poll.title}*\n`;
      pollListText += `   ${poll.question}\n`;
      pollListText += `   🗳️ ${poll.options.length} pilihan\n\n`;
    });

    pollListText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    pollListText += `🗳️ *Cara Ikut:*\n`;
    pollListText += `Ketik: *poll 1*, *poll 2*, dst.\n\n`;
    pollListText += `🔄 Menu utama: ketik *menu*`;

    await message.reply(pollListText);
  }

  /**
   * Mulai kuis
   */
  async startQuiz(message, quizIndex) {
    const userId = message.from;
    
    if (quizIndex < 0 || quizIndex >= this.quizData.quizzes.length) {
      await message.reply('❌ Nomor kuis tidak valid. Ketik *kuis* untuk melihat daftar.');
      return;
    }

    const quiz = this.quizData.quizzes[quizIndex];
    
    // Initialize quiz session
    this.userManager.startQuizSession(userId, {
      quizId: quiz.id,
      currentQuestion: 0,
      score: 0,
      answers: [],
      startTime: Date.now()
    });

    // Send quiz intro
    const introText = `🎯 *${quiz.title}*\n\n` +
                     `${quiz.description}\n\n` +
                     `📝 Total Pertanyaan: ${quiz.questions.length}\n` +
                     `⏱️ Estimasi Waktu: ${Math.ceil(quiz.questions.length * 0.5)} menit\n\n` +
                     `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
                     `🚀 *Siap memulai?*\n` +
                     `Ketik *mulai* untuk memulai kuis!`;

    await message.reply(introText);
  }

  /**
   * Mulai polling
   */
  async startPoll(message, pollIndex) {
    const userId = message.from;
    
    if (pollIndex < 0 || pollIndex >= this.quizData.polls.length) {
      await message.reply('❌ Nomor polling tidak valid. Ketik *poll* untuk melihat daftar.');
      return;
    }

    const poll = this.quizData.polls[pollIndex];
    
    let pollText = `📊 *${poll.title}*\n\n`;
    pollText += `❓ *${poll.question}*\n\n`;
    
    poll.options.forEach((option, index) => {
      pollText += `${index + 1}️⃣ ${option}\n`;
    });

    pollText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    pollText += `🗳️ *Cara Vote:*\n`;
    pollText += `Ketik nomor pilihan (1, 2, 3, dst.)\n\n`;
    pollText += `📈 Hasil akan ditampilkan setelah Anda vote!`;

    // Set user in poll session
    this.userManager.startPollSession(userId, poll.id);

    await message.reply(pollText);
  }

  /**
   * Cek apakah user sedang dalam kuis
   */
  async isUserInQuiz(userId) {
    const session = this.userManager.getQuizSession(userId);
    return session !== null;
  }

  /**
   * Cek apakah user sedang dalam polling
   */
  async isUserInPoll(userId) {
    const session = this.userManager.getPollSession(userId);
    return session !== null;
  }

  /**
   * Handle jawaban kuis
   */
  async handleQuizAnswer(message, answer) {
    const userId = message.from;
    const session = this.userManager.getQuizSession(userId);
    
    if (!session) return;

    const quiz = this.quizData.quizzes.find(q => q.id === session.quizId);
    if (!quiz) return;

    // Handle "mulai" command
    if (answer === 'mulai' && session.currentQuestion === 0) {
      await this.sendQuizQuestion(message, quiz, session);
      return;
    }

    // Handle quiz answers (A, B, C, D)
    const validAnswers = ['a', 'b', 'c', 'd'];
    if (validAnswers.includes(answer)) {
      await this.processQuizAnswer(message, quiz, session, answer.toUpperCase());
    } else {
      await message.reply('❌ Jawaban tidak valid. Pilih A, B, C, atau D.');
    }
  }

  /**
   * Kirim pertanyaan kuis
   */
  async sendQuizQuestion(message, quiz, session) {
    const question = quiz.questions[session.currentQuestion];
    
    let questionText = `🧠 *PERTANYAAN ${session.currentQuestion + 1}/${quiz.questions.length}*\n\n`;
    questionText += `❓ *${question.question}*\n\n`;
    
    question.options.forEach(option => {
      questionText += `${option}\n`;
    });

    questionText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    questionText += `💡 Ketik huruf jawaban (A/B/C/D)`;

    await message.reply(questionText);
  }

  /**
   * Proses jawaban kuis
   */
  async processQuizAnswer(message, quiz, session, answer) {
    const userId = message.from;
    const question = quiz.questions[session.currentQuestion];
    const isCorrect = answer === question.correct;

    // Update session
    session.answers.push({
      questionId: question.id,
      answer: answer,
      correct: isCorrect
    });

    if (isCorrect) {
      session.score++;
    }

    // Send feedback
    let feedbackText = isCorrect ? 
      `✅ *BENAR!*\n\n` : 
      `❌ *SALAH!*\n\nJawaban yang benar: *${question.correct}*\n\n`;
    
    feedbackText += `💡 *Penjelasan:*\n${question.explanation}\n\n`;
    feedbackText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    await message.reply(feedbackText);

    // Next question or finish
    session.currentQuestion++;
    
    if (session.currentQuestion < quiz.questions.length) {
      // Send next question after delay
      setTimeout(async () => {
        await this.sendQuizQuestion(message, quiz, session);
      }, 2000);
    } else {
      // Finish quiz
      setTimeout(async () => {
        await this.finishQuiz(message, quiz, session);
      }, 2000);
    }

    // Update session
    this.userManager.updateQuizSession(userId, session);
  }

  /**
   * Selesaikan kuis dan tampilkan hasil
   */
  async finishQuiz(message, quiz, session) {
    const userId = message.from;
    const percentage = Math.round((session.score / quiz.questions.length) * 100);
    
    let resultText = `🎉 *KUIS SELESAI!*\n\n`;
    resultText += `📊 *HASIL ANDA:*\n`;
    resultText += `✅ Benar: ${session.score}/${quiz.questions.length}\n`;
    resultText += `📈 Persentase: ${percentage}%\n\n`;

    // Performance message
    if (percentage === 100) {
      resultText += `🏆 *SEMPURNA!* Anda mendapat skor 100%!\n`;
      resultText += `🎁 Dapatkan diskon spesial dengan menghubungi admin!\n\n`;
    } else if (percentage >= 80) {
      resultText += `🌟 *EXCELLENT!* Pengetahuan Anda sangat baik!\n\n`;
    } else if (percentage >= 60) {
      resultText += `👍 *GOOD!* Hasil yang cukup baik!\n\n`;
    } else {
      resultText += `💪 *KEEP LEARNING!* Terus belajar dan coba lagi!\n\n`;
    }

    resultText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    resultText += `🔄 Coba kuis lain: ketik *kuis*\n`;
    resultText += `📞 Hubungi admin: ketik *kontak*\n`;
    resultText += `🏠 Menu utama: ketik *menu*`;

    await message.reply(resultText);

    // Clear quiz session
    this.userManager.endQuizSession(userId);
  }

  /**
   * Handle polling vote
   */
  async handlePollVote(message, vote) {
    const userId = message.from;
    const pollId = this.userManager.getPollSession(userId);
    
    if (!pollId) return;

    const poll = this.quizData.polls.find(p => p.id === pollId);
    if (!poll) return;

    const voteIndex = parseInt(vote) - 1;
    if (voteIndex < 0 || voteIndex >= poll.options.length) {
      await message.reply('❌ Pilihan tidak valid. Pilih nomor yang tersedia.');
      return;
    }

    // Record vote
    const selectedOption = poll.options[voteIndex];
    if (!poll.results[selectedOption]) {
      poll.results[selectedOption] = 0;
    }
    poll.results[selectedOption]++;

    // Save updated poll data
    this.saveQuizData();

    // Show results
    await this.showPollResults(message, poll, selectedOption);

    // Clear poll session
    this.userManager.endPollSession(userId);
  }

  /**
   * Tampilkan hasil polling
   */
  async showPollResults(message, poll, userChoice) {
    const totalVotes = Object.values(poll.results).reduce((sum, count) => sum + count, 0);
    
    let resultText = `📊 *HASIL POLLING*\n\n`;
    resultText += `🗳️ *${poll.title}*\n`;
    resultText += `❓ ${poll.question}\n\n`;
    resultText += `✅ *Pilihan Anda: ${userChoice}*\n\n`;
    resultText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    resultText += `📈 *STATISTIK VOTING:*\n\n`;

    poll.options.forEach(option => {
      const votes = poll.results[option] || 0;
      const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
      const bar = '█'.repeat(Math.floor(percentage / 5));
      
      resultText += `${option}\n`;
      resultText += `${bar} ${percentage}% (${votes} votes)\n\n`;
    });

    resultText += `━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
    resultText += `👥 Total Partisipan: ${totalVotes}\n`;
    resultText += `🙏 Terima kasih atas partisipasinya!\n\n`;
    resultText += `🔄 Polling lain: ketik *poll*\n`;
    resultText += `🏠 Menu utama: ketik *menu*`;

    await message.reply(resultText);
  }
}

module.exports = QuizHandler;
