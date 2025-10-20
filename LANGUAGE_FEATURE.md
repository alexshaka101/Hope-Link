# HopeLink 多語言功能說明

## 功能概述

HopeLink 平台現已支援四種語言的完整切換功能：
- 🇹🇼 **中文（繁體）** - Traditional Chinese
- 🇬🇧 **英文** - English
- 🇺🇦 **烏克蘭文** - Ukrainian (Українська)
- 🇸🇦 **阿拉伯文** - Arabic (العربية)

## 功能特點

### 1. 完整的介面翻譯
- ✅ 導覽列選單
- ✅ 主頁面內容（Hero區、功能介紹等）
- ✅ 模態視窗內容（孩童端、家長端、通報者端）
- ✅ 通報表單（包括所有標籤、提示文字、按鈕）
- ✅ 頁尾內容

### 2. RTL 支持（阿拉伯文）
- 自動偵測阿拉伯文並切換為從右到左（RTL）排版
- 所有元素佈局自動調整以適應RTL方向
- 導覽列、表單、模態視窗等都完美支援RTL

### 3. 語言持久化
- 使用者選擇的語言會儲存在 `localStorage` 中
- 下次訪問時自動載入上次選擇的語言

### 4. 動態字體支援
- **中文**：使用 Noto Sans TC
- **英文**：使用 Poppins
- **烏克蘭文**：使用 Noto Sans
- **阿拉伯文**：使用 Noto Naskh Arabic

## 使用方法

### 用戶端使用

1. **切換語言**
   - 點擊頂部導覽列右側的語言選擇按鈕
   - 選項包括：`中文` | `EN` | `УКР` | `عربي`
   - 點擊後頁面會立即切換到所選語言

2. **語言效果**
   - 所有可見文字都會翻譯
   - 表單的佔位符（placeholder）會翻譯
   - 按鈕文字會翻譯
   - 動態生成的內容也會翻譯

### 開發者使用

#### 文件結構

```
HopeLink/
├── index.html          # 主頁面，包含 data-i18n 屬性
├── translations.js     # 翻譯資料文件
├── script.js          # 包含語言切換邏輯
└── styles.css         # 包含 RTL 樣式支援
```

#### 添加新的可翻譯內容

1. **在 HTML 中標記要翻譯的元素**

   對於普通文字內容：
   ```html
   <h1 data-i18n="hero.title">讓故事成為重聚的橋樑</h1>
   ```

   對於 input/textarea 的 placeholder：
   ```html
   <input type="text" data-i18n-placeholder="form.name.placeholder">
   ```

2. **在 translations.js 中添加翻譯**

   ```javascript
   const translations = {
       zh: {
           'hero.title': '讓故事成為重聚的橋樑'
       },
       en: {
           'hero.title': 'Stories Become the Bridge to Reunion'
       },
       uk: {
           'hero.title': 'Історії стають мостом до возз\'єднання'
       },
       ar: {
           'hero.title': 'القصص تصبح جسرًا للم الشمل'
       }
   };
   ```

3. **翻譯會自動應用**
   - 頁面載入時會自動應用已儲存的語言
   - 切換語言時會自動更新所有標記的元素

#### 核心函數說明

```javascript
// 獲取當前語言
getCurrentLanguage()  // 返回: 'zh', 'en', 'uk', 或 'ar'

// 設置語言
setLanguage(lang)     // 參數: 'zh', 'en', 'uk', 或 'ar'

// 翻譯鍵
t('hero.title')       // 根據當前語言返回對應翻譯
```

## 技術實現

### 1. 翻譯系統
- 使用鍵值對映射系統
- 支援點記法訪問（如 `modal.child.title`）
- 自動回退到中文如果翻譯缺失

### 2. RTL 支援
```css
/* 阿拉伯文時自動套用 */
body.rtl {
    direction: rtl;
    text-align: right;
}

/* 元素佈局自動反轉 */
body.rtl .nav-content {
    flex-direction: row-reverse;
}
```

### 3. 語言偵測與儲存
```javascript
// 儲存語言偏好
localStorage.setItem('hopelink-language', lang);

// 載入語言偏好
const savedLang = localStorage.getItem('hopelink-language') || 'zh';
```

## 翻譯覆蓋範圍

### 已翻譯區域 ✅
- [x] 導覽列
- [x] Hero 主視覺區
- [x] 功能亮點區
- [x] 國際合作區
- [x] 支援與協助區
- [x] 頁尾
- [x] 孩童端模態視窗
- [x] 家長端模態視窗
- [x] 通報者端模態視窗
- [x] 通報表單（完整）
- [x] 案件追蹤系統

### 動態內容
- [x] GPS 定位按鈕狀態
- [x] 表單驗證訊息
- [x] 下拉選單選項

## 測試建議

### 基本測試
1. 在瀏覽器中打開 `index.html`
2. 點擊每個語言按鈕
3. 確認所有文字都正確翻譯
4. 測試阿拉伯文的 RTL 排版

### 進階測試
1. 切換語言後重新載入頁面
2. 確認語言偏好被保存
3. 開啟所有模態視窗並驗證翻譯
4. 填寫表單並驗證 placeholder 翻譯
5. 測試 GPS 按鈕的動態翻譯

### RTL 測試（阿拉伯文）
1. 切換到阿拉伯文
2. 驗證導覽列從右到左排列
3. 驗證模態視窗的關閉按鈕在左側
4. 驗證表單元素對齊正確
5. 驗證所有 Flexbox 元素方向正確

## 瀏覽器支援

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 已知限制

1. **動態生成的 alert 訊息**
   - 部分 JavaScript alert 尚未翻譯
   - 建議替換為自定義通知系統

2. **日期時間格式**
   - datetime-local input 使用瀏覽器預設格式
   - 未來可考慮添加自定義日期選擇器

## 維護與更新

### 添加新語言
1. 在 `translations.js` 中添加新的語言對象
2. 在 HTML 中添加語言按鈕
3. 必要時在 CSS 中添加字體支援

### 更新翻譯
1. 直接修改 `translations.js` 中對應的鍵值
2. 無需重新啟動或編譯
3. 重新載入頁面即可看到變更

## 貢獻指南

如需改進翻譯品質：
1. Fork 專案
2. 修改 `translations.js`
3. 提交 Pull Request
4. 註明改進的語言和原因

## 授權

本專案的多語言功能遵循主專案授權協議。

---

**最後更新**: 2025年10月20日
**版本**: 1.0.0
**維護者**: HopeLink Team

