// ==================== 模態視窗功能 ====================
// 開啟模態視窗
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滾動
    }
}

// 關閉模態視窗
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // 恢復背景滾動
    }
}

// 監聽所有開啟模態視窗的按鈕
document.querySelectorAll('[data-modal]').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = button.dataset.modal;
        openModal(modalId);
    });
});

// 監聽所有關閉按鈕
document.querySelectorAll('[data-close]').forEach(button => {
    button.addEventListener('click', () => {
        const modalId = button.dataset.close;
        closeModal(modalId);
    });
});

// 點擊遮罩層關閉模態視窗
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', () => {
        const modal = overlay.closest('.modal');
        if (modal) {
            closeModal(modal.id);
        }
    });
});

// ESC 鍵關閉模態視窗
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ==================== 導覽列滾動效果 ====================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ==================== 行動版選單 ====================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
});

// 點擊選單項目後關閉選單
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
    });
});

// ==================== 語言切換功能 ====================
// 應用翻譯到所有具有 data-i18n 屬性的元素
function applyTranslations() {
    // 處理 data-i18n 屬性（文字內容）
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (element.tagName === 'OPTION') {
            element.textContent = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // 處理 data-i18n-placeholder 屬性（placeholder）
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        element.placeholder = translation;
    });
    
    // 動態更新GPS按鈕文字
    updateDynamicElements();
}

// 更新動態元素（如GPS按鈕的狀態文字）
function updateDynamicElements() {
    const getGpsBtn = document.getElementById('getGpsBtn');
    if (getGpsBtn && getGpsBtn.textContent.includes('定位中') || getGpsBtn.textContent.includes('Locating') || getGpsBtn.textContent.includes('Визначення') || getGpsBtn.textContent.includes('تحديد')) {
        getGpsBtn.textContent = t('form.gps.loading');
    } else if (getGpsBtn && (getGpsBtn.textContent.includes('已獲取') || getGpsBtn.textContent.includes('Located') || getGpsBtn.textContent.includes('Визначено') || getGpsBtn.textContent.includes('تم التحديد'))) {
        getGpsBtn.textContent = t('form.gps.success');
    }
}

// 設置語言並更新頁面
function setLanguage(lang) {
    setCurrentLanguage(lang);
    
    // 更新 HTML lang 屬性
    document.documentElement.setAttribute('lang', lang);
    
    // 處理 RTL（阿拉伯文）
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
        document.body.classList.add('rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
        document.body.classList.remove('rtl');
    }
    
    // 應用翻譯
    applyTranslations();
    
    // 更新語言按鈕的激活狀態
    updateLanguageButtons(lang);
    
    // 存儲語言偏好
    localStorage.setItem('hopelink-language', lang);
}

// 更新語言按鈕的激活狀態
function updateLanguageButtons(lang) {
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(button => {
        if (button.dataset.lang === lang) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// 語言切換按鈕事件
const langOptions = document.querySelectorAll('.lang-option');
langOptions.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        setLanguage(lang);
    });
});

// 頁面載入時初始化語言
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = getCurrentLanguage();
    setLanguage(savedLang);
});

// ==================== 滾動動畫 ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// 觀察所有需要動畫的元素
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ==================== 平滑滾動 ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // 忽略空錨點和非滾動連結
        if (href === '#' || href === '#!') {
            e.preventDefault();
            return;
        }
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            e.preventDefault();
            const navbarHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== 按鈕互動效果 ====================
const buttons = document.querySelectorAll('.pathway-btn, .support-link, .auth-btn');

buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // 創建漣漪效果
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加漣漪效果的樣式
const style = document.createElement('style');
style.textContent = `
    button, .support-link {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== 卡片懸停效果 ====================
const cards = document.querySelectorAll('.action-card, .feature-card, .pathway-card, .support-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;
        
        const maxTilt = 5;
        const tiltX = percentY * maxTilt;
        const tiltY = -percentX * maxTilt;
        
        this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
});

// ==================== 載入動畫 ====================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // 延遲執行動畫
    setTimeout(() => {
        document.querySelectorAll('[data-aos]').forEach((element, index) => {
            element.style.transitionDelay = `${index * 0.1}s`;
        });
    }, 100);
});

// ==================== 主題切換（預留功能）====================
const createThemeToggle = () => {
    // 這裡可以加入日夜模式切換功能
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
};

createThemeToggle();

// ==================== 表單提交處理（預留）====================
const forms = document.querySelectorAll('form');

forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('表單提交:', new FormData(form));
        // 這裡可以加入實際的表單處理邏輯
    });
});

// ==================== 效能優化：圖片延遲載入 ====================
const lazyImages = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// ==================== 控制台訊息 ====================
console.log(`
%c🔗 HopeLink
%c讓故事成為重聚的橋樑
When memories find their way home.

