import React, { useState } from 'react';
import { Button, Input, Card, Upload, message, Spin } from 'antd';
import { UploadOutlined, CameraOutlined, HistoryOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { historyDB } from '../utils/historyDB';
import { indexedDBHelper } from '../utils/indexedDB';

const { TextArea } = Input;

const Home = () => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!description && !imageFile) {
      message.warning('请上传图片或输入食物描述');
      return;
    }
    
    setAnalyzing(true);
    
    // 模拟AI分析过程
    setTimeout(async () => {
      // 生成模拟分析结果
      const imageId = Date.now();
      let imageData = null;

      // 如果有图片，先保存到IndexedDB
      if (imageFile) {
        try {
          await historyDB.init();
          await indexedDB.saveImage(imageId, imageFile);
          imageData = `db:${imageId}`;
        } catch (error) {
          console.error('保存图片失败:', error);
          message.error('保存图片失败，请重试');
          setAnalyzing(false);
          return;
        }
      }

      const mockResult = {
        id: imageId,
        foodName: imageFile ? '牛肉拉面' : description,
        quantity: '1碗',
        calories: 480,
        protein: 25,
        fat: 12,
        carbs: 68,
        analysisTime: new Date().toLocaleString(),
        imageId: imageData ? imageId : null,
        recommendations: [
          '建议搭配一份蔬菜沙拉增加纤维摄入',
          '下次可选择清汤牛肉面减少油脂摄入',
          '搭配一杯无糖豆浆增加蛋白质摄入'
        ]
      };
      
      // 保存到IndexedDB
      try {
        await historyDB.addHistory(mockResult);
      } catch (error) {
        console.error('保存历史记录失败:', error);
        message.error('保存历史记录失败');
      }
      
      setAnalyzing(false);
      navigate(`/analysis/${mockResult.id}`);
    }, 2000);
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    return false; // 阻止默认上传行为
  };

  return (
    <div className="min-h-screen bg-[#e6f4f1] p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-8">
        <h1 className="text-2xl font-bold text-center text-[#2d3748] mb-2">智能热量分析</h1>
        <p className="text-center text-[#a0aec0] mb-6">拍照或描述食物，获取详细营养信息</p>
        
        <div className="mb-6">
          <div className="flex justify-center mb-4">
            <CameraOutlined className="text-4xl text-[#48bb78]" />
          </div>
          <Upload 
            beforeUpload={handleImageUpload}
            showUploadList={false}
            accept="image/*"
          >
            <Button 
              block 
              size="large" 
              icon={<UploadOutlined />}
              className="mb-4"
            >
              {imageFile ? '已选择图片' : '上传食物图片'}
            </Button>
          </Upload>
          
          <div className="relative flex items-center justify-center mb-4">
            <div className="flex-grow border-t border-[#cbd5e0]" />
            <span className="mx-4 text-[#a0aec0] text-sm">或</span>
            <div className="flex-grow border-t border-[#cbd5e0]" />
          </div>
          
          <TextArea 
            placeholder="输入食物描述，例如：一碗牛肉拉面"
            autoSize={{ minRows: 3, maxRows: 5 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />
        </div>
        
        <Button 
          type="primary" 
          size="large" 
          block 
          onClick={handleAnalyze}
          disabled={analyzing}
          className="mb-4 bg-[#48bb78] hover:bg-[#3da067]"
        >
          {analyzing ? <Spin size="small" /> : '开始分析'}
        </Button>
        
        <Button 
          block 
          size="large" 
          icon={<HistoryOutlined />}
          onClick={() => navigate('/history')}
        >
          查看历史记录
        </Button>
      </div>
      
      <Card className="w-full max-w-md mt-6 border-0 shadow-none bg-transparent">
        <p className="text-center text-[#a0aec0] text-sm">
          通过AI技术快速识别食物热量与营养成分，
          帮助您更好地管理日常饮食
        </p>
      </Card>
    </div>
  );
};

export default Home;