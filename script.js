const storageKey = 'hostelManagementSystemData';

const defaultData = {
  students: [
    { id: 'S001', name: 'Aisha Khan', department: 'Computer Science', phone: '9801234567', guardian: 'Mr. Khan', room: '101' },
    { id: 'S002', name: 'Rahul Verma', department: 'Mechanical', phone: '9807654321', guardian: 'Mrs. Verma', room: '102' },
    { id: 'S003', name: 'Nadia Ahmed', department: 'Business', phone: '9812233445', guardian: 'Mr. Ahmed', room: '103' }
  ],
  rooms: [
    { number: '101', occupied: true },
    { number: '102', occupied: true },
    { number: '103', occupied: true },
    { number: '104', occupied: false },
    { number: '105', occupied: false },
    { number: '106', occupied: false },
    { number: '107', occupied: true },
    { number: '108', occupied: false },
    { number: '109', occupied: false },
    { number: '110', occupied: false }
  ],
  fees: [
    { studentId: 'S001', type: 'Hostel Rent', amount: 3500, status: 'Paid' },
    { studentId: 'S002', type: 'Hostel Rent', amount: 3500, status: 'Pending' },
    { studentId: 'S003', type: 'Food Charges', amount: 2200, status: 'Overdue' }
  ],
  complaints: [
    { studentId: 'S001', type: 'Maintenance', description: 'Ceiling fan in room 101 is noisy.', status: 'In Progress' },
    { studentId: 'S002', type: 'Water', description: 'Water pressure is weak in the morning.', status: 'Open' }
  ],
  visitors: [
    { name: 'Mr. Ali', studentId: 'S001', purpose: 'Parent visit', time: '15:30' }
  ]
};

const state = loadState();
let currentPanel = 'admin';
let currentStudentId = null;

function loadState() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    localStorage.setItem(storageKey, JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    localStorage.setItem(storageKey, JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function showMessage(text, type = 'success') {
  const box = document.getElementById('messageBox');
  if (!box) return;
  box.innerHTML = `<div class="alert ${type}">${text}</div>`;
}

function getStudentName(studentId) {
  const student = state.students.find(item => item.id === studentId);
  return student ? student.name : studentId;
}

function renderStats() {
  const statsGrid = document.getElementById('statsGrid');
  if (!statsGrid) return;

  const totalStudents = state.students.length;
  const occupied = state.rooms.filter(room => room.occupied).length;
  const vacant = state.rooms.length - occupied;
  const feeTotal = state.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const openComplaints = state.complaints.filter(item => item.status !== 'Resolved').length;
  const visitorCount = state.visitors.length;

  const cards = [
    { label: 'Total Students', value: totalStudents, trend: '+8% this month' },
    { label: 'Occupied Rooms', value: occupied, trend: `${vacant} vacant` },
    { label: 'Fee Collection', value: `₹${feeTotal.toLocaleString()}`, trend: 'Updated today' },
    { label: 'Open Complaints', value: openComplaints, trend: 'Needs attention' },
    { label: 'Visitors Logged', value: visitorCount, trend: 'Current records' }
  ];

  statsGrid.innerHTML = cards.map(card => `
    <div class="stat-card">
      <div class="stat-label">${card.label}</div>
      <div class="stat-value">${card.value}</div>
      <div class="stat-trend">${card.trend}</div>
    </div>
  `).join('');
}

function renderRoomStatus() {
  const list = document.getElementById('roomStatusList');
  if (!list) return;

  list.innerHTML = state.rooms.map(room => `
    <div class="room-item">
      <strong>Room ${room.number}</strong>
      <span class="status-tag ${room.occupied ? 'occupied' : 'vacant'}">${room.occupied ? 'Occupied' : 'Vacant'}</span>
    </div>
  `).join('');
}

function populateRoomSelects() {
  const roomOptions = state.rooms.map(room => `<option value="${room.number}">Room ${room.number}</option>`).join('');
  const studentRoomSelect = document.getElementById('studentRoomSelect');
  if (studentRoomSelect) studentRoomSelect.innerHTML = roomOptions;

  const availableRooms = state.rooms.filter(room => !room.occupied);
  const availableRoomOptions = availableRooms.length
    ? availableRooms.map(room => `<option value="${room.number}">Room ${room.number}</option>`).join('')
    : '<option value="">No rooms available</option>';

  const allocationRoomSelect = document.getElementById('allocationRoomId');
  if (allocationRoomSelect) allocationRoomSelect.innerHTML = availableRoomOptions;
}

function populateStudentSelects() {
  const studentOptions = state.students.map(student => `
    <option value="${student.id}">${student.name} (${student.id})</option>
  `).join('');

  const names = ['allocationStudentId', 'feeStudentId', 'complaintStudentId', 'visitorStudentId'];
  names.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = studentOptions;
  });

  const studentSelect = document.getElementById('studentSelect');
  if (studentSelect) {
    studentSelect.innerHTML = state.students.map(student => `<option value="${student.id}">${student.name} (${student.id})</option>`).join('');
  }
}

