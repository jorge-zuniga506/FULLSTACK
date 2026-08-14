import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localApi } from '../../services/localStorageAdapter';

const API_HOST = 'http://localhost:3007';
const API_PREFIXES = ['/api', '/api/v1'];
const unwrapData = (payload) => payload?.data?.data ?? payload?.data ?? null;
const asArray = (value) => (Array.isArray(value) ? value : []);

const fetchWithApiFallback = async (path, buildInit) => {
  for (let i = 0; i < API_PREFIXES.length; i += 1) {
    const prefix = API_PREFIXES[i];
    const init = typeof buildInit === 'function' ? buildInit(prefix) : buildInit;
    try {
      const response = await fetch(`${API_HOST}${prefix}${path}`, init);
      if (response.ok) {
        return response;
      }
    } catch (err) {}
  }

  // Fallback a localApi
  const init = typeof buildInit === 'function' ? buildInit('/api') : buildInit;
  const method = init?.method || 'GET';
  let bodyData = null;
  if (init?.body) {
    try {
      bodyData = typeof init.body === 'string' ? JSON.parse(init.body) : init.body;
    } catch {
      bodyData = init.body;
    }
  }
  const result = localApi.dispatch(method, path, bodyData);
  return {
    ok: true,
    status: 200,
    json: async () => ({ status: 'success', data: result })
  };
};

/* ── Tiempo relativo ─────────────────────────────────────────────────────── */
const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60)  return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
};

/* ── Avatar helper ───────────────────────────────────────────────────────── */
const Avatar = ({ src, name, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
    background: 'linear-gradient(135deg, #8b00dd, #00aaff)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: '700', color: '#fff',
    border: '2px solid rgba(139,0,221,0.3)'
  }}>
    {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (name || 'S').charAt(0).toUpperCase()}
  </div>
);

