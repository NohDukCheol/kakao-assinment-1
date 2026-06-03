// 1. DOM 요소 선택
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const filterBtns = document.querySelectorAll('.filter-btn');

const prevWeekBtn = document.getElementById('prev-week-btn');
const nextWeekBtn = document.getElementById('next-week-btn');
const currentWeekDisplay = document.getElementById('current-week-display');
const weeklyCalendar = document.getElementById('weekly-calendar');

// 2. 상태 관리 변수
let todos = [];
let currentFilter = 'all';
let selectedDate = new Date(); // 현재 클릭해서 보고 있는 날짜
let currentWeekStart = getStartOfWeek(new Date()); // 현재 달력에 표시될 주(Week)의 월요일

// --- 로컬 스토리지 연동 함수 ---
// 데이터를 로컬 스토리지에 저장 (JSON.stringify 활용)
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// 로컬 스토리지에서 데이터 불러오기 (JSON.parse 활용)
function loadTodos() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
    }
}
// -----------------------------

// --- 날짜 계산 및 포맷팅 함수 ---
// 특정 날짜가 속한 주의 '월요일'을 구하는 함수
function getStartOfWeek(date) {
    const result = new Date(date);
    const day = result.getDay();
    // 일요일(0)이면 -6일, 그 외 요일은 (현재요일 - 1)만큼 빼서 월요일로 맞춤
    const diff = result.getDate() - day + (day === 0 ? -6 : 1);
    result.setDate(diff);
    return result;
}

// 날짜를 YYYY-MM-DD 포맷으로 변환
function getFormattedDate(dateObj) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 기준 날짜로부터 7일간의 날짜 배열 생성
function generateWeekArray(startDate) {
    const week = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        week.push(d);
    }
    return week;
}
// -----------------------------

// 전체 UI(캘린더 + 리스트)를 한 번에 업데이트하는 래퍼 함수
function updateUI() {
    renderCalendar();
    renderTodos();
}

// 주간 달력 렌더링 함수
function renderCalendar() {
    const week = generateWeekArray(currentWeekStart);
    const endOfWeek = week[6];

    // 상단 "YYYY-MM-DD ~ YYYY-MM-DD" 텍스트 업데이트
    currentWeekDisplay.textContent = `${getFormattedDate(week[0])} ~ ${getFormattedDate(endOfWeek)}`;
    
    weeklyCalendar.innerHTML = '';
    const daysName = ['월', '화', '수', '목', '금', '토', '일'];
    
    const todayStr = getFormattedDate(new Date());
    const selectedStr = getFormattedDate(selectedDate);

    // 7개의 요일 카드를 생성
    week.forEach((date, index) => {
        const dateStr = getFormattedDate(date);
        
        // 해당 날짜의 Todo 개수 계산 (로컬스토리지에 있는 데이터 기준)
        const dayTodosCount = todos.filter(todo => todo.date === dateStr).length;

        const dayCard = document.createElement('div');
        dayCard.className = 'day-card';
        
        // 스타일 적용: 오늘 날짜, 선택된 날짜
        if (dateStr === todayStr) dayCard.classList.add('today');
        if (dateStr === selectedStr) dayCard.classList.add('selected');

        dayCard.innerHTML = `
            <div class="day-name">${daysName[index]}</div>
            <div class="day-num">${date.getDate()}</div>
            <div class="todo-count">${dayTodosCount}</div>
        `;

        // 날짜 클릭 이벤트 (선택된 날짜를 변경하고 UI 재구성)
        dayCard.addEventListener('click', () => {
            selectedDate = new Date(date);
            updateUI();
        });

        weeklyCalendar.appendChild(dayCard);
    });
}

// Todo 목록 렌더링 함수
function renderTodos() {
    todoList.innerHTML = '';
    const formattedSelectedDate = getFormattedDate(selectedDate);

    // 날짜 + 탭 필터링
    const filteredTodos = todos.filter(todo => {
        if (todo.date !== formattedSelectedDate) return false;
        if (currentFilter === 'active') return !todo.isCompleted;
        if (currentFilter === 'completed') return todo.isCompleted;
        return true; 
    });
    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <li style="text-align: center; color: #888; padding: 30px 0; font-size: 14px;">
                해당 조건에 표시할 할 일이 없습니다. 📝
            </li>`;
        return; // 데이터가 없으면 여기서 함수 종료
    }
    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const span = document.createElement('span');
        span.className = `todo-text ${todo.isCompleted ? 'completed' : ''}`;
        span.textContent = todo.text;

        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'action-btn';
        completeBtn.textContent = '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));

        const editBtn = document.createElement('button');
        editBtn.className = 'action-btn';
        editBtn.textContent = '수정';
        editBtn.addEventListener('click', () => editTodo(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'action-btn';
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        buttonGroup.appendChild(completeBtn);
        buttonGroup.appendChild(editBtn);
        buttonGroup.appendChild(deleteBtn);

        li.appendChild(span);
        li.appendChild(buttonGroup);
        todoList.appendChild(li);
    });
}

// --- Todo CRUD 액션 함수 ---
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') {
        alert('할 일을 입력해주세요.');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        isCompleted: false,
        date: getFormattedDate(selectedDate)
    };

    todos.push(newTodo);
    todoInput.value = '';
    
    saveTodos(); // 변경사항 로컬스토리지 저장
    updateUI();  // 달력(개수)과 리스트를 모두 업데이트
}

function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    updateUI();
}

function toggleComplete(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, isCompleted: !todo.isCompleted };
        }
        return todo;
    });
    saveTodos();
    updateUI();
}

function editTodo(id) {
    const todoToEdit = todos.find(todo => todo.id === id);
    if (!todoToEdit) return;

    const newText = prompt('할 일을 수정하세요:', todoToEdit.text);
    if (newText !== null && newText.trim() !== '') {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, text: newText.trim() };
            }
            return todo;
        });
        saveTodos();
        updateUI();
    }
}

// --- 이벤트 리스너 등록 ---
// 주간 이동 버튼 (7일씩 증감)
prevWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateUI();
});

nextWeekBtn.addEventListener('click', () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateUI();
});

// 필터 버튼 (전체/진행/완료)
filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.getAttribute('data-filter');
        renderTodos(); // 달력 개수는 안변하므로 리스트만 업데이트
    });
});

addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// --- 앱 초기화 실행 ---
loadTodos(); // 1. 로컬스토리지에서 기존 데이터 불러오기
updateUI();  // 2. 화면에 달력과 리스트 그리기