import React from 'react';
import { useJournal } from '../hooks/useJournal';

function Trends() {
  const { logs } = useJournal();
  
  // Calculate stats
  const totalPractice = logs.length;
  // Get last 7 logs for the chart, reverse them so oldest to newest (left to right)
  const recentLogs = [...logs].slice(0, 7).reverse();
  
  const calculateAIAdvice = () => {
    if (logs.length === 0) return "您還沒有任何練習紀錄喔！趕快到「練習」頁面開始您的第一堂動中覺察吧。";
    
    // Calculate average relaxation score of last 3 practices
    const recent3 = logs.slice(0, 3);
    const avgRecent = recent3.reduce((acc, log) => acc + log.relaxationScore, 0) / recent3.length;
    
    let advice = `您已經累積了 ${totalPractice} 次的覺察紀錄。`;
    if (avgRecent >= 8) {
      advice += "最近幾次的練習後，您的放鬆程度非常高！這表示您的神經系統已經能在練習中找到安全感。請繼續維持這份無壓力的穩定練習。";
    } else if (avgRecent >= 5) {
      advice += "最近的狀態平穩。如果您在特定部位 (例如肩頸或腰背) 還有殘留的緊繃感，可以試著在平時的動作中再放慢一倍的速度，不要勉強推到極限。";
    } else {
      advice += "最近的練習似乎還是讓您感到有些緊繃。提醒您：「動中覺察」的重點不在於動作標準，而在於「發現不費力的路徑」。下次練習時，請嘗試把動作幅度縮小到原來的三分之一，只在腦中想像動作也沒關係喔！";
    }
    return advice;
  };

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '100px' }}>
      <header style={{ marginTop: '20px' }}>
        <h2 style={{ color: 'var(--accent-color)', fontWeight: '500' }}>長期觀察</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>看見身體變化的軌跡</p>
      </header>

      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ flex: 1, backgroundColor: 'var(--accent-light)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalPractice}</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>總覺察次數</span>
        </div>
        <div style={{ flex: 1, backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
            {logs.length > 0 ? (logs.reduce((acc, log) => acc + log.relaxationScore, 0) / logs.length).toFixed(1) : '-'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>平均放鬆度</span>
        </div>
      </div>

      <section>
        <div style={{
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}>
          <h4 style={{ marginBottom: '24px', fontWeight: '500' }}>近期放鬆程度趨勢 (最近 7 次)</h4>
          <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingTop: '20px' }}>
            {recentLogs.length > 0 ? recentLogs.map((log) => (
              <div key={log.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-warm)' }}>{log.relaxationScore}</span>
                <div style={{ 
                  width: '100%', 
                  height: `${(log.relaxationScore / 10) * 100}%`, 
                  backgroundColor: 'var(--accent-color)',
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 1s ease-out'
                }} />
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  {new Date(log.date).getDate()}日
                </span>
              </div>
            )) : (
               <div style={{ width: '100%', textAlign: 'center', color: 'var(--text-secondary)', paddingBottom: '20px' }}>尚無足夠資料</div>
            )}
          </div>
        </div>
      </section>

      <section>
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '24px',
          borderRadius: '16px',
        }}>
          <h4 style={{ marginBottom: '12px', fontWeight: '500' }}>AI 覺察助手回饋</h4>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.6' }}>
            「{calculateAIAdvice()}」
          </p>
        </div>
      </section>
    </div>
  );
}

export default Trends;
