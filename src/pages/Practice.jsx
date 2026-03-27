import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, ChevronLeft, Clock, Plus, Trash2, Repeat, Download, Upload, Star, Edit2, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCourses } from '../hooks/useCourses';
import { useFavorites } from '../hooks/useFavorites';

function Practice() {
  const { categories, addCourse, deleteCourse, editCourse, exportCourses, importCourses } = useCourses();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [activePart, setActivePart] = useState('part1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isPlayingRef = useRef(isPlaying);
  const isLoopingRef = useRef(isLooping);
  const fileInputRef = useRef(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
    isLoopingRef.current = isLooping;
  }, [isPlaying, isLooping]);

  useEffect(() => {
    if (location.state?.autoOpenCourseId && location.state?.categoryId && categories.length > 0) {
      const category = categories.find(c => c.id === location.state.categoryId);
      if (category) {
        const course = category.courses.find(c => c.id === location.state.autoOpenCourseId);
        if (course) {
          setSelectedCourse({ ...course, categoryId: category.id });
          setActivePart('part1');
          window.history.replaceState({}, document.title);
        }
      }
    }
  }, [location.state, categories]);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedCourse, activePart]);

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert("您的瀏覽器不支援語音播放功能");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      playTTS();
    }
  };

  const playTTS = () => {
    const steps = selectedCourse.parts[activePart];
    const text = steps?.join("。 ... ") || "";
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt to find a male voice
    const availableVoices = window.speechSynthesis.getVoices();
    let maleVoice = availableVoices.find(v => 
      v.lang.includes('zh') && (v.name.includes('Zhiwei') || v.name.toLowerCase().includes('male') || v.name.includes('Kangkang') || v.name.includes('Jianping') || v.name.includes('Yunxi'))
    );
    if (!maleVoice) {
      maleVoice = availableVoices.find(v => v.lang.includes('zh-TW')) || availableVoices.find(v => v.lang.includes('zh'));
    }
    
    if (maleVoice) utterance.voice = maleVoice;
    
    utterance.lang = 'zh-TW';
    utterance.rate = 0.5; // 放慢1倍語速
    
    utterance.onend = () => {
      if (isPlayingRef.current && isLoopingRef.current) {
        setTimeout(() => {
          if (isPlayingRef.current) playTTS();
        }, 1500);
      } else {
        setIsPlaying(false);
      }
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  // Add Course State
  const [newCatId, setNewCatId] = useState('c1');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDuration, setNewDuration] = useState('10 min');
  const [newPart1, setNewPart1] = useState('');
  const [newPart2, setNewPart2] = useState('');

  // Accordion State
  const [expandedCats, setExpandedCats] = useState([]);
  
  useEffect(() => {
    if (categories.length > 0 && expandedCats.length === 0) {
      setExpandedCats([categories[0].id]);
    }
  }, [categories]);

  const toggleCat = (id) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  // Edit Course State
  const [editingCourse, setEditingCourse] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDuration, setEditDuration] = useState('10 min');
  const [editPart1, setEditPart1] = useState('');
  const [editPart2, setEditPart2] = useState('');

  const openEditModal = (categoryId, course, e) => {
    e.stopPropagation();
    setEditingCourse({ categoryId, courseId: course.id });
    setEditTitle(course.title);
    setEditDesc(course.description);
    setEditDuration(course.duration || '10 min');
    setEditPart1(course.parts.part1?.join('\n') || '');
    setEditPart2(course.parts.part2?.join('\n') || '');
  };

  const handleEditCourse = () => {
    if (!editTitle.trim() || !editPart1.trim()) return;
    const updated = {
      title: editTitle,
      description: editDesc,
      duration: editDuration,
      parts: {
        part1: editPart1.split('\n').filter(s => s.trim()),
        part2: editPart2.split('\n').filter(s => s.trim())
      }
    };
    editCourse(editingCourse.categoryId, editingCourse.courseId, updated);
    setEditingCourse(null);
  };

  const handleAddCourse = () => {
    if (!newTitle.trim() || !newPart1.trim()) return;
    const course = {
      title: newTitle,
      description: newDesc,
      duration: newDuration,
      parts: {
        part1: newPart1.split('\n').filter(s => s.trim()),
        part2: newPart2.split('\n').filter(s => s.trim())
      }
    };
    addCourse(newCatId, course);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
    setNewPart1('');
    setNewPart2('');
  };

  if (showAddModal) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px', backgroundColor: 'var(--bg-primary)' }}>
        <button 
          onClick={() => setShowAddModal(false)}
          style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '24px', marginTop: '10px' }}
        >
          <ChevronLeft size={24} /> 取消新增
        </button>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '24px', fontWeight: '600' }}>新增練習內容</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>類別</label>
            <select value={newCatId} onChange={e => setNewCatId(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>標題</label>
            <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="例如：新版骨盆時鐘" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>描述</label>
            <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="簡短的說明" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Part 1 步驟 (每行一個步驟)</label>
            <textarea value={newPart1} onChange={e => setNewPart1(e.target.value)} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Part 2 步驟 (每行一個步驟)</label>
            <textarea value={newPart2} onChange={e => setNewPart2(e.target.value)} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <button 
            onClick={handleAddCourse}
            style={{ backgroundColor: 'var(--accent-color)', color: '#fff', padding: '16px', borderRadius: '30px', fontWeight: '500', marginTop: '16px', border: 'none' }}
          >
            保存新增
          </button>
        </div>
      </div>
    );
  }

  if (editingCourse) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px', backgroundColor: 'var(--bg-primary)' }}>
        <button 
          onClick={() => setEditingCourse(null)}
          style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '24px', marginTop: '10px', background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} /> 取消編輯
        </button>
        <h2 style={{ color: 'var(--accent-color)', marginBottom: '24px', fontWeight: '600' }}>編輯練習內容</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>標題</label>
            <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>描述</label>
            <input type="text" value={editDesc} onChange={e => setEditDesc(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Part 1 步驟 (每行一個步驟)</label>
            <textarea value={editPart1} onChange={e => setEditPart1(e.target.value)} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Part 2 步驟 (每行一個步驟)</label>
            <textarea value={editPart2} onChange={e => setEditPart2(e.target.value)} rows={4} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--accent-light)', marginTop: '4px' }} />
          </div>
          <button 
            onClick={handleEditCourse}
            style={{ backgroundColor: 'var(--accent-color)', color: '#fff', padding: '16px', borderRadius: '30px', fontWeight: '500', marginTop: '16px', border: 'none', cursor: 'pointer' }}
          >
            保存修改
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px', position: 'relative' }}>
        <header style={{ marginTop: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ color: 'var(--accent-color)', fontWeight: '500' }}>六大動中覺察 (ATM)</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>分化動作系列 - 打破習慣，找回輕鬆</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)' }}
              title="匯入練習內容"
            >
              <Download size={20} />
            </button>
            <input 
              type="file" 
              accept=".json" 
              ref={fileInputRef} 
              onChange={importCourses} 
              style={{ display: 'none' }} 
            />
            <button 
              onClick={exportCourses}
              style={{ padding: '8px', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', color: 'var(--text-secondary)' }}
              title="匯出練習內容"
            >
              <Upload size={20} />
            </button>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {categories.map((category) => (
            <div key={category.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div 
                onClick={() => toggleCat(category.id)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}
              >
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
                    {category.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent-warm)', margin: 0 }}>{category.subtitle}</p>
                </div>
                {expandedCats.includes(category.id) ? <ChevronDown size={20} color="var(--text-secondary)" /> : <ChevronRight size={20} color="var(--text-secondary)" />}
              </div>

              {expandedCats.includes(category.id) && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px', paddingLeft: '8px' }}>
                  {category.courses.map((course) => (
                    <div 
                      key={course.id}
                      style={{
                        backgroundColor: '#fff',
                        padding: '20px',
                        borderRadius: '16px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        transition: 'transform 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        borderLeft: '4px solid var(--accent-light)',
                        position: 'relative'
                      }}
                    >
                      <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => openEditModal(category.id, course, e)}
                          style={{ color: 'var(--text-secondary)', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          title="編輯"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteCourse(category.id, course.id); }}
                          style={{ color: '#ffaaaa', padding: '4px', border: 'none', background: 'transparent', cursor: 'pointer' }}
                          title="刪除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div 
                        onClick={() => { setSelectedCourse({ ...course, categoryId: category.id }); setActivePart('part1'); }}
                        style={{ cursor: 'pointer', flex: 1 }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '60px' }}>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-primary)', margin: 0 }}>{course.title}</h4>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
                          <Clock size={14} /><span>{course.duration}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginTop: '8px' }}>
                          {course.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Floating Add Button */}
        <button 
          onClick={() => setShowAddModal(true)}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: window.innerWidth > 480 ? 'calc(50% - 220px)' : '24px',
            backgroundColor: 'var(--accent-warm)',
            color: '#fff',
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(220,174,163, 0.6)',
            zIndex: 10
          }}
        >
          <Plus size={30} />
        </button>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', paddingBottom: '100px' }}>
      <button 
        onClick={() => { setSelectedCourse(null); setIsPlaying(false); }}
        style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)', marginBottom: '24px', marginTop: '10px' }}
      >
        <ChevronLeft size={24} /> 返回列表
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
          {selectedCourse.title}
        </h2>
        <button 
          onClick={() => toggleFavorite(selectedCourse.id, selectedCourse.categoryId, selectedCourse.title)} 
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
        >
          <Star size={24} fill={isFavorite(selectedCourse.id) ? "var(--accent-warm)" : "none"} color={isFavorite(selectedCourse.id) ? "var(--accent-warm)" : "var(--text-secondary)"} />
        </button>
      </div>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>
        {selectedCourse.description}
      </p>

      {/* Parts Toggle */}
      <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
        <button 
          onClick={() => { setActivePart('part1'); setIsPlaying(false); }}
          style={{ 
            flex: 1, padding: '10px 0', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '500', 
            backgroundColor: activePart === 'part1' ? '#fff' : 'transparent',
            boxShadow: activePart === 'part1' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            color: activePart === 'part1' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Part 1 (Step 1-5)
        </button>
        <button 
          onClick={() => { setActivePart('part2'); setIsPlaying(false); }}
          style={{ 
            flex: 1, padding: '10px 0', borderRadius: '10px', fontSize: '0.95rem', fontWeight: '500', 
            backgroundColor: activePart === 'part2' ? '#fff' : 'transparent',
            boxShadow: activePart === 'part2' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            color: activePart === 'part2' ? 'var(--accent-color)' : 'var(--text-secondary)'
          }}
        >
          Part 2 (Step 6-10)
        </button>
      </div>

      {/* Steps List */}
      <div style={{ 
        backgroundColor: '#fff', 
        borderRadius: '16px', 
        padding: '20px', 
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <h4 style={{ fontWeight: '600', color: 'var(--accent-warm)', margin: 0 }}>練習指引</h4>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setIsLooping(!isLooping)}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '4px', 
                color: isLooping ? 'var(--accent-color)' : 'var(--text-secondary)',
                backgroundColor: isLooping ? 'var(--accent-light)' : 'var(--bg-secondary)',
                padding: '6px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '500' 
              }}
            >
              <Repeat size={14} />
              {isLooping ? '循環中' : '單次'}
            </button>
            <button 
              onClick={toggleSpeech}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '6px', 
                color: isPlaying ? '#fff' : 'var(--accent-color)', 
                backgroundColor: isPlaying ? 'var(--accent-color)' : 'var(--bg-secondary)',
                padding: '6px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '500' 
              }}
            >
              {isPlaying ? <Square size={16} fill="white" /> : <Play size={16} fill="var(--accent-color)" />}
              {isPlaying ? '停止播放' : '語音播放'}
            </button>
          </div>
        </div>
        
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {selectedCourse.parts[activePart]?.map((step, index) => (
            <li key={index} style={{ 
              display: 'flex', gap: '12px', alignItems: 'flex-start',
              color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6 
            }}>
              <div style={{ 
                minWidth: '24px', height: '24px', borderRadius: '50%', 
                backgroundColor: 'var(--accent-light)', color: 'var(--text-primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                fontSize: '0.8rem', fontWeight: '600', marginTop: '2px' 
              }}>
                {activePart === 'part1' ? index + 1 : index + 6}
              </div>
              <p style={{ margin: 0 }}>{step.replace(/^\d+\.\s*/, '')}</p>
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={() => navigate('/journal', { state: { courseName: selectedCourse.title } })}
        style={{ 
          color: 'var(--accent-warm)', textDecoration: 'underline', 
          fontSize: '1rem', alignSelf: 'center', marginTop: 'auto' 
        }}
      >
        完成這段練習，記錄感受
      </button>
    </div>
  );
}

export default Practice;
