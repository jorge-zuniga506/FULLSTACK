import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

/**
 * ReusableCRUD — Componente genérico para gestionar colecciones de datos (CRUD)
 *
 * Props:
 * - endpoint: Ruta del endpoint de la API (ej: '/api/startups')
 * - columns: Array que define las columnas del grid y campos de formulario
 *   Ej: { key: 'nombre_comercial', label: 'Nombre', type: 'text', required: true }
 * - title: Título del módulo (ej: "Gestión de Startups")
 * - defaultValues: Objeto con valores predeterminados para la creación
 */
const ReusableCRUD = ({ service, columns, title, defaultValues = {}, onActionSuccess }) => {
  const { token, user } = useAuth();

  // Estados de datos
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Paginación y búsqueda
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estados del modal de formulario (Crear / Editar)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Estado del modal de confirmación de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Obtiene los datos de la API
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Usamos el servicio específico inyectado para la petición GET
      const data = await service.getAll({
        page: currentPage,
        limit: 5, // 5 por página para que quepa bien en el dash
        search: searchQuery
      }, token);
      
      // Adaptamos dinámicamente si el backend devuelve paginación estructurada o un array directo
      if (data && Array.isArray(data)) {
        setItems(data);
        setTotalPages(1);
      } else if (data && typeof data === 'object') {
        // Buscamos dinámicamente la clave que contenga el array de datos (ej: startups)
        const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        const rows = arrayKey ? data[arrayKey] : (data.rows || data.items || []);
        setItems(rows);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Recarga al cambiar página, token o búsqueda
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [currentPage, searchQuery, token]);

  // Manejador del campo de búsqueda (con debouncing simple)
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reiniciar a página 1 al buscar
  };

  // Abre el modal de creación
  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormError('');
    // Rellenamos el formulario con los default values o vacíos
    const initialData = {};
    columns.forEach(col => {
      initialData[col.key] = col.defaultValue !== undefined ? col.defaultValue : '';
    });
    // Si la columna requiere user_id, le asignamos el ID del usuario logueado
    if (initialData.user_id === '' && user?.id) {
      initialData.user_id = user.id;
    }
    setFormData({ ...initialData, ...defaultValues });
    setIsModalOpen(true);
  };

  // Abre el modal de edición
  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormError('');
    const editData = {};
    columns.forEach(col => {
      editData[col.key] = item[col.key] !== null && item[col.key] !== undefined ? item[col.key] : '';
    });
    setFormData(editData);
    setIsModalOpen(true);
  };

  // Maneja cambios en campos del formulario dinámico
  const handleInputChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Envía el formulario (Creación o Edición)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const isEdit = modalMode === 'edit';

      // Convertimos campos numéricos para cumplir con validaciones Sequelize/express-validator
      const parsedData = { ...formData };
      columns.forEach(col => {
        if (col.type === 'number' && parsedData[col.key] !== '') {
          parsedData[col.key] = parseInt(parsedData[col.key], 10);
        }
      });

      if (isEdit) {
        await service.update(selectedItem.id, parsedData, token);
      } else {
        await service.create(parsedData, token);
      }

      setIsModalOpen(false);
      fetchData(); // Recargar datos
      if (onActionSuccess) onActionSuccess(); // Refresco externo
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Abre el modal de confirmación de eliminación
  const handleOpenDelete = (item) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  // Ejecuta la eliminación del registro
  const handleDeleteConfirm = async () => {
    setDeleteSubmitting(true);
    try {
      await service.delete(itemToDelete.id, token);

      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      
      // Si eliminamos el último elemento de una página, retrocedemos
      if (items.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        fetchData();
      }
      if (onActionSuccess) onActionSuccess(); // Refresco externo
    } catch (err) {
      alert(`⚠️ Error: ${err.message}`);
    } finally {
      setDeleteSubmitting(false);
    }
  };

  return (
    <div className="db-card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
      
      {/* ── HEADER DEL MÓDULO CRUD ───────────────────────────────────── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div>
          <h2 className="db-card-title" style={{ margin: '0 0 4px', fontSize: '20px', color: '#f3f4f6' }}>{title}</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af' }}>Consola administrativa conectada de forma directa en MySQL2</p>
        </div>
        <button
          onClick={handleOpenCreate}
          style={{
            background: 'linear-gradient(135deg, #aa3bff, #8b00dd)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 0 15px rgba(170, 59, 255, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 0 25px rgba(170, 59, 255, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(170, 59, 255, 0.4)';
          }}
        >
          ➕ Agregar Nuevo
        </button>
      </div>

      {/* ── SECCIÓN DE BÚSQUEDA ───────────────────────────────────────── */}
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <input
          type="text"
          placeholder={`🔍 Buscar en ${title.toLowerCase()}...`}
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '8px',
            padding: '12px 16px',
            color: '#f3f4f6',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.border = '1px solid rgba(192, 132, 252, 0.5)';
            e.target.style.boxShadow = '0 0 10px rgba(192, 132, 252, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid rgba(255, 255, 255, 0.08)';
            e.target.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* ── TABLA DE DATOS ────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          padding: '12px',
          fontSize: '14px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          ⚠️ {error}
        </div>
      )}

      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px 0',
          color: '#c084fc'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(192, 132, 252, 0.1)',
            borderRadius: '50%',
            borderLeftColor: '#c084fc',
            animation: 'spin 1s linear infinite',
            marginBottom: '15px'
          }}></div>
          <span style={{ fontSize: '14px', letterSpacing: '1px' }}>Cargando registros...</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      ) : items.length === 0 ? (
        <div style={{
          padding: '40px 0',
          textAlign: 'center',
          color: '#9ca3af',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: '8px',
          border: '1px dashed rgba(255, 255, 255, 0.05)'
        }}>
          📭 No se encontraron registros.
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {columns.map(col => (
                  <th key={col.key} style={{ padding: '12px 16px', color: '#c084fc', fontWeight: '600' }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ padding: '12px 16px', color: '#c084fc', fontWeight: '600', textAlign: 'right' }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.2s ease',
                }}
                className="crud-row"
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {columns.map(col => (
                    <td key={col.key} style={{ padding: '14px 16px', color: '#e5e7eb', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {/* Formateador sutil de datos */}
                      {col.type === 'select' && item[col.key] ? (
                        <span style={{
                          background: 'rgba(192, 132, 252, 0.1)',
                          border: '1px solid rgba(192, 132, 252, 0.3)',
                          borderRadius: '12px',
                          padding: '2px 8px',
                          fontSize: '12px',
                          color: '#c084fc'
                        }}>
                          {item[col.key]}
                        </span>
                      ) : (
                        item[col.key] !== null && item[col.key] !== undefined ? String(item[col.key]) : '-'
                      )}
                    </td>
                  ))}
                  
                  {/* Acciones de edición y borrado */}
                  <td style={{ padding: '14px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleOpenEdit(item)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        marginRight: '8px',
                        color: '#a78bfa',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(167, 139, 250, 0.15)';
                        e.currentTarget.style.borderColor = '#a78bfa';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleOpenDelete(item)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.05)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        color: '#f87171',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
                        e.currentTarget.style.borderColor = '#f87171';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                      }}
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PAGINACIÓN ────────────────────────────────────────────────── */}
      {!loading && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px',
          marginTop: '24px'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: currentPage === 1 ? '#4b5563' : '#f3f4f6',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            ◀ Anterior
          </button>
          <span style={{ fontSize: '13px', color: '#9ca3af' }}>Pág. {currentPage} de {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: currentPage === totalPages ? '#4b5563' : '#f3f4f6',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Siguiente ▶
          </button>
        </div>
      )}

      {/* ── MODAL DINÁMICO FORMULARIO (GLASSMORPHIC) ────────────────────── */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(22, 23, 29, 0.95)',
            border: '1px solid rgba(192, 132, 252, 0.25)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            animation: 'fadeIn 0.3s ease',
            overflow: 'hidden'
          }}>
            {/* Cabecera del Modal */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#c084fc' }}>
                {modalMode === 'edit' ? '✏️ Editar Registro' : '➕ Agregar Registro'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '20px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>

            {/* Contenido / Formulario */}
            <form onSubmit={handleFormSubmit} style={{ padding: '24px' }}>
              {formError && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '8px',
                  color: '#f87171',
                  padding: '12px',
                  fontSize: '13px',
                  marginBottom: '20px',
                  textAlign: 'left'
                }}>
                  ⚠️ {formError}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '400px', overflowY: 'auto', paddingRight: '4px' }}>
                {columns.map(col => {
                  // Si el campo es autogestionado por el usuario logueado en la creación (como user_id),
                  // lo renderizamos deshabilitado pero visible para mayor claridad.
                  const isUserIDField = col.key === 'user_id';

                  return (
                    <div key={col.key} style={{ display: 'flex', flexDirection: 'column', gap: '6px', textAlign: 'left' }}>
                      <label htmlFor={`form-${col.key}`} style={{ fontSize: '13px', fontWeight: '600', color: '#e5e7eb' }}>
                        {col.label} {col.required && <span style={{ color: '#f87171' }}>*</span>}
                      </label>

                      {col.type === 'textarea' ? (
                        <textarea
                          id={`form-${col.key}`}
                          rows={3}
                          value={formData[col.key]}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                          required={col.required}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#f3f4f6',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      ) : col.type === 'select' ? (
                        <select
                          id={`form-${col.key}`}
                          value={formData[col.key]}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                          required={col.required}
                          style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: '#f3f4f6',
                            fontSize: '14px',
                            outline: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Seleccione una opción...</option>
                          {col.options.map(opt => (
                            <option key={opt} value={opt} style={{ background: '#16171d' }}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={col.type === 'number' ? 'number' : 'text'}
                          id={`form-${col.key}`}
                          value={formData[col.key]}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                          required={col.required}
                          disabled={isUserIDField && modalMode === 'create'}
                          style={{
                            background: isUserIDField && modalMode === 'create' ? 'rgba(255,255,255,0.01)' : 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            color: isUserIDField && modalMode === 'create' ? '#6b7280' : '#f3f4f6',
                            fontSize: '14px',
                            outline: 'none'
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botones de acción del Modal */}
              <div style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px'
              }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#e5e7eb',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  style={{
                    background: 'linear-gradient(135deg, #aa3bff, #8b00dd)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {formSubmitting ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL ALERTA CONFIRMACIÓN ELIMINACIÓN ─────────────────────── */}
      {isDeleteModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(22, 23, 29, 0.95)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '400px',
            padding: '24px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', color: '#f87171', fontSize: '18px' }}>¿Confirmar Eliminación?</h3>
            <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: '1.4', marginBottom: '24px' }}>
              Esta acción eliminará de forma definitiva el registro de la base de datos MySQL. Esta operación no se puede deshacer.
            </p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#e5e7eb',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteSubmitting}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {deleteSubmitting ? 'Eliminando...' : 'Eliminar Definitivamente'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReusableCRUD;
