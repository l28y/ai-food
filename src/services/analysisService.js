// 模拟AI分析服务
export const analyzeFood = async (foodData) => {
  // 模拟API延迟
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 根据不同类型返回不同的模拟结果
  if (foodData.type === 'text') {
    // 文本分析示例
    const text = foodData.content.toLowerCase();
    
    if (text.includes('汉堡') || text.includes('burger')) {
      return {
        name: '牛肉汉堡配薯条',
        calories: 850,
        image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E6%B1%89%E5%A0%A1%E8%83%9C%E5%88%A9&width=400&height=300&random=hamburg_400_300',
        nutrients: {
          '蛋白质': '32g',
          '脂肪': '45g',
          '碳水化合物': '78g',
          '纤维': '4g',
          '钠': '1200mg'
        },
        suggestions: [
          {
            type: 'substitute',
            description: '可选择鸡肉汉堡或素食汉堡替代，热量可降低20-30%'
          },
          {
            type: 'intake',
            description: '建议搭配蔬菜沙拉，增加纤维摄入并平衡营养'
          }
        ]
      };
    } else if (text.includes('沙拉') || text.includes('salad')) {
      return {
        name: '凯撒沙拉',
        calories: 380,
        image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E5%87%AF%E6%92%92%E6%B2%99%E6%8B%89&width=400&height=300&random=salad_400_300',
        nutrients: {
          '蛋白质': '15g',
          '脂肪': '28g',
          '碳水化合物': '18g',
          '纤维': '6g',
          '钠': '850mg'
        },
        suggestions: [
          {
            type: 'substitute',
            description: '可选择低脂沙拉酱或柠檬汁替代，热量可降低15-20%'
          },
          {
            type: 'intake',
            description: '建议添加鸡胸肉或豆腐增加蛋白质含量'
          }
        ]
      };
    } else {
      // 默认返回示例
      return {
        name: '示例食物',
        calories: 450,
        image: 'https://www.weavefox.cn/api/bolt/unsplash_image?keyword=%E9%A3%9F%E7%89%A9&width=400&height=300&random=food_400_300',
        nutrients: {
          '蛋白质': '20g',
          '脂肪': '15g',
          '碳水化合物': '55g',
          '纤维': '8g',
          '钠': '600mg'
        },
        suggestions: [
          {
            type: 'substitute',
            description: '可选择全麦面包替代白面包，增加纤维摄入'
          },
          {
            type: 'intake',
            description: '建议控制食用频率，每周不超过3次'
          }
        ]
      };
    }
  } else {
    // 图像或摄像头分析示例
    return {
      name: '示例食物',
      calories: 520,
      image: foodData.content, // 使用上传的图片
      nutrients: {
        '蛋白质': '25g',
        '脂肪': '22g',
        '碳水化合物': '58g',
        '纤维': '6g',
        '钠': '750mg'
      },
      suggestions: [
        {
          type: 'substitute',
          description: '可选择烤制方式替代油炸，热量可降低30-40%'
        },
        {
          type: 'intake',
          description: '建议搭配蔬菜汤，增加饱腹感并平衡营养'
        }
      ]
    };
  }
};