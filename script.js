// Language translations
const translations = {
    en: {
        title: 'Calendar',
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        today: 'Today'
    },
    de: {
        title: 'Kalender',
        months: [
            'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
            'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
        ],
        days: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        today: 'Heute'
    }
};

// Calendar state
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentLanguage = 'en';

// DOM elements
const languageSelector = document.getElementById('language-selector');
const appTitle = document.getElementById('app-title');
const currentMonthYear = document.getElementById('current-month-year');
const calendarGrid = document.getElementById('calendar-grid');
const prevMonthBtn = document.getElementById('prev-month');
const nextMonthBtn = document.getElementById('next-month');
const todayBtn = document.getElementById('today-btn');

// Initialize calendar
document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    setupEventListeners();
});

function initializeCalendar() {
    // Set initial language from localStorage or default to English
    const savedLanguage = localStorage.getItem('calendar-language') || 'en';
    currentLanguage = savedLanguage;
    languageSelector.value = savedLanguage;

    updateLanguage();
    generateCalendar();
}

function setupEventListeners() {
    // Language selector
    languageSelector.addEventListener('change', function() {
        currentLanguage = this.value;
        localStorage.setItem('calendar-language', currentLanguage);
        updateLanguage();
        generateCalendar();
    });

    // Navigation buttons
    prevMonthBtn.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar();
    });

    nextMonthBtn.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar();
    });

    // Today button
    todayBtn.addEventListener('click', function() {
        const today = new Date();
        currentMonth = today.getMonth();
        currentYear = today.getFullYear();
        generateCalendar();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                prevMonthBtn.click();
                break;
            case 'ArrowRight':
                nextMonthBtn.click();
                break;
            case ' ':
                e.preventDefault();
                todayBtn.click();
                break;
        }
    });
}

function updateLanguage() {
    const lang = translations[currentLanguage];

    // Update title
    appTitle.textContent = lang.title;
    document.title = lang.title;

    // Update day headers
    for (let i = 0; i < 7; i++) {
        document.getElementById(`day-${i}`).textContent = lang.days[i];
    }

    // Update today button
    todayBtn.textContent = lang.today;

    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
}

function generateCalendar() {
    const lang = translations[currentLanguage];
    const today = new Date();
    const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

    // Update month/year display
    currentMonthYear.textContent = `${lang.months[currentMonth]} ${currentYear}`;

    // Clear calendar grid
    calendarGrid.innerHTML = '';

    // Get first day of the month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Add days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const dayElement = createDayElement(day, true, false);
        calendarGrid.appendChild(dayElement);
    }

    // Add days of current month
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = isCurrentMonth && day === today.getDate();
        const dayElement = createDayElement(day, false, isToday);
        calendarGrid.appendChild(dayElement);
    }

    // Add days from next month to fill the grid
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days = 42 cells
    for (let day = 1; day <= remainingCells; day++) {
        const dayElement = createDayElement(day, true, false);
        calendarGrid.appendChild(dayElement);
    }

    // Add animation
    calendarGrid.style.opacity = '0';
    calendarGrid.style.transform = 'translateY(20px)';
    setTimeout(() => {
        calendarGrid.style.transition = 'all 0.3s ease';
        calendarGrid.style.opacity = '1';
        calendarGrid.style.transform = 'translateY(0)';
    }, 50);
}

function createDayElement(day, isOtherMonth, isToday) {
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = day;

    if (isOtherMonth) {
        dayElement.classList.add('other-month');
    }

    if (isToday) {
        dayElement.classList.add('today');
    }

    // Add click event listener
    dayElement.addEventListener('click', function() {
        // Remove previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(el => {
            el.classList.remove('selected');
        });

        // Add selection to clicked day (only for current month)
        if (!isOtherMonth) {
            this.classList.add('selected');
        }
    });

    // Add hover effect enhancement
    dayElement.addEventListener('mouseenter', function() {
        if (!isOtherMonth) {
            this.style.transform = 'scale(1.05)';
        }
    });

    dayElement.addEventListener('mouseleave', function() {
        if (!isOtherMonth) {
            this.style.transform = 'scale(1)';
        }
    });

    return dayElement;
}

// Add smooth transitions when changing months
function smoothTransition(callback) {
    calendarGrid.style.transition = 'all 0.3s ease';
    calendarGrid.style.opacity = '0';
    calendarGrid.style.transform = 'translateX(20px)';

    setTimeout(() => {
        callback();
        calendarGrid.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            calendarGrid.style.opacity = '1';
            calendarGrid.style.transform = 'translateX(0)';
        }, 50);
    }, 150);
}

// Enhanced navigation with smooth transitions
function navigateMonth(direction) {
    smoothTransition(() => {
        if (direction === 'prev') {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
        } else {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
        }
        generateCalendar();
    });
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

calendarGrid.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

calendarGrid.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next month
            nextMonthBtn.click();
        } else {
            // Swipe right - previous month
            prevMonthBtn.click();
        }
    }
}

// Add current date info to footer
function updateDateInfo() {
    const today = new Date();
    const lang = translations[currentLanguage];
    const dateInfo = document.createElement('div');
    dateInfo.className = 'date-info';
    dateInfo.style.marginTop = '10px';
    dateInfo.style.fontSize = '0.9rem';
    dateInfo.style.color = '#666';

    const dayName = lang.days[today.getDay()];
    const monthName = lang.months[today.getMonth()];
    const dayNum = today.getDate();
    const year = today.getFullYear();

    if (currentLanguage === 'de') {
        dateInfo.textContent = `${dayName}, ${dayNum}. ${monthName} ${year}`;
    } else {
        dateInfo.textContent = `${dayName}, ${monthName} ${dayNum}, ${year}`;
    }

    // Add to footer if not already present
    const footer = document.querySelector('.calendar-footer');
    const existingInfo = footer.querySelector('.date-info');
    if (existingInfo) {
        existingInfo.replaceWith(dateInfo);
    } else {
        footer.appendChild(dateInfo);
    }
}

// Update date info when language changes
const originalUpdateLanguage = updateLanguage;
updateLanguage = function() {
    originalUpdateLanguage();
    updateDateInfo();
};

// Initialize date info
setTimeout(updateDateInfo, 100);
