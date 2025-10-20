# Gemini API 測試指南

## ✅ API 配置已完成

### 當前設定
- **API Key**: `AIzaSyDEXYSZI5GNe266b6P5F4DLY7G6JdbtI4c`
- **模型**: `gemini-1.5-flash` （快速響應版本）
- **狀態**: ✅ 已配置並優化

---

## 🧪 快速測試 API

### 方法 1：使用內建測試功能

1. **開啟網頁**：在瀏覽器中開啟 `index.html`

2. **開啟 Console**：
   - Windows/Linux: 按 `F12` 或 `Ctrl + Shift + J`
   - Mac: 按 `Cmd + Option + J`

3. **執行測試指令**：
   ```javascript
   testGeminiAPI()
   ```

4. **查看結果**：
   - ✅ **成功**：會顯示 AI 的回應
   - ❌ **失敗**：會顯示錯誤訊息和檢查建議

### 預期輸出（成功）
```
🧪 開始測試 Gemini API...
📡 API URL: https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
🔑 API Key: AIzaSyDEXY...
📤 測試提示詞: 你好！請用一句溫暖的話回應我。
🤖 正在呼叫 Gemini API...
✅ API 回應成功: {...}
💬 AI 回應內容: 你好呀！很高興認識你～
✅ API 測試成功！
💬 AI 回應: 你好呀！很高興認識你～

✨ 系統運作正常，可以開始使用！
```

---

## 🎯 完整功能測試

### 方法 2：測試實際對話功能

1. **點擊「孩童端」**
   - 在首頁點擊「我是孩子 🧒」卡片
   - 或點擊導覽列的「孩童端」

2. **點擊「開始使用」**
   - 閱讀使用說明
   - 點擊綠色的「開始使用」按鈕

3. **選擇語言**（可選）
   - 預設為中文
   - 可切換到 EN / УКР / عربي

4. **選擇輸入方式**：

   **選項 A：語音輸入**
   - 按住「按住說話」按鈕 🎤
   - 對著麥克風說話
   - 放開按鈕停止錄音
   - 等待 AI 回應（1-3 秒）

   **選項 B：文字輸入**
   - 點擊麥克風旁的切換按鈕 🔄
   - 在輸入框中打字
   - 按 Enter 或點擊發送按鈕 ➤

5. **查看 Console 日誌**：
   ```
   🤖 正在呼叫 Gemini API...
   ✅ API 回應成功
   💬 AI 回應內容: [實際回應]
   😊 孩童選擇情緒: happy
   📊 語意特徵統計: {...}
   ```

---

## 🔍 常見錯誤排查

### 錯誤 1: `403 Forbidden`
```
❌ API 錯誤: 403 - API key not valid
```
**原因**: API Key 無效或已過期

