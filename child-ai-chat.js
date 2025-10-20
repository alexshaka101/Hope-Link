// ==================== 孩童端 AI 聊天功能 ====================
// Gemini API 整合與各功能模組實現

// ==================== 設定 ====================
const GEMINI_API_KEY = 'AIzaSyDEXYSZI5GNe266b6P5F4DLY7G6JdbtI4c';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// 模型說明：
// gemini-1.5-flash - 快速響應，適合即時對話（推薦）
// gemini-1.5-pro - 更強大但較慢
// gemini-pro - 舊版模型

// ==================== 全域狀態管理 ====================
const ChildAIChat = {
    // 對話狀態
    isActive: false,
    isPaused: false,
    currentLanguage: 'zh',
    conversationHistory: [],
    
    // 記憶與語義資料
    memoryCards: [],
    extractedKeywords: [],
    emotionLevel: 'neutral', // neutral, happy, nervous, sad
    emotionHistory: [], // 情感時間軸
    
    // 對話階段（生活→家庭→情感）
    conversationStage: 1, // 1: 中性話題, 2: 家庭相關, 3: 情感深入
    messageCount: 0,
    
    // 安全監控
    hasTriggeredSafety: false,
    
    // 語音識別
    recognition: null,
    isRecording: false,
    
    // 安全監控
    safetyKeywords: ['害怕', '恐懼', '戰爭', '打', '痛', 'fear', 'war', 'hit', 'hurt', 'scared', 'страх', 'війна', 'خوف', 'حرب'],
    
    // UI 元素
    elements: {},
    
    // 輸入模式（固定為文字）
    inputMode: 'text'
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    initChildAIChat();
});

function initChildAIChat() {
    // 綁定 UI 元素
    ChildAIChat.elements = {
        childStartBtn: document.getElementById('childStartBtn'),
        chatModal: document.getElementById('childAIChatModal'),
        chatMessages: document.getElementById('chatMessages'),
        textInputContainer: document.getElementById('textInputContainer'),
        textInput: document.getElementById('textInput'),
        textSendBtn: document.getElementById('textSendBtn'),
        pauseChatBtn: document.getElementById('pauseChatBtn'),
        resumeChatBtn: document.getElementById('resumeChatBtn'),
        comfortOverlay: document.getElementById('comfortOverlay'),
        chatLangBtns: document.querySelectorAll('.chat-lang-btn')
    };
    
    // 綁定事件
    if (ChildAIChat.elements.childStartBtn) {
        ChildAIChat.elements.childStartBtn.addEventListener('click', startAIChat);
    }
    
    if (ChildAIChat.elements.pauseChatBtn) {
        ChildAIChat.elements.pauseChatBtn.addEventListener('click', pauseChat);
    }
    
    if (ChildAIChat.elements.resumeChatBtn) {
        ChildAIChat.elements.resumeChatBtn.addEventListener('click', resumeChat);
    }
    
    // 表情按鈕
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const emotion = e.currentTarget.dataset.emotion;
            handleEmotionSelection(emotion);
        });
    });
    
    // 語言切換
    ChildAIChat.elements.chatLangBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.dataset.chatLang;
            switchChatLanguage(lang);
        });
    });
    
    // 文字輸入發送
    if (ChildAIChat.elements.textSendBtn) {
        ChildAIChat.elements.textSendBtn.addEventListener('click', sendTextMessage);
    }
    
    // 文字輸入按 Enter 發送
    if (ChildAIChat.elements.textInput) {
        ChildAIChat.elements.textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendTextMessage();
            }
        });
    }
}

// ==================== 語音識別模組 (🎧 Voice2Text) ====================
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        ChildAIChat.recognition = new SpeechRecognition();
        ChildAIChat.recognition.continuous = false;
        ChildAIChat.recognition.interimResults = false;
        ChildAIChat.recognition.lang = getRecognitionLanguage(ChildAIChat.currentLanguage);
        
        ChildAIChat.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            
            console.log('語音識別結果:', transcript, '置信度:', confidence);
            
            // 顯示孩童的訊息
            addChatMessage(transcript, 'child');
            
            // 分析並回應
            analyzeAndRespond(transcript);
        };
        
        ChildAIChat.recognition.onerror = (event) => {
            console.error('語音識別錯誤:', event.error);
            ChildAIChat.isRecording = false;
            ChildAIChat.elements.voiceInputBtn.classList.remove('recording');
        };
        
        ChildAIChat.recognition.onend = () => {
            ChildAIChat.isRecording = false;
            ChildAIChat.elements.voiceInputBtn.classList.remove('recording');
        };
    } else {
        console.warn('瀏覽器不支援語音識別');
    }
}

