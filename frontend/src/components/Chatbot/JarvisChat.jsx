import React, { useState, useEffect, useRef } from 'react';
import { localApi } from '../../services/localStorageAdapter';
import './JarvisChat.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';

const JarvisChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSkill, setActiveSkill] = useState('chat');
  const [messages, setMessages] = useState([
    {
      sender: 'jarvis',
      text: 'Saludos, señor. Soy J.A.R.V.I.S. Estoy a su entera disposición para analizar y responder cualquier consulta sobre nuestro ecosistema de startups. ¿En qué puedo asistirle hoy?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Configuración de Voz
  const [voices, setVoices] = useState([]);
  const [selectedVoiceGender, setSelectedVoiceGender] = useState('female');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const updateVoices = () => {
      if (synthRef.current) {
        setVoices(synthRef.current.getVoices());
      }
    };

    updateVoices();
    if (synthRef.current) {
      synthRef.current.onvoiceschanged = updateVoices;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'es-ES';
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = (e) => {
        console.error("Speech recognition error:", e);
        setIsListening(false);
      };
      rec.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setInput(text);
      };

      recognitionRef.current = rec;
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if (!synthRef.current || !soundEnabled || !text) return;

    synthRef.current.cancel();

    const cleanText = String(text).replace(/[*#_`~]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const spanishVoices = voices.filter(v => v.lang.startsWith('es'));
    let selectedVoice = null;

    if (spanishVoices.length > 0) {
      if (selectedVoiceGender === 'female') {
        selectedVoice = spanishVoices.find(v => 
          v.name.toLowerCase().includes('sandra') || 
          v.name.toLowerCase().includes('sabina') || 
          v.name.toLowerCase().includes('helena') || 
          v.name.toLowerCase().includes('maria') || 
          v.name.toLowerCase().includes('google español') || 
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('female')
        ) || spanishVoices[0];
      } else {
        selectedVoice = spanishVoices.find(v => 
          v.name.toLowerCase().includes('pablo') || 
          v.name.toLowerCase().includes('miguel') || 
          v.name.toLowerCase().includes('jorge') || 
          v.name.toLowerCase().includes('google') ||
          v.name.toLowerCase().includes('male')
        ) || spanishVoices[spanishVoices.length - 1];
      }
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.pitch = selectedVoiceGender === 'female' ? 1.05 : 0.95;
    utterance.rate = 0.92;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');
    
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }

    const newMessage = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const endpoint = activeSkill === 'classifier' ? '/api/ai/classify-request' : '/api/ai/chat';
      const payload = activeSkill === 'classifier' ? { text: userText } : { message: userText };

      let data;
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          data = await response.json();
        }
      } catch (err) {}

      if (!data) {
        data = localApi.dispatch('POST', endpoint, payload);
      }

      const actualData = data.data !== undefined && data.data !== null && typeof data.data === 'object' && !Array.isArray(data.data)
        ? data.data
        : data;

      const jarvisText = activeSkill === 'classifier'
        ? [
            `Clasificación sugerida: ${actualData.tipo || data.tipo}`,
            `Confianza: ${Math.round(((actualData.confianza || data.confianza) || 0) * 100)}%`,
            actualData.razon || data.razon,
            (actualData.requiere_revision || data.requiere_revision) ? 'Recomendación: revisar manualmente antes de aprobar.' : 'Recomendación: puede avanzar a revisión del administrador.'
          ].filter(Boolean).join('\n')
        : (actualData.response || data.response || 'Disculpe, señor. No pude obtener una respuesta válida.');

      const jarvisMessage = {
        sender: 'jarvis',
        text: jarvisText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, jarvisMessage]);
      speak(jarvisText);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        sender: 'jarvis',
        text: 'Mis disculpas, señor. He experimentado una interrupción temporal en mis servidores de enlace. Verifique que el backend esté activo.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Activar/Desactivar Reconocimiento de Voz
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Lo lamento, señor. Su navegador no soporta el reconocimiento de voz de manera nativa.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className={`jarvis-chatbot-container ${isOpen ? 'active' : ''}`}>
      {/* ── BOTÓN FLOTANTE: ARC REACTOR / ORBE DE JARVIS ────────────────────── */}
      <button 
        className={`jarvis-floating-trigger ${isOpen ? 'active' : ''} ${isSpeaking ? 'speaking' : ''} ${isLoading ? 'thinking' : ''}`}
        onClick={() => {
          setIsOpen(!isOpen);
          if (synthRef.current) synthRef.current.cancel();
          setIsSpeaking(false);
        }}
        title="Contactar a J.A.R.V.I.S."
      >
        <div className="jarvis-core-ring">
          <div className="jarvis-core-glow"></div>
        </div>
        <span className="jarvis-trigger-badge">J.A.R.V.I.S.</span>
      </button>

      {/* ── PANEL DE CHAT GLASSMORPHIC ────────────────────────────────────── */}
      {isOpen && (
        <div className="jarvis-chat-panel">
          {/* Cabecera del Panel */}
          <div className="jarvis-chat-header">
            <div className="jarvis-header-avatar">
              <div className="jarvis-pulse-orb"></div>
            </div>
            <div className="jarvis-header-info">
              <h3>J.A.R.V.I.S.</h3>
              <p>{isSpeaking ? 'Hablando...' : isLoading ? 'Procesando consulta...' : 'En línea · Asistente de Ecosistema'}</p>
            </div>
            
            {/* Controles Rápidos */}
            <div className="jarvis-header-controls">
              {/* Voz Masculina / Femenina */}
              <select 
                className="jarvis-voice-select" 
                value={selectedVoiceGender} 
                onChange={(e) => setSelectedVoiceGender(e.target.value)}
                title="Selección de tono de voz"
              >
                <option value="female">🎙️ Femenina</option>
                <option value="male">🎙️ Masculina</option>
              </select>

              {/* Botón Silenciar */}
              <button 
                className={`jarvis-sound-btn ${soundEnabled ? 'active' : ''}`}
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  if (synthRef.current) synthRef.current.cancel();
                }}
                title={soundEnabled ? 'Silenciar asistente' : 'Activar voz'}
              >
                {soundEnabled ? '🔊' : '🔇'}
              </button>

              {/* Cerrar */}
              <button className="jarvis-close-btn" onClick={() => setIsOpen(false)}>×</button>
            </div>
          </div>

          {/* Cuerpo del Chat / Mensajes */}
          <div className="jarvis-chat-body">
            <div className="jarvis-skill-switch" role="group" aria-label="Modo de IA">
              <button
                type="button"
                className={activeSkill === 'chat' ? 'active' : ''}
                onClick={() => setActiveSkill('chat')}
              >
                Chat asesor
              </button>
              <button
                type="button"
                className={activeSkill === 'classifier' ? 'active' : ''}
                onClick={() => setActiveSkill('classifier')}
              >
                Clasificador
              </button>
            </div>
            {messages.map((msg, index) => (
              <div key={index} className={`jarvis-message-wrapper ${msg.sender}`}>
                <div className="jarvis-message-bubble">
                  {msg.sender === 'jarvis' && <span className="jarvis-sender-tag">J.A.R.V.I.S. // System</span>}
                  <p className="jarvis-message-text">{msg.text}</p>
                  <span className="jarvis-message-time">{msg.time}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="jarvis-message-wrapper jarvis">
                <div className="jarvis-message-bubble loading">
                  <div className="jarvis-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de Entrada */}
          <form className="jarvis-chat-input-area" onSubmit={handleSend}>
            <input
              type="text"
              className="jarvis-chat-input"
              placeholder={activeSkill === 'classifier' ? 'Pegue una solicitud para clasificar...' : 'Escriba su comando o consulta, señor...'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />

            {/* Micrófono (Speech to Text) */}
            <button
              type="button"
              className={`jarvis-input-btn mic-btn ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              title="Hablar por micrófono"
              disabled={isLoading}
            >
              🎤
            </button>

            {/* Enviar */}
            <button 
              type="submit" 
              className="jarvis-input-btn send-btn"
              disabled={isLoading || !input.trim()}
              title="Enviar comando"
            >
              ⚡
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default JarvisChat;