**解決方法**:
1. 檢查 API Key 是否正確
2. 前往 [Google AI Studio](https://makersuite.google.com/app/apikey) 驗證
3. 如需要，生成新的 API Key

---

### 錯誤 2: `CORS Error`
```
Access to fetch at '...' has been blocked by CORS policy
```
**原因**: 本地檔案無法直接訪問 API

**解決方法**:
使用本地伺服器：

**選項 A：使用 Python**
```bash
# Python 3
python -m http.server 8000

# 然後訪問 http://localhost:8000
```

**選項 B：使用 Node.js**
```bash
npx http-server

# 然後訪問顯示的 URL
```

**選項 C：使用 VS Code**
- 安裝 "Live Server" 擴充套件
- 右鍵點擊 index.html
- 選擇 "Open with Live Server"

---

### 錯誤 3: `429 Too Many Requests`
```
❌ API 錯誤: 429 - Quota exceeded
```
**原因**: API 請求次數超過限制

**解決方法**:
1. 等待一段時間後再試
2. 檢查 API 配額設定
3. 升級到付費方案（如需要）

---

### 錯誤 4: 語音識別不工作
**原因**: 瀏覽器不支援或沒有權限

**解決方法**:
1. **使用支援的瀏覽器**：
   - ✅ Chrome（推薦）
   - ✅ Edge
   - ✅ Safari
   - ❌ Firefox（部分支援）

2. **確保使用 HTTPS 或 localhost**：
   - 語音識別需要安全環境
   - 使用本地伺服器（如上述方法）

3. **檢查麥克風權限**：
   - 允許瀏覽器訪問麥克風
   - 檢查作業系統的隱私設定

---

### 錯誤 5: API 回應被阻擋
```
⚠️ 回應被安全過濾器阻擋
```
**原因**: 內容觸發了 Google 的安全過濾器

**說明**:
- 這是正常的保護機制
- 系統會自動回退到備用回應
- 不影響整體功能

---

## 📊 監控 API 使用狀況

### 查看系統狀態
在 Console 中執行：
```javascript
// 查看對話狀態
console.table(window.ChildAIChat);

// 查看已生成的語意摘要卡
const cards = JSON.parse(localStorage.getItem('hopelink-memory-cards'));
console.table(cards);

// 查看關鍵詞提取
console.log('提取的關鍵詞:', window.ChildAIChat.extractedKeywords);
```

### API 請求日誌
每次 API 呼叫都會在 Console 顯示：
```
🤖 正在呼叫 Gemini API...
✅ API 回應成功: {...}
💬 AI 回應內容: [實際內容]
```

---

## ⚙️ 進階設定

### 調整模型參數
如果需要修改 API 行為，編輯 `child-ai-chat.js`:

```javascript
// 在第 213-219 行
generationConfig: {
    temperature: 0.9,        // 創造性 (0.0-1.0)
    maxOutputTokens: 200,    // 最大回應長度
    topP: 0.95,              // 多樣性
    topK: 40,                // 候選數量
    candidateCount: 1
}
```

**參數說明**:
- `temperature`: 越高越有創意（建議 0.7-0.9）
- `maxOutputTokens`: 控制回應長度（建議 150-300）
- `topP`: 控制多樣性（建議 0.9-0.95）

### 切換模型
在 `child-ai-chat.js` 第 6 行：

```javascript
// 選項 1: 快速版本（推薦）
const GEMINI_API_URL = '...gemini-1.5-flash:generateContent';

// 選項 2: 強大版本（較慢但更智能）
const GEMINI_API_URL = '...gemini-1.5-pro:generateContent';

// 選項 3: 舊版本
const GEMINI_API_URL = '...gemini-pro:generateContent';
```

---

## 🎯 效能基準

### 預期響應時間
- **語音識別**: < 500ms
- **API 呼叫**: 1-3 秒
- **語意提取**: < 1 秒
- **總延遲**: 2-4 秒

### API 配額（免費版）
- **每分鐘請求數**: 15 次
- **每日請求數**: 1500 次
- **每月字元數**: 有限制

如需更高配額，請考慮升級到付費方案。

---

## ✅ 測試清單

完整測試前，請確認：

- [ ] API Key 已正確設定
- [ ] 使用本地伺服器（避免 CORS）
- [ ] 瀏覽器支援語音識別
- [ ] 麥克風權限已授予
- [ ] Console 中執行 `testGeminiAPI()` 成功
- [ ] 能夠開啟 AI 聊天視窗
- [ ] 語音或文字輸入正常工作
- [ ] AI 能夠正常回應
- [ ] 語意摘要卡正常生成

---

## 📞 需要協助？

### 檢查這些資源
1. **技術文檔**: `AI_CHAT_SYSTEM_README.md`
2. **快速開始**: `AI_CHAT_QUICK_START.md`
3. **實作總結**: `CHILD_AI_CHAT_IMPLEMENTATION_SUMMARY.md`

### Debug 指令
```javascript
// 檢查 API 設定
console.log('API URL:', GEMINI_API_URL);
console.log('API Key:', GEMINI_API_KEY.substring(0, 10) + '...');

// 測試 API 連接
testGeminiAPI();

// 查看系統狀態
console.log(window.ChildAIChat);

// 檢查語意摘要卡
const cards = JSON.parse(localStorage.getItem('hopelink-memory-cards'));
console.log('摘要卡數量:', cards?.length || 0);
```

---

## 🎉 準備就緒！

如果所有測試都通過，您的系統已經準備好使用了！

**下一步**:
1. ✅ 進行完整的對話測試
2. ✅ 檢查語意摘要卡生成
3. ✅ 測試多語言功能
4. ✅ 驗證安全機制
5. ✅ 準備後端整合

祝您使用順利！✨

---

**文檔版本**: 1.0  
**更新日期**: 2025-10-20  
**API 模型**: gemini-1.5-flash

