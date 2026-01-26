import React, { useState, useEffect } from 'react';
import { Button, Card, Input, Form, Select, Space, Divider, Alert, App } from 'antd';
import { SaveOutlined, LeftOutlined, KeyOutlined, RobotOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const Settings = () => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // 可用的模型列表
  const modelOptions = [
    {
      value: 'deepseek-ai/deepseek-vl2',
      label: 'DeepSeek-VL2 (视觉语言模型)',
      description: '支持图片和文本输入的多模态模型'
    },
    {
      value: 'Qwen/Qwen2.5-7B-Instruct',
      label: 'Qwen2.5-7B-Instruct',
      description: '通义千问7B指令模型'
    },
    {
      value: 'THUDM/glm-4-9b-chat',
      label: 'GLM-4-9B-Chat',
      description: '智谱AI GLM-4模型'
    },
    {
      value: 'Pro/deepseek-ai/DeepSeek-V3',
      label: 'DeepSeek-V3',
      description: 'DeepSeek最新版本模型'
    }
  ];

  // 测试密钥
  const TEST_API_KEY = 'sk-yhqrucalfounzlswjkpitezdmgvgeksmllzrtsgljwnicnup';

  useEffect(() => {
    // 加载已保存的设置
    loadSettings();
  }, []);

  const loadSettings = () => {
    const apiKey = localStorage.getItem('siliconflow_api_key') || '';
    const model = localStorage.getItem('siliconflow_model') || 'deepseek-ai/deepseek-vl2';
    form.setFieldsValue({ apiKey, model });
  };

  const handleUseTestKey = () => {
    form.setFieldsValue({ apiKey: TEST_API_KEY });
    message.success('已填入测试密钥，请按需使用');
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 保存到localStorage
      localStorage.setItem('siliconflow_api_key', values.apiKey);
      localStorage.setItem('siliconflow_model', values.model);

      setLoading(false);
      setSaved(true);
      message.success('设置保存成功');

      // 3秒后隐藏成功提示
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请检查输入');
      setLoading(false);
    }
  };

  const handleClear = () => {
    localStorage.removeItem('siliconflow_api_key');
    localStorage.removeItem('siliconflow_model');
    form.setFieldsValue({ apiKey: '', model: 'deepseek-ai/deepseek-vl2' });
    message.success('已清除设置');
  };

  const handleTest = async () => {
    const apiKey = form.getFieldValue('apiKey');
    const model = form.getFieldValue('model');

    if (!apiKey) {
      message.warning('请先输入API密钥');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10
        })
      });

      if (response.ok) {
        message.success('API密钥验证成功！');
      } else {
        const errorData = await response.json();
        message.error(`验证失败: ${errorData.message || '请检查API密钥'}`);
      }
    } catch (error) {
      message.error('网络错误，请检查网络连接');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#e6f4f1] p-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 mt-8">
        <div className="flex items-center mb-6">
          <Button 
            type="text" 
            icon={<LeftOutlined />} 
            onClick={() => navigate('/')} 
            className="text-[#2d3748]"
          />
          <h1 className="text-xl font-bold text-[#2d3748] ml-2">API设置</h1>
        </div>

        <Alert
          message="关于API密钥"
          description={
            <div>
              <p className="mb-2">API密钥用于调用硅基流动的大模型服务。请访问硅基流动官网获取您的API密钥。密钥将仅保存在本地浏览器中，不会上传到任何服务器。</p>
              <Alert
                message="测试密钥"
                description="下方提供的是测试密钥，仅供开发测试使用。正式使用时请申请自己的API密钥。"
                type="warning"
                showIcon
                className="mt-2"
              />
            </div>
          }
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-6"
        />

        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label={
              <Space>
                <KeyOutlined />
                <span className="font-semibold">API密钥</span>
              </Space>
            }
            name="apiKey"
            rules={[
              { required: true, message: '请输入API密钥' }
            ]}
          >
            <Input.Password
              placeholder="请输入硅基流动API密钥"
              size="large"
              prefix={<KeyOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            label={
              <Space>
                <RobotOutlined />
                <span className="font-semibold">选择模型</span>
              </Space>
            }
            name="model"
            rules={[
              { required: true, message: '请选择模型' }
            ]}
          >
            <Select size="large" placeholder="请选择模型">
              {modelOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Divider />

        <Space className="w-full" direction="vertical" size="middle">
          <div className="flex space-x-4">
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={loading}
              className="flex-1 bg-[#48bb78] hover:bg-[#3da067]"
            >
              保存设置
            </Button>
            <Button
              size="large"
              onClick={handleTest}
              loading={loading}
            >
              测试连接
            </Button>
          </div>

          <Button
            size="large"
            onClick={handleUseTestKey}
            className="text-[#48bb78] border-[#48bb78] hover:text-[#3da067] hover:border-[#3da067]"
          >
            使用测试密钥
          </Button>

          <Button
            size="large"
            onClick={handleClear}
            className="text-[#f56565] hover:text-[#c53030]"
          >
            清除设置
          </Button>
        </Space>

        {saved && (
          <div className="mt-4 p-3 bg-[#c6f6d5] text-[#22543d] rounded-lg text-center">
            ✓ 设置已保存
          </div>
        )}

        <Card className="mt-6 border-0 shadow-none bg-gray-50">
          <h3 className="font-semibold text-[#2d3748] mb-2">如何获取API密钥？</h3>
          <ol className="text-sm text-[#4a5568] space-y-2">
            <li>1. 访问 <a href="https://cloud.siliconflow.cn/i/EP2VclY4" target="_blank" rel="noopener noreferrer" className="text-[#48bb78] hover:underline">硅基流动官网</a></li>
            <li>2. 注册并登录账号</li>
            <li>3. 进入控制台 → API密钥管理</li>
            <li>4. 创建新的API密钥</li>
            <li>5. 复制密钥并粘贴到上方输入框</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
