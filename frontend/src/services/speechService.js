class SpeechService {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.isSupported = 'speechSynthesis' in window;
    this.voices = [];
    this.preferredVoice = null;
    
    // Load voices when available
    this.loadVoices();
    
    // Voices may load asynchronously
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    this.voices = this.synth.getVoices();
    this.selectBestVoice();
  }

  selectBestVoice() {
    if (this.voices.length === 0) return;

    // Prioritize mystical/dramatic voices with deeper, more resonant tones
    const mysticalVoiceNames = [
      // Premium mystical voices (deeper, more dramatic)
      'Alex', 'Daniel', 'Victoria', 'Serena', 'Moira',
      // British voices (often sound more mystical)
      'Google UK English Female', 'Google UK English Male', 'Microsoft Hazel Desktop',
      'Microsoft George Desktop', 'Microsoft Zira Desktop',
      // Quality female voices with mystical qualities
      'Samantha', 'Allison', 'Ava', 'Karen', 'Fiona',
      // Microsoft voices with good quality
      'Microsoft David Desktop', 'Microsoft Mark Desktop',
      // Google voices
      'Google US English'
    ];

    // First, try to find mystical voices
    for (const voiceName of mysticalVoiceNames) {
      const voice = this.voices.find(v => v.name.includes(voiceName));
      if (voice) {
        this.preferredVoice = voice;
        return;
      }
    }

    // Get all English voices
    const englishVoices = this.voices.filter(voice => 
      voice.lang.startsWith('en')
    );

    if (englishVoices.length > 0) {
      // Prefer voices that sound more mystical/dramatic
      const dramaticVoices = englishVoices.filter(voice => {
        const name = voice.name.toLowerCase();
        return name.includes('enhanced') || 
               name.includes('premium') ||
               name.includes('neural') ||
               name.includes('natural') ||
               !voice.localService; // Non-local voices often have better quality
      });

      if (dramaticVoices.length > 0) {
        // Prefer female voices for oracle mystique, but accept quality male voices
        const femaleVoice = dramaticVoices.find(voice => {
          const name = voice.name.toLowerCase();
          return name.includes('female') ||
                 name.includes('woman') ||
                 ['samantha', 'victoria', 'allison', 'ava', 'serena', 'karen', 'moira', 'zira', 'hazel', 'fiona'].some(n => 
                   name.includes(n)
                 );
        });
        
        this.preferredVoice = femaleVoice || dramaticVoices[0];
      } else {
        this.preferredVoice = englishVoices[0];
      }
    } else {
      // Last resort: any available voice
      this.preferredVoice = this.voices[0];
    }
  }

  speak(text, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    // Stop any current speech
    this.stop();

    return new Promise((resolve, reject) => {
      // Clean text for better speech
      const cleanText = this.preprocessText(text);
      
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      // Configure voice settings for mystical feel
      utterance.voice = this.preferredVoice;
      utterance.rate = options.rate || 0.75; // Slower for more mystical delivery
      utterance.pitch = options.pitch || 0.85; // Lower pitch for wisdom/authority
      utterance.volume = options.volume || 0.8;

      // Event handlers
      utterance.onend = () => {
        this.currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        this.currentUtterance = null;
        reject(new Error(`Speech synthesis error: ${event.error}`));
      };

      utterance.onstart = () => {
        console.log('Oracle speech started');
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    });
  }

  // Progressive speech that speaks chunks as they're revealed
  speakProgressive(textChunks, options = {}) {
    if (!this.isSupported) {
      console.warn('Speech synthesis not supported');
      return Promise.reject(new Error('Speech synthesis not supported'));
    }

    this.stop();
    let currentChunkIndex = 0;
    
    const speakNextChunk = () => {
      if (currentChunkIndex >= textChunks.length) {
        return Promise.resolve();
      }

      const chunk = textChunks[currentChunkIndex];
      currentChunkIndex++;
      
      // Only speak meaningful chunks (not just punctuation or single characters)
      if (chunk.trim().length < 3) {
        return speakNextChunk();
      }

      return new Promise((resolve, reject) => {
        const cleanText = this.preprocessText(chunk);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        utterance.voice = this.preferredVoice;
        utterance.rate = options.rate || 0.75;
        utterance.pitch = options.pitch || 0.85;
        utterance.volume = options.volume || 0.8;

        utterance.onend = () => {
          this.currentUtterance = null;
          // Small pause between chunks for dramatic effect
          setTimeout(() => {
            speakNextChunk().then(resolve).catch(reject);
          }, 200);
        };

        utterance.onerror = (event) => {
          this.currentUtterance = null;
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        this.currentUtterance = utterance;
        this.synth.speak(utterance);
      });
    };

    return speakNextChunk();
  }

  // Start speaking along with typing animation
  startProgressiveSpeech(fullText, options = {}) {
    if (!this.isSupported) {
      return Promise.resolve();
    }

    // Split text into sentences for more natural progressive speech
    const sentences = this.splitIntoSentences(fullText);
    let currentSentenceIndex = 0;
    let isActive = true;

    const speakController = {
      stop: () => {
        isActive = false;
        this.stop();
      },
      isActive: () => isActive
    };

    const speakNextSentence = () => {
      if (!isActive || currentSentenceIndex >= sentences.length) {
        return;
      }

      const sentence = sentences[currentSentenceIndex];
      currentSentenceIndex++;

      if (sentence.trim().length > 0) {
        this.speak(sentence, options).catch(() => {
          // Ignore errors and continue
        }).finally(() => {
          if (isActive) {
            // Small delay before next sentence
            setTimeout(speakNextSentence, 300);
          }
        });
      } else {
        speakNextSentence();
      }
    };

    // Start speaking the first sentence after a short delay
    setTimeout(speakNextSentence, 800);
    
    return speakController;
  }

  splitIntoSentences(text) {
    return text
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(s => s + '.');
  }

  preprocessText(text) {
    return text
      // Remove markdown-style formatting
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`(.*?)`/g, '$1')
      
      // Remove stage directions and mystical actions
      .replace(/\*[^*]*\*/g, '')
      .replace(/\([^)]*adjusting[^)]*\)/gi, '')
      .replace(/\([^)]*gazing[^)]*\)/gi, '')
      
      // Add pauses for better delivery
      .replace(/\.\.\./g, '... ')
      .replace(/([.!?])\s+/g, '$1 ')
      .replace(/:/g, ', ')
      
      // Clean up extra whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  stop() {
    if (this.currentUtterance) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth.paused) {
      this.synth.resume();
    }
  }

  isSpeaking() {
    return this.synth.speaking;
  }

  isPaused() {
    return this.synth.paused;
  }

  getAvailableVoices() {
    return this.voices.filter(voice => voice.lang.startsWith('en'));
  }

  setVoice(voiceName) {
    const voice = this.voices.find(v => v.name === voiceName);
    if (voice) {
      this.preferredVoice = voice;
      return true;
    }
    return false;
  }
}

const speechServiceInstance = new SpeechService();
export default speechServiceInstance;