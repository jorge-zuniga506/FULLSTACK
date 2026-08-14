import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { localApi } from '../../services/localStorageAdapter';

const API_HOST = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3007';
const API_PREFIXES = ['/api', '/api/v1'];

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

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
};

const unwrapData = (payload) => payload?.data?.data ?? payload?.data ?? null;
const readMessage = (payload, fallback) => payload?.message || payload?.meta?.error || fallback;

const Avatar = ({ src, name, size = 40 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #8b00dd, #00aaff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.36,
    fontWeight: '700',
    color: '#fff'
  }}>
    {src
      ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      : (name || 'A').charAt(0).toUpperCase()}
  </div>
);

const PostCard = ({ post, currentAceleradoraId, token, onDeleted, onComentado, setError }) => {
  const [showComments, setShowComments] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  const authorName = post.Aceleradora?.nombre || post.Aceleradora?.User?.nombre || 'Aceleradora';
  const authorPic = post.Aceleradora?.User?.foto_perfil;
  const etiqueta = post.Aceleradora?.sitio_web;
  const isOwner = post.aceleradora_id === currentAceleradoraId;

  const enviarComentario = async () => {
    if (!nuevoComentario.trim()) return;
    setEnviando(true);
    try {
      const r = await fetchWithApiFallback(`/feed/aceleradora/${post.id}/comentarios`, () => ({
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ contenido: nuevoComentario })
      }));
      const payload = await r.json();
      if (!r.ok) {
        setError(readMessage(payload, 'No se pudo publicar el comentario.'));
        return;
      }
      const comentario = unwrapData(payload);
      setNuevoComentario('');
      onComentado(post.id, comentario);
    } catch {
      setError('No se pudo conectar con el servidor para comentar.');
    } finally {
      setEnviando(false);
    }
  };

  const eliminarComentario = async (comentarioId) => {
    try {
      const r = await fetchWithApiFallback(`/feed/aceleradora/comentarios/${comentarioId}`, () => ({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }));
      const payload = await r.json();
      if (!r.ok) {
        setError(readMessage(payload, 'No se pudo eliminar el comentario.'));
        return;
      }
      onComentado(post.id, null, comentarioId);
    } catch {
      setError('No se pudo conectar con el servidor para eliminar el comentario.');
    }
  };

  const comentarios = post.AceleradoraComentarios || [];

  return (
    <div style={{
      background: 'rgba(11,19,36,0.62)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '18px',
      padding: '20px',
      marginBottom: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
        <Avatar src={authorPic} name={authorName} size={44} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '700', color: '#fff', fontSize: '14px' }}>{authorName}</span>
            {etiqueta && (
              <span style={{
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '50px',
                color: '#b1f500',
                background: 'rgba(177,245,0,0.1)'
              }}>
                {etiqueta}
              </span>
            )}
          </div>
          <span style={{ fontSize: '12px', color: '#4a5568' }}>{timeAgo(post.created_at)}</span>
        </div>
        {isOwner && (
          <button
            onClick={() => onDeleted(post.id)}
            title="Eliminar post"
            style={{ background: 'none', border: 'none', color: '#b3bfd0', cursor: 'pointer' }}
          >
            Eliminar
          </button>
        )}
      </div>

      <p style={{ margin: '0 0 12px', fontSize: '15px', color: '#e2e8f0', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
        {post.contenido}
      </p>

      {post.imagen_url && (
        <div style={{ marginBottom: '12px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
          <img
            src={post.imagen_url}
            alt="Imagen del post"
            style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block', cursor: 'pointer' }}
            onClick={() => window.open(post.imagen_url, '_blank')}
          />
        </div>
      )}

      <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button
          onClick={() => setShowComments(!showComments)}
          style={{ background: 'none', border: 'none', color: '#95a6bc', fontWeight: '700', cursor: 'pointer', padding: 0 }}
        >
          Comentarios ({comentarios.length})
        </button>
      </div>

      {showComments && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '12px' }}>
            {comentarios.map((c) => {
              const cName = c.Aceleradora?.nombre || c.Aceleradora?.User?.nombre || 'Aceleradora';
              const cPic = c.Aceleradora?.User?.foto_perfil;
              const isMyComment = c.aceleradora_id === currentAceleradoraId;
              return (
                <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Avatar src={cPic} name={cName} size={32} />
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '8px 10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#c084fc' }}>{cName}</span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#4a5568' }}>{timeAgo(c.created_at)}</span>
                        {isMyComment && (
                          <button
                            onClick={() => eliminarComentario(c.id)}
                            style={{ background: 'none', border: 'none', color: '#9caec2', cursor: 'pointer' }}
                          >
                            x
                          </button>
                        )}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0', lineHeight: '1.45' }}>{c.contenido}</p>
                  </div>
                </div>
              );
            })}
            {comentarios.length === 0 && (
              <p style={{ color: '#4a5568', fontSize: '13px', textAlign: 'center', padding: '6px 0' }}>
                Aun no hay comentarios.
              </p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              value={nuevoComentario}
              onChange={(e) => setNuevoComentario(e.target.value)}
              placeholder="Escribe un comentario..."
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  enviarComentario();
                }
              }}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                color: '#fff',
                resize: 'none'
              }}
            />
            <button
              onClick={enviarComentario}
              disabled={enviando || !nuevoComentario.trim()}
              style={{
                padding: '10px 14px',
                border: 'none',
                borderRadius: '10px',
                color: '#fff',
                fontWeight: '700',
                cursor: 'pointer',
                opacity: (!nuevoComentario.trim() || enviando) ? 0.5 : 1,
                background: 'linear-gradient(135deg, #8b00dd, #5500aa)'
              }}
            >
              {enviando ? '...' : 'Comentar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const AceleradoraFeed = () => {
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicando, setPublicando] = useState(false);
  const [currentAceleradoraId, setCurrentAceleradoraId] = useState(null);
  const [error, setError] = useState('');
  const [okMessage, setOkMessage] = useState('');

  const [contenido, setContenido] = useState('');
  const [imagen, setImagen] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileRef = useRef(null);

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const r = await fetchWithApiFallback('/feed/aceleradora', () => ({
        headers: { Authorization: `Bearer ${token}` }
      }));
      const payload = await r.json();
      if (!r.ok) {
        setError(readMessage(payload, 'No se pudo cargar la red de aceleradoras.'));
        setPosts([]);
        return;
      }
      const rows = unwrapData(payload);
      setPosts(Array.isArray(rows) ? rows : []);
    } catch {
      setError('No se pudo conectar con el servidor para cargar publicaciones.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    fetchWithApiFallback('/dashboard/aceleradora', () => ({ headers: { Authorization: `Bearer ${token}` } }))
      .then((r) => r.json())
      .then((payload) => {
        const d = unwrapData(payload) || payload?.data || payload;
        const ownId = d?.aceleradoraInfo?.id || d?.aceleradora_id || null;
        setCurrentAceleradoraId(ownId);
      })
      .catch(() => {});

    loadFeed();
  }, [token, loadFeed]);

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

  const publicar = async () => {
    if (!contenido.trim()) return;
    setPublicando(true);
    setError('');
    setOkMessage('');
    try {
      const form = new FormData();
      form.append('contenido', contenido.trim());
      if (imagen) form.append('imagen', imagen);

      const r = await fetchWithApiFallback('/feed/aceleradora', () => ({
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form
      }));
      const payload = await r.json();
      if (!r.ok) {
        setError(readMessage(payload, 'No se pudo publicar el post.'));
        return;
      }

      const nuevoPost = unwrapData(payload);
      if (!nuevoPost || !nuevoPost.id) {
        setError('El servidor respondio sin el post creado.');
        return;
      }

      setPosts((prev) => [nuevoPost, ...prev]);
      setContenido('');
      quitarImagen();
      setCurrentAceleradoraId((prev) => prev || nuevoPost.aceleradora_id || null);
      setOkMessage('Publicacion creada con exito.');
    } catch {
      setError('No se pudo conectar con el servidor para publicar.');
    } finally {
      setPublicando(false);
    }
  };

  const handleDeleted = async (postId) => {
    setError('');
    try {
      const r = await fetchWithApiFallback(`/feed/aceleradora/${postId}`, () => ({
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }));
      const payload = await r.json();
      if (!r.ok) {
        setError(readMessage(payload, 'No se pudo eliminar el post.'));
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
      setError('No se pudo conectar con el servidor para eliminar el post.');
    }
  };

  const handleComentado = (postId, nuevoComentario, deletedId) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      let comentarios = p.AceleradoraComentarios || [];
      if (deletedId) comentarios = comentarios.filter((c) => c.id !== deletedId);
      else if (nuevoComentario) comentarios = [...comentarios, nuevoComentario];
      return { ...p, AceleradoraComentarios: comentarios };
    }));
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '10px 0 40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', color: '#fff' }}>Red de Aceleradoras</h1>
        <p style={{ margin: '8px 0 0', color: '#8899aa', fontSize: '14px' }}>
          Comparte avances, convocatorias y aprendizajes con otras aceleradoras del ecosistema.
        </p>
      </div>

      {error && (
        <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '10px', color: '#fecaca', background: 'rgba(127,29,29,0.35)', border: '1px solid rgba(239,68,68,0.45)' }}>
          {error}
        </div>
      )}
      {okMessage && (
        <div style={{ marginBottom: '12px', padding: '10px 12px', borderRadius: '10px', color: '#d1fae5', background: 'rgba(6,78,59,0.35)', border: '1px solid rgba(16,185,129,0.45)' }}>
          {okMessage}
        </div>
      )}

      <div style={{
        background: 'rgba(11,19,36,0.72)',
        border: '1px solid rgba(139,0,221,0.28)',
        borderRadius: '18px',
        padding: '18px',
        marginBottom: '22px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <Avatar src={user?.foto_perfil || user?.profile_picture} name={user?.nombre || 'A'} size={42} />
          <div style={{ flex: 1 }}>
            <textarea
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              placeholder="Que esta pasando en tu aceleradora? Comparte avances, convocatoria o aprendizajes..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                color: '#fff',
                resize: 'none',
                boxSizing: 'border-box'
              }}
            />

            {preview && (
              <div style={{ position: 'relative', marginTop: '10px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={preview} alt="Preview" style={{ width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block' }} />
                <button
                  onClick={quitarImagen}
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.75)',
                    border: 'none',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '3px 8px',
                    cursor: 'pointer'
                  }}
                >
                  Quitar
                </button>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  padding: '8px 12px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#a5b4c6',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {imagen ? `Imagen: ${imagen.name}` : 'Adjuntar imagen'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />

              <button
                onClick={publicar}
                disabled={publicando || !contenido.trim()}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  opacity: (publicando || !contenido.trim()) ? 0.6 : 1,
                  background: 'linear-gradient(135deg, #8b00dd, #5500aa)'
                }}
              >
                {publicando ? 'Publicando...' : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#7d8ea6', fontSize: '14px' }}>Cargando publicaciones...</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '70px 20px', color: '#7587a0', border: '1px dashed rgba(255,255,255,0.12)', borderRadius: '18px' }}>
          <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>No hay publicaciones aun</p>
          <p style={{ fontSize: '14px', margin: 0 }}>Se la primera aceleradora en compartir algo en la red.</p>
        </div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentAceleradoraId={currentAceleradoraId}
            token={token}
            onDeleted={handleDeleted}
            onComentado={handleComentado}
            setError={setError}
          />
        ))
      )}
    </div>
  );
};

export default AceleradoraFeed;

