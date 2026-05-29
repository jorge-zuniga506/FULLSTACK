import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './GlobalUtilityMenu.css';

const STORAGE_KEY = 'nexus_global_utility_settings_v1';
const SOURCE_LANGUAGE = 'es';

const LANGUAGE_OPTIONS = [
  { code: 'af', label: 'Afrikaans' },
  { code: 'sq', label: 'Albanian' },
  { code: 'am', label: 'Amharic' },
  { code: 'ar', label: 'Arabic' },
  { code: 'hy', label: 'Armenian' },
  { code: 'az', label: 'Azerbaijani' },
  { code: 'eu', label: 'Basque' },
  { code: 'be', label: 'Belarusian' },
  { code: 'bn', label: 'Bengali' },
  { code: 'bs', label: 'Bosnian' },
  { code: 'bg', label: 'Bulgarian' },
  { code: 'ca', label: 'Catalan' },
  { code: 'ceb', label: 'Cebuano' },
  { code: 'zh-CN', label: 'Chinese (Simplified)' },
  { code: 'zh-TW', label: 'Chinese (Traditional)' },
  { code: 'co', label: 'Corsican' },
  { code: 'hr', label: 'Croatian' },
  { code: 'cs', label: 'Czech' },
  { code: 'da', label: 'Danish' },
  { code: 'nl', label: 'Dutch' },
  { code: 'en', label: 'English' },
  { code: 'eo', label: 'Esperanto' },
  { code: 'et', label: 'Estonian' },
  { code: 'fi', label: 'Finnish' },
  { code: 'fr', label: 'French' },
  { code: 'fy', label: 'Frisian' },
  { code: 'gl', label: 'Galician' },
  { code: 'ka', label: 'Georgian' },
  { code: 'de', label: 'German' },
  { code: 'el', label: 'Greek' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'ht', label: 'Haitian Creole' },
  { code: 'ha', label: 'Hausa' },
  { code: 'haw', label: 'Hawaiian' },
  { code: 'iw', label: 'Hebrew' },
  { code: 'hi', label: 'Hindi' },
  { code: 'hmn', label: 'Hmong' },
  { code: 'hu', label: 'Hungarian' },
  { code: 'is', label: 'Icelandic' },
  { code: 'ig', label: 'Igbo' },
  { code: 'id', label: 'Indonesian' },
  { code: 'ga', label: 'Irish' },
  { code: 'it', label: 'Italian' },
  { code: 'ja', label: 'Japanese' },
  { code: 'jv', label: 'Javanese' },
  { code: 'kn', label: 'Kannada' },
  { code: 'kk', label: 'Kazakh' },
  { code: 'km', label: 'Khmer' },
  { code: 'ko', label: 'Korean' },
  { code: 'ku', label: 'Kurdish' },
  { code: 'ky', label: 'Kyrgyz' },
  { code: 'lo', label: 'Lao' },
  { code: 'la', label: 'Latin' },
  { code: 'lv', label: 'Latvian' },
  { code: 'lt', label: 'Lithuanian' },
  { code: 'lb', label: 'Luxembourgish' },
  { code: 'mk', label: 'Macedonian' },
  { code: 'mg', label: 'Malagasy' },
  { code: 'ms', label: 'Malay' },
  { code: 'ml', label: 'Malayalam' },
  { code: 'mt', label: 'Maltese' },
  { code: 'mi', label: 'Maori' },
  { code: 'mr', label: 'Marathi' },
  { code: 'mn', label: 'Mongolian' },
  { code: 'my', label: 'Myanmar (Burmese)' },
  { code: 'ne', label: 'Nepali' },
  { code: 'no', label: 'Norwegian' },
  { code: 'ny', label: 'Nyanja (Chichewa)' },
  { code: 'or', label: 'Odia' },
  { code: 'ps', label: 'Pashto' },
  { code: 'fa', label: 'Persian' },
  { code: 'pl', label: 'Polish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'pa', label: 'Punjabi' },
  { code: 'ro', label: 'Romanian' },
  { code: 'ru', label: 'Russian' },
  { code: 'sm', label: 'Samoan' },
  { code: 'gd', label: 'Scots Gaelic' },
  { code: 'sr', label: 'Serbian' },
  { code: 'st', label: 'Sesotho' },
  { code: 'sn', label: 'Shona' },
  { code: 'sd', label: 'Sindhi' },
  { code: 'si', label: 'Sinhala' },
  { code: 'sk', label: 'Slovak' },
  { code: 'sl', label: 'Slovenian' },
  { code: 'so', label: 'Somali' },
  { code: 'es', label: 'Spanish' },
  { code: 'su', label: 'Sundanese' },
  { code: 'sw', label: 'Swahili' },
  { code: 'sv', label: 'Swedish' },
  { code: 'tl', label: 'Tagalog' },
  { code: 'tg', label: 'Tajik' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'th', label: 'Thai' },
  { code: 'tr', label: 'Turkish' },
  { code: 'uk', label: 'Ukrainian' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ug', label: 'Uyghur' },
  { code: 'uz', label: 'Uzbek' },
  { code: 'vi', label: 'Vietnamese' },
  { code: 'cy', label: 'Welsh' },
  { code: 'xh', label: 'Xhosa' },
  { code: 'yi', label: 'Yiddish' },
  { code: 'yo', label: 'Yoruba' },
  { code: 'zu', label: 'Zulu' }
];

const INCLUDED_LANGUAGES = LANGUAGE_OPTIONS.map((lang) => lang.code).join(',');

const readSavedSettings = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
};

const saveSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (_error) {
    // ignore localStorage errors
  }
};

