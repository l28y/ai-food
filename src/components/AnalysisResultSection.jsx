import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const AnalysisResultSection = ({ result }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!result) return null;
  
  return (
    <section className="mb-10 bg-white rounded-2xl shadow-sm border border-[#e0e0e0] p-6">
      <h2 className="text-2xl font-bold text-[#333333] mb-4">识别到以下食物</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <img 
            src={result.image || `https://www.weavefox.cn/api/bolt/unsplash_image?keyword=${encodeURIComponent(result.name)}&width=300&height=200&random=${result.name}_300_200`} 
            alt={result.name} 
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
        
        <div className="md:w-2/3">
          <h3 className="text-xl font-semibold mb-2">{result.name}</h3>
          <p className="text-3xl font-bold text-[#40c080] mb-4">{result.calories} <span className="text-lg">千卡</span></p>
          
          <button 
            onClick={() => setExpanded(!expanded)}
            className="flex items-center text-[#40c080] font-medium mb-3"
          >
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            营养成分详情
          </button>
          
          {expanded && (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.nutrients).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-[#f0f7f4]">
                  <span className="text-[#666666]">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnalysisResultSection;