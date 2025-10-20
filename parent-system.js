// ==================== 家長端系統（Family Portal | Memory Match 模組）====================

// 模擬的兒童資料庫（實際應從後端 API 獲取）
const childDatabase = [
    {
        id: 'CHILD-2024-001',
        name: '小明',
        age: '8-9',
        gender: 'male',
        location: '烏克蘭基輔',
        time: '2022年3月',
        features: '短髮、左手臂有小胎記',
        uploadTime: '2024-01-15',
        story: {
            family: '常說媽媽會帶他去公園玩',
            habits: '睡前一定要聽故事',
            favorites: '最喜歡紅色的小汽車',
            memories: '記得家裡有一隻叫「小白」的貓'
        },
        questions: [
            {
                id: 'q1',
                category: '家庭互動',
                question: '孩子提到有人常帶他去公園玩，請問那是誰？你們會在公園做什麼？',
                childAnswer: '媽媽會帶我去公園，我們會在鞦韆那裡玩，媽媽會幫我推鞦韆',
                keywords: ['公園', '鞦韆', '母親', '互動', '玩耍']
            },
            {
                id: 'q2',
                category: '睡前習慣',
                question: '孩子說睡前一定要做某件事，請問是什麼？通常是誰陪伴？',
                childAnswer: '睡覺前要聽故事，媽媽會念故事書給我聽，還會唱搖籃曲',
                keywords: ['故事', '睡前', '陪伴', '母親', '儀式']
            },
            {
                id: 'q3',
                category: '喜好物品',
                question: '孩子最喜歡的玩具是什麼顏色？是什麼樣的玩具？',
                childAnswer: '紅色的小汽車，是爸爸買給我的生日禮物',
                keywords: ['紅色', '汽車', '玩具', '禮物', '父親']
            },
            {
                id: 'q4',
                category: '家庭寵物',
                question: '孩子說家裡有一個特別的家庭成員，你記得是誰嗎？',
                childAnswer: '家裡有養一隻貓咪，叫做小白，白色的，很可愛',
                keywords: ['寵物', '貓', '小白', '白色', '家庭成員']
            },
            {
                id: 'q5',
                category: '情感記憶',
                question: '請描述一個你和孩子在一起最溫馨的時刻',
                childAnswer: '我記得生日那天，全家人一起唱歌，媽媽做了我最愛吃的蛋糕',
                keywords: ['生日', '家人', '蛋糕', '溫暖', '慶祝']
            }
        ]
    },
    {
        id: 'CHILD-2024-002',
        name: '索菲亞',
        age: '10-11',
        gender: 'female',
        location: '烏克蘭哈爾科夫',
        time: '2022年5月',
        features: '長捲髮、右腳有受傷痕跡',
        uploadTime: '2024-02-10',
        story: {
            family: '說爸爸是消防員',
            habits: '喜歡畫畫，特別是畫花',
            favorites: '最愛藍色洋娃娃',
            memories: '記得家裡的花園有很多向日葵'
        },
        questions: [
            {
                id: 'q1',
                category: '家庭職業',
                question: '孩子提到家人的職業，請問你記得是什麼工作嗎？',
                childAnswer: '爸爸是消防員，穿著很帥的制服，會去救火',
                keywords: ['消防員', '父親', '職業', '制服', '救援']
            },
            {
                id: 'q2',
                category: '興趣愛好',
                question: '孩子最喜歡做什麼活動？通常畫什麼內容？',
                childAnswer: '很喜歡畫畫，最喜歡畫各種花朵，尤其是向日葵',
                keywords: ['畫畫', '藝術', '花', '向日葵', '創作']
            },
            {
                id: 'q3',
                category: '珍貴物品',
                question: '孩子最珍惜的東西是什麼？什麼顏色的？',
                childAnswer: '藍色的洋娃娃，是奶奶送的，我一直帶著它',
                keywords: ['洋娃娃', '藍色', '奶奶', '禮物', '珍惜']
            },
            {
                id: 'q4',
                category: '家園記憶',
                question: '請描述你們家的特別之處，有什麼讓孩子印象深刻的？',
                childAnswer: '家裡有個花園，種了好多向日葵，夏天會開得很漂亮',
                keywords: ['花園', '向日葵', '家', '美好', '自然']
            },
            {
                id: 'q5',
                category: '情感連結',
                question: '孩子害怕什麼？你通常如何安慰她？',
                childAnswer: '怕打雷，每次打雷時媽媽都會抱著我，說有媽媽在不用怕',
                keywords: ['害怕', '打雷', '母親', '安慰', '保護']
            }
        ]
    },
    {
        id: 'CHILD-2024-003',
        name: '亞歷山大',
        age: '7-8',
        gender: 'male',
        location: '敘利亞大馬士革',
        time: '2023年8月',
        features: '圓臉、戴眼鏡',
        uploadTime: '2024-03-01',
        story: {
            family: '有個姐姐會唸書給他聽',
            habits: '喜歡踢足球',
            favorites: '最愛吃媽媽做的餅',
            memories: '記得爺爺家有個大院子'
        },
        questions: [
            {
                id: 'q1',
                category: '手足關係',
                question: '孩子提到有兄弟姊妹，請問你記得他們的關係嗎？',
                childAnswer: '有個姐姐，姐姐很愛我，會唸故事書給我聽',
                keywords: ['姐姐', '手足', '關愛', '故事', '陪伴']
            },
            {
                id: 'q2',
                category: '運動愛好',
                question: '孩子喜歡的運動或遊戲是什麼？',
                childAnswer: '最喜歡踢足球，常常和鄰居小朋友一起在街上踢',
                keywords: ['足球', '運動', '遊戲', '朋友', '戶外']
            },
            {
                id: 'q3',
                category: '飲食記憶',
                question: '孩子最喜歡吃什麼食物？誰做的？',
                childAnswer: '最喜歡媽媽做的餅，又香又軟，每次都吃好多',
                keywords: ['食物', '餅', '母親', '烹飪', '家的味道']
            },
            {
                id: 'q4',
                category: '親屬記憶',
                question: '孩子提到長輩的家，請描述你記得的細節',
                childAnswer: '爺爺家有個大院子，我們常常去那裡玩，院子裡有棵大樹',
                keywords: ['爺爺', '院子', '大樹', '親屬', '空間']
            },
            {
                id: 'q5',
                category: '日常習慣',
                question: '孩子戴眼鏡嗎？什麼時候開始戴的？',
                childAnswer: '6歲開始戴眼鏡，因為看黑板看不清楚',
                keywords: ['眼鏡', '視力', '學校', '成長', '照顧']
            }
        ]
    }
];