function getRecognitionLanguage(lang) {
    const langMap = {
        'zh': 'zh-TW',
        'en': 'en-US',
        'uk': 'uk-UA',
        'ar': 'ar-SA'
    };
    return langMap[lang] || 'zh-TW';
}

function startVoiceInput(e) {
    e.preventDefault();
    
    if (ChildAIChat.isPaused) return;
    
    if (ChildAIChat.recognition && !ChildAIChat.isRecording) {
        ChildAIChat.isRecording = true;
        ChildAIChat.elements.voiceInputBtn.classList.add('recording');
        ChildAIChat.recognition.lang = getRecognitionLanguage(ChildAIChat.currentLanguage);
        ChildAIChat.recognition.start();
    }
}

function stopVoiceInput(e) {
    e.preventDefault();
    
    if (ChildAIChat.recognition && ChildAIChat.isRecording) {
        ChildAIChat.recognition.stop();
    }
}

// ==================== Gemini API 整合 ====================
async function callGeminiAPI(prompt, context = []) {
    try {
        // 建立對話歷史（最多保留最近5輪對話作為上下文）
        const recentHistory = ChildAIChat.conversationHistory.slice(-10); // 最近10條訊息（5輪對話）
        let conversationContext = "";
        
        if (recentHistory.length > 0) {
            conversationContext = "\n\n對話歷史：\n" + recentHistory.map(msg => 
                `${msg.role === 'child' ? '孩子' : '光光'}: ${msg.content}`
            ).join('\n');
        }
        
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: buildSystemPrompt() + conversationContext + "\n\n當前孩子的訊息: " + prompt + "\n\n請根據以上對話歷史，給予自然、連貫的回應。"
                        }
                    ]
                }
            ],
            generationConfig: {
                temperature: 0.9,        // 提高創造性，讓回應更自然溫暖
                maxOutputTokens: 200,    // 保持簡短回應
                topP: 0.95,              // 增加多樣性
                topK: 40,
                candidateCount: 1
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_HARASSMENT",
                    threshold: "BLOCK_ONLY_HIGH"  // 調整為只阻擋高風險內容
                },
                {
                    category: "HARM_CATEGORY_HATE_SPEECH",
                    threshold: "BLOCK_ONLY_HIGH"
                },
                {
                    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                    threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                    threshold: "BLOCK_ONLY_HIGH"  // 允許討論一些情感話題
                }
            ]
        };
        
        console.log('🤖 正在呼叫 Gemini API...');
        console.log('📝 提示詞長度:', requestBody.contents[0].parts[0].text.length);
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API 錯誤回應:', errorText);
            console.error('❌ HTTP 狀態:', response.status);
            throw new Error(`API 錯誤: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ API 回應成功');
        
        // 檢查回應結構
        if (data.candidates && data.candidates[0] && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text.trim();
            console.log('💬 AI 回應內容:', aiResponse);
            console.log('📊 回應長度:', aiResponse.length, '字元');
            console.log('🎯 當前對話階段:', ChildAIChat.conversationStage);
            console.log('📈 對話輪數:', ChildAIChat.messageCount);
            return aiResponse;
        }
        
        // 處理被安全過濾器阻擋的情況
        if (data.candidates && data.candidates[0] && data.candidates[0].finishReason === 'SAFETY') {
            console.warn('⚠️ 回應被安全過濾器阻擋');
            console.warn('⚠️ 原因:', data.candidates[0].safetyRatings);
            return '我想換個話題聊聊～你最近有什麼開心的事嗎？😊';
        }
        
        // 處理其他完成原因
        if (data.candidates && data.candidates[0]) {
            console.warn('⚠️ 完成原因:', data.candidates[0].finishReason);
        }
        
        console.error('❌ 無效的 API 回應結構:', data);
        throw new Error('無效的 API 回應結構');
    } catch (error) {
        console.error('❌ Gemini API 錯誤:', error);
        console.error('❌ 錯誤詳情:', error.message);
        console.warn('⚠️ 使用備用回應機制');
        
        // 返回友善的備用回應
        return getDefaultResponse();
    }
}

function buildSystemPrompt() {
    const stagePrompts = {
        1: "你是光光 ✨，一個溫暖、友善的AI夥伴。現在是對話初期，請用輕鬆、充滿關懷的語氣與孩子建立信任。可以詢問他們喜歡的事物（如最愛的食物、顏色、遊戲、卡通角色等）。記住：你不是在「訪談」，而是在「聊天」。每次只問一個簡單的開放式問題，讓孩子感到自在和被尊重。回應要簡短、自然，就像真正的朋友在對話。",
        2: "你是光光 ✨，孩子現在對你更有信任感了。可以溫柔地將話題引導到日常生活和家庭環境，但要非常自然。比如：「你家裡有養小動物嗎？」「你最喜歡家裡的哪個地方？」「你家附近有什麼好玩的地方嗎？」避免直接問「你的家人在哪裡」這類問題。保持對話輕鬆，像朋友間的分享。回應要簡短、親切。",
        3: "你是光光 ✨，孩子已經願意和你深入交談。現在可以更細緻地了解關於家的記憶和情感連結，但必須極度溫柔和謹慎。可以問：「你最想念家裡的什麼？」「有什麼特別的回憶讓你印象深刻嗎？」如果孩子表現出任何不安、沉默或情緒波動，立即轉換話題到輕鬆的內容，給予安撫和鼓勵。回應要溫柔、支持。"
    };
    
    const languageInstructions = {
        'zh': '請用繁體中文回答，語氣溫柔親切，像大姊姊/大哥哥一樣陪伴孩子。',
        'en': 'Please respond in English with a gentle, warm, and caring tone, like a kind older sibling.',
        'uk': 'Будь ласка, відповідайте українською мовою з ніжним, теплим і турботливим тоном, як добрий старший брат або сестра.',
        'ar': 'يرجى الرد باللغة العربية بنبرة لطيفة ودافئة ورعاية، مثل أخ أو أخت أكبر سنًا.'
    };
    
    return `${stagePrompts[ChildAIChat.conversationStage]}
    
${languageInstructions[ChildAIChat.currentLanguage]}

核心原則（極為重要）：
1. 每次回答保持簡短（1-2句話，最多30字），避免長篇大論
2. 使用適合兒童的簡單語言，避免複雜詞彙
3. 保持積極、鼓勵、支持的語氣，多使用讚美和肯定
4. 一次只問一個開放式問題，讓孩子自由表達
5. 絕對不要提及：戰爭、傷害、恐懼、創傷等負面敏感詞彙
6. 如果孩子沉默或情緒低落，給予理解和支持：「沒關係，我們可以聊別的～」
7. 使用溫暖的 emoji 和語氣詞（如：好棒喔！真有趣～我懂你的感覺💚）
8. 回應必須自然、口語化，像真人在聊天，不要太正式或制式化
9. 根據孩子的回應調整話題，展現真正的傾聽和理解`;
}

function getDefaultResponse() {
    const defaultResponses = {
        'zh': ['我聽到了～繼續說吧！', '哇，好有趣！', '我想多了解一些～', '真棒！'],
        'en': ['I hear you~', 'Wow, interesting!', 'Tell me more~', 'That\'s great!'],
        'uk': ['Я чую тебе~', 'Вау, цікаво!', 'Розкажи більше~', 'Це чудово!'],
        'ar': ['أسمعك~', 'واو، مثير للاهتمام!', 'أخبرني المزيد~', 'هذا رائع!']
    };
    
    const responses = defaultResponses[ChildAIChat.currentLanguage] || defaultResponses['zh'];
    return responses[Math.floor(Math.random() * responses.length)];
}

// ==================== 語義提取模組 (🧩 Semantic Extractor) ====================
async function extractSemanticInfo(text) {
    // 使用 Gemini API 進行語義提取
    const extractionPrompt = `分析以下孩童的話語，提取關鍵信息（JSON格式）：
文本: "${text}"

請提取：
1. 主題 (theme): 食物/家庭/地點/人物/情感/其他
2. 關鍵名詞 (nouns): 重要的名詞列表
3. 情感 (emotion): 正面/中性/負面
4. 家庭相關 (isFamily): true/false
5. 置信度 (confidence): 0-1

只回傳 JSON，不要其他文字。`;
    
    try {
        const response = await callGeminiAPI(extractionPrompt);
        
        // 嘗試解析 JSON
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const semanticData = JSON.parse(jsonMatch[0]);
            
            // 儲存關鍵詞
            if (semanticData.nouns && Array.isArray(semanticData.nouns)) {
                semanticData.nouns.forEach(noun => {
                    if (!ChildAIChat.extractedKeywords.find(k => k.text === noun)) {
                        ChildAIChat.extractedKeywords.push({
                            text: noun,
                            theme: semanticData.theme,
                            timestamp: Date.now()
                        });
                    }
                });
            }
            
            
            return semanticData;
        }
    } catch (error) {
        console.error('語義提取錯誤:', error);
    }
    
    // 備用：簡單的關鍵詞提取
    return extractKeywordsSimple(text);
}

function extractKeywordsSimple(text) {
    // 簡單的關鍵詞提取（備用方案）
    const familyWords = ['媽媽', '爸爸', '家', '哥哥', '姊姊', '弟弟', '妹妹', 'mom', 'dad', 'home', 'family', 'мама', 'тато', 'дім', 'أم', 'أب', 'منزل'];
    const emotionWords = ['喜歡', '愛', '想念', '開心', '難過', 'love', 'miss', 'happy', 'sad', 'люблю', 'сумую', 'أحب', 'أفتقد'];
    
    const isFamily = familyWords.some(word => text.includes(word));
    const hasEmotion = emotionWords.some(word => text.includes(word));
    
    return {
        theme: isFamily ? '家庭' : hasEmotion ? '情感' : '其他',
        nouns: [],
        emotion: hasEmotion ? '正面' : '中性',
        isFamily: isFamily,
        confidence: 0.6
    };
}

// ==================== 安全監控模組 (🕊️ Safety Monitor) ====================
function checkSafety(text) {
    const lowerText = text.toLowerCase();
    
    // 檢查是否包含敏感關鍵詞
    const hasSafetyIssue = ChildAIChat.safetyKeywords.some(keyword => 
        lowerText.includes(keyword.toLowerCase())
    );
    
    if (hasSafetyIssue) {
        triggerSafetyPause();
        return false;
    }
    
    return true;
}

function triggerSafetyPause() {
    console.log('⚠️ 偵測到敏感內容，自動觸發安撫模式');
    
    // 標記已觸發安全暫停
    ChildAIChat.hasTriggeredSafety = true;
    
    // 記錄到情感時間軸
    ChildAIChat.emotionHistory.push({
        emotion: 'safety_triggered',
        timestamp: Date.now(),
        messageIndex: ChildAIChat.messageCount,
        reason: '偵測到敏感內容'
    });
    
    // 暫停對話，進入安撫模式
    pauseChat();
    
    // 立即儲存當前狀態的記憶卡
    saveToMemoryPool();
}

// ==================== Hash 編碼模組 (🔒 Hash Encoder) ====================
async function generateSemanticHash(data) {
    const dataString = JSON.stringify({
        keywords: ChildAIChat.extractedKeywords,
        themes: data.themes || [],
        emotions: data.emotions || [],
        timestamp: Date.now()
    });
    
    // 使用 Web Crypto API 生成 SHA-256 hash
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(dataString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// ==================== 記憶池模組 (🧾 Memory Pool) ====================
function saveToMemoryPool() {
    // 分類關鍵詞
    const categorizedKeywords = categorizeKeywords(ChildAIChat.extractedKeywords);
    
    // 提取對話片段（用於語意比對）
    const conversationSnippets = ChildAIChat.conversationHistory
        .filter(msg => msg.role === 'child')
        .map(msg => msg.content)
        .slice(-10); // 只保留最近10條對話
    
    // 生成語意摘要卡
    const memoryCard = {
        // 基本資訊
        sessionId: generateSessionId(),
        timestamp: new Date().toISOString(),
        language: ChildAIChat.currentLanguage,
        conversationStage: ChildAIChat.conversationStage,
        messageCount: ChildAIChat.messageCount,
        
        // 語意特徵（用於後端比對）
        semanticFeatures: {
            // 分類關鍵詞
            familyMembers: categorizedKeywords.familyMembers || [],        // 家庭成員
            locations: categorizedKeywords.locations || [],                // 地點
            objects: categorizedKeywords.objects || [],                    // 物品
            activities: categorizedKeywords.activities || [],              // 活動
            emotions: categorizedKeywords.emotions || [],                  // 情感
            descriptions: categorizedKeywords.descriptions || [],          // 描述性詞彙
            
            // 所有關鍵詞
            allKeywords: ChildAIChat.extractedKeywords,
            
            // 主題分佈
            themes: extractThemes(ChildAIChat.extractedKeywords),
            
            // 對話片段（去識別化）
            conversationSnippets: conversationSnippets
        },
        
        // 情感狀態追蹤
        emotionTimeline: ChildAIChat.emotionHistory || [],
        
        // 安全標記
        safetyFlags: {
            hasTriggeredSafetyPause: ChildAIChat.hasTriggeredSafety || false,
            conversationCompleted: ChildAIChat.conversationStage >= 3
        },
        
        // 元數據（用於系統追蹤）
        metadata: {
            version: '1.0',
            platform: 'web',
            userAgent: navigator.userAgent,
            screenSize: `${window.innerWidth}x${window.innerHeight}`
        }
    };
    
    // 生成語義哈希（用於快速比對）
    generateSemanticHash(memoryCard).then(hash => {
        memoryCard.semanticHash = hash;
        memoryCard.shortHash = hash.substring(0, 16); // 短哈希用於顯示
        
        ChildAIChat.memoryCards.push(memoryCard);
        
        // 儲存到 localStorage（實際應用中應該傳送到後端 API）
        localStorage.setItem('hopelink-memory-cards', JSON.stringify(ChildAIChat.memoryCards));
        
        console.log('✅ 語意摘要卡已生成:', memoryCard);
        console.log('📊 語意特徵統計:', {
            家庭成員: memoryCard.semanticFeatures.familyMembers.length,
            地點: memoryCard.semanticFeatures.locations.length,
            物品: memoryCard.semanticFeatures.objects.length,
            活動: memoryCard.semanticFeatures.activities.length,
            總關鍵詞: memoryCard.semanticFeatures.allKeywords.length
        });
        
        // 在實際應用中，這裡應該呼叫後端 API
        // sendToBackend(memoryCard);
    });
}

// 分類關鍵詞的輔助函數
function categorizeKeywords(keywords) {
    const categories = {
        familyMembers: [],
        locations: [],
        objects: [],
        activities: [],
        emotions: [],
        descriptions: []
    };
    
    // 定義各類別的關鍵詞列表
    const familyWords = ['媽媽', '爸爸', '哥哥', '姊姊', '弟弟', '妹妹', '奶奶', '爺爺', '阿姨', '叔叔', 
                         'mom', 'dad', 'mother', 'father', 'brother', 'sister', 'grandma', 'grandpa',
                         'мама', 'тато', 'брат', 'сестра', 'أم', 'أب', 'أخ', 'أخت'];
    
    const locationWords = ['家', '學校', '公園', '房間', '廚房', '街道', '城市', '村莊',
                          'home', 'school', 'park', 'room', 'kitchen', 'street', 'city', 'village',
                          'дім', 'школа', 'парк', 'منزل', 'مدرسة', 'حديقة'];
    
    const emotionWords = ['喜歡', '愛', '想念', '開心', '快樂', '難過', '害怕',
                         'love', 'miss', 'happy', 'sad', 'scared', 'afraid',
                         'люблю', 'сумую', 'щасливий', 'أحب', 'أفتقد', 'سعيد'];
    
    keywords.forEach(keyword => {
        const keywordText = keyword.text.toLowerCase();
        
        if (familyWords.some(word => keywordText.includes(word.toLowerCase()))) {
            categories.familyMembers.push(keyword);
        } else if (locationWords.some(word => keywordText.includes(word.toLowerCase()))) {
            categories.locations.push(keyword);
        } else if (emotionWords.some(word => keywordText.includes(word.toLowerCase()))) {
            categories.emotions.push(keyword);
        } else if (keyword.theme === '活動' || keyword.theme === 'activities') {
            categories.activities.push(keyword);
        } else if (keyword.theme === '物品' || keyword.theme === 'objects') {
            categories.objects.push(keyword);
        } else {
            categories.descriptions.push(keyword);
        }
    });
    
    return categories;
}

// 提取主題的輔助函數
function extractThemes(keywords) {
    const themeCount = {};
    
    keywords.forEach(keyword => {
        const theme = keyword.theme || '其他';
        themeCount[theme] = (themeCount[theme] || 0) + 1;
    });
    
    // 轉換為陣列並排序
    return Object.entries(themeCount)
        .map(([theme, count]) => ({ theme, count }))
        .sort((a, b) => b.count - a.count);
}

function generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ==================== 對話分析與回應 ====================
async function analyzeAndRespond(userMessage) {
    // 增加訊息計數
    ChildAIChat.messageCount++;
    
    // 安全檢查
    if (!checkSafety(userMessage)) {
        return;
    }
    
    // 語義提取
    const semanticInfo = await extractSemanticInfo(userMessage);
    console.log('語義分析結果:', semanticInfo);
    
    // 根據對話數量進階對話階段
    if (ChildAIChat.messageCount >= 5 && ChildAIChat.conversationStage === 1) {
        ChildAIChat.conversationStage = 2;
    } else if (ChildAIChat.messageCount >= 10 && ChildAIChat.conversationStage === 2) {
        ChildAIChat.conversationStage = 3;
    }
    
    // 呼叫 AI 生成回應
    const aiResponse = await callGeminiAPI(userMessage, ChildAIChat.conversationHistory);
    
    // 顯示 AI 回應
    setTimeout(() => {
        addChatMessage(aiResponse, 'ai');
    }, 800);
    
    // 儲存對話歷史
    ChildAIChat.conversationHistory.push({
        role: 'child',
        content: userMessage
    }, {
        role: 'ai',
        content: aiResponse
    });
    
    // 定期儲存記憶卡
    if (ChildAIChat.messageCount % 5 === 0) {
        saveToMemoryPool();
    }
}

// ==================== UI 互動函數 ====================
function startAIChat() {
    closeModal('childModal');
    setTimeout(() => {
        openModal('childAIChatModal');
        ChildAIChat.isActive = true;
        
        // 自動聚焦到文字輸入框
        setTimeout(() => {
            if (ChildAIChat.elements.textInput) {
                ChildAIChat.elements.textInput.focus();
            }
        }, 500);
    }, 300);
}

function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-bubble ${sender}-bubble`;
    
    // 將訊息拆分成段落
    const paragraphs = message.split('\n').filter(p => p.trim());
    paragraphs.forEach(para => {
        const p = document.createElement('p');
        p.textContent = para;
        messageDiv.appendChild(p);
    });
    
    ChildAIChat.elements.chatMessages.appendChild(messageDiv);
    
    // 滾動到底部（使用 smooth scroll 並確保完全可見）
    setTimeout(() => {
        ChildAIChat.elements.chatMessages.scrollTo({
            top: ChildAIChat.elements.chatMessages.scrollHeight,
            behavior: 'smooth'
        });
    }, 100);
}