const setCookie = (name, value) => {
  document.cookie = `${name}=${value};path=/;max-age=31536000`;
  document.cookie = `${name}=${value};domain=${window.location.hostname};path=/;max-age=31536000`;
};

const initGoogleWidget = () => {
  if (!window.google || !window.google.translate) return;
  const target = document.getElementById('google_translate_element_hidden');
  if (!target || target.dataset.ready === 'true') return;

  target.innerHTML = '';
  new window.google.translate.TranslateElement(
    {
      pageLanguage: SOURCE_LANGUAGE,
      autoDisplay: false,
      includedLanguages: INCLUDED_LANGUAGES,
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    },
    'google_translate_element_hidden'
  );
  target.dataset.ready = 'true';
};

const loadGoogleTranslateScript = (onReady) => {
  if (window.google && window.google.translate) {
    initGoogleWidget();
    if (onReady) onReady();
    return;
  }

  if (!window.__nexusGoogleTranslateCallbacks) {
    window.__nexusGoogleTranslateCallbacks = [];
  }
  if (onReady) {
    window.__nexusGoogleTranslateCallbacks.push(onReady);
  }

  if (document.getElementById('google-translate-element-script')) return;

  window.nexusGoogleTranslateInit = () => {
    initGoogleWidget();
    const callbacks = window.__nexusGoogleTranslateCallbacks || [];
    callbacks.forEach((cb) => cb());
    window.__nexusGoogleTranslateCallbacks = [];
  };

  const script = document.createElement('script');
  script.id = 'google-translate-element-script';
  script.src = 'https://translate.google.com/translate_a/element.js?cb=nexusGoogleTranslateInit';
  script.async = true;
  document.body.appendChild(script);
};

const applyLanguage = (langCode, { allowReloadFallback = true } = {}) => {
  const safeCode = langCode || SOURCE_LANGUAGE;
  setCookie('googtrans', `/${SOURCE_LANGUAGE}/${safeCode}`);
  document.documentElement.setAttribute('lang', safeCode);

  const combo = document.querySelector('.goog-te-combo');
  if (combo) {
    combo.value = safeCode;
    combo.dispatchEvent(new Event('change'));
    return;
  }

  if (allowReloadFallback) {
    window.location.reload();
  }
};

const applyAccessibility = ({ zoomLevel, highContrast, reducedMotion, readableFont }) => {
  const safeZoom = Number(zoomLevel) || 100;
  const zoomScale = Math.max(80, Math.min(160, safeZoom)) / 100;
  const root = document.documentElement;

  root.style.setProperty('--nexus-a11y-zoom', String(zoomScale));
  root.classList.toggle('nexus-a11y-high-contrast', Boolean(highContrast));
  root.classList.toggle('nexus-a11y-reduced-motion', Boolean(reducedMotion));
  root.classList.toggle('nexus-a11y-readable-font', Boolean(readableFont));
};

