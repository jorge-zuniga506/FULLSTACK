import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { apiService } from '../../services/apiService';

const fallbackText = '-';

const isValidNumber = (value) => Number.isFinite(Number(value));

const formatCurrency = (value, currency, minDigits = 2, maxDigits = 2) => {
  if (!isValidNumber(value)) return fallbackText;

  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    minimumFractionDigits: minDigits,
    maximumFractionDigits: maxDigits
  }).format(Number(value));
};

const formatDate = (isoDate) => {
  if (!isoDate) return fallbackText;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return String(isoDate);
  return parsed.toLocaleString('es-CR');
};

const formatBtcRate = (value) => {
  if (!isValidNumber(value)) return fallbackText;
  const parsed = Number(value);
  if (parsed === 0) return '0';
  if (Math.abs(parsed) < 0.000001) return parsed.toExponential(4);
  return parsed.toFixed(8).replace(/0+$/, '').replace(/\.$/, '');
};

const ExchangeRatePanel = ({ accent = '#00aaff', secondary = '#8b00dd', showApiDetails = false }) => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await apiService.getOne('/api/indicadores/tc');
      setRates(response?.data || null);
    } catch (err) {
      setError(err.message || 'No se pudo cargar el tipo de cambio.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
    const intervalId = setInterval(fetchRates, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchRates]);

  const cards = useMemo(() => {
    const dolarCompra = rates?.dolar?.compra ?? null;
    const dolarVenta = rates?.dolar?.venta ?? null;
    const euroColones = rates?.euro?.colones ?? null;
    const btcUsd = rates?.bitcoin?.price_usd ?? null;
    const btcCrc = rates?.conversiones?.btc_to_crc ?? null;

    return [
      { label: 'USD Compra', value: formatCurrency(dolarCompra, 'CRC'), sub: 'CRC por 1 USD' },
      { label: 'USD Venta', value: formatCurrency(dolarVenta, 'CRC'), sub: 'CRC por 1 USD' },
      { label: 'EUR Oficial', value: formatCurrency(euroColones, 'CRC'), sub: 'CRC por 1 EUR' },
      { label: 'BTC (USD)', value: formatCurrency(btcUsd, 'USD', 2, 2), sub: 'USD por 1 BTC' },
      { label: 'BTC (CRC)', value: formatCurrency(btcCrc, 'CRC', 2, 2), sub: 'CRC por 1 BTC' }
    ];
  }, [rates]);

  return (
    <div
      style={{
        marginTop: '24px',
        background: 'rgba(11,19,36,0.55)',
        border: `1px solid ${accent}30`,
        borderRadius: '16px',
        padding: '20px',
        textAlign: 'left',
        boxShadow: `0 0 18px ${accent}12`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, color: '#fff', fontSize: '17px', fontWeight: '700' }}>
          Tipo de Cambio + Bitcoin
        </h3>
        <button
          type="button"
          onClick={fetchRates}
          disabled={loading}
          style={{
            padding: '7px 12px',
            borderRadius: '8px',
            border: `1px solid ${secondary}55`,
            background: `${secondary}1f`,
            color: '#fff',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {error ? (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 12px',
            borderRadius: '10px',
            background: 'rgba(127,29,29,0.35)',
            border: '1px solid rgba(239,68,68,0.45)',
            color: '#fecaca',
            fontSize: '13px'
          }}
        >
          {error}
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginTop: '14px' }}>
            {cards.map((card) => (
              <div
                key={card.label}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}
              >
                <p style={{ margin: '0 0 4px', fontSize: '11px', color: '#8899aa', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {card.label}
                </p>
                <p style={{ margin: '0 0 3px', fontSize: '18px', color: '#fff', fontWeight: '800' }}>{card.value}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#9aa9bc' }}>{card.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px', color: '#a8b7c9', fontSize: '13px', lineHeight: '1.6' }}>
            <div>1 CRC ~= {formatCurrency(rates?.conversiones?.crc_to_usd, 'USD', 6, 6)}</div>
            <div>1 CRC ~= {formatCurrency(rates?.conversiones?.crc_to_eur, 'EUR', 6, 6)}</div>
            <div>1 CRC ~= {formatBtcRate(rates?.conversiones?.crc_to_btc)} BTC</div>
            <div style={{ marginTop: '6px', fontSize: '11px', color: '#7f90a7' }}>
              Ultima actualizacion: {formatDate(rates?.obtenido_en)}
            </div>
          </div>

          {Array.isArray(rates?.warnings) && rates.warnings.length > 0 && (
            <div
              style={{
                marginTop: '10px',
                padding: '10px 12px',
                borderRadius: '10px',
                background: 'rgba(113,63,18,0.35)',
                border: '1px solid rgba(245,158,11,0.45)',
                color: '#fde68a',
                fontSize: '12px'
              }}
            >
              {rates.warnings.join(' | ')}
            </div>
          )}
        </>
      )}

      {showApiDetails && (
        <div style={{ marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#8899aa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            cURL APIs
          </p>
          <code
            style={{
              display: 'block',
              fontSize: '12px',
              color: '#d6e5f5',
              background: 'rgba(0,0,0,0.24)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '8px 10px',
              marginBottom: '8px',
              overflowX: 'auto'
            }}
          >
            {rates?.curl?.dolar || 'curl "https://api.hacienda.go.cr/indicadores/tc/dolar"'}
          </code>
          <code
            style={{
              display: 'block',
              fontSize: '12px',
              color: '#d6e5f5',
              background: 'rgba(0,0,0,0.24)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '8px 10px',
              marginBottom: '8px',
              overflowX: 'auto'
            }}
          >
            {rates?.curl?.euro || 'curl "https://api.hacienda.go.cr/indicadores/tc/euro"'}
          </code>
          <code
            style={{
              display: 'block',
              fontSize: '12px',
              color: '#d6e5f5',
              background: 'rgba(0,0,0,0.24)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '8px 10px',
              overflowX: 'auto'
            }}
          >
            {rates?.curl?.bitcoin || 'curl "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=bitcoin"'}
          </code>
        </div>
      )}
    </div>
  );
};

export default ExchangeRatePanel;
