import { useState, useEffect } from 'react';

export function useJournal() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('awaremove_journal');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('awaremove_journal', JSON.stringify(logs));
  }, [logs]);

  const addLog = (logData) => {
    setLogs(prev => [{ ...logData, id: Date.now(), date: new Date().toISOString() }, ...prev]);
  };

  const deleteLog = (logId) => {
    if(!window.confirm('確定要刪除這筆紀錄嗎？')) return;
    setLogs(prev => prev.filter(log => log.id !== logId));
  };

  const exportJournal = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "awaremove_journal.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importJournal = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setLogs(importedData);
          alert('日誌匯入成功！');
        } else {
          alert('檔案格式錯誤，必須為合法的 JSON。');
        }
      } catch (err) {
        alert('檔案讀取失敗：不是有效的 JSON。');
      }
    };
    reader.readAsText(file);
    event.target.value = null; // clear
  };

  return { logs, addLog, deleteLog, exportJournal, importJournal };
}