function renderFeeTable() {
  const tbody = document.getElementById('feeTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.fees.map(fee => {
    const statusClass = fee.status.toLowerCase().replace(' ', '');
    return `
      <tr>
        <td>${getStudentName(fee.studentId)}</td>
        <td>${fee.type}</td>
        <td>₹${Number(fee.amount).toLocaleString()}</td>
        <td><span class="meta-tag ${statusClass}">${fee.status}</span></td>
      </tr>
    `;
  }).join('');
}

function renderComplaintTable() {
  const tbody = document.getElementById('complaintTableBody');
  if (!tbody) return;

  tbody.innerHTML = state.complaints.map(item => {
    const statusClass = item.status === 'In Progress' ? 'progress' : item.status.toLowerCase();
    return `
      <tr>
        <td>${getStudentName(item.studentId)}</td>
        <td>${item.type}</td>
        <td><span class="meta-tag ${statusClass}">${item.status}</span></td>
      </tr>
    `;
  }).join('');
}

function renderReports() {
  const reportSummary = document.getElementById('reportSummary');
  if (!reportSummary) return;

  const totalStudents = state.students.length;
  const feeTotal = state.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const pendingFees = state.fees.filter(fee => fee.status !== 'Paid').length;
  const complaintCount = state.complaints.length;
  const visitorCount = state.visitors.length;
  const occupancy = `${state.rooms.filter(room => room.occupied).length}/${state.rooms.length}`;

  const summary = [
    { label: 'Students', value: totalStudents },
    { label: 'Pending Fees', value: pendingFees },
    { label: 'Complaints', value: complaintCount },
    { label: 'Visitors', value: visitorCount },
    { label: 'Collection', value: `₹${feeTotal.toLocaleString()}` },
    { label: 'Occupancy', value: occupancy }
  ];

  reportSummary.innerHTML = summary.map(item => `
    <div class="report-box">
      <strong>${item.value}</strong>
      <span>${item.label}</span>
    </div>
  `).join('');
}

function renderStudentPanel() {
  const studentPanel = document.getElementById('studentPanel');
  const studentDashboard = document.getElementById('studentDashboard');
  const select = document.getElementById('studentSelect');

  if (!studentPanel || !studentDashboard || !select) return;

  if (!currentStudentId) {
    studentDashboard.classList.add('hidden');
    return;
  }

  const student = state.students.find(item => item.id === currentStudentId);
  if (!student) {
    currentStudentId = null;
    studentDashboard.classList.add('hidden');
    return;
  }

  document.getElementById('studentName').textContent = student.name;
  document.getElementById('studentIdText').textContent = student.id;
  document.getElementById('studentDepartment').textContent = student.department;
  document.getElementById('studentRoom').textContent = student.room;

  const studentFees = state.fees.filter(fee => fee.studentId === currentStudentId);
  const studentComplaints = state.complaints.filter(item => item.studentId === currentStudentId);
  const visitorLogs = state.visitors.filter(item => item.studentId === currentStudentId);

  const feeSummary = document.getElementById('studentFeeSummary');
  if (studentFees.length) {
    feeSummary.innerHTML = studentFees.map(fee => `
      <div class="student-card-item">
        <strong>${fee.type}</strong><br>
        ₹${Number(fee.amount).toLocaleString()}<br>
        <span class="meta-tag ${fee.status.toLowerCase().replace(' ', '')}">${fee.status}</span>
      </div>
    `).join('');
  } else {
    feeSummary.innerHTML = '<div class="student-card-item">No fee records found.</div>';
  }

  const complaintList = document.getElementById('studentComplaintList');
  if (studentComplaints.length) {
    complaintList.innerHTML = studentComplaints.map(item => `
      <div class="student-card-item">
        <strong>${item.type}</strong><br>
        ${item.description}<br>
        <span class="meta-tag ${item.status === 'In Progress' ? 'progress' : item.status.toLowerCase()}">${item.status}</span>
      </div>
    `).join('');
  } else {
    complaintList.innerHTML = '<div class="student-card-item">No complaint history.</div>';
  }

  const visitorList = document.getElementById('studentVisitorList');
  if (visitorLogs.length) {
    visitorList.innerHTML = visitorLogs.map(item => `
      <div class="student-card-item">
        <strong>${item.name}</strong><br>
        Purpose: ${item.purpose}<br>
        Time: ${item.time}
      </div>
    `).join('');
  } else {
    visitorList.innerHTML = '<div class="student-card-item">No visitors logged yet.</div>';
  }

  studentDashboard.classList.remove('hidden');
  select.value = currentStudentId;
}

