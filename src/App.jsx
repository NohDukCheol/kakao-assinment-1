import { useEffect, useState } from 'react';

function App() {
  const [taskList, setTaskList] = useState(() => {
    const storedTasks = localStorage.getItem('taskList');

    if (storedTasks) {
      return JSON.parse(storedTasks);
    }

    return [];
  });

  const [taskText, setTaskText] = useState('');
  const [noticeMessage, setNoticeMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [pickedDate, setPickedDate] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('taskList', JSON.stringify(taskList));
  }, [taskList]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const movePickedDate = (amount) => {
    const nextDate = new Date(pickedDate);
    nextDate.setDate(nextDate.getDate() + amount);
    setPickedDate(nextDate);
  };

  const createTask = () => {
    if (taskText.trim() === '') {
      setNoticeMessage('할 일을 입력해주세요.');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      isCompleted: false,
      isEditing: false,
      date: formatDate(pickedDate),
    };

    setTaskList([...taskList, newTask]);
    setTaskText('');
    setNoticeMessage('');
  };

  const removeTask = (id) => {
    setTaskList(taskList.filter((task) => task.id !== id));
  };

  const toggleTask = (id) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const modifyTask = (id) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, isEditing: true } : task
      )
    );
  };

  const updateTaskText = (id, value) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id ? { ...task, text: value } : task
      )
    );
  };

  const saveModifiedTask = (id) => {
    setTaskList(
      taskList.map((task) =>
        task.id === id && task.text.trim() !== ''
          ? { ...task, text: task.text.trim(), isEditing: false }
          : task
      )
    );
  };

  const filteredTasks = taskList.filter((task) => {
    if (task.date !== formatDate(pickedDate)) return false;

    if (activeFilter === 'active') return !task.isCompleted;
    if (activeFilter === 'completed') return task.isCompleted;

    return true;
  });

  return (
    <div className="min-h-screen flex justify-center bg-slate-100 pt-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Todo List
        </h1>

        <div className="flex justify-between items-center bg-blue-50 rounded-lg px-4 py-3 mb-4">
          <button
            className="text-blue-600 font-bold text-xl"
            onClick={() => movePickedDate(-1)}
          >
            ◀
          </button>

          <span className="font-bold text-blue-600">
            {formatDate(pickedDate)}
          </span>

          <button
            className="text-blue-600 font-bold text-xl"
            onClick={() => movePickedDate(1)}
          >
            ▶
          </button>
        </div>

        <div className="flex gap-2 mb-2">
          <input
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-600"
            type="text"
            placeholder="할 일을 입력하세요"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') createTask();
            }}
          />

          <button
            className="bg-blue-600 text-white px-4 rounded-lg font-bold"
            onClick={createTask}
          >
            추가
          </button>
        </div>

        {noticeMessage && (
          <p className="text-sm text-red-500 mb-4">{noticeMessage}</p>
        )}

        <div className="flex gap-2 my-4">
          <button
            className={`flex-1 py-2 rounded-lg font-bold ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
            onClick={() => setActiveFilter('all')}
          >
            전체
          </button>

          <button
            className={`flex-1 py-2 rounded-lg font-bold ${
              activeFilter === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
            onClick={() => setActiveFilter('active')}
          >
            진행 중
          </button>

          <button
            className={`flex-1 py-2 rounded-lg font-bold ${
              activeFilter === 'completed'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
            onClick={() => setActiveFilter('completed')}
          >
            완료
          </button>
        </div>

        <ul className="flex flex-col gap-3 mt-4">
          {filteredTasks.length === 0 ? (
            <li className="text-center text-slate-400 py-8">
              표시할 할 일이 없습니다. 📝
            </li>
          ) : (
            filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between border-b border-slate-200 py-3"
              >
                {task.isEditing ? (
                  <input
                    className="flex-1 border border-slate-300 rounded px-3 py-1 mr-2"
                    value={task.text}
                    onChange={(e) =>
                      updateTaskText(task.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveModifiedTask(task.id);
                    }}
                  />
                ) : (
                  <span
                    className={`flex-1 ${
                      task.isCompleted
                        ? 'line-through text-slate-400'
                        : 'text-slate-700'
                    }`}
                  >
                    {task.text}
                  </span>
                )}

                <div className="flex gap-1">
                  {task.isEditing ? (
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                      onClick={() => saveModifiedTask(task.id)}
                    >
                      저장
                    </button>
                  ) : (
                    <button
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                      onClick={() => modifyTask(task.id)}
                    >
                      수정
                    </button>
                  )}

                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    onClick={() => toggleTask(task.id)}
                  >
                    완료
                  </button>

                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    onClick={() => removeTask(task.id)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;