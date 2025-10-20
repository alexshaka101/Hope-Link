# 孩童端 AI 聊天系統說明文檔

## 📖 系統概述

HopeLink 孩童端 AI 聊天系統是一個專為失散兒童設計的溫柔、安全的對話介面。系統透過自然的對話方式，引導孩童分享關於家的記憶，並自動生成「語意摘要卡（Semantic Memory Card）」供後端比對使用。

---

## 🎯 核心設計理念

### 1. 安全第一
- **非審問式對話**：AI 不會像警察或社工一樣「盤問」孩子，而是像朋友一樣聊天
- **情緒監控**：即時偵測孩童情緒變化，提供安撫模式
- **敏感詞彙過濾**：自動偵測並避免戰爭、創傷等敏感話題

### 2. 溫柔引導
- **分階段對話**：從輕鬆話題逐步過渡到家庭記憶
  - 階段 1：興趣愛好（食物、顏色、玩具）
  - 階段 2：日常生活（家裡環境、寵物、鄰居）
  - 階段 3：情感記憶（想念的人、特別的回憶）

### 3. 多模態互動
- **語音輸入**：支援按住說話的語音識別
- **文字輸入**：提供打字選項，適合不同年齡層
- **情緒表達**：透過表情符號讓孩童表達當下感受

---

## 🧩 系統架構

### 核心模組

#### 1. 🎧 Voice2Text（語音轉文字）
```javascript
// 使用 Web Speech API 進行語音識別
- 支援多語言：中文、英文、烏克蘭文、阿拉伯文
- 即時轉錄孩童的話語
- 自動調整語言設定
```

#### 2. 🤖 Gemini AI 整合
```javascript
// 使用 Google Gemini API 進行自然語言理解
- 根據對話階段調整提示詞
- 生成溫柔、適齡的回應
- 避免敏感詞彙
```

#### 3. 🧠 語意提取器（Semantic Extractor）
```javascript
// 從對話中提取關鍵資訊
extractSemanticInfo(text) {
  - 主題分類（食物/家庭/地點/人物/情感）
  - 關鍵名詞提取
  - 情感分析
  - 家庭相關性判定
}
```

#### 4. 🕊️ 安全監控（Safety Monitor）
```javascript
// 即時監控對話安全性
checkSafety(text) {
  - 偵測敏感關鍵詞
  - 觸發安撫模式
  - 記錄安全事件
}
```

#### 5. 🔒 Hash 編碼器
```javascript
// 使用 SHA-256 生成語意哈希
generateSemanticHash(data) {
  - 快速比對用途
  - 保護隱私
  - 唯一性識別
}
```

#### 6. 🧾 記憶池（Memory Pool）
```javascript
// 管理和儲存語意摘要卡
saveToMemoryPool() {
  - 分類關鍵詞
  - 生成摘要卡
  - 加密儲存
}
```

---

## 📊 語意摘要卡（Semantic Memory Card）結構

### 完整資料結構

```json
{
  // ========== 基本資訊 ==========
  "sessionId": "session-1729512345678-abc123def",
  "timestamp": "2025-10-20T14:30:00.000Z",
  "language": "zh",
  "conversationStage": 2,
  "messageCount": 15,
  
  // ========== 語意特徵（核心比對資料） ==========
  "semanticFeatures": {
    // 分類關鍵詞
    "familyMembers": [
      { "text": "媽媽", "theme": "家庭", "timestamp": 1729512345678 },
      { "text": "小弟", "theme": "家庭", "timestamp": 1729512367890 }
    ],
    "locations": [
      { "text": "公園", "theme": "地點", "timestamp": 1729512389012 },
      { "text": "房間", "theme": "地點", "timestamp": 1729512401234 }
    ],
    "objects": [
      { "text": "小熊玩偶", "theme": "物品", "timestamp": 1729512423456 }
    ],
    "activities": [
      { "text": "一起做飯", "theme": "活動", "timestamp": 1729512445678 }
    ],
    "emotions": [
      { "text": "想念", "theme": "情感", "timestamp": 1729512467890 }
    ],
    "descriptions": [
      { "text": "黃色的", "theme": "描述", "timestamp": 1729512489012 }
    ],
    
    // 所有關鍵詞（未分類）
    "allKeywords": [...],
    
    // 主題分佈統計
    "themes": [
      { "theme": "家庭", "count": 8 },
      { "theme": "地點", "count": 5 },
      { "theme": "情感", "count": 3 }
    ],
    
    // 對話片段（去識別化，只保留語意）
    "conversationSnippets": [
      "我喜歡吃媽媽做的蛋炒飯",
      "家裡有一隻小狗叫豆豆",
      "我的房間有很多玩具"
    ]
  },
  
  // ========== 情感狀態追蹤 ==========
  "emotionTimeline": [
    { "emotion": "happy", "timestamp": 1729512345678, "messageIndex": 1 },
    { "emotion": "neutral", "timestamp": 1729512389012, "messageIndex": 5 },
    { "emotion": "nervous", "timestamp": 1729512445678, "messageIndex": 10 }
  ],
  
  // ========== 安全標記 ==========
  "safetyFlags": {
    "hasTriggeredSafetyPause": false,
    "conversationCompleted": false
  },
  
  // ========== 元數據 ==========
  "metadata": {
    "version": "1.0",
    "platform": "web",
    "userAgent": "Mozilla/5.0...",
    "screenSize": "1920x1080"
  },
  
  // ========== 語意哈希（用於快速比對） ==========
  "semanticHash": "a3f5d2e1b4c6...",
  "shortHash": "a3f5d2e1b4c6"
}
```

