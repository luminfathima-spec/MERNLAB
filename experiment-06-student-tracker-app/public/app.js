document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('taskTableBody');
  const taskForm = document.getElementById('taskForm');
  const totalCount = document.getElementById('totalCount');
  const completedCount = document.getElementById('completedCount');
  const pendingCount = document.getElementById('pendingCount');

  // Set default due date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];

  function fetchTasks() {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          renderTasks(data.tasks);
        }
      });
  }

  function renderTasks(tasks) {
    tableBody.innerHTML = '';
    let completed = 0;
    let pending = 0;

    tasks.forEach(t => {
      if (t.status === 'Completed') completed++;
      else pending++;

      const tr = document.createElement('tr');
      const badgeClass = t.status === 'Completed' ? 'bg-success' : (t.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary');

      tr.innerHTML = `
        <td class="fw-bold">${t.title}</td>
        <td><span class="badge bg-light text-dark border">${t.subject}</span></td>
        <td class="small text-muted">${t.dueDate}</td>
        <td>
          <select class="form-select form-select-sm" onchange="updateStatus(${t.id}, this.value)">
            <option value="Pending" ${t.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${t.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${t.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
        </td>
        <td>
          <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="deleteTask(${t.id})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;
  }

  window.updateStatus = (id, newStatus) => {
    fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    }).then(() => fetchTasks());
  };

  window.deleteTask = (id) => {
    fetch(`/api/tasks/${id}`, { method: 'DELETE' }).then(() => fetchTasks());
  };

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('taskTitle').value;
    const subject = document.getElementById('taskSubject').value;
    const dueDate = document.getElementById('taskDueDate').value;

    fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, subject, dueDate })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        taskForm.reset();
        document.getElementById('taskDueDate').value = tomorrow.toISOString().split('T')[0];
        fetchTasks();
      }
    });
  });

  fetchTasks();
});
