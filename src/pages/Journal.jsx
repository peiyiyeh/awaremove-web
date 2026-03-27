import React, { useState, useRef, useEffect } from 'react';
import { useJournal } from '../hooks/useJournal';
import { Download, Upload, Clock, Plus, Trash2, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const BODY_PARTS = [
  { id: 'head', label: '頭部', cx: 100, cy: 30, r: 15 },
  { id: 'neck', label: '頸部', cx: 100, cy: 55, r: 8 },
  { id: 'l_shoulder', label: '左肩', cx: 60, cy: 75, r: 10 },
  { id: 'r_shoulder', label: '右肩', cx: 140, cy: 75, r: 10 },
  { id: 'chest', label: '胸椎', cx: 100, cy: 95, r: 12 },
  { id: 'l_elbow', label: '左手肘', cx: 40, cy: 120, r: 8 },
  { id: 'r_elbow', label: '右手肘', cx: 160, cy: 120, r: 8 },
  { id: 'pelvis', label: '骨盆', cx: 100, cy: 150, r: 14 },
  { id: 'l_hand', label: '左手', cx: 20, cy: 170, r: 8 },
  { id: 'r_hand', label: '右手', cx: 180, cy: 170, r: 8 },
  { id: 'l_knee', label: '左膝', cx: 70, cy: 210, r: 10 },
  { id: 'r_knee', label: '右膝', cx: 130, cy: 210, r: 10 },
  { id: 'l_foot', label: '左腳', cx: 60, cy: 270, r: 8 },
  { id: 'r_foot', label: '右腳', cx: 140, cy: 270, r: 8 },
];

const FEELINGS = ['緊繃', '放鬆', '痠痛', '沉重', '輕盈', '刺痛', '麻木', '無感'];

function Journal() {
  const { logs, addLog, deleteLog, exportJournal, importJournal } = useJournal();
  const fileInputRef = useRef(null);
  const location = useLocation();

  const [viewMode, setViewMode] = useState('new'); // 'new' | 'history'
  
  // New Entry State
  const [courseName, setCourseName] = useState('');
  const [relaxation, setRelaxation] = useState(5);
  const [notes, setNotes] = useState('');
  const [selections, setSelections] = useState({}); 

  // Initialize courseName if navigated from Practice
  useEffect(() => {
    if (location.state?.courseName) {
      setCourseName(location.state.courseName);
    }
  }, [location.state]);
  
  // Modal State for body part
  const [activePart, setActivePart] = useState(null);
  const [tempFeeling, setTempFeeling] = useState('');

  const handleSaveEntry = () => {
    addLog({
      courseName,
      relaxationScore: parseInt(relaxation),
      notes,
      bodyParts: selections
    });
    alert('已保存今日紀錄！');
    setRelaxation(5);
    setNotes('');
    setSelections({});
    setCourseName('');
    setViewMode('history');
  };

  const handleSavePartFeeling = () => {
    if (activePart && tempFeeling) {
      setSelections(prev => ({
        ...prev,
        [activePart.id]: { feeling: tempFeeling, label: activePart.label }
      }));
    } else if (activePart && !tempFeeling) {
      const newSel = { ...selections };
      delete newSel[activePart.id];
      setSelections(newSel);
    }
    setActivePart(null);
    setTempFeeling('');
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px', position: 'relative' }}>
      <header style={{ marginTop: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ color: 'var(--accent-color)', fontWeight: '500' }}>覺察日誌</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>不評價，只是記錄當下的真實感受</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => fileInputRef.current?.click()} style={{ padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)' }} title="匯入紀錄">
            <Upload size={20} />
          </button>
          <input type="file" accept=".json" ref={fileInputRef} onChange={importJournal} style={{ display: 'none' }} />
          <button onClick={exportJournal} style={{ padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)' }} title="匯出紀錄">
            <Download size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
        <button 
          onClick={() => setViewMode('new')}
          style={{ 
            flex: 1, padding: '10px 0', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '500', 
            backgroundColor: viewMode === 'new' ? '#fff' : 'transparent',
            boxShadow: viewMode === 'new' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            color: viewMode === 'new' ? 'var(--accent-color)' : 'var(--text-secondary)',
            border: 'none', cursor: 'pointer'
          }}
        >
          <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> 新增紀錄
        </button>
        <button 
          onClick={() => setViewMode('history')}
          style={{ 
            flex: 1, padding: '10px 0', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '500', 
            backgroundColor: viewMode === 'history' ? '#fff' : 'transparent',
            boxShadow: viewMode === 'history' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            color: viewMode === 'history' ? 'var(--accent-color)' : 'var(--text-secondary)',
            border: 'none', cursor: 'pointer'
          }}
        >
          <Clock size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} /> 歷史回顧
        </button>
      </div>

      {viewMode === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <section>
            <h4 style={{ marginBottom: '8px', fontWeight: '500' }}>本次練習項目</h4>
            <input 
              type="text" 
              value={courseName}
              onChange={e => setCourseName(e.target.value)}
              placeholder="可選填或由練習頁面帶入..."
              style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--accent-light)' }}
            />
          </section>
          <section>
            <h4 style={{ marginBottom: '16px', fontWeight: '500' }}>練習後的整體狀態</h4>
            <div style={{ padding: '0 8px' }}>
              <input 
                type="range" 
                min="1" max="10" 
                value={relaxation}
                onChange={(e) => setRelaxation(e.target.value)}
                style={{ width: '100%', accentColor: 'var(--accent-warm)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span>極度緊繃/極痛 (1)</span>
                <span style={{ fontWeight: 'bold', color: 'var(--accent-warm)', fontSize: '1rem' }}>{relaxation}</span>
                <span>完全放鬆/輕盈 (10)</span>
              </div>
            </div>
          </section>

          <section>
            <h4 style={{ marginBottom: '8px', fontWeight: '500' }}>部位覺察：哪裡有特別的感覺嗎？</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>請點擊圖示上的圓點來標記部位感受。</p>
            <div style={{ 
              height: '340px', 
              backgroundColor: '#fff', 
              borderRadius: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              position: 'relative'
            }}>
              <svg width="200" height="300" viewBox="0 0 200 300">
                <line x1="100" y1="30" x2="100" y2="150" stroke="var(--bg-secondary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="60" y1="75" x2="140" y2="75" stroke="var(--bg-secondary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="60" y1="75" x2="20" y2="170" stroke="var(--bg-secondary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="140" y1="75" x2="180" y2="170" stroke="var(--bg-secondary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="100" y1="150" x2="60" y2="270" stroke="var(--bg-secondary)" strokeWidth="6" strokeLinecap="round" />
                <line x1="100" y1="150" x2="140" y2="270" stroke="var(--bg-secondary)" strokeWidth="6" strokeLinecap="round" />

                {BODY_PARTS.map(part => {
                  const isSelected = !!selections[part.id];
                  return (
                    <g key={part.id} onClick={() => {
                        setActivePart(part);
                        setTempFeeling(selections[part.id]?.feeling || '');
                    }} style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                      <circle 
                        cx={part.cx} cy={part.cy} r={isSelected ? part.r + 4 : part.r} 
                        fill={isSelected ? 'var(--accent-warm)' : 'var(--bg-primary)'} 
                        stroke={isSelected ? '#fff' : 'var(--accent-color)'} 
                        strokeWidth="2"
                      />
                      {isSelected && (
                        <text x={part.cx} y={part.cy} textAnchor="middle" dy="3" fontSize="10" fill="#fff" pointerEvents="none">
                          ✓
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
            {Object.keys(selections).length > 0 && (
              <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {Object.values(selections).map((s, idx) => (
                  <span key={idx} style={{ padding: '6px 12px', backgroundColor: 'var(--accent-light)', borderRadius: '16px', fontSize: '0.85rem', color: 'var(--text-primary)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    {s.label}: <strong>{s.feeling}</strong>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section>
            <h4 style={{ marginBottom: '16px', fontWeight: '500' }}>自由書寫</h4>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="例如：做完骨盆時鐘後，覺得右側腰部的痠痛感減輕，呼吸也順暢多了..."
              style={{ width: '100%', height: '100px', padding: '16px', borderRadius: '12px', border: '1px solid var(--bg-secondary)', backgroundColor: '#fff', resize: 'none', fontFamily: 'inherit' }}
            />
          </section>

          <button onClick={handleSaveEntry} style={{ backgroundColor: 'var(--accent-color)', color: '#fff', padding: '16px', borderRadius: '30px', fontWeight: '600', width: '100%', border: 'none', boxShadow: '0 4px 12px rgba(143, 184, 195, 0.4)' }}>
            保存今日紀錄
          </button>
        </div>
      )}

      {viewMode === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {logs.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px' }}>目前還沒有任何紀錄喔！趕快來新增第一筆覺察日誌吧。</p>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative' }}>
                <button onClick={() => deleteLog(log.id)} style={{ position: 'absolute', top: '16px', right: '16px', color: '#ffaaaa', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  {new Date(log.date).toLocaleString('zh-TW', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
                {log.courseName && (
                  <p style={{ fontSize: '0.95rem', color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '8px' }}>
                    練習項目：{log.courseName}
                  </p>
                )}
                <p style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  整體狀態分數：
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: 'var(--accent-warm)', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', fontSize: '0.9rem', fontWeight: 'bold' 
                  }}>
                    {log.relaxationScore}
                  </span>
                </p>
                
                {log.bodyParts && Object.keys(log.bodyParts).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                    {Object.values(log.bodyParts).map((s, idx) => (
                      <span key={idx} style={{ padding: '4px 10px', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--accent-light)', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                        {s.label}: <strong>{s.feeling}</strong>
                      </span>
                    ))}
                  </div>
                )}
                
                {log.notes && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, backgroundColor: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', margin: 0 }}>
                    {log.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for Body Part Feeling */}
      {activePart && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
          padding: '20px'
        }}>
          <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '340px', position: 'relative', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <button onClick={() => setActivePart(null)} style={{ position: 'absolute', top: '16px', right: '16px', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '8px', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600' }}>{activePart.label} 的感受</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>請點擊您目前該部位的真實狀態：</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {FEELINGS.map(f => (
                <button 
                  key={f} 
                  onClick={() => setTempFeeling(f === tempFeeling ? '' : f)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    backgroundColor: tempFeeling === f ? 'var(--accent-warm)' : 'var(--bg-secondary)',
                    color: tempFeeling === f ? '#fff' : 'var(--text-primary)',
                    border: '1px solid',
                    borderColor: tempFeeling === f ? 'var(--accent-warm)' : 'var(--accent-light)',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontWeight: tempFeeling === f ? 'bold' : 'normal'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleSavePartFeeling}
              style={{ width: '100%', padding: '14px', backgroundColor: 'var(--accent-color)', color: '#fff', borderRadius: '12px', fontWeight: '600', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
            >
              確定
            </button>
            {tempFeeling && (
               <button 
                onClick={() => { setTempFeeling(''); }}
                style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: 'var(--text-secondary)', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '0.9rem', marginTop: '8px' }}
              >
                清除選擇
              </button>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default Journal;
