import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar } from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('foodHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    if (window.confirm('确定要清除所有历史记录吗？')) {
      localStorage.removeItem('foodHistory');
      setHistory([]);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  // 按日期分组历史记录
  const groupHistoryByDate = (history) => {
    const grouped = {};
    history.forEach(entry => {
      const date = new Date(entry.timestamp);
      const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const displayDate = `${date.getMonth() + 1}月${date.getDate()}日`;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { displayDate, entries: [] };
      }
      grouped[dateKey].entries.push(entry);
    });
    
    return Object.values(grouped);
  };

  const groupedHistory = groupHistoryByDate(history);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <button 
          onClick={() => navigate('/')} 
          className="text-[#40c080] hover:underline mb-4"
        >
          ← 返回主页
        </button>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#333333]">识别历史</h1>
          {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-1 text-sm text-[#f25c54] hover:text-[#d9534f]"
            >
              <Trash2 size={16} />
              清除记录
            </button>
          )}
        </div>
      </header>

      <main>
        {history.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#666666] mb-4">暂无识别记录</p>
            <button 
              onClick={() => navigate('/')} 
              className="px-4 py-2 bg-[#40c080] text-white rounded-lg hover:bg-[#37b075] transition-colors"
            >
              开始分析食物
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedHistory.map((group, index) => (
              <div key={index}>
                <div className="flex items-center gap-2 mb-4 text-[#666666]">
                  <Calendar size={16} />
                  <h2 className="font-medium">{group.displayDate}</h2>
                </div>
                <div className="space-y-4">
                  {group.entries.map((entry) => (
                    <div 
                      key={entry.id} 
                      className="bg-white rounded-xl shadow-sm border border-[#e0e0e0] p-4 flex items-center gap-4"
                    >
                      <img 
                        src={entry.image || `https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(entry.name)}&width=100&height=100&random=${entry.id}`} 
                        alt={entry.name} 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{entry.name}</h3>
                        <p className="text-[#40c080] font-medium">{entry.calories} 千卡</p>
                      </div>
                      <div className="text-sm text-[#666666]">
                        {formatDate(entry.timestamp)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;