import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Stethoscope,
  Heart,
  Activity,
  Flame,
} from 'lucide-react';
import { LanguageCode, RiskCalculationResult, UserAnswers } from '../types';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/languages';
import { speechHelper } from '../utils/speechHelper';
import { AppLogoIcon } from './AppLogo';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isSpeaking?: boolean;
}

interface AiHealthAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: LanguageCode;
  calculatedResult: RiskCalculationResult | null;
  userAnswers: UserAnswers;
}

export const AiHealthAgentModal: React.FC<AiHealthAgentModalProps> = ({
  isOpen,
  onClose,
  language,
  calculatedResult,
  userAnswers,
}) => {
  const t = TRANSLATIONS[language];
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize initial greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getInitialGreeting();
      const initialMsg: ChatMessage = {
        id: 'initial-greeting',
        role: 'model',
        content: greeting,
        timestamp: new Date(),
      };
      setMessages([initialMsg]);

      if (autoSpeak) {
        speakText(greeting, 'initial-greeting');
      }
    }
  }, [isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Clean up SpeechRecognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      speechHelper.stop();
    };
  }, []);

  function getInitialGreeting(): string {
    const lang = langMeta?.nativeName || 'your language';
    if (calculatedResult) {
      const score = calculatedResult.overallScore;
      const level = calculatedResult.riskLevel;
      if (language === 'hi') {
        return `नमस्ते! मैं आपका स्वास्थ्य दोस्त (HealthDost AI) हूँ। मैंने आपकी स्क्रीनिंग रिपोर्ट देखी है (जोखिम स्तर: ${level.toUpperCase()}, स्कोर: ${score}/100)। आप अपने दिल की सेहत, शुगर या डाइट के बारे में मुझसे कोई भी सवाल पूछ सकते हैं या बोलकर बात कर सकते हैं।`;
      }
      if (language === 'te') {
        return `నమస్కారం! నేను మీ ఆరోగ్య మిత్రుడు (HealthDost AI). మీ రిస్క్ స్కోరు (${score}/100) మరియు గుండె, షుగర్ నివారణ గురించి మీరు నాతో మాట్లాడవచ్చు.`;
      }
      if (language === 'ta') {
        return `வணக்கம்! நான் உங்கள் நல்வாழ்வு தோழன் (HealthDost AI). உங்கள் உடல்நல அபாய மதிப்பீடு (${score}/100) மற்றும் உணவு முறை பற்றி என்னிடம் பேசலாம்.`;
      }
      if (language === 'bn') {
        return `নমস্কার! আমি আপনার স্বাস্থ্য বন্ধু (HealthDost AI)। আপনার হার্ট ও সুগার সংক্রান্ত যেকোনো প্রশ্ন আমাকে বাংলায় জিজ্ঞাসা করতে পারেন।`;
      }
      return `Hello! I am HealthDost, your AI health guide. I have reviewed your screening assessment (${level.toUpperCase()} risk, score ${score}/100). You can speak to me or type any questions about your heart health, sugar levels, or daily nutrition!`;
    }

    if (language === 'hi') {
      return `नमस्ते! मैं आपका स्वास्थ्य दोस्त (HealthDost AI) हूँ। आप मुझसे ब्लड प्रेशर, शुगर, खान-पान या दिल की सेहत के बारे में हिंदी में बोलकर या लिखकर बात कर सकते हैं।`;
    }
    return `Hello! I am HealthDost, your friendly AI Community Health Companion. You can talk to me with your voice or type your questions about diabetes, heart health, exercise, and Indian diet. How can I help you today?`;
  }

  const starterQuestions = [
    calculatedResult
      ? `Explain my ${calculatedResult.riskLevel} risk score in simple terms`
      : 'What foods help lower blood sugar in Indian diet?',
    'How much daily walking is best for heart health?',
    'What simple changes can prevent high blood pressure?',
    'What questions should I ask my doctor or ASHA worker?',
  ];

  const speakText = (text: string, msgId: string) => {
    speechHelper.stop();
    setActiveSpeakingId(msgId);

    // Strip markdown formatting for cleaner speech output
    const cleanText = text.replace(/[*_#`[\]()]/g, '').trim();

    speechHelper.speak(
      cleanText,
      language,
      () => {
        // onStart
      },
      () => {
        // onEnd
        setActiveSpeakingId(null);
      },
      () => {
        // onError
        setActiveSpeakingId(null);
      }
    );
  };

  const stopSpeaking = () => {
    speechHelper.stop();
    setActiveSpeakingId(null);
  };

  // Toggle Voice Recognition (STT)
  const toggleVoiceInput = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Voice input is not supported in this browser. Please type your message.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = langMeta?.speechCode || 'hi-IN';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setErrorMsg(`Microphone error: ${event.error}. You can still type below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Speech recognition start failed:', err);
      setIsListening(false);
      setErrorMsg('Could not access microphone. Please check permissions.');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Stop listening if mic was active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    stopSpeaking();

    const userMsgId = `user-${Date.now()}`;
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        content: text,
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          languageName: langMeta?.englishName || 'English',
          userContext: {
            riskLevel: calculatedResult?.riskLevel || null,
            overallScore: calculatedResult?.overallScore || null,
            age: userAnswers.ageGroup,
            gender: userAnswers.gender,
            topFactors: calculatedResult?.topRiskFactors?.map((f) => f.title) || [],
            answers: userAnswers,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        const botMsgId = `bot-${Date.now()}`;
        const botMsg: ChatMessage = {
          id: botMsgId,
          role: 'model',
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);

        if (autoSpeak) {
          speakText(data.reply, botMsgId);
        }
      } else {
        throw new Error(data.error || 'Failed to get AI response');
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackId = `fallback-${Date.now()}`;
      const fallbackMsg: ChatMessage = {
        id: fallbackId,
        role: 'model',
        content:
          'For a healthy lifestyle, focus on brisk daily walking (30 mins), eating whole grains & fresh vegetables, reducing excess salt/oil, drinking plenty of water, and checking your blood pressure regularly with your local ASHA worker.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setErrorMsg('Connected using offline community health advice.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="ai-health-agent-modal"
        className="w-full max-w-xl h-[88vh] max-h-[720px] bg-[#ffffff] rounded-3xl border border-[#e5e5df] shadow-2xl flex flex-col overflow-hidden relative"
      >
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 bg-[#ffffff] border-b border-[#e5e5df] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <AppLogoIcon size="md" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cultural font-bold text-base sm:text-lg text-[#0284c7]">
                  Health<span className="text-[#16a34a]">Dost</span> AI Agent
                </h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Live Guide
                </span>
              </div>
              <p className="text-[11px] text-[#7a7960] flex items-center gap-1 font-medium">
                <span>Speaking in</span>
                <strong className="text-[#33332d]">{langMeta?.nativeName || 'English'}</strong>
                {calculatedResult && (
                  <span className="text-emerald-700 font-semibold">• Screening Linked</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Auto-Speak Toggle */}
            <button
              onClick={() => {
                if (autoSpeak) stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                autoSpeak
                  ? 'bg-[#faf9f5] border-[#5a5a40] text-[#5a5a40]'
                  : 'bg-transparent border-[#e5e5df] text-[#7a7960] hover:text-[#33332d]'
              }`}
              title={autoSpeak ? 'Auto-voice speech enabled' : 'Voice muted'}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 rounded-xl text-[#7a7960] hover:text-[#33332d] hover:bg-[#edece4] transition-colors cursor-pointer"
              aria-label="Close AI agent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Speaking Indicator Banner */}
        {activeSpeakingId && (
          <div className="bg-[#5a5a40] text-white px-4 py-2 text-xs flex items-center justify-between shrink-0 shadow-inner">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-3 bg-white rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-white rounded-full animate-pulse delay-75" />
                <span className="w-1 h-2.5 bg-white rounded-full animate-pulse delay-150" />
              </div>
              <span className="font-cultural font-medium">HealthDost is speaking aloud...</span>
            </div>
            <button
              onClick={stopSpeaking}
              className="px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] cursor-pointer"
            >
              Stop Voice
            </button>
          </div>
        )}

        {/* Error / Alert notice */}
        {errorMsg && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs text-amber-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-amber-900 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#faf9f5]">
          {messages.map((msg) => {
            const isModel = msg.role === 'model';
            const isSpeakingThis = activeSpeakingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3 ${
                  isModel ? 'items-start' : 'items-end flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isModel
                      ? 'bg-[#5a5a40] text-white shadow-xs'
                      : 'bg-[#f27d26] text-white shadow-xs'
                  }`}
                >
                  {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-3 sm:p-3.5 text-xs sm:text-sm leading-relaxed border transition-all ${
                    isModel
                      ? 'bg-[#ffffff] text-[#33332d] border-[#e5e5df] shadow-xs'
                      : 'bg-[#5a5a40] text-white border-[#434330] shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Actions footer on Bot message */}
                  {isModel && (
                    <div className="mt-2.5 pt-2 border-t border-[#e5e5df] flex items-center justify-between text-[11px] text-[#7a7960]">
                      <span className="text-[10px]">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="p-1 rounded-lg hover:bg-[#edece4] text-[#7a7960] hover:text-[#33332d] transition-colors cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            if (isSpeakingThis) {
                              stopSpeaking();
                            } else {
                              speakText(msg.content, msg.id);
                            }
                          }}
                          className={`p-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                            isSpeakingThis
                              ? 'bg-[#f27d26] text-white font-bold'
                              : 'hover:bg-[#edece4] text-[#7a7960] hover:text-[#33332d]'
                          }`}
                          title="Listen with voice"
                        >
                          {isSpeakingThis ? (
                            <VolumeX className="w-3.5 h-3.5" />
                          ) : (
                            <Volume2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#5a5a40] text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-[#ffffff] border border-[#e5e5df] rounded-2xl px-4 py-3 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs text-[#7a7960]">
                  <span className="w-2 h-2 rounded-full bg-[#5a5a40] animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-[#5a5a40] animate-bounce delay-100" />
                  <span className="w-2 h-2 rounded-full bg-[#5a5a40] animate-bounce delay-200" />
                  <span className="ml-1 text-[11px] font-medium">Thinking in your language...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 bg-[#ffffff] border-t border-[#e5e5df] flex items-center gap-1.5 overflow-x-auto shrink-0 no-scrollbar">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#7a7960] shrink-0 pl-1">
            Quick:
          </span>
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#faf9f5] hover:bg-[#edece4] text-[#55554d] border border-[#e5e5df] whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar & Voice Record Controls */}
        <div className="p-3 sm:p-4 bg-[#ffffff] border-t border-[#e5e5df] shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer shrink-0 ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-4 ring-rose-300/40 animate-pulse'
                  : 'bg-[#faf9f5] hover:bg-[#edece4] text-[#5a5a40] border-[#deded3]'
              }`}
              title={isListening ? 'Listening... Tap to stop' : 'Speak with your voice (Microphone)'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input Text Box */}
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? '🎙️ Listening... Speak now in your language'
                  : `Ask a health question in ${langMeta?.nativeName || 'your language'}...`
              }
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 sm:py-3 rounded-2xl border border-[#e5e5df] bg-[#faf9f5] focus:bg-[#ffffff] focus:border-[#5a5a40] text-xs sm:text-sm text-[#33332d] outline-hidden transition-all shadow-inner"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 sm:p-3 rounded-2xl bg-[#5a5a40] hover:bg-[#434330] active:bg-[#343425] text-white shadow-md transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              title="Send Message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Voice Hint & Safety Disclaimer */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-[#7a7960] px-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#f27d26]" />
              Tap mic to speak or listen to answers aloud
            </span>
            <span className="text-[9px] text-[#888870] hidden sm:inline">
              Awareness guide • Not a clinical diagnosis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