function pauseChat() {
    ChildAIChat.isPaused = true;
    ChildAIChat.elements.comfortOverlay.classList.add('active');
    
    // 禁用輸入
    if (ChildAIChat.elements.textInput) {
        ChildAIChat.elements.textInput.disabled = true;
    }
    if (ChildAIChat.elements.textSendBtn) {
        ChildAIChat.elements.textSendBtn.disabled = true;
    }
}

function resumeChat() {
    ChildAIChat.isPaused = false;
    ChildAIChat.elements.comfortOverlay.classList.remove('active');
    
    // 恢復輸入
    if (ChildAIChat.elements.textInput) {
        ChildAIChat.elements.textInput.disabled = false;
    }
    if (ChildAIChat.elements.textSendBtn) {
        ChildAIChat.elements.textSendBtn.disabled = false;
    }
    
    // 如果是文字模式，重新聚焦
    if (ChildAIChat.inputMode === 'text') {
        setTimeout(() => {
            ChildAIChat.elements.textInput.focus();
        }, 100);
    }
}


function handleEmotionSelection(emotion) {
    // 移除之前的選擇
    document.querySelectorAll('.emotion-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 標記當前選擇
    event.target.classList.add('selected');
    
    // 更新情緒狀態
    ChildAIChat.emotionLevel = emotion;
    
    // 記錄情感到時間軸
    ChildAIChat.emotionHistory.push({
        emotion: emotion,
        timestamp: Date.now(),
        messageIndex: ChildAIChat.messageCount
    });
    
    console.log('😊 孩童選擇情緒:', emotion);
    
    // 根據情緒調整回應
    if (emotion === 'nervous' || emotion === 'sad') {
        // 記錄負面情緒，但不立即暫停，給予支持
        console.log('💙 偵測到孩童情緒低落，給予關懷');
    } else if (emotion === 'rest') {
        // 孩童想休息，立即暫停
        pauseChat();
        console.log('😴 孩童想休息，觸發安撫模式');
    } else if (emotion === 'happy') {
        console.log('😊 孩童情緒良好，繼續對話');
    }
}




function switchChatLanguage(lang) {
    ChildAIChat.currentLanguage = lang;
    
    // 更新按鈕狀態
    ChildAIChat.elements.chatLangBtns.forEach(btn => {
        if (btn.dataset.chatLang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 更新語音識別語言
    if (ChildAIChat.recognition) {
        ChildAIChat.recognition.lang = getRecognitionLanguage(lang);
    }
    
    console.log('切換聊天語言至:', lang);
}

// ==================== 文字訊息發送 ====================
function sendTextMessage() {
    if (ChildAIChat.isPaused) return;
    
    const message = ChildAIChat.elements.textInput.value.trim();
    
    if (!message) return;
    
    // 顯示孩童的訊息
    addChatMessage(message, 'child');
    
    // 清空輸入框
    ChildAIChat.elements.textInput.value = '';
    
    // 分析並回應
    analyzeAndRespond(message);
}

// ==================== 輔助函數 ====================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== API 測試功能 ====================
// 在 Console 中執行 testGeminiAPI() 來測試 API 連接
window.testGeminiAPI = async function() {
    console.log('🧪 開始測試 Gemini API...');
    console.log('📡 API URL:', GEMINI_API_URL);
    console.log('🔑 API Key:', GEMINI_API_KEY.substring(0, 10) + '...');
    
    try {
        const testPrompt = "你好！請用一句溫暖的話回應我。";
        console.log('📤 測試提示詞:', testPrompt);
        
        const response = await callGeminiAPI(testPrompt);
        
        console.log('✅ API 測試成功！');
        console.log('💬 AI 回應:', response);
        console.log('');
        console.log('✨ 系統運作正常，可以開始使用！');
        return true;
    } catch (error) {
        console.error('❌ API 測試失敗:', error);
        console.log('');
        console.log('💡 請檢查：');
        console.log('1. API Key 是否正確');
        console.log('2. 網路連線是否正常');
        console.log('3. 是否有 CORS 錯誤');
        return false;
    }
};

// 診斷工具：檢查 API 設定
window.diagnoseAPI = function() {
    console.log('🔍 開始診斷 API 設定...');
    console.log('');
    
    console.log('📋 基本設定：');
    console.log('- API Key:', GEMINI_API_KEY ? '✅ 已設定' : '❌ 未設定');
    console.log('- API URL:', GEMINI_API_URL);
    console.log('');
    
    console.log('📊 系統狀態：');
    console.log('- 對話啟用:', ChildAIChat.isActive ? '✅ 是' : '❌ 否');
    console.log('- 對話階段:', ChildAIChat.conversationStage);
    console.log('- 對話輪數:', ChildAIChat.messageCount);
    console.log('- 對話歷史:', ChildAIChat.conversationHistory.length, '條訊息');
    console.log('');
    
    console.log('🧪 執行 API 測試...');
    testGeminiAPI();
};

// ==================== 導出供全域使用 ====================
window.ChildAIChat = ChildAIChat;

console.log('🔗 HopeLink 孩童端 AI 聊天系統已載入');
console.log('');
console.log('💡 使用說明：');
console.log('1. 點擊「孩童端」→「開始使用」啟動 AI 聊天');
console.log('2. 在 Console 中執行 testGeminiAPI() 測試 API 連接');
console.log('3. 執行 window.ChildAIChat 查看系統狀態');
console.log('');