function renderAllAdmin() {
  renderStats();
  renderRoomStatus();
  populateRoomSelects();
  populateStudentSelects();
  renderFeeTable();
  renderComplaintTable();
  renderReports();
}

function togglePanel(panelName) {
  currentPanel = panelName;
  const adminPanel = document.getElementById('adminPanel');
  const studentPanel = document.getElementById('studentPanel');
  const buttons = document.querySelectorAll('.panel-toggle');

  if (adminPanel) adminPanel.classList.toggle('hidden', panelName !== 'admin');
  if (studentPanel) studentPanel.classList.toggle('hidden', panelName !== 'student');

  buttons.forEach(btn => btn.classList.toggle('active', btn.dataset.panel === panelName));

  if (panelName === 'student') {
    renderStudentPanel();
  }
}

document.getElementById('studentForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = new FormData(this);
  const data = Object.fromEntries(form.entries());

  const exists = state.students.some(student => student.id === data.studentId);
  if (exists) {
    showMessage('This student ID already exists. Please choose a different ID.', 'error');
    return;
  }

  state.students.push({
    id: data.studentId,
    name: data.name,
    department: data.department,
    phone: data.phone,
    guardian: data.guardian,
    room: data.room
  });

  const room = state.rooms.find(item => item.number === data.room);
  if (room) room.occupied = true;

  saveState();
  renderAllAdmin();
  populateStudentSelects();
  this.reset();
  showMessage('Student registered successfully.');
});

document.getElementById('allocationForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const studentId = document.getElementById('allocationStudentId').value;
  const roomNumber = document.getElementById('allocationRoomId').value;

  if (!studentId || !roomNumber) {
    showMessage('Please select a student and an available room.', 'error');
    return;
  }

  const student = state.students.find(item => item.id === studentId);
  if (!student) {
    showMessage('Selected student was not found.', 'error');
    return;
  }

  if (student.room) {
    const oldRoom = state.rooms.find(room => room.number === student.room);
    if (oldRoom) oldRoom.occupied = false;
  }

  student.room = roomNumber;

  const newRoom = state.rooms.find(room => room.number === roomNumber);
  if (newRoom) newRoom.occupied = true;

  saveState();
  renderAllAdmin();
  renderStudentPanel();
  showMessage('Room allocation updated successfully.');
});

document.getElementById('feeForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = new FormData(this);
  const data = Object.fromEntries(form.entries());

  state.fees.push({
    studentId: document.getElementById('feeStudentId').value,
    type: data.type,
    amount: Number(data.amount),
    status: data.status
  });

  saveState();
  renderAllAdmin();
  renderStudentPanel();
  this.reset();
  showMessage('Fee information added successfully.');
});

document.getElementById('complaintForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = new FormData(this);
  const data = Object.fromEntries(form.entries());

  state.complaints.push({
    studentId: document.getElementById('complaintStudentId').value,
    type: data.type,
    description: data.description,
    status: data.status
  });

  saveState();
  renderAllAdmin();
  renderStudentPanel();
  this.reset();
  showMessage('Complaint submitted successfully.');
});

document.getElementById('visitorForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = new FormData(this);
  const data = Object.fromEntries(form.entries());

  state.visitors.push({
    name: data.visitorName,
    studentId: document.getElementById('visitorStudentId').value,
    purpose: data.purpose,
    time: data.time
  });

  saveState();
  renderAllAdmin();
  renderStudentPanel();
  this.reset();
  showMessage('Visitor logged successfully.');
});

document.getElementById('studentLoginBtn').addEventListener('click', function () {
  const selectedId = document.getElementById('studentSelect').value;
  if (!selectedId) {
    showMessage('Please select your student ID.', 'error');
    return;
  }

  currentStudentId = selectedId;
  renderStudentPanel();
});

document.getElementById('studentComplaintForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const form = new FormData(this);
  const data = Object.fromEntries(form.entries());

  state.complaints.push({
    studentId: currentStudentId,
    type: data.type,
    description: data.description,
    status: data.status
  });

  saveState();
  renderAllAdmin();
  renderStudentPanel();
  this.reset();
  showMessage('Your complaint has been submitted successfully.');
});

document.querySelectorAll('.panel-toggle').forEach(button => {
  button.addEventListener('click', () => togglePanel(button.dataset.panel));
});

renderAllAdmin();
populateStudentSelects();
renderStudentPanel();
togglePanel('admin');