---

## 🔄 對話流程

### 1. 啟動對話
```
用戶點擊「孩童端」→「開始使用」
↓
開啟 AI 聊天模態視窗
↓
AI 發送初始問候：「你好！我是光光 ✨」
```

### 2. 階段性引導

#### 階段 1：建立信任（1-4 則訊息）
```
AI: "你最喜歡吃什麼呀？🍕"
孩童: "我喜歡披薩！"
AI: "哇，披薩好好吃喔！你喜歡什麼口味的呢？"
```

#### 階段 2：日常生活（5-9 則訊息）
```
AI: "你家裡有養小動物嗎？🐶"
孩童: "有一隻小狗叫豆豆"
AI: "豆豆好可愛的名字！牠是什麼顏色的呢？"
```

#### 階段 3：情感記憶（10+ 則訊息）
```
AI: "你最想念家裡的什麼呢？💚"
孩童: "我想念媽媽做的飯"
AI: "我懂你的感覺～媽媽最常做什麼菜給你吃呢？"
```

### 3. 語意提取
```
每次孩童回應後：
1. 語音識別 → 文字
2. 傳送給 Gemini API 分析
3. 提取關鍵詞和主題
4. 儲存到記憶池
```

### 4. 定期儲存
```
每 5 則訊息自動生成語意摘要卡
↓
儲存到 localStorage（模擬）
↓
實際應用中應傳送到後端 API
```

---

## 🛡️ 安全機制

### 1. 敏感詞彙監控
```javascript
safetyKeywords: [
  '害怕', '恐懼', '戰爭', '打', '痛',
  'fear', 'war', 'hit', 'hurt', 'scared',
  'страх', 'війна',
  'خوف', 'حرب'
]
```

### 2. 自動觸發安撫模式
```
偵測到敏感詞彙
↓
立即暫停對話
↓
顯示月亮星星動畫 🌙✨
↓
播放安撫訊息：「我們休息一下吧」
```

### 3. 情緒監控
```
孩童可隨時選擇表情：
😊 開心 → 繼續正常對話
😐 還好 → 保持當前節奏
😟 緊張 → AI 給予關懷
😴 想休息 → 立即進入安撫模式
```

---

## 🌍 多語言支援

### 支援語言
- 🇹🇼 繁體中文（zh）
- 🇬🇧 英文（en）
- 🇺🇦 烏克蘭文（uk）
- 🇸🇦 阿拉伯文（ar）

### 語音識別對應
```javascript
const langMap = {
  'zh': 'zh-TW',
  'en': 'en-US',
  'uk': 'uk-UA',
  'ar': 'ar-SA'
};
```

---

## 📝 後端整合指南

### API 端點設計建議

#### 1. 提交語意摘要卡
```http
POST /api/semantic-cards
Content-Type: application/json

{
  "sessionId": "session-xxx",
  "semanticFeatures": {...},
  "emotionTimeline": [...],
  ...
}

Response:
{
  "success": true,
  "cardId": "card-123456",
  "matchPending": true
}
```

#### 2. 比對相似度
```http
POST /api/match/semantic
Content-Type: application/json

{
  "cardId": "card-123456",
  "threshold": 0.7
}

Response:
{
  "matches": [
    {
      "parentCaseId": "parent-789",
      "similarity": 0.85,
      "matchedFeatures": {
        "familyMembers": ["媽媽", "小弟"],
        "locations": ["公園"],
        "activities": ["一起做飯"]
      }
    }
  ]
}
```

### 比對演算法建議

