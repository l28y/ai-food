import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FoodUploadSection from '../components/FoodUploadSection';
import AnalysisResultSection from '../components/AnalysisResultSection';
import ComparisonSection from '../components/ComparisonSection';
import SuggestionSection from '../components/SuggestionSection';
import { analyzeFood } from '../services/analysisService';

const HomePage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFoodSubmit = async (foodData) => {
    setIsLoading(true);
    try {
      // 模拟API调用
      const result = await analyzeFood(foodData);
      setAnalysisResult(result);
      
      // 保存到本地存储
      const history = JSON.parse(localStorage.getItem('foodHistory') || '[]');
      const newEntry = {
        id: Date.now(),
        ...result,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('foodHistory', JSON.stringify([newEntry, ...history.slice(0, 9)]));
    } catch (error) {
      console.error('分析失败:', error);
      // 这里应该有错误处理UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-2">AI热量分析与食物对比工具</h1>
        <p className="text-lg text-[#666666]">上传食物图片或描述，获取热量信息与营养建议</p>
      </header>

      <main>
        <FoodUploadSection onSubmit={handleFoodSubmit} isLoading={isLoading} />
        
        {analysisResult && (
          <>
            <AnalysisResultSection result={analysisResult} />
            <ComparisonSection foodItem={analysisResult} />
            <SuggestionSection suggestions={analysisResult.suggestions} />
          </>
        )}
      </main>

      <footer className="mt-12 pt-6 border-t border-[#e0e0e0] text-center text-[#666666] text-sm">
        <button 
          onClick={() => navigate('/history')}
          className="text-[#40c080] hover:underline mb-2 block"
        >
          查看历史记录
        </button>
        <p>© 2026 热量分析工具 - 科学管理您的饮食</p>
      </footer>
    </div>
  );
};

export default HomePage;