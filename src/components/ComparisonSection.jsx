import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Grid } from 'lucide-react';

const ComparisonSection = ({ foodItem }) => {
  const [viewMode, setViewMode] = useState('chart'); // 'chart' or 'cards'
  
  // 示例对比数据
  const comparisonData = [
    { name: '青菜', calories: 25, image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E9%9D%92%E8%8F%9C&width=100&height=100&random=qc_100_100' },
    { name: '鸡蛋', calories: 70, image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E9%B8%A1%E8%9B%8B&width=100&height=100&random=jd_100_100' },
    { name: '苹果', calories: 52, image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E8%8B%B9%E6%9E%9C&width=100&height=100&random=pg_100_100' },
    { name: '米饭', calories: 130, image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E7%B1%B3%E9%A5%AD&width=100&height=100&random=mf_100_100' },
    { name: '牛肉', calories: 250, image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E7%89%9B%E8%82%89&width=100&height=100&random=nf_100_100' },
    { name: '当前食物', calories: foodItem.calories, image: foodItem.image || `https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(foodItem.name)}&width=100&height=100&random=${foodItem.name}_100_100` }
  ];
  
  // 为图表数据排序
  const sortedData = [...comparisonData].sort((a, b) => a.calories - b.calories);
  
  return (
    <section className="mb-10 bg-white rounded-2xl shadow-sm border border-[#e0e0e0] p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#333333]">热量与常见食物对比</h2>
        <div className="flex bg-[#f0f7f4] rounded-lg p-1">
          <button 
            onClick={() => setViewMode('chart')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md ${viewMode === 'chart' ? 'bg-white shadow-sm' : ''}`}
          >
            <BarChart3 size={16} />
            <span>图表</span>
          </button>
          <button 
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-3 py-1 rounded-md ${viewMode === 'cards' ? 'bg-white shadow-sm' : ''}`}
          >
            <Grid size={16} />
            <span>卡片</span>
          </button>
        </div>
      </div>
      
      {viewMode === 'chart' ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sortedData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, Math.max(...comparisonData.map(d => d.calories)) * 1.2]} />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fill: '#333333' }} 
                width={80}
              />
              <Tooltip 
                formatter={(value) => [`${value} 千卡`, '热量']}
                labelFormatter={(name) => `食物: ${name}`}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e0e0e0' }}
              />
              <Bar 
                dataKey="calories" 
                fill="#40c080" 
                radius={[0, 4, 4, 0]}
                name="热量 (千卡)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {comparisonData.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center p-4 rounded-xl border ${item.name === '当前食物' ? 'border-[#40c080] bg-[#f0f7f4]' : 'border-[#e0e0e0]'}`}
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-16 h-16 rounded-lg object-cover mb-3"
              />
              <h3 className="font-medium text-center mb-1">{item.name}</h3>
              <p className="text-[#40c080] font-semibold">{item.calories} 千卡</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ComparisonSection;