© 2025 Humanitarian Tech Initiative
`, 
'color: #6CC8A4; font-size: 24px; font-weight: bold;',
'color: #5A6C7D; font-size: 14px; font-style: italic;'
);

// ==================== 統計與分析（預留）====================
const trackEvent = (category, action, label) => {
    console.log('事件追蹤:', { category, action, label });
    // 這裡可以整合 Google Analytics 或其他分析工具
};

// 追蹤按鈕點擊
document.querySelectorAll('.action-card, .pathway-btn').forEach(element => {
    element.addEventListener('click', function() {
        const text = this.textContent.trim();
        trackEvent('Button', 'Click', text);
    });
});

// ==================== 通報者功能 ====================
// 通報案件儲存（使用 localStorage 模擬）
let reportCases = JSON.parse(localStorage.getItem('reportCases')) || [];

// 生成案件編號
function generateCaseId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `HL-${timestamp}-${random}`;
}

// 通報者端 "開始使用" 按鈕 - 直接進入通報表單
const reporterStartBtn = document.getElementById('reporterStartBtn');
if (reporterStartBtn) {
    reporterStartBtn.addEventListener('click', () => {
        closeModal('reporterModal');
        setTimeout(() => openModal('reportFormModal'), 300);
    });
}

// 通報者介紹頁面的 "查看我的案件" 按鈕
const viewCasesFromIntroBtn = document.getElementById('viewCasesFromIntroBtn');
if (viewCasesFromIntroBtn) {
    viewCasesFromIntroBtn.addEventListener('click', () => {
        closeModal('reporterModal');
        setTimeout(() => {
            openModal('caseTrackingModal');
            loadCaseList();
        }, 300);
    });
}

// 通報表單頁面的 "查看我的案件" 按鈕
const viewCasesHeaderBtn = document.getElementById('viewCasesHeaderBtn');
if (viewCasesHeaderBtn) {
    viewCasesHeaderBtn.addEventListener('click', () => {
        closeModal('reportFormModal');
        setTimeout(() => {
            openModal('caseTrackingModal');
            loadCaseList();
        }, 300);
    });
}

// 案件追蹤頁面的 "返回" 按鈕
const backToFormBtn = document.getElementById('backToFormBtn');
if (backToFormBtn) {
    backToFormBtn.addEventListener('click', () => {
        closeModal('caseTrackingModal');
        setTimeout(() => openModal('reporterModal'), 300);
    });
}

// 案件詳情頁面的 "返回案件列表" 按鈕
const backToCaseListBtn = document.getElementById('backToCaseListBtn');
if (backToCaseListBtn) {
    backToCaseListBtn.addEventListener('click', () => {
        closeModal('caseDetailModal');
        setTimeout(() => {
            openModal('caseTrackingModal');
            loadCaseList();
        }, 300);
    });
}

// 開始通報按鈕（保留給 reporterMainModal 使用，如果需要）
const startReportBtn = document.getElementById('startReportBtn');
if (startReportBtn) {
    startReportBtn.addEventListener('click', () => {
        closeModal('reporterMainModal');
        setTimeout(() => openModal('reportFormModal'), 300);
    });
}

// 查看案件按鈕（保留給 reporterMainModal 使用，如果需要）
const viewCasesBtn = document.getElementById('viewCasesBtn');
if (viewCasesBtn) {
    viewCasesBtn.addEventListener('click', () => {
        closeModal('reporterMainModal');
        setTimeout(() => {
            openModal('caseTrackingModal');
            loadCaseList();
        }, 300);
    });
}

// 圖片上傳處理
const imageUploadArea = document.getElementById('imageUploadArea');
const childImageInput = document.getElementById('childImage');
const imagePreview = document.getElementById('imagePreview');
const uploadPlaceholder = imageUploadArea?.querySelector('.upload-placeholder');
const previewImg = document.getElementById('previewImg');
let uploadedImageData = null;

if (imageUploadArea && childImageInput) {
    imageUploadArea.addEventListener('click', () => {
        childImageInput.click();
    });

    childImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedImageData = event.target.result;
                previewImg.src = uploadedImageData;
                uploadPlaceholder.style.display = 'none';
                imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    // 更換照片按鈕
    const changeImageBtn = imageUploadArea.querySelector('.change-image-btn');
    if (changeImageBtn) {
        changeImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            childImageInput.click();
        });
    }
}

// GPS 定位按鈕
const getGpsBtn = document.getElementById('getGpsBtn');
const gpsInput = document.getElementById('gpsCoords');

if (getGpsBtn && gpsInput) {
    getGpsBtn.addEventListener('click', () => {
        getGpsBtn.textContent = t('form.gps.loading');
        getGpsBtn.disabled = true;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude.toFixed(6);
                    const lng = position.coords.longitude.toFixed(6);
                    gpsInput.value = `${lat}, ${lng}`;
                    getGpsBtn.textContent = t('form.gps.success');
                    getGpsBtn.disabled = false;
                },
                (error) => {
                    alert('無法獲取定位，請手動輸入或檢查定位權限');
                    gpsInput.readOnly = false;
                    getGpsBtn.textContent = t('form.gps.btn');
                    getGpsBtn.disabled = false;
                }
            );
        } else {
            alert('您的瀏覽器不支援定位功能');
            gpsInput.readOnly = false;
            getGpsBtn.textContent = t('form.gps.btn');
            getGpsBtn.disabled = false;
        }
    });
}

// 儲存草稿
const saveDraftBtn = document.getElementById('saveDraftBtn');
if (saveDraftBtn) {
    saveDraftBtn.addEventListener('click', () => {
        const formData = getFormData();
        if (!formData) return;

        formData.isDraft = true;
        formData.status = 'draft';
        
        // 儲存到 localStorage
        let drafts = JSON.parse(localStorage.getItem('reportDrafts')) || [];
        drafts.push(formData);
        localStorage.setItem('reportDrafts', JSON.stringify(drafts));

        alert('✓ 草稿已儲存\n您可以隨時返回繼續填寫');
        console.log('草稿已儲存:', formData);
    });
}

// 表單提交
const reportForm = document.getElementById('reportForm');
if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = getFormData();
        if (!formData) return;

        // 生成案件編號
        const caseId = generateCaseId();
        formData.caseId = caseId;
        formData.status = 'pending';
        formData.submittedAt = new Date().toISOString();
        formData.isDraft = false;

        // 儲存案件
        reportCases.push(formData);
        localStorage.setItem('reportCases', JSON.stringify(reportCases));

        // 顯示成功訊息
        alert(`✓ 通報提交成功！\n\n案件編號：${caseId}\n\n感謝您的通報，我們會盡快處理。\n您可以在「查看我的案件」中追蹤進度。`);

        // 重置表單
        reportForm.reset();
        if (uploadPlaceholder && imagePreview) {
            uploadPlaceholder.style.display = 'block';
            imagePreview.style.display = 'none';
        }
        uploadedImageData = null;

        // 關閉表單視窗
        closeModal('reportFormModal');
        
        console.log('案件已提交:', formData);
    });
}

// 獲取表單資料
function getFormData() {
    const childName = document.getElementById('childName')?.value;
    const childAge = document.getElementById('childAge')?.value;
    const childGender = document.getElementById('childGender')?.value;
    const childLanguage = document.getElementById('childLanguage')?.value;
    const childHealth = document.getElementById('childHealth')?.value;
    const childOther = document.getElementById('childOther')?.value;
    const location = document.getElementById('location')?.value;
    const gpsCoords = document.getElementById('gpsCoords')?.value;
    const foundTime = document.getElementById('foundTime')?.value;
    const environment = document.getElementById('environment')?.value;

    // 驗證必填欄位
    if (!childAge || !childGender || !location || !foundTime) {
        alert('請填寫所有必填欄位（標示 * 的欄位）');
        return null;
    }

    return {
        image: uploadedImageData,
        childName,
        childAge,
        childGender,
        childLanguage,
        childHealth,
        childOther,
        location,
        gpsCoords,
        foundTime,
        environment
    };
}

// 載入案件列表
function loadCaseList() {
    const caseList = document.getElementById('caseList');
    if (!caseList) return;

    if (reportCases.length === 0) {
        caseList.innerHTML = `
            <div class="empty-case">
                <span class="empty-case-icon">📋</span>
                <p>目前沒有通報案件</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">您可以點擊「開始通報」來提交新的案件</p>
            </div>
        `;
        return;
    }

    // 按時間排序（最新的在前）
    const sortedCases = [...reportCases].reverse();

    caseList.innerHTML = sortedCases.map(caseData => {
        const statusClass = `status-${caseData.status}`;
        const statusText = {
            'pending': '待處理',
            'processing': '處理中',
            'completed': '已完成',
            'draft': '草稿'
        }[caseData.status] || '未知';

        const submittedDate = new Date(caseData.submittedAt).toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });

        const genderText = {
            'male': '男',
            'female': '女',
            'unknown': '不確定'
        }[caseData.childGender] || caseData.childGender;

        return `
            <div class="case-item">
                <div class="case-header">
                    <span class="case-id">${caseData.caseId}</span>
                    <span class="case-status ${statusClass}">${statusText}</span>
                </div>
                <div class="case-info">
                    <div class="info-item">
                        <strong>年齡:</strong> ${caseData.childAge}
                    </div>
                    <div class="info-item">
                        <strong>性別:</strong> ${genderText}
                    </div>
                    <div class="info-item">
                        <strong>地點:</strong> ${caseData.location}
                    </div>
                    <div class="info-item">
                        <strong>提交時間:</strong> ${submittedDate}
                    </div>
                </div>
                <div class="case-actions">
                    <button class="view-detail-btn" onclick="viewCaseDetail('${caseData.caseId}')">
                        查看詳情
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// 查看案件詳情
function viewCaseDetail(caseId) {
    const caseData = reportCases.find(c => c.caseId === caseId);
    if (!caseData) return;

    const detailContent = document.getElementById('caseDetailContent');
    if (!detailContent) return;

    const genderText = {
        'male': '男',
        'female': '女',
        'unknown': '不確定'
    }[caseData.childGender] || caseData.childGender;

    const submittedDate = new Date(caseData.submittedAt).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    const foundDateTime = new Date(caseData.foundTime).toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });

    detailContent.innerHTML = `
        <div class="detail-section">
            <h3>📋 案件資訊</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">案件編號</div>
                    <div class="detail-value">${caseData.caseId}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">提交時間</div>
                    <div class="detail-value">${submittedDate}</div>
                </div>
            </div>
        </div>

        ${caseData.image ? `
        <div class="detail-section">
            <h3>📸 孩童照片</h3>
            <div class="detail-image">
                <img src="${caseData.image}" alt="孩童照片（已模糊）">
                <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">
                    ✓ 照片已經過模糊處理以保護隱私
                </p>
            </div>
        </div>
        ` : ''}

        <div class="detail-section">
            <h3>👤 孩童基本資訊</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">估計年齡</div>
                    <div class="detail-value">${caseData.childAge}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">性別</div>
                    <div class="detail-value">${genderText}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">語言</div>
                    <div class="detail-value">${caseData.childLanguage || '未提供'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">健康狀況</div>
                    <div class="detail-value">${caseData.childHealth || '未提供'}</div>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>📍 發現地點資訊</h3>
            <div class="detail-item">
                <div class="detail-label">發現地點</div>
                <div class="detail-value">${caseData.location}</div>
            </div>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="detail-label">GPS 座標</div>
                    <div class="detail-value">${caseData.gpsCoords || '未提供'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">發現時間</div>
                    <div class="detail-value">${foundDateTime}</div>
                </div>
            </div>
            ${caseData.environment ? `
            <div class="detail-item" style="margin-top: 1rem;">
                <div class="detail-label">環境描述</div>
                <div class="detail-value">${caseData.environment}</div>
            </div>
            ` : ''}
        </div>
    `;

    closeModal('caseTrackingModal');
    setTimeout(() => openModal('caseDetailModal'), 300);
}

// 將 viewCaseDetail 函數掛載到 window 上，讓 HTML 中的 onclick 可以訪問
window.viewCaseDetail = viewCaseDetail;