/* ── PostCard ─────────────────────────────────────────────────────────────── */
const PostCard = ({ post, currentStartupId, token, onDeleted, onComentado }) => {
  const [showComments, setShowComments] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const authorName = post.Startup?.nombre_comercial || post.Startup?.User?.nombre || 'Startup';
  const authorPic  = post.Startup?.logo_url || post.Startup?.User?.foto_perfil;
  const sector     = post.Startup?.Sector?.nombre;
  const isOwner    = post.startup_id === currentStartupId;

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setEnviando(true);
    try {
      const r = await fetchWithApiFallback(`/feed/${post.id}/comentarios`, () => ({
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contenido: nuevoComentario })
      }));
      if (r.ok) {
        const data = await r.json();
        const comentario = unwrapData(data);
        setNuevoComentario('');
        if (comentario) onComentado(post.id, comentario);
      }
    } finally { setEnviando(false); }
  };

  const eliminarComentario = async (cId) => {
    await fetchWithApiFallback(`/feed/comentarios/${cId}`, () => ({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }));
    onComentado(post.id, null, cId); // null = eliminado
  };

  return (
    <div style={{
      background: 'rgba(11,19,36,0.6)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '18px',
      padding: '20px 22px',
      backdropFilter: 'blur(12px)',
      transition: 'border-color 0.2s ease',
      marginBottom: '16px'
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(139,0,221,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Header del post */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
        <Avatar src={authorPic} name={authorName} size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{authorName}</span>
            {sector && (
              <span style={{ fontSize: '11px', padding: '2px 8px', background: 'rgba(177,245,0,0.1)', color: '#b1f500', borderRadius: '50px', fontWeight: '600' }}>
                {sector}
              </span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#4a5568' }}>{timeAgo(post.created_at)}</span>
        </div>
        {isOwner && (
          <button onClick={() => onDeleted(post.id)} title="Eliminar post" style={{
            background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer',
            fontSize: '16px', padding: '4px', borderRadius: '6px', transition: 'color 0.2s'
          }}
            onMouseEnter={e => e.target.style.color = '#ef4444'}
            onMouseLeave={e => e.target.style.color = '#4a5568'}
          >🗑️</button>
        )}
      </div>

      {/* Contenido */}
      <p style={{ margin: '0 0 14px', fontSize: '15px', color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {post.contenido}
      </p>

      {/* Imagen */}
      {post.imagen_url && (
        <div style={{ marginBottom: '14px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <img
            src={post.imagen_url}
            alt="Imagen del post"
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
            onClick={() => window.open(post.imagen_url, '_blank')}
          />
        </div>
      )}

      {/* Footer: comentarios */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => setShowComments(!showComments)} style={{
          background: 'none', border: 'none', color: showComments ? '#8b00dd' : '#8899aa',
          fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          💬 {post.StartupComentarios?.length || 0} comentarios
        </button>
      </div>

      {/* Sección de comentarios */}
      {showComments && (
        <div style={{ marginTop: '14px' }}>
          {/* Lista de comentarios */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
            {(post.StartupComentarios || []).map(c => {
              const cName = c.Startup?.nombre_comercial || c.Startup?.User?.nombre || 'Startup';
              const cPic  = c.Startup?.logo_url || c.Startup?.User?.foto_perfil;
              const isMyComment = c.startup_id === currentStartupId;
              return (
                <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Avatar src={cPic} name={cName} size={32} />
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '8px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#c084fc' }}>{cName}</span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#4a5568' }}>{timeAgo(c.created_at)}</span>
                        {isMyComment && (
                          <button onClick={() => eliminarComentario(c.id)} style={{ background: 'none', border: 'none', color: '#4a5568', cursor: 'pointer', fontSize: '12px', padding: 0 }}
                            onMouseEnter={e => e.target.style.color = '#ef4444'}
                            onMouseLeave={e => e.target.style.color = '#4a5568'}
                          >✕</button>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0', lineHeight: '1.5' }}>{c.contenido}</p>
                  </div>
                </div>
              );
            })}
            {(post.StartupComentarios || []).length === 0 && (
              <p style={{ color: '#4a5568', fontSize: '13px', textAlign: 'center', padding: '8px 0' }}>Sé el primero en comentar...</p>
            )}
          </div>

          {/* Caja de nuevo comentario */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={nuevoComentario}
                onChange={e => setNuevoComentario(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={2}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviarComentario(); } }}
                style={{
                  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff',
                  fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button onClick={enviarComentario} disabled={enviando || !nuevoComentario.trim()} style={{
              padding: '10px 16px', background: 'linear-gradient(135deg, #8b00dd, #5500aa)',
              border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700',
              fontSize: '13px', cursor: 'pointer', flexShrink: 0,
              opacity: (!nuevoComentario.trim() || enviando) ? 0.5 : 1,
              boxShadow: '0 4px 12px rgba(139,0,221,0.3)'
            }}>
              {enviando ? '...' : '↑'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── StartupFeed (Página principal) ─────────────────────────────────────── */
const StartupFeed = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [currentStartupId, setCurrentStartupId] = useState(null);

  // Formulario
  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  /* ── Cargar feed ────────────────────────────────────────────────────── */
  const loadFeed = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetchWithApiFallback('/feed', () => ({
        headers: { Authorization: `Bearer ${token}` }
      }));
      const data = await r.json();
      setPosts(asArray(unwrapData(data)));
    } catch {}
    finally { setLoading(false); }
  }, [token]);

  /* ── Obtener mi startup_id ──────────────────────────────────────────── */
  useEffect(() => {
    if (!token) return;
    fetchWithApiFallback('/dashboard/startup', () => ({ headers: { Authorization: `Bearer ${token}` } }))
      .then(r => r.json())
      .then(d => {
        // busca startup_id en la respuesta o simplemente lo sacamos del feed
        const dashboardData = unwrapData(d) || d?.data || d;
        setCurrentStartupId(dashboardData?.startupInfo?.id || dashboardData?.startup_id || null);
      }).catch(() => {});
    loadFeed();
  }, [token, loadFeed]);

  /* ── Preview de imagen ──────────────────────────────────────────────── */
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  };

  const quitarImagen = () => {
    setImagen(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  /* ── Publicar post ──────────────────────────────────────────────────── */
  const publicar = async () => {
    if (!contenido.trim()) return;
    setPublicando(true);
    try {
      const form = new FormData();
      form.append('contenido', contenido.trim());
      if (imagen) form.append('imagen', imagen);

      const r = await fetchWithApiFallback('/feed', () => {
        const newForm = new FormData();
        newForm.append('contenido', contenido.trim());
        if (imagen) newForm.append('imagen', imagen);
        return {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: newForm
        };
      });
      const data = await r.json();
      if (r.ok) {
        const nuevoPost = unwrapData(data);
        if (!nuevoPost) return;
        setPosts(prev => [nuevoPost, ...asArray(prev)]);
        setContenido('');
        quitarImagen();
        // Intentar capturar el startup_id del primer post propio
        if (nuevoPost.startup_id && !currentStartupId) {
          setCurrentStartupId(nuevoPost.startup_id);
        }
      }
    } catch {}
    finally { setPublicando(false); }
  };

  /* ── Eliminar post ──────────────────────────────────────────────────── */
  const handleDeleted = async (postId) => {
    await fetchWithApiFallback(`/feed/${postId}`, () => ({
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    }));
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  /* ── Actualizar comentarios en el estado local ──────────────────────── */
  const handleComentado = (postId, nuevoComentario, deletedId) => {
    setPosts(prev => asArray(prev).map(p => {
      if (p.id !== postId) return p;
      let comentarios = p.StartupComentarios || [];
      if (deletedId) {
        comentarios = comentarios.filter(c => c.id !== deletedId);
      } else if (nuevoComentario) {
        comentarios = [...comentarios, nuevoComentario];
      }
      return { ...p, StartupComentarios: comentarios };
    }));
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '10px 0 40px' }}>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #8b00dd, #00aaff)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
            🔎
          </div>
          <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px' }}>
            Búsqueda
          </h1>
          <span style={{ padding: '3px 10px', background: 'rgba(139,0,221,0.15)', border: '1px solid rgba(139,0,221,0.3)', borderRadius: '50px', fontSize: '11px', fontWeight: '700', color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Solo Startups
          </span>
        </div>
        <p style={{ margin: 0, color: '#8899aa', fontSize: '14px' }}>
          Comparte avances, haz preguntas y conecta con otras startups del ecosistema.
        </p>
      </div>

      {/* ── Caja de publicación ─────────────────────────────────────────── */}
      <div style={{
        background: 'rgba(11,19,36,0.7)',
        border: '1px solid rgba(139,0,221,0.2)',
        borderRadius: '18px',
        padding: '20px',
        marginBottom: '24px',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 0 24px rgba(139,0,221,0.08)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Avatar src={user?.foto_perfil || user?.profile_picture} name={user?.nombre || 'S'} size={42} />
          <div style={{ flex: 1 }}>
            <textarea
              value={contenido}
              onChange={e => setContenido(e.target.value)}
              placeholder="¿Qué está pasando con tu startup? Comparte un avance, pregunta o idea..."
              rows={3}
              style={{
                width: '100%', padding: '12px 14px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', color: '#fff', fontSize: '14px',
                outline: 'none', resize: 'none', fontFamily: 'inherit',
                boxSizing: 'border-box', lineHeight: '1.6',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(139,0,221,0.4)'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />

            {/* Preview imagen */}
            {preview && (
              <div style={{ position: 'relative', marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }} />
                <button onClick={quitarImagen} style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff',
                  borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer',
                  fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>✕</button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Botón subir imagen */}
                <button onClick={() => fileRef.current?.click()} style={{
                  padding: '8px 14px', background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px',
                  color: '#8899aa', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s ease'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(139,0,221,0.4)'; e.currentTarget.style.color = '#c084fc'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#8899aa'; }}
                >
                  🖼️ {imagen ? imagen.name.slice(0, 18) + (imagen.name.length > 18 ? '...' : '') : 'Imagen'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
              </div>

              <button
                onClick={publicar}
                disabled={publicando || !contenido.trim()}
                style={{
                  padding: '10px 22px',
                  background: contenido.trim()
                    ? 'linear-gradient(135deg, #8b00dd 0%, #5500aa 100%)'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none', borderRadius: '10px',
                  color: contenido.trim() ? '#fff' : '#4a5568',
                  fontWeight: '700', fontSize: '13px', cursor: contenido.trim() ? 'pointer' : 'not-allowed',
                  boxShadow: contenido.trim() ? '0 4px 14px rgba(139,0,221,0.3)' : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                {publicando ? '⏳ Publicando...' : '⚡ Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Feed de posts ───────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ background: 'rgba(11,19,36,0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '18px', padding: '22px', height: '140px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', animation: 'pulse 1.5s infinite' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: '14px', width: '140px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginBottom: '8px' }} />
                  <div style={{ height: '10px', width: '80px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px' }} />
                </div>
              </div>
              <div style={{ height: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ height: '12px', width: '70%', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: '#4a5568', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: '18px' }}>
          <p style={{ fontSize: '52px', marginBottom: '12px' }}>🚀</p>
          <p style={{ fontSize: '18px', fontWeight: '700', color: '#6b7280', marginBottom: '8px' }}>El feed está vacío</p>
          <p style={{ fontSize: '14px' }}>¡Sé el primero en compartir algo con la comunidad de startups!</p>
        </div>
      ) : (
        asArray(posts).map(post => (
          <PostCard
            key={post.id}
            post={post}
            currentStartupId={currentStartupId}
            token={token}
            onDeleted={handleDeleted}
            onComentado={handleComentado}
          />
        ))
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default StartupFeed;