// 當前搜尋狀態
let currentSearchResults = [];
let currentSelectedChild = null;
let currentAttempt = 1;
let maxAttempts = 3;
let lastAttemptTime = null;
let cooldownHours = 24;

// 家長端「開始使用」按鈕
const parentStartBtn = document.getElementById('parentStartBtn');
if (parentStartBtn) {
    parentStartBtn.addEventListener('click', () => {
        closeModal('parentModal');
        setTimeout(() => {
            openModal('parentSearchModal');
        }, 300);
    });
}

// 搜尋表單提交
const parentSearchForm = document.getElementById('parentSearchForm');
if (parentSearchForm) {
    parentSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleParentSearch();
    });
}

// 返回搜尋按鈕
const backToSearchBtn = document.getElementById('backToSearchBtn');
if (backToSearchBtn) {
    backToSearchBtn.addEventListener('click', () => {
        closeModal('parentResultsModal');
        setTimeout(() => openModal('parentSearchModal'), 300);
    });
}

// 返回結果按鈕
const backToResultsBtn = document.getElementById('backToResultsBtn');
if (backToResultsBtn) {
    backToResultsBtn.addEventListener('click', () => {
        closeModal('parentVerificationModal');
        setTimeout(() => openModal('parentResultsModal'), 300);
    });
}

// 驗證表單提交
const verificationForm = document.getElementById('verificationForm');
if (verificationForm) {
    verificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleVerificationSubmit();
    });
}

// 處理家長搜尋
function handleParentSearch() {
    const searchData = {
        name: document.getElementById('searchName')?.value || '',
        age: document.getElementById('searchAge')?.value || '',
        gender: document.getElementById('searchGender')?.value || '',
        location: document.getElementById('searchLocation')?.value || '',
        time: document.getElementById('searchTime')?.value || '',
        features: document.getElementById('searchFeatures')?.value || '',
        memories: document.getElementById('searchMemories')?.value || ''
    };

    // 顯示載入動畫
    showLoadingOverlay('AI 正在搜尋並比對資料庫...');

    // 模擬 API 搜尋延遲
    setTimeout(() => {
        // 執行 AI 語意比對（簡化版）
        currentSearchResults = performAIMatching(searchData);
        
        hideLoadingOverlay();
        
        // 顯示結果
        displaySearchResults();
        
        closeModal('parentSearchModal');
        setTimeout(() => openModal('parentResultsModal'), 300);
    }, 2000);
}