#### 1. 關鍵詞向量化
```python
# 使用 TF-IDF 或 Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer

# 將關鍵詞轉換為向量
vectorizer = TfidfVectorizer()
child_vector = vectorizer.fit_transform(child_keywords)
parent_vector = vectorizer.transform(parent_keywords)

# 計算相似度
from sklearn.metrics.pairwise import cosine_similarity
similarity = cosine_similarity(child_vector, parent_vector)
```

#### 2. 多維度比對
```python
# 權重分配
weights = {
    'family_members': 0.35,  # 家庭成員權重最高
    'locations': 0.25,       # 地點次之
    'activities': 0.20,      # 活動
    'objects': 0.15,         # 物品
    'emotions': 0.05         # 情感
}

# 綜合相似度
total_similarity = sum(
    weights[category] * calculate_similarity(
        child_features[category],
        parent_features[category]
    )
    for category in weights.keys()
)
```

---

## 🔐 隱私保護措施

### 1. 去識別化
- 不儲存任何個人識別資訊（姓名、照片、具體地址）
- 只保留語意特徵和記憶片段

### 2. 加密傳輸
- 所有 API 通訊使用 HTTPS
- 語意哈希用於快速比對，不可逆

### 3. 資料生命週期
```
生成 → 加密 → 傳輸 → 比對 → 刪除
        ↑                    ↓
    本地暫存            成功匹配後刪除原始資料
```

---

## 🧪 測試指南

### 1. 本地測試
```bash
# 1. 開啟 index.html
# 2. 點擊「孩童端」→「開始使用」
# 3. 選擇語言
# 4. 開始對話測試
```

### 2. 測試場景

#### 場景 1：正常對話流程
```
1. AI 問候
2. 孩童分享喜好（階段 1）
3. AI 引導到家庭話題（階段 2）
4. 孩童分享家的記憶（階段 3）
5. 檢查 localStorage 中的語意摘要卡
```

#### 場景 2：安全機制觸發
```
1. 孩童輸入敏感詞彙（如「害怕」、「戰爭」）
2. 系統應自動觸發安撫模式
3. 檢查 console 日誌
```

#### 場景 3：情緒變化
```
1. 點擊不同表情按鈕
2. 檢查 emotionTimeline 記錄
3. 驗證 AI 回應是否相應調整
```

### 3. 檢查語意摘要卡
```javascript
// 在瀏覽器 Console 中執行
const cards = JSON.parse(localStorage.getItem('hopelink-memory-cards'));
console.table(cards);

// 查看特定卡片的語意特徵
console.log(cards[0].semanticFeatures);
```

---

## 📈 系統監控

### 關鍵指標

```javascript
// Console 輸出範例
✅ 語意摘要卡已生成: {...}
📊 語意特徵統計: {
  家庭成員: 5,
  地點: 3,
  物品: 2,
  活動: 4,
  總關鍵詞: 18
}
```

### 即時日誌
```
🔗 HopeLink 孩童端 AI 聊天系統已載入
😊 孩童選擇情緒: happy
💙 偵測到孩童情緒低落，給予關懷
⚠️ 偵測到敏感內容，自動觸發安撫模式
```

---

## 🚀 部署建議

### 1. 前端部署
- 託管在 CDN（如 Cloudflare, AWS S3）
- 啟用 HTTPS
- 設定 CSP（Content Security Policy）

### 2. API 密鑰管理
```javascript
// 不要在前端暴露真實的 API 密鑰
// 應該透過後端代理
const GEMINI_API_PROXY = 'https://your-backend.com/api/gemini';
```

### 3. 效能優化
- 啟用 Service Worker 快取
- 壓縮 JavaScript 和 CSS
- 使用 CDN 載入字型和資源

---

## 🛠️ 疑難排解

### 常見問題

#### 1. 語音識別不工作
```
問題：瀏覽器不支援 Web Speech API
解決：
- 使用 Chrome 或 Edge 瀏覽器
- 確保使用 HTTPS
- 檢查麥克風權限
```

#### 2. Gemini API 錯誤
```
問題：API 請求失敗
解決：
- 檢查 API 密鑰是否有效
- 確認網路連線
- 查看 Console 錯誤訊息
```

#### 3. 語意摘要卡未生成
```
問題：localStorage 中沒有資料
解決：
- 確保對話至少 5 則訊息
- 檢查 Console 是否有錯誤
- 手動呼叫 saveToMemoryPool()
```

---

## 📞 支援與聯繫

如有任何問題或建議，請聯繫：
- Email: support@hopelink.org
- GitHub: https://github.com/hopelink/ai-chat

---

**最後更新：2025-10-20**
**版本：1.0.0**

