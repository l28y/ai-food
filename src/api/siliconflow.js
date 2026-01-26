// 硅基流动API服务
const API_BASE_URL = 'https://api.siliconflow.cn/v1';

/**
 * 将文件转换为Base64格式
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // 移除data:image/xxx;base64,前缀
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * 调用硅基流动的大模型进行食物分析
 * @param {File|null} imageFile - 上传的图片文件
 * @param {string} description - 食物描述
 * @param {string} apiKey - 硅基流动API密钥
 * @param {string} model - 模型ID
 * @returns {Promise<Object>} 分析结果
 */
export const analyzeFood = async (imageFile, description, apiKey, model = 'deepseek-ai/deepseek-vl2') => {
  try {
    const imageId = Date.now();
    let imageData = null;

    // 如果有图片，转换为base64
    if (imageFile) {
      imageData = await fileToBase64(imageFile);
    }

    // 构建提示词
    let prompt = '';
    let messages = [];

    if (imageData) {
      // 有图片的情况
      prompt = `请分析这张食物图片，提供详细的营养信息。请以JSON格式返回，包含以下字段：
- foodName: 食物名称
- quantity: 份量估计
- calories: 热量(kcal)
- protein: 蛋白质含量
- fat: 脂肪含量(g)
- carbs: 碳水化合物含量(g)
- recommendations: 建议列表(3条)

只返回JSON，不要有其他文字。`;
      
      messages = [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`
              }
            },
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ];
    } else {
      // 纯文本描述的情况
      prompt = `请根据食物描述"${description}"，提供详细的营养信息。请以JSON格式返回，包含以下字段：
- foodName: 食物名称
- quantity: 份量估计
- calories: 热量(kcal)
- protein: 蛋白质含量
- fat: 脂肪含量(g)
- carbs: 碳水化合物含量(g)
- recommendations: 建议列表(3条)

只返回JSON，不要有其他文字。`;
      
      messages = [
        {
          role: 'user',
          content: prompt
        }
      ];
    }

    // 调用硅基流动API
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'API调用失败');
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 解析JSON响应
    let result;
    try {
      // 尝试直接解析
      result = JSON.parse(content);
    } catch (error) {
      // 如果直接解析失败，尝试提取JSON部分
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析API返回的数据');
      }
    }

    // 返回分析结果
    return {
      id: imageId,
      foodName: result.foodName || description || '未知食物',
      quantity: result.quantity || '1份',
      calories: result.calories || 0,
      protein: result.protein || 0,
      fat: result.fat || 0,
      carbs: result.carbs || 0,
      recommendations: result.recommendations || [
        '建议搭配蔬菜增加纤维摄入',
        '注意控制食用份量',
        '搭配健康饮品效果更佳'
      ],
      analysisTime: new Date().toLocaleString()
    };

  } catch (error) {
    console.error('分析失败:', error);
    throw error;
  }
};
