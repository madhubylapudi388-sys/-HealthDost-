import { LanguageCode } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/languages';

class SpeechHelper {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported = false;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();

      // Some browsers (Chrome/Safari/Android) load voices asynchronously
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    try {
      const available = this.synth.getVoices();
      if (available && available.length > 0) {
        this.voices = available;
      }
    } catch {
      this.voices = [];
    }
  }

  public getSupported(): boolean {
    return this.isSupported;
  }

  /**
   * Find the closest matching voice for a language:
   * 1. Exact match (e.g., 'hi-IN')
   * 2. Prefix match (e.g., 'hi')
   * 3. Name contains language name (e.g., 'Hindi')
   * 4. Fallback to Indian English ('en-IN') or standard English ('en-US', 'en-GB')
   * 5. Fallback to any default voice available on the device
   */
  public findBestVoice(langCode: LanguageCode, speechCode: string): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    this.loadVoices();

    const voices = this.voices.length > 0 ? this.voices : this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    const targetCodeLower = speechCode.toLowerCase();
    const langCodeLower = langCode.toLowerCase();

    // 1. Exact speech code match (hi-in or hi_in)
    const exactMatch = voices.find((v) => {
      const vl = v.lang.toLowerCase().replace('_', '-');
      return vl === targetCodeLower;
    });
    if (exactMatch) return exactMatch;

    // 2. Starts with language code
    const prefixMatch = voices.find((v) => {
      const vl = v.lang.toLowerCase().replace('_', '-');
      return vl.startsWith(langCodeLower);
    });
    if (prefixMatch) return prefixMatch;

    // 3. Name match for language
    const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (langMeta) {
      const nameMatch = voices.find((v) =>
        v.name.toLowerCase().includes(langMeta.englishName.toLowerCase())
      );
      if (nameMatch) return nameMatch;
    }

    // 4. Graceful Fallback: Indian English or Generic English
    const enIndianMatch = voices.find((v) => {
      const vl = v.lang.toLowerCase().replace('_', '-');
      return vl === 'en-in' || v.name.toLowerCase().includes('india');
    });
    if (enIndianMatch) return enIndianMatch;

    const enGenericMatch = voices.find((v) => {
      const vl = v.lang.toLowerCase().replace('_', '-');
      return vl.startsWith('en');
    });
    if (enGenericMatch) return enGenericMatch;

    // 5. Default device voice
    const defaultVoice = voices.find((v) => v.default) || voices[0];
    return defaultVoice || null;
  }

  /**
   * Cleans text to avoid reading emojis or markdown symbols
   */
  private cleanTextForSpeech(text: string): string {
    return text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  public speak(
    text: string,
    langCode: LanguageCode,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth || !this.isSupported) {
      if (onEnd) onEnd();
      return;
    }

    try {
      this.synth.cancel(); // Stop any currently playing audio

      const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      const targetSpeechCode = langMeta ? langMeta.speechCode : 'en-IN';

      const cleanedText = this.cleanTextForSpeech(text);
      if (!cleanedText) {
        if (onEnd) onEnd();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanedText);
      utterance.rate = 0.92; // Slightly slower, highly intelligible pace
      utterance.pitch = 1.0;

      const matchedVoice = this.findBestVoice(langCode, targetSpeechCode);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = targetSpeechCode;
      }

      utterance.onstart = () => {
        if (onStart) onStart();
      };

      utterance.onend = () => {
        this.currentUtterance = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e: any) => {
        this.currentUtterance = null;
        // Ignore normal interruptions
        if (e && (e.error === 'interrupted' || e.error === 'canceled')) {
          if (onEnd) onEnd();
          return;
        }
        if (onError) onError(e);
        if (onEnd) onEnd();
      };

      this.currentUtterance = utterance;
      this.synth.speak(utterance);
    } catch (err) {
      this.currentUtterance = null;
      if (onError) onError(err);
      if (onEnd) onEnd();
    }
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && (this.synth.speaking || this.synth.pending));
  }
}

export const speechHelper = new SpeechHelper();

