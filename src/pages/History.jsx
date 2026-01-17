import React, { useState, useEffect } from 'react';
import { Button, List, Card, Empty, message } from 'antd';
import { LeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('calorieHistory') || '[]');
    setHistory(storedHistory);
  }, []);

  const deleteRecord = (id) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem('calorieHistory', JSON.stringify(newHistory));
    message.success('记录已删除');
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
          <h1 className="text-xl font-bold text-[#2d3748]">分析历史</h1>
          <div style={{ width: 32 }} /> {/* 占位元素 */}
        </div>
        
        {history.length === 0 ? (
          <Empty 
            description="暂无分析记录" 
            className="py-12"
            imageStyle={{ height: 80 }}
          />
        ) : (
          <List
            dataSource={history}
            renderItem={item => (
              <List.Item 
                className="bg-white border border-[#e2e8f0] rounded-lg mb-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/analysis/${item.id}`)}
              >
                <Card className="w-full border-0 shadow-none relative">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-[#2d3748]">{item.foodName}</h3>
                      <p className="text-sm text-[#a0aec0]">{item.analysisTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#48bb78]">{item.calories} <span className="text-sm font-normal">kcal</span></p>
                      <p className="text-sm text-[#a0aec0]">{item.quantity}</p>
                    </div>
                  </div>
                  
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined />} 
                    className="absolute top-2 right-2 text-[#a0aec0] hover:text-[#f6ad55]"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRecord(item.id);
                    }}
                  />
                </Card>
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default History;