// 历史记录存储工具 - 使用 IndexedDB
import { indexedDBHelper } from './indexedDB';

const HISTORY_STORE_NAME = 'history';

class HistoryDB {
  constructor() {
    this.db = null;
    this.dbName = 'AIFoodDB';
    this.version = 1;
  }

  // 初始化数据库
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        // 确保历史记录存储存在
        if (!db.objectStoreNames.contains(HISTORY_STORE_NAME)) {
          db.createObjectStore(HISTORY_STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  // 添加历史记录
  async addHistory(record) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([HISTORY_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(HISTORY_STORE_NAME);
      const request = store.add(record);

      request.onsuccess = () => resolve(record);
      request.onerror = () => reject(request.error);
    });
  }

  // 获取所有历史记录
  async getAllHistory() {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([HISTORY_STORE_NAME], 'readonly');
      const store = transaction.objectStore(HISTORY_STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        // 按时间倒序排序
        const results = request.result.sort((a, b) => b.id - a.id);
        resolve(results);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 获取单个历史记录
  async getHistory(id) {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([HISTORY_STORE_NAME], 'readonly');
      const store = transaction.objectStore(HISTORY_STORE_NAME);
      const request = store.get(Number(id));

      request.onsuccess = () => {
        const result = request.result;
        if (result && result.imageId) {
          // 如果有图片ID，从IndexedDB获取图片数据
          indexedDBHelper.getImage(result.imageId).then(imageData => {
            if (imageData) {
              result.image = imageData;
            }
            resolve(result);
          }).catch(() => resolve(result));
        } else {
          resolve(result);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // 删除历史记录
  async deleteHistory(id) {
    if (!this.db) await this.init();

    return new Promise(async (resolve, reject) => {
      // 先获取记录，看是否有图片需要删除
      const transaction = this.db.transaction([HISTORY_STORE_NAME], 'readonly');
      const store = transaction.objectStore(HISTORY_STORE_NAME);
      const getRequest = store.get(Number(id));

      getRequest.onsuccess = async () => {
        const record = getRequest.result;
        
        // 删除图片
        if (record && record.imageId) {
          await indexedDBHelper.deleteImage(record.imageId);
        }

        // 删除历史记录
        const deleteTransaction = this.db.transaction([HISTORY_STORE_NAME], 'readwrite');
        const deleteStore = deleteTransaction.objectStore(HISTORY_STORE_NAME);
        const deleteRequest = deleteStore.delete(Number(id));

        deleteRequest.onsuccess = () => resolve();
        deleteRequest.onerror = () => reject(deleteRequest.error);
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // 清空所有历史记录
  async clearAllHistory() {
    if (!this.db) await this.init();

    // 先清空所有图片
    await indexedDBHelper.clearAll();

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([HISTORY_STORE_NAME], 'readwrite');
      const store = transaction.objectStore(HISTORY_STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// 导出单例实例
export const historyDB = new HistoryDB();
export default historyDB;
