import React from 'react';

/**
 * Pagination — Componente reutilizable para controles de paginación
 * 
 * Props:
 * - currentPage: Página actual (number)
 * - totalPages: Total de páginas (number)
 * - onPageChange: Función que recibe el nuevo número de página
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      marginTop: '32px',
      marginBottom: '16px',
    },
    button: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      color: '#f3f4f6',
      borderRadius: '8px',
      padding: '8px 16px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    buttonDisabled: {
      color: '#4b5563',
      cursor: 'not-allowed',
      opacity: 0.5
    },
    info: {
      fontSize: '14px',
      color: '#9ca3af',
      fontWeight: '400'
    },
    pageNumber: {
      color: '#c084fc',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          ...styles.button,
          ...(currentPage === 1 ? styles.buttonDisabled : {})
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }
        }}
      >
        <span>◀</span> Anterior
      </button>

      <span style={styles.info}>
        Página <span style={styles.pageNumber}>{currentPage}</span> de <span style={styles.pageNumber}>{totalPages}</span>
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          ...styles.button,
          ...(currentPage === totalPages ? styles.buttonDisabled : {})
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.borderColor = 'rgba(192, 132, 252, 0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }
        }}
      >
        Siguiente <span>▶</span>
      </button>
    </div>
  );
};

export default Pagination;