// AI 語意比對（簡化版模擬）
function performAIMatching(searchData) {
    const results = childDatabase.map(child => {
        let matchScore = 0;
        let matchReasons = [];

        // 姓名比對
        if (searchData.name && child.name.includes(searchData.name)) {
            matchScore += 25;
            matchReasons.push('姓名高度吻合');
        } else if (searchData.name) {
            matchScore += 5;
        }

        // 年齡比對
        if (searchData.age && child.age.includes(searchData.age.split('-')[0])) {
            matchScore += 20;
            matchReasons.push('年齡範圍相符');
        }

        // 性別比對
        if (searchData.gender && child.gender === searchData.gender) {
            matchScore += 15;
            matchReasons.push('性別相符');
        }

        // 地點比對
        if (searchData.location && child.location.includes(searchData.location)) {
            matchScore += 20;
            matchReasons.push('地點高度吻合');
        } else if (searchData.location) {
            // 部分比對
            const searchLoc = searchData.location.toLowerCase();
            const childLoc = child.location.toLowerCase();
            if (searchLoc.split(' ').some(word => childLoc.includes(word))) {
                matchScore += 10;
                matchReasons.push('地點部分相符');
            }
        }

        // 特徵比對（語意分析簡化）
        if (searchData.features && child.features) {
            const featureWords = searchData.features.toLowerCase().split(/[,，、\s]+/);
            const childFeatures = child.features.toLowerCase();
            const matchingFeatures = featureWords.filter(word => 
                word.length > 1 && childFeatures.includes(word)
            );
            if (matchingFeatures.length > 0) {
                matchScore += matchingFeatures.length * 5;
                matchReasons.push(`外貌特徵有 ${matchingFeatures.length} 項吻合`);
            }
        }

        // 記憶比對（語意分析簡化）
        if (searchData.memories) {
            const memoryWords = searchData.memories.toLowerCase().split(/[,，、\s]+/);
            const storyText = JSON.stringify(child.story).toLowerCase();
            const matchingMemories = memoryWords.filter(word => 
                word.length > 1 && storyText.includes(word)
            );
            if (matchingMemories.length > 0) {
                matchScore += matchingMemories.length * 3;
                matchReasons.push(`記憶片段有 ${matchingMemories.length} 項吻合`);
            }
        }

        // 確保分數在 0-100 之間
        matchScore = Math.min(100, matchScore);

        return {
            child,
            matchScore,
            matchReasons,
            matchLevel: matchScore >= 70 ? 'high' : matchScore >= 50 ? 'medium' : 'low'
        };
    });

    // 按匹配分數排序
    return results.sort((a, b) => b.matchScore - a.matchScore);
}

