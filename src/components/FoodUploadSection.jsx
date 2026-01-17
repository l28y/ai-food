import React, { useState } from 'react';
import { Upload, Camera, Type, Mic } from 'lucide-react';

const FoodUploadSection = ({ onSubmit, isLoading }) => {
  const [foodDescription, setFoodDescription] = useState('');
  
  const handleTextSubmit = () => {
    if (foodDescription.trim()) {
      onSubmit({ type: 'text', content: foodDescription });
      setFoodDescription('');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onSubmit({ type: 'image', content: event.target.result, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // 在实际应用中，这里会调用摄像头API
    // 为了演示，我们使用一个示例图片
    onSubmit({ 
      type: 'camera', 
      content: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E9%A3%9F%E7%89%A9&width=400&height=300&random=camera_400_300',
      fileName: 'camera-capture.jpg'
    });
  };

  return (
    <section className="mb-12 bg-white rounded-2xl shadow-sm border border-[#e0e0e0] p-6">
      <h2 className="text-2xl font-bold text-[#333333] mb-2">添加你的食物</h2>
      <p className="text-[#666666] mb-6">支持图片、描述或语音输入</p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <label className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] rounded-xl cursor-pointer hover:bg-[#e9ecef] transition-colors border border-[#e0e0e0]">
          <Upload className="text-[#40c080] mb-2" size={24} />
          <span className="text-sm text-center">图片上传</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageUpload}
            disabled={isLoading}
          />
        </label>
        
        <button 
          className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] rounded-xl cursor-pointer hover:bg-[#e9ecef] transition-colors border border-[#e0e0e0] disabled:opacity-50"
          onClick={handleCameraCapture}
          disabled={isLoading}
        >
          <Camera className="text-[#40c080] mb-2" size={24} />
          <span className="text-sm text-center">拍照</span>
        </button>
        
        <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e0e0]">
          <Mic className="text-[#40c080] mb-2" size={24} />
          <span className="text-sm text-center">语音输入</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-[#f8f9fa] rounded-xl border border-[#e0e0e0]">
          <Type className="text-[#40c080] mb-2" size={24} />
          <span className="text-sm text-center">文字描述</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={foodDescription}
          onChange={(e) => setFoodDescription(e.target.value)}
          placeholder="输入食物描述，例如：一份牛肉汉堡配薯条"
          className="flex-1 px-4 py-3 border border-[#e0e0e0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40c080] focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleTextSubmit}
          disabled={isLoading || !foodDescription.trim()}
          className="px-6 py-3 bg-[#40c080] text-white rounded-lg hover:bg-[#37b075] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '分析中...' : '分析食物'}
        </button>
      </div>
      
      {isLoading && (
        <div className="mt-4 flex items-center justify-center text-[#666666]">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#40c080] mr-2"></div>
          <span>正在分析食物信息...</span>
        </div>
      )}
    </section>
  );
};

export default FoodUploadSection;