const GlobalUtilityMenu = () => {
  const containerRef = useRef(null);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showA11y, setShowA11y] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  const [settings, setSettings] = useState({
    language: SOURCE_LANGUAGE,
    zoomLevel: 100,
    highContrast: false,
    reducedMotion: false,
    readableFont: false
  });

  useEffect(() => {
    const saved = readSavedSettings();
    const nextSettings = {
      language: saved?.language || SOURCE_LANGUAGE,
      zoomLevel: saved?.zoomLevel || 100,
      highContrast: Boolean(saved?.highContrast),
      reducedMotion: Boolean(saved?.reducedMotion),
      readableFont: Boolean(saved?.readableFont)
    };

    setSettings(nextSettings);
    applyAccessibility(nextSettings);

    if (nextSettings.language && nextSettings.language !== SOURCE_LANGUAGE) {
      setCookie('googtrans', `/${SOURCE_LANGUAGE}/${nextSettings.language}`);
      document.documentElement.setAttribute('lang', nextSettings.language);
    }

    loadGoogleTranslateScript(() => {
      if (nextSettings.language && nextSettings.language !== SOURCE_LANGUAGE) {
        applyLanguage(nextSettings.language, { allowReloadFallback: false });
      }
    });
  }, []);

  useEffect(() => {
    saveSettings(settings);
    applyAccessibility(settings);
  }, [settings]);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onEscape);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onEscape);
    };
  }, []);

  const filteredLanguages = useMemo(() => {
    const query = languageSearch.trim().toLowerCase();
    if (!query) return LANGUAGE_OPTIONS;
    return LANGUAGE_OPTIONS.filter(
      (lang) =>
        lang.label.toLowerCase().includes(query) || lang.code.toLowerCase().includes(query)
    );
  }, [languageSearch]);

  const pathname = location.pathname || '';
  const ecosystemPrefixes = ['/dashboard', '/explorer', '/startups', '/investors', '/accelerators', '/profile'];
  const isEcosystemRoute = ecosystemPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  const handleLanguageChange = (langCode) => {
    setSettings((prev) => ({ ...prev, language: langCode }));
    applyLanguage(langCode);
  };

  return (
    <div
      className={`nexus-utility-menu ${isEcosystemRoute ? 'nexus-utility-menu-ecosystem' : 'nexus-utility-menu-public'}`}
      ref={containerRef}
    >
      <button
        type="button"
        className="nexus-utility-trigger"
        aria-expanded={isOpen}
        aria-label="Abrir menu de idioma y accesibilidad"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        ...
      </button>

      <div id="google_translate_element_hidden" style={{ display: 'none' }} />

      {isOpen && (
        <div className="nexus-utility-panel">
          <div className="nexus-utility-section">
            <p className="nexus-utility-title">Cambiar idioma</p>
            <input
              type="text"
              className="nexus-utility-search"
              placeholder="Buscar idioma"
              value={languageSearch}
              onChange={(e) => setLanguageSearch(e.target.value)}
            />
            <select
              className="nexus-utility-select"
              value={settings.language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              size={8}
            >
              {filteredLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label} ({lang.code})
                </option>
              ))}
            </select>
            <p className="nexus-utility-hint">
              Idiomas disponibles: {LANGUAGE_OPTIONS.length}
            </p>
          </div>

          <div className="nexus-utility-section">
            <button
              type="button"
              className="nexus-a11y-toggle"
              onClick={() => setShowA11y((prev) => !prev)}
            >
              Accesibilidad
            </button>

            {showA11y && (
              <div className="nexus-a11y-controls">
                <label className="nexus-a11y-label">Escala visual ({settings.zoomLevel}%)</label>
                <input
                  type="range"
                  min="80"
                  max="160"
                  step="10"
                  value={settings.zoomLevel}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10);
                    setSettings((prev) => ({ ...prev, zoomLevel: value }));
                  }}
                />

                <label className="nexus-a11y-check">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, highContrast: e.target.checked }))
                    }
                  />
                  Alto contraste
                </label>

                <label className="nexus-a11y-check">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, reducedMotion: e.target.checked }))
                    }
                  />
                  Reducir animaciones
                </label>

                <label className="nexus-a11y-check">
                  <input
                    type="checkbox"
                    checked={settings.readableFont}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, readableFont: e.target.checked }))
                    }
                  />
                  Fuente legible
                </label>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalUtilityMenu;
