import { useState, useEffect } from 'react';
import { courseCategories as initialData } from '../data/courses';

export function useCourses() {
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('awaremove_courses');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialData;
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('awaremove_courses', JSON.stringify(categories));
  }, [categories]);

  const addCourse = (categoryId, newCourse) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          courses: [...cat.courses, { ...newCourse, id: Date.now() }]
        };
      }
      return cat;
    }));
  };

  const deleteCourse = (categoryId, courseId) => {
    if(!window.confirm('確定要刪除這項練習嗎？')) return;
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          courses: cat.courses.filter(c => c.id !== courseId)
        };
      }
      return cat;
    }));
  };

  const editCourse = (categoryId, courseId, updatedCourse) => {
    setCategories(prev => prev.map(cat => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          courses: cat.courses.map(c => c.id === courseId ? { ...c, ...updatedCourse } : c)
        };
      }
      return cat;
    }));
  };

  const exportCourses = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(categories));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "awaremove_courses.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const importCourses = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          setCategories(importedData);
          alert('匯入成功！');
        } else {
          alert('檔案格式錯誤，必須為合法的 JSON。');
        }
      } catch (err) {
        alert('檔案讀取失敗：不是有效的 JSON。');
      }
    };
    reader.readAsText(file);
    // clear value so the same file could be imported again if needed
    event.target.value = null;
  };

  return { categories, addCourse, deleteCourse, editCourse, exportCourses, importCourses };
}