// 顯示搜尋結果
function displaySearchResults() {
    const container = document.getElementById('searchResultsContent');
    if (!container) return;

    if (currentSearchResults.length === 0) {
        container.innerHTML = `
            <div class="empty-case">
                <span class="empty-case-icon"></span>
                <p>目前沒有找到匹配的資料</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">
                    建議調整搜尋條件或提供更多細節資訊
                </p>
                <button class="modal-btn btn-primary" style="margin-top: 1.5rem;" onclick="document.getElementById('backToSearchBtn').click()">
                    返回修改搜尋條件
                </button>
            </div>
        `;
        return;
    }

    const highMatches = currentSearchResults.filter(r => r.matchLevel === 'high');
    
    let html = `
        <div class="search-results-list">
            ${currentSearchResults.map(result => `
                <div class="result-card match-${result.matchLevel}">
                    <div class="result-header">
                        <div class="result-match-score">
                            <div class="match-percentage">${result.matchScore}%</div>
                            <div class="match-label">AI 匹配度</div>
                        </div>
                        <div class="result-info">
                            <div class="result-id">案件編號：${result.child.id}</div>
                            <div class="result-time">上傳時間：${result.child.uploadTime}</div>
                        </div>
                    </div>
                    
                    <div class="result-details">
                        <div class="detail-item">
                            <span><strong>姓名：</strong>${result.child.name || '未提供'}</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>年齡：</strong>${result.child.age} 歲</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>地點：</strong>${result.child.location}</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>時間：</strong>${result.child.time}</span>
                        </div>
                        <div class="detail-item">
                            <span><strong>特徵：</strong>${result.child.features}</span>
                        </div>
                    </div>

                    ${result.matchReasons.length > 0 ? `
                        <div style="background: rgba(108, 200, 164, 0.1); padding: 0.75rem; border-radius: 8px; margin-bottom: 1rem;">
                            <strong>匹配原因：</strong>
                            <ul style="margin: 0.5rem 0 0 1.5rem; font-size: 0.9rem;">
                                ${result.matchReasons.map(reason => `<li>${reason}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}

                    <div class="result-actions">
                        <button class="select-case-btn" onclick="startVerification('${result.child.id}')">
                            ${result.matchLevel === 'high' ? '進行 StoryMatch 驗證' : '查看並驗證'}
                        </button>
                    </div>

                    ${result.matchLevel === 'high' ? `
                        <div class="high-match-notice">
                            此案件匹配度極高，建議優先進行驗證
                        </div>
                    ` : ''}
                </div>
            `).join('')}
        </div>

        ${highMatches.length > 0 ? `
            <div class="results-notice">
                <p>找到 ${highMatches.length} 個高度匹配的案件</p>
                <p style="font-size: 0.9rem;">點擊「進行 StoryMatch 驗證」以確認親屬關係</p>
            </div>
        ` : `
            <div class="results-notice">
                <p>找到 ${currentSearchResults.length} 個可能的案件</p>
                <p style="font-size: 0.9rem;">您可以選擇進行驗證，或返回調整搜尋條件</p>
            </div>
        `}
    `;

    container.innerHTML = html;
}

// 開始驗證流程
function startVerification(childId) {
    const result = currentSearchResults.find(r => r.child.id === childId);
    if (!result) return;

    currentSelectedChild = result.child;
    currentAttempt = 1;

    // 顯示驗證問題
    displayVerificationQuestions();

    closeModal('parentResultsModal');
    setTimeout(() => openModal('parentVerificationModal'), 300);
}

// 顯示驗證問題
function displayVerificationQuestions() {
    if (!currentSelectedChild) return;

    const container = document.getElementById('questionsContainer');
    const attemptsDisplay = document.getElementById('attemptsDisplay');
    const attemptSpan = document.getElementById('currentAttempt');

    if (attemptsDisplay) {
        attemptsDisplay.style.display = 'block';
    }
    if (attemptSpan) {
        attemptSpan.textContent = currentAttempt;
    }

    // 隨機選擇 3-5 個問題
    const numQuestions = Math.floor(Math.random() * 3) + 3; // 3-5 個問題
    const selectedQuestions = currentSelectedChild.questions
        .sort(() => 0.5 - Math.random())
        .slice(0, numQuestions);

    const html = selectedQuestions.map((q, index) => `
        <div class="question-card">
            <div>
                <span class="question-number">問題 ${index + 1}</span>
                <span class="question-category">${q.category}</span>
            </div>
            <div class="question-text">${q.question}</div>
            <textarea 
                class="answer-input" 
                id="answer-${q.id}" 
                rows="3" 
                placeholder="請根據您的記憶作答，不需要完全一致..."
                required
            ></textarea>
            <p class="memory-hint">提示：請盡量描述細節，AI 會理解語意而非逐字比對</p>
        </div>
    `).join('');

    container.innerHTML = html;
}

// 處理驗證提交
function handleVerificationSubmit() {
    if (!currentSelectedChild) return;

    // 收集答案
    const answers = {};
    currentSelectedChild.questions.forEach(q => {
        const answerInput = document.getElementById(`answer-${q.id}`);
        if (answerInput) {
            answers[q.id] = answerInput.value;
        }
    });

    // 顯示載入動畫
    showLoadingOverlay('AI 正在分析您的回答與孩童敘事的語意吻合度...');

    // 模擬 AI 分析
    setTimeout(() => {
        const result = performVerificationAnalysis(answers);
        hideLoadingOverlay();
        
        // 顯示結果
        displayVerificationResult(result);
        
        closeModal('parentVerificationModal');
        setTimeout(() => openModal('parentResultModal'), 300);
    }, 3000);
}

