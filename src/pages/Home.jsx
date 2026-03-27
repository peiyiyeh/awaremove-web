import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

function Home() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '100px' }}>
      <header style={{ marginTop: '20px' }}>
        <h1 style={{ fontSize: '1.8rem', color: 'var(--accent-color)' }}>早安，</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>今天想感受身體的哪部分呢？</p>
        <div style={{ marginTop: '20px', fontStyle: 'italic', color: 'var(--accent-warm)', borderLeft: '3px solid var(--accent-light)', paddingLeft: '12px', fontSize: '1rem', lineHeight: '1.5' }}>
          「動作是感覺的基礎，動作可以反映出當下神經系統的狀態」<br />
          <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '6px' }}>— 摩謝·費登魁斯</span>
        </div>
      </header>

      <div style={{
        backgroundColor: 'var(--bg-secondary)',
        padding: '24px',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>溫和提醒</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          您已經連續 3 天花一點時間陪伴自己了，繼續保持這個不帶壓力的節奏吧。
        </p>
      </div>

      <section>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={18} color="var(--accent-warm)" fill="var(--accent-warm)" /> 我的快捷練習
        </h3>
        {favorites.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
            目前還沒有快捷項目喔。<br/>您可以到「練習」列表點選右上角星星加入最愛！
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {favorites.map(fav => (
              <button 
                key={fav.id}
                onClick={() => navigate('/practice', { state: { autoOpenCourseId: fav.id, categoryId: fav.categoryId } })}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '16px 20px', backgroundColor: '#fff', borderRadius: '16px', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)', border: 'none', cursor: 'pointer', textAlign: 'left',
                  borderLeft: '4px solid var(--accent-warm)'
                }}
              >
                <span style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '500' }}>{fav.title}</span>
                <Play size={18} color="var(--accent-color)" />
              </button>
            ))}
          </div>
        )}
      </section>

      <button 
        onClick={() => navigate('/practice')}
        style={{
          backgroundColor: 'var(--accent-warm)',
          color: '#fff',
          padding: '16px 24px',
          borderRadius: '30px',
          fontSize: '1.1rem',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(220, 174, 163, 0.4)',
          marginTop: 'auto'
        }}
      >
        開始所有練習
      </button>
    </div>
  );
}

export default Home;
