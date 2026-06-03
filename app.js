// DOM 요소
const taskInput = document.getElementById('task-input');
const btnAdd = document.getElementById('btn-add');
const taskContainer = document.getElementById('task-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const btnPrevWeek = document.getElementById('btn-prev-week');
const btnNextWeek = document.getElementById('btn-next-week');
const weekDisplay = document.getElementById('week-display');
const calendarWrapper = document.getElementById('calendar-wrapper');

// 상태 관리
let taskData = [];
let activeFilter = 'all';
let pickedDate = new Date();
let weekStartDate = getMonday(new Date());

// 스토리지 연동
function saveTasks() {
    localStorage.setItem('taskData', JSON.stringify(taskData));
}

function loadTasks() {
    const stored = localStorage.getItem('taskData');
    if (stored) taskData = JSON.parse(stored);
}

// 날짜 계산
function getMonday(date) {
    const res = new Date(date);
    const day = res.getDay();
    const diff = res.getDate() - day + (day === 0 ? -6 : 1);
    res.setDate(diff);
    return res;
}

function formatDate(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getWeekArr(start) {
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        return d;
    });
}

// 통합 UI 렌더링
function refreshUI() {
    drawCalendar();
    drawTasks();
}

// 달력 렌더링
function drawCalendar() {
    const week = getWeekArr(weekStartDate);
    weekDisplay.textContent = `${formatDate(week[0])} ~ ${formatDate(week[6])}`;
    calendarWrapper.innerHTML = '';
    
    const dayLabels = ['월', '화', '수', '목', '금', '토', '일'];
    const todayStr = formatDate(new Date());
    const pickedStr = formatDate(pickedDate);

    week.forEach((date, i) => {
        const dStr = formatDate(date);
        const count = taskData.filter(t => t.date === dStr).length;

        const card = document.createElement('div');
        card.className = 'day-card';
        if (dStr === todayStr) card.classList.add('today');
        if (dStr === pickedStr) card.classList.add('picked');

        card.innerHTML = `
            <div class="day-name">${dayLabels[i]}</div>
            <div class="day-num">${date.getDate()}</div>
            <div class="task-count">${count}</div>
        `;

        card.addEventListener('click', () => {
            pickedDate = new Date(date);
            refreshUI();
        });

        calendarWrapper.appendChild(card);
    });
}

// 리스트 렌더링
function drawTasks() {
    taskContainer.innerHTML = '';
    const pickedStr = formatDate(pickedDate);

    const filtered = taskData.filter(t => {
        if (t.date !== pickedStr) return false;
        if (activeFilter === 'active') return !t.isDone;
        if (activeFilter === 'completed') return t.isDone;
        return true;
    });

    if (filtered.length === 0) {
        taskContainer.innerHTML = `<li style="text-align: center; color: #888; padding: 30px 0; font-size: 14px;">할 일이 없습니다. 📝</li>`;
        return;
    }

    filtered.forEach(t => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.className = `task-text ${t.isDone ? 'done' : ''}`;
        span.textContent = t.text;

        const btnGrp = document.createElement('div');
        btnGrp.className = 'btn-group';

        const btnDone = document.createElement('button');
        btnDone.className = 'btn-action';
        btnDone.textContent = '완료';
        btnDone.addEventListener('click', () => toggleTask(t.id));

        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn-action';
        btnEdit.textContent = '수정';
        btnEdit.addEventListener('click', () => modifyTask(t.id));

        const btnDel = document.createElement('button');
        btnDel.className = 'btn-action';
        btnDel.textContent = '삭제';
        btnDel.addEventListener('click', () => removeTask(t.id));

        btnGrp.append(btnDone, btnEdit, btnDel);
        li.append(span, btnGrp);
        taskContainer.appendChild(li);
    });
}

// 데이터 조작 (CRUD)
function createTask() {
    const val = taskInput.value.trim();
    if (!val) return alert('할 일을 입력해주세요.');

    taskData.push({
        id: Date.now(),
        text: val,
        isDone: false,
        date: formatDate(pickedDate)
    });

    taskInput.value = '';
    saveTasks();
    refreshUI();
}

function removeTask(id) {
    taskData = taskData.filter(t => t.id !== id);
    saveTasks();
    refreshUI();
}

function toggleTask(id) {
    taskData = taskData.map(t => t.id === id ? { ...t, isDone: !t.isDone } : t);
    saveTasks();
    refreshUI();
}

function modifyTask(id) {
    const target = taskData.find(t => t.id === id);
    if (!target) return;

    const val = prompt('할 일을 수정하세요:', target.text);
    if (val && val.trim() !== '') {
        taskData = taskData.map(t => t.id === id ? { ...t, text: val.trim() } : t);
        saveTasks();
        refreshUI();
    }
}

// 이벤트 리스너
btnPrevWeek.addEventListener('click', () => {
    weekStartDate.setDate(weekStartDate.getDate() - 7);
    refreshUI();
});

btnNextWeek.addEventListener('click', () => {
    weekStartDate.setDate(weekStartDate.getDate() + 7);
    refreshUI();
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        activeFilter = e.target.getAttribute('data-filter');
        drawTasks();
    });
});

btnAdd.addEventListener('click', createTask);
taskInput.addEventListener('keypress', e => e.key === 'Enter' && createTask());

// 초기화
loadTasks();
refreshUI();