// 執行驗證分析（簡化版 AI 模擬）
function performVerificationAnalysis(parentAnswers) {
    if (!currentSelectedChild) return null;

    const questionResults = [];
    let totalScore = 0;

    currentSelectedChild.questions.forEach(q => {
        const parentAnswer = parentAnswers[q.id] || '';
        if (!parentAnswer) {
            questionResults.push({
                question: q,
                score: 0,
                passed: false,
                feedback: '未作答'
            });
            return;
        }

        // 簡化的語意比對
        const parentWords = parentAnswer.toLowerCase().split(/[\s,，、。.]+/);
        const childWords = q.childAnswer.toLowerCase().split(/[\s,，、。.]+/);
        const keywords = q.keywords.map(k => k.toLowerCase());

        // 計算關鍵詞匹配
        let keywordMatches = 0;
        keywords.forEach(keyword => {
            if (parentWords.some(word => word.includes(keyword) || keyword.includes(word))) {
                keywordMatches++;
            }
        });

        // 計算語意重疊
        let semanticOverlap = 0;
        childWords.forEach(childWord => {
            if (childWord.length > 1 && parentWords.some(parentWord => 
                parentWord.includes(childWord) || childWord.includes(parentWord)
            )) {
                semanticOverlap++;
            }
        });

        // 計算分數（0-100）
        const keywordScore = (keywordMatches / keywords.length) * 60;
        const semanticScore = (semanticOverlap / Math.max(childWords.length, 1)) * 40;
        const questionScore = Math.min(100, keywordScore + semanticScore);

        const passed = questionScore >= 60;

        questionResults.push({
            question: q,
            score: Math.round(questionScore),
            passed,
            feedback: passed ? 
                '回答與孩童敘事高度吻合' : 
                '回答與孩童敘事有差異'
        });

        totalScore += questionScore;
    });

    const averageScore = Math.round(totalScore / currentSelectedChild.questions.length);
    const passedCount = questionResults.filter(r => r.passed).length;
    const isPassed = averageScore >= 65 && passedCount >= Math.ceil(questionResults.length * 0.6);

    return {
        isPassed,
        averageScore,
        passedCount,
        totalQuestions: questionResults.length,
        questionResults,
        attempt: currentAttempt
    };
}

