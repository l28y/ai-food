import React, { useState, useEffect } from 'react';
import { Button, Card, Progress, App } from 'antd';
import { LeftOutlined, SwapOutlined, BulbOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { historyDB } from '../utils/historyDB';

const AnalysisResult = () => {
  const { message } = App.useApp();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    loadAnalysisResult();
  }, [id, navigate]);

  const loadAnalysisResult = async () => {
    try {
      await historyDB.init();
      const result = await historyDB.getHistory(id);
      if (result) {
        setAnalysisResult(result);
        
        // 使用存储在结果中的推荐，如果没有则生成模拟推荐
        const recs = result.recommendations || [
          '建议搭配一份蔬菜沙拉增加纤维摄入',
          '下次可选择清汤牛肉面减少油脂摄入',
          '搭配一杯无糖豆浆增加蛋白质摄入'
        ];
        setRecommendations(recs);
      } else {
        // 回退到localStorage
        const history = JSON.parse(localStorage.getItem('calorieHistory') || '[]');
        const localStorageResult = history.find(item => item.id == id);
        if (localStorageResult) {
          setAnalysisResult(localStorageResult);
          const recs = localStorageResult.recommendations || [
            '建议搭配一份蔬菜沙拉增加纤维摄入',
            '下次可选择清汤牛肉面减少油脂摄入',
            '搭配一杯无糖豆浆增加蛋白质摄入'
          ];
          setRecommendations(recs);
        } else {
          message.error('未找到分析记录');
          navigate('/');
        }
      }
    } catch (error) {
      console.error('加载分析结果失败:', error);
      message.error('加载分析结果失败');
      navigate('/');
    }
  };

  if (!analysisResult) return null;

  return (
    <div className="min-h-screen bg-[#e6f4f1] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={() => navigate('/')} 
            className="text-[#2d3748]"
          />
          <h1 className="text-xl font-bold text-[#2d3748]">分析结果</h1>
          <div style={{ width: 32 }} /> {/* 占位元素 */}
        </div>
        
        <Card className="mb-6 border-0 shadow-md rounded-xl bg-gradient-to-r from-[#f0fff4] to-[#e6fffa]">
          <div className="text-center mb-4">
            {analysisResult.image ? (
              <img 
                src={analysisResult.image} 
                alt={analysisResult.foodName} 
                className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-[#c6f6d5] mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🍜</span>
              </div>
            )}
            <h2 className="text-2xl font-bold text-[#2d3748]">{analysisResult.foodName}</h2>
            <p className="text-[#a0aec0]">{analysisResult.quantity}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-[#a0aec0] mb-1">热量</p>
              <p className="text-xl font-bold text-[#48bb78]">{analysisResult.calories} <span className="text-sm font-normal">kcal</span></p>
            </div>
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-[#a0aec0] mb-1">蛋白质</p>
              <p className="text-xl font-bold text-[#48bb78]">{analysisResult.protein} <span className="text-sm font-normal">g</span></p>
            </div>
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-[#a0aec0] mb-1">脂肪</p>
              <p className="text-xl font-bold text-[#f6ad55]">{analysisResult.fat} <span className="text-sm font-normal">g</span></p>
            </div>
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <p className="text-sm text-[#a0aec0] mb-1">碳水</p>
              <p className="text-xl font-bold text-[#4299e1]">{analysisResult.carbs} <span className="text-sm font-normal">g</span></p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-[#a0aec0] mb-1">
              <span>营养构成</span>
              <span>蛋白质:脂肪:碳水 = 4:2:5</span>
            </div>
            <Progress 
              percent={100} 
              showInfo={false} 
              strokeColor={{
                '0%': '#48bb78',
                '50%': '#f6ad55',
                '100%': '#4299e1',
              }}
              trailColor="#e2e8f0"
            />
            <div className="flex justify-between text-xs text-[#a0aec0] mt-1">
              <span>蛋白质</span>
              <span>脂肪</span>
              <span>碳水化合物</span>
            </div>
          </div>
        </Card>
        
        <Card className="mb-6 border-0 shadow-md rounded-xl">
          <div className="flex items-center mb-4">
            <BulbOutlined className="text-xl text-[#48bb78] mr-2" />
            <h3 className="text-lg font-bold text-[#2d3748]">饮食建议</h3>
          </div>
          
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-[#48bb78] mr-2">•</span>
                <span className="text-[#2d3748]">{rec}</span>
              </li>
            ))}
          </ul>
          
          <Button 
            type="dashed" 
            block 
            className="mt-4 text-[#48bb78] border-[#48bb78] hover:border-[#3da067] hover:text-[#3da067]"
            onClick={async () => {
              const newRec = [
                '建议增加一份水果补充维生素',
                '可搭配无糖酸奶增加益生菌摄入',
                '下次选择全麦面包增加膳食纤维'
              ][Math.floor(Math.random() * 3)];
              
              const updatedRecommendations = [newRec];
              setRecommendations(updatedRecommendations);
              
              // 更新存储中的推荐数据
              if (analysisResult) {
                const updatedResult = {
                  ...analysisResult,
                  recommendations: updatedRecommendations
                };
                setAnalysisResult(updatedResult);
                
                try {
                  await historyDB.init();
                  // 更新IndexedDB中的记录
                  const db = historyDB.db;
                  const transaction = db.transaction(['history'], 'readwrite');
                  const store = transaction.objectStore('history');
                  store.put(updatedResult);
                } catch (error) {
                  console.error('更新推荐失败:', error);
                }
              }
            }}
          >
            换一批建议
          </Button>
        </Card>
        
        <div className="flex space-x-4">
          <Button 
            block 
            size="large" 
            icon={<SwapOutlined />}
            onClick={() => navigate('/compare')}
          >
            食物对比
          </Button>
          <Button 
            type="primary" 
            block 
            size="large" 
            onClick={() => navigate('/')} 
            className="bg-[#48bb78] hover:bg-[#3da067]"
          >
            再次分析
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;