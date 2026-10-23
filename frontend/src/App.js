import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function App() {
  const [data, setData] = useState({ metrics: {}, timeseries: [] });
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-05");

  const backendUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/wind-data?start_date=${startDate}&end_date=${endDate}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("API Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '32px' }}>
      <header style={{ borderBottom: '1px solid #1e293b', paddingBottom: '20px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0', color: '#38bdf8' }}>
            UK Day-Ahead Wind Forecast & Generation Portal
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
            Decision-support intelligence for UK Day-Ahead Electricity Procurement (Elexon BMRS - Jan 2026)
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>
            Start: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', marginLeft: '6px' }} />
          </label>
          <label style={{ fontSize: '13px', color: '#94a3b8' }}>
            End: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ background: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '6px 10px', marginLeft: '6px' }} />
          </label>
        </div>
      </header>

      {/* KPI Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>Mean Absolute Error (MAE)</span>
          <h2 style={{ fontSize: '26px', margin: '8px 0 0 0', color: '#38bdf8' }}>{data.metrics?.mae_mw ?? '--'} <span style={{ fontSize: '14px', color: '#6b7280' }}>MW</span></h2>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>Root Mean Sq. Error (RMSE)</span>
          <h2 style={{ fontSize: '26px', margin: '8px 0 0 0', color: '#f87171' }}>{data.metrics?.rmse_mw ?? '--'} <span style={{ fontSize: '14px', color: '#6b7280' }}>MW</span></h2>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>Total Actual Energy</span>
          <h2 style={{ fontSize: '26px', margin: '8px 0 0 0', color: '#4ade80' }}>{data.metrics?.total_actual_mwh?.toLocaleString() ?? '--'} <span style={{ fontSize: '14px', color: '#6b7280' }}>MWh</span></h2>
        </div>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
          <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#9ca3af' }}>Settlement Intervals</span>
          <h2 style={{ fontSize: '26px', margin: '8px 0 0 0', color: '#facc15' }}>{data.metrics?.total_points ?? 0} <span style={{ fontSize: '14px', color: '#6b7280' }}>HH</span></h2>
        </div>
      </div>

      {/* Main Chart Section */}
      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '24px', marginBottom: '28px' }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#f1f5f9' }}>Generation Profile & Purchase Delta Gap (MW)</h3>
        {loading ? (
          <div style={{ height: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Loading settlement period data...</div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data.timeseries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="startTime" stroke="#64748b" tickFormatter={(v) => v.slice(5, 16).replace('T', ' ')} />
              <YAxis stroke="#64748b" unit=" MW" />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }} />
              <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '16px' }} />
              <Line type="monotone" dataKey="actual_mw" stroke="#4ade80" name="Actual Wind (FUELHH)" dot={false} strokeWidth={2.5} />
              <Line type="monotone" dataKey="forecast_mw" stroke="#38bdf8" name="Day-Ahead Forecast (WINDFOR)" dot={false} strokeWidth={2} strokeDasharray="4 4" />
              <Bar dataKey="error_mw" fill="#fb7185" name="Forecast Bias / Error (MW)" opacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Purchase Decision Insight Table */}
      <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '10px', padding: '20px' }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#e2e8f0' }}>Key Settlement Intervals & Procurement Exposure</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                <th style={{ padding: '10px' }}>Settlement Time</th>
                <th style={{ padding: '10px' }}>Actual Wind (MW)</th>
                <th style={{ padding: '10px' }}>Forecast (MW)</th>
                <th style={{ padding: '10px' }}>Procurement Variance (MW)</th>
                <th style={{ padding: '10px' }}>Decision Action</th>
              </tr>
            </thead>
            <tbody>
              {data.timeseries.slice(0, 10).map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ padding: '10px' }}>{row.startTime.replace('T', ' ').replace('Z', '')}</td>
                  <td style={{ padding: '10px', color: '#4ade80' }}>{row.actual_mw}</td>
                  <td style={{ padding: '10px', color: '#38bdf8' }}>{row.forecast_mw}</td>
                  <td style={{ padding: '10px', color: row.error_mw >= 0 ? '#facc15' : '#fb7185' }}>{row.error_mw.toFixed(2)}</td>
                  <td style={{ padding: '10px', color: '#cbd5e1' }}>
                    {row.error_mw > 200 ? 'Over-forecasted: Dispatch Thermal' : row.error_mw < -200 ? 'Under-forecasted: Surplus Margin' : 'Balanced Decision'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
