import React, { useState, useEffect } from 'react';
import { Button, Card, List, message } from 'antd';
import { LeftOutlined, RightOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Compare = () => {
  const [history, setHistory] = useState([]);
  const [selectedFoods, setSelectedFoods] = useState([null, null]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('calorieHistory') || '[]');
    setHistory(storedHistory);
  }, []);

  const selectFood = (food, index) => {
    const newSelected = [...selectedFoods];
    newSelected[index] = food;
    setSelectedFoods(newSelected);
  };

  const performComparison = () => {
    if (!selectedFoods[0] || !selectedFoods[1]) {
      message.warning('请选择两种食物进行对比');
      return;
    }
    
    // 在实际应用中，这里会跳转到对比结果页面
    message.success(`即将对比: ${selectedFoods[0].foodName} vs ${selectedFoods[1].foodName}`);
    // 模拟跳转到对比结果页面
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

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
          <h1 className="text-xl font-bold text-[#2d3748]">食物热量对比</h1>
          <div style={{ width: 32 }} /> {/* 占位元素 */}
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <div className="text-center flex-1 px-4 py-6 bg-[#f0fff4] rounded-lg mr-2">
            <h3 className="font-medium text-[#2d3748] mb-2">食物A</h3>
            {selectedFoods[0] ? (
              <>
                <p className="text-lg font-bold text-[#48bb78]">{selectedFoods[0].foodName}</p>
                <p className="text-sm text-[#a0aec0]">{selectedFoods[0].quantity} | {selectedFoods[0].calories}kcal</p>
              </>
            ) : (
              <p className="text-[#a0aec0]">待选择</p>
            )}
          </div>
          
          <div className="mx-2 text-[#48bb78]">
            <SwapOutlined className="text-2xl" />
          </div>
          
          <div className="text-center flex-1 px-4 py-6 bg-[#f0fff4] rounded-lg ml-2">
            <h3 className="font-medium text-[#2d3748] mb-2">食物B</h3>
            {selectedFoods[1] ? (
              <>
                <p className="text-lg font-bold text-[#48bb78]">{selectedFoods[1].foodName}</p>
                <p className="text-sm text-[#a0aec0]">{selectedFoods[1].quantity} | {selectedFoods[1].calories}kcal</p>
              </>
            ) : (
              <p className="text-[#a0aec0]">待选择</p>
            )}
          </div>
        </div>
        
        <Button 
          type="primary" 
          size="large" 
          block 
          onClick={performComparison}
          disabled={!selectedFoods[0] || !selectedFoods[1]}
          className="mb-8 bg-[#48bb78] hover:bg-[#3da067]"
        >
          开始对比分析
        </Button>
        
        <h2 className="text-lg font-bold text-[#2d3748] mb-4">选择对比食物</h2>
        <List
          dataSource={history}
          renderItem={item => (
            <List.Item 
              className="bg-white border border-[#e2e8f0] rounded-lg mb-3 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                // 简化逻辑：依次选择食物A和食物B
                if (!selectedFoods[0]) {
                  selectFood(item, 0);
                } else if (!selectedFoods[1]) {
                  selectFood(item, 1);
                }
              }}
            >
              <Card className="w-full border-0 shadow-none">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-[#2d3748]">{item.foodName}</h3>
                    <p className="text-sm text-[#a0aec0]">{item.quantity} | {item.calories}kcal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#48bb78] font-medium">蛋白质: {item.protein}g</p>
                    <p className="text-sm text-[#f6ad55] font-medium">脂肪: {item.fat}g</p>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
};

export default Compare;