// 顯示驗證結果
function displayVerificationResult(result) {
    const container = document.getElementById('verificationResultContent');
    if (!container || !result) return;

    if (result.isPassed) {
        // 驗證通過
        container.innerHTML = `
            <div class="result-success">
                <div class="result-icon"></div>
                <h2>驗證通過！</h2>
                <div class="result-score">
                    總體匹配度：<strong>${result.averageScore}%</strong>
                </div>
                <p class="result-message">
                    您的回答與孩童的敘事有高度的語意與情感一致性。<br>
                    ${result.passedCount} / ${result.totalQuestions} 題達到匹配標準。
                </p>

                <div class="result-details">
                    <h3>📊 各題分析結果</h3>
                    ${result.questionResults.map(qr => `
                        <div class="result-item ${qr.passed ? 'passed' : 'failed'}">
                            <div class="result-item-header">
                                <span class="result-item-icon">${qr.passed ? '✓' : '✗'}</span>
                                <span class="result-item-title">${qr.question.category}</span>
                                <span class="result-item-score">${qr.score}%</span>
                            </div>
                            <div class="result-item-question">${qr.question.question}</div>
                        </div>
                    `).join('')}
                </div>

                <div class="next-steps">
                    <h3>接下來的步驟</h3>
                    <p>為確保孩童安全與真實性，系統會將您的申請提交給 NGO 進行人工核實：</p>
                    <ol>
                        <li>NGO 專員將在 <strong>48 小時內</strong> 聯繫您</li>
                        <li>進行身份與關係的二次驗證</li>
                        <li>確認無誤後，安排安全的重聚流程</li>
                        <li>全程由專業人員陪同與心理輔導</li>
                    </ol>
                    <button class="modal-btn btn-primary" onclick="submitReuniteApplication()">
                        提交 NGO 人工核實申請
                    </button>
                </div>
            </div>
        `;
    } else {
        // 驗證未通過
        const remainingAttempts = maxAttempts - currentAttempt;
        
        container.innerHTML = `
            <div class="result-failure">
                <div class="result-icon">💙</div>
                <h2>記憶吻合度不足</h2>
                <div class="result-score">
                    總體匹配度：<strong>${result.averageScore}%</strong>
                </div>
                <p class="result-message">
                    您的回答與孩童敘事的吻合度未達標準（需 ≥65%）。<br>
                    ${result.passedCount} / ${result.totalQuestions} 題達到匹配標準（需 ≥60%）。
                </p>

                <div class="result-details">
                    <h3>📊 各題分析結果</h3>
                    ${result.questionResults.map(qr => `
                        <div class="result-item ${qr.passed ? 'passed' : 'failed'}">
                            <div class="result-item-header">
                                <span class="result-item-icon">${qr.passed ? '✓' : '✗'}</span>
                                <span class="result-item-title">${qr.question.category}</span>
                                <span class="result-item-score">${qr.score}%</span>
                            </div>
                            <div class="result-item-question">${qr.question.question}</div>
                        </div>
                    `).join('')}
                </div>

                ${remainingAttempts > 0 ? `
                    <div class="retry-info">
                        <p>您還有 <strong>${remainingAttempts}</strong> 次驗證機會</p>
                        <p>建議重新思考記憶細節，或嘗試描述相關的情境與感受</p>
                        <button class="modal-btn btn-primary" onclick="retryVerification()">
                            重新驗證（剩餘 ${remainingAttempts} 次）
                        </button>
                        <button class="modal-btn btn-secondary" onclick="backToSearchFromResult()">
                            返回搜尋其他案件
                        </button>
                    </div>
                ` : `
                    <div class="cooldown-info">
                        <p>您已用完 3 次驗證機會</p>
                        <p>為防止誤匹配，此案件需等待 <strong>${cooldownHours} 小時</strong> 後才能再次驗證</p>
                        <p>建議先搜尋其他可能的案件，或聯繫 NGO 尋求協助</p>
                        <button class="modal-btn btn-primary" onclick="backToSearchFromResult()">
                            搜尋其他案件
                        </button>
                        <button class="modal-btn btn-secondary" onclick="closeModal('parentResultModal')">
                            聯繫 NGO 協助
                        </button>
                    </div>
                `}
            </div>
        `;
    }
}

// 重新驗證
function retryVerification() {
    currentAttempt++;
    closeModal('parentResultModal');
    setTimeout(() => {
        displayVerificationQuestions();
        openModal('parentVerificationModal');
    }, 300);
}

// 從結果返回搜尋
function backToSearchFromResult() {
    closeModal('parentResultModal');
    setTimeout(() => openModal('parentSearchModal'), 300);
}

// 提交 NGO 申請
function submitReuniteApplication() {
    if (!currentSelectedChild) return;

    showLoadingOverlay('正在提交申請給 NGO...');

    // 模擬提交
    setTimeout(() => {
        hideLoadingOverlay();

        const applicationId = `APP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        alert(`
✅ 申請提交成功！

📋 申請編號：${applicationId}
👶 案件編號：${currentSelectedChild.id}

📞 NGO 將在 48 小時內聯繫您
📧 請注意查收電子郵件與電話通知
🔒 所有流程均經過嚴格的安全審查

感謝您的耐心，我們會盡快協助您與孩子團聚。
        `);

        // 記錄申請（實際應儲存到後端）
        console.log('NGO Application:', {
            applicationId,
            childId: currentSelectedChild.id,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });

        // 關閉所有視窗
        closeModal('parentResultModal');
    }, 2000);
}

// 顯示載入覆蓋層
function showLoadingOverlay(message = '處理中...') {
    let overlay = document.getElementById('loadingOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loadingOverlay';
        overlay.className = 'loading-overlay';
        document.body.appendChild(overlay);
    }
    
    overlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <p>${message}</p>
        </div>
    `;
    
    overlay.style.display = 'flex';
}

// 隱藏載入覆蓋層
function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

// 將函數掛載到 window 以供 HTML onclick 使用
window.startVerification = startVerification;
window.retryVerification = retryVerification;
window.backToSearchFromResult = backToSearchFromResult;
window.submitReuniteApplication = submitReuniteApplication;

