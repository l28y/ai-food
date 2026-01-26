import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Upload, message, Spin, Alert } from 'antd';
import { UploadOutlined, CameraOutlined, HistoryOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { historyDB } from '../utils/historyDB';
import { indexedDBHelper } from '../utils/indexedDB';
import { analyzeFood } from '../api/siliconflow';

const { TextArea } = Input;

const Home = () => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // 检查是否已配置API密钥
    const apiKey = localStorage.getItem('siliconflow_api_key');
    if (!apiKey) {
      message.warning('请先配置API密钥');
      navigate('/settings');
    }
  }, [navigate]);

  const handleAnalyze = async () => {
    if (!description && !imageFile) {
      message.warning('请上传图片或输入食物描述');
      return;
    }

    const apiKey = localStorage.getItem('siliconflow_api_key');
    const model = localStorage.getItem('siliconflow_model') || 'deepseek-ai/deepseek-vl2';

    if (!apiKey) {
      message.warning('请先配置API密钥');
      navigate('/settings');
      return;
    }
    
    setAnalyzing(true);
    
    try {
      // 调用AI分析
      const analysisResult = await analyzeFood(imageFile, description, apiKey, model);
      
      // 保存图片到IndexedDB
      let imageData = null;
      if (imageFile) {
        try {
          await historyDB.init();
          await indexedDBHelper.saveImage(analysisResult.id, imageFile);
          imageData = `db:${analysisResult.id}`;
        } catch (error) {
          console.error('保存图片失败:', error);
          message.error('保存图片失败，请重试');
        }
      }

      // 添加imageId到结果中
      const resultWithImage = {
        ...analysisResult,
        imageId: imageData ? analysisResult.id : null
      };
      
      // 保存到IndexedDB
      try {
        await historyDB.addHistory(resultWithImage);
      } catch (error) {
        console.error('保存历史记录失败:', error);
        message.error('保存历史记录失败');
      }

      // 清理预览URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      
      setAnalyzing(false);
      navigate(`/analysis/${resultWithImage.id}`);
    } catch (error) {
      console.error('分析失败:', error);
      message.error(error.message || '分析失败，请重试');
      setAnalyzing(false);
    }
  };

  const handleImageUpload = (file) => {
    setImageFile(file);
    // 创建预览URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    return false; // 阻止默认上传行为
  };

  const handleClearImage = () => {
    setImageFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f4f1] p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 mt-8">
        <h1 className="text-2xl font-bold text-center text-[#2d3748] mb-2">智能热量分析</h1>
        <p className="text-center text-[#a0aec0] mb-6">拍照或描述食物，获取详细营养信息</p>
        
        <div className="mb-6">
          {imagePreview ? (
            <div className="mb-6 flex flex-col items-center">
              <div className="relative mb-4">
                <img
                  src={imagePreview}
                  alt="上传的图片"
                  className="w-full max-w-xs h-64 object-contain rounded-xl border-2 border-[#48bb78] shadow-md"
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  className="absolute -top-2 -right-2 bg-white rounded-full shadow-md w-8 h-8 flex items-center justify-center hover:bg-[#f7fafc]"
                  onClick={handleClearImage}
                />
              </div>
              <Upload
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button
                  size="large"
                  icon={<UploadOutlined />}
                  className="w-64"
                >
                  更换图片
                </Button>
              </Upload>
            </div>
          ) : (
            <div className="mb-6 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#c6f6d5] to-[#9ae6b4] flex items-center justify-center mb-4">
                <CameraOutlined className="text-5xl text-[#48bb78]" />
              </div>
              <Upload 
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button
                  size="large"
                  icon={<UploadOutlined />}
                  className="bg-gradient-to-r from-[#48bb78] to-[#38a169] text-white border-none hover:from-[#3da067] hover:to-[#2f855a] w-64"
                >
                  上传食物图片
                </Button>
              </Upload>
            </div>
          )}
          
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

          {!localStorage.getItem('siliconflow_api_key') && (
            <Alert
              message="请先配置API密钥"
              description="需要配置硅基流动API密钥才能使用AI分析功能"
              type="warning"
              showIcon
              closable
              className="mb-4"
              afterClose={() => {}}
            />
          )}
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
          className="mb-4"
        >
          查看历史记录
        </Button>

        <Button 
          block 
          size="large" 
          icon={<SettingOutlined />}
          onClick={() => navigate('/settings')}
          className="text-[#718096]"
        >
          API设置
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