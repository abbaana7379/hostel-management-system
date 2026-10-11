const rooms = [
  { id: 'A-101', capacity: 2, occupied: 2, residents: ['A. Khan', 'R. Das'] },
  { id: 'A-102', capacity: 2, occupied: 1, residents: ['M. Ali'] },
  { id: 'A-103', capacity: 2, occupied: 0, residents: [] },
  { id: 'A-104', capacity: 2, occupied: 2, residents: ['P. Singh', 'S. Nair'] },
  { id: 'B-201', capacity: 3, occupied: 2, residents: ['T. Roy', 'D. Shah'] },
  { id: 'B-202', capacity: 3, occupied: 1, residents: ['K. Patel'] },
  { id: 'B-203', capacity: 3, occupied: 0, residents: [] },
  { id: 'B-204', capacity: 3, occupied: 3, residents: ['N. James', 'L. Das', 'A. Ahmed'] },
  { id: 'C-301', capacity: 4, occupied: 2, residents: ['R. Verma', 'S. Rao'] },
  { id: 'C-302', capacity: 2, occupied: 1, residents: ['V. Patel'] },
  { id: 'C-303', capacity: 2, occupied: 0, residents: [] },
  { id: 'C-304', capacity: 2, occupied: 2, residents: ['J. Bose', 'L. Roy'] }
];

const students = [
  { name: 'A. Khan', studentId: 'HMS-101', room: 'A-101', department: 'Computer Science', phone: '+91 98765 12345', guardian: 'A. Khan Sr.', feeStatus: 'Paid' },
  { name: 'R. Das', studentId: 'HMS-102', room: 'A-101', department: 'Electronics', phone: '+91 81234 22222', guardian: 'S. Das', feeStatus: 'Pending' },
  { name: 'M. Ali', studentId: 'HMS-103', room: 'A-102', department: 'Mechanical', phone: '+91 99887 74466', guardian: 'F. Ali', feeStatus: 'Paid' },
  { name: 'T. Roy', studentId: 'HMS-104', room: 'B-201', department: 'Business', phone: '+91 90345 99222', guardian: 'R. Roy', feeStatus: 'Pending' },
  { name: 'P. Singh', studentId: 'HMS-105', room: 'A-104', department: 'Civil', phone: '+91 88222 10101', guardian: 'K. Singh', feeStatus: 'Paid' }
];

const feeRecords = [
  { student: 'A. Khan', month: '2026-10', amount: 6500, status: 'Paid' },
  { student: 'R. Das', month: '2026-10', amount: 6500, status: 'Pending' },
  { student: 'M. Ali', month: '2026-10', amount: 6500, status: 'Paid' },
  { student: 'T. Roy', month: '2026-09', amount: 6500, status: 'Pending' },
  { student: 'P. Singh', month: '2026-10', amount: 6500, status: 'Paid' }
];

const complaints = [
  { student: 'R. Das', type: 'Electrical', details: 'Power fluctuation in room A-101 after 8 PM.', status: 'Open' },
  { student: 'M. Ali', type: 'Plumbing', details: 'Water leakage near bathroom tap.', status: 'In Progress' },
  { student: 'P. Singh', type: 'Cleaning', details: 'Dust accumulation near the window.', status: 'Open' }
];

const visitors = [
  { name: 'Rahul Nair', purpose: 'Parent visit', host: 'M. Ali', time: 'Today, 4:15 PM' },
  { name: 'Shreya Patel', purpose: 'Delivery check', host: 'A. Khan', time: 'Today, 11:35 AM' },
  { name: 'Joseph Thomas', purpose: 'Faculty meeting', host: 'T. Roy', time: 'Yesterday, 6:00 PM' }
];

const roomSelect = document.getElementById('studentRoomSelect');
const feeStudentSelect = document.getElementById('feeStudentSelect');
const complaintStudentSelect = document.getElementById('complaintStudentSelect');
const visitorHostSelect = document.getElementById('visitorHostSelect');

const studentForm = document.getElementById('studentForm');
const feeForm = document.getElementById('feeForm');
const complaintForm = document.getElementById('complaintForm');
const visitorForm = document.getElementById('visitorForm');

function getRoomStatus(room) {
  if (room.occupied >= room.capacity) return 'Full';
  if (room.occupied === 0) return 'Available';
  return 'Partial';
}

function updateSelectOptions() {
  const roomOptions = rooms
    .filter((room) => room.occupied < room.capacity)
    .map((room) => `<option value="${room.id}">${room.id}</option>`)
    .join('');

  roomSelect.innerHTML = `<option value="">Select room</option>${roomOptions}`;

  const studentOptions = students
    .map((student) => `<option value="${student.name}">${student.name} (${student.studentId})</option>`)
    .join('');

  feeStudentSelect.innerHTML = `<option value="">Select student</option>${studentOptions}`;
  complaintStudentSelect.innerHTML = `<option value="">Select student</option>${studentOptions}`;
  visitorHostSelect.innerHTML = `<option value="">Select host</option>${studentOptions}`;
}

function renderStats() {
  const occupiedRooms = rooms.filter((room) => room.occupied > 0).length;
  const dueFees = feeRecords.filter((fee) => fee.status === 'Pending').length;
  const openComplaints = complaints.filter((complaint) => complaint.status !== 'Resolved').length;

  document.getElementById('totalStudents').textContent = students.length;
  document.getElementById('occupiedRooms').textContent = `${occupiedRooms}`;
  document.getElementById('dueFees').textContent = dueFees;
  document.getElementById('openComplaints').textContent = openComplaints;
}

function renderStudents() {
  const tableBody = document.getElementById('studentTableBody');

  tableBody.innerHTML = students
    .map(
      (student) => `
        <tr>
          <td>${student.name}</td>
          <td>${student.studentId}</td>
          <td>${student.room}</td>
          <td>${student.feeStatus}</td>
        </tr>
      `
    )
    .join('');
}

function renderRooms() {
  const roomGrid = document.getElementById('roomGrid');

  roomGrid.innerHTML = rooms
    .map((room) => {
      const status = getRoomStatus(room);
      const statusClass = status.toLowerCase().replace(/\s/g, '-');

      return `
        <div class="room-card">
          <h4>${room.id}</h4>
          <div class="room-meta">
            <span>${room.occupied}/${room.capacity} occupied</span>
            <span class="room-status ${statusClass}">${status}</span>
          </div>
          <div class="room-meta" style="margin-top: 10px;">
            <small>${room.residents.length ? room.residents.join(', ') : 'No residents assigned'}</small>
          </div>
        </div>
      `;
    })
    .join('');
}

function renderFees() {
  const tableBody = document.getElementById('feeTableBody');

  tableBody.innerHTML = feeRecords
    .map(
      (record) => `
        <tr>
          <td>${record.student}</td>
          <td>${record.month}</td>
          <td>₹${record.amount.toLocaleString('en-IN')}</td>
          <td>${record.status}</td>
        </tr>
      `
    )
    .join('');
}

function renderComplaints() {
  const complaintList = document.getElementById('complaintList');

  complaintList.innerHTML = complaints
    .map(
      (complaint) => `
        <li class="list-item">
          <strong>${complaint.type}</strong>
          <div>${complaint.student}</div>
          <small>${complaint.details}</small>
          <div style="margin-top: 6px; color: ${complaint.status === 'Resolved' ? '#1fa76a' : complaint.status === 'In Progress' ? '#b57d00' : '#e76363'}; font-weight: 700;">
            ${complaint.status}
          </div>
        </li>
      `
    )
    .join('');
}

function renderVisitors() {
  const visitorList = document.getElementById('visitorList');

  visitorList.innerHTML = visitors
    .map(
      (visitor) => `
        <li class="list-item">
          <strong>${visitor.name}</strong>
          <div>${visitor.purpose}</div>
          <small>Host: ${visitor.host}</small>
          <div style="margin-top: 6px; color: var(--muted);">${visitor.time}</div>
        </li>
      `
    )
    .join('');
}

function renderReportSummary() {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((room) => room.occupied > 0).length;
  const occupancyRate = ((occupiedRooms / totalRooms) * 100).toFixed(0);
  const paidFeeRatio = ((feeRecords.filter((record) => record.status === 'Paid').length / feeRecords.length) * 100).toFixed(0);
  const resolvedComplaints = complaints.filter((complaint) => complaint.status === 'Resolved').length;

  const reportSummary = document.getElementById('reportSummary');

  reportSummary.innerHTML = `
    <div class="report-box">
      <span>Occupancy</span>
      <strong>${occupancyRate}%</strong>
    </div>
    <div class="report-box">
      <span>Fee Collection</span>
      <strong>${paidFeeRatio}%</strong>
    </div>
    <div class="report-box">
      <span>Resolved Issues</span>
      <strong>${resolvedComplaints}</strong>
    </div>
  `;

  const reportList = document.getElementById('monthlyReportList');
  reportList.innerHTML = `
    <li><strong>Monthly intake:</strong> 18 new residents processed this month.</li>
    <li><strong>Maintenance:</strong> 3 service requests tracked across plumbing and electricity.</li>
    <li><strong>Security:</strong> 29 visitor logs recorded with proper check-in.</li>
  `;
}

function renderDashboard() {
  renderStats();
  renderStudents();
  renderRooms();
  renderFees();
  renderComplaints();
  renderVisitors();
  renderReportSummary();
  updateSelectOptions();
}

studentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(studentForm);
  const newStudent = {
    name: formData.get('name'),
    studentId: formData.get('studentId'),
    room: formData.get('room'),
    department: formData.get('department'),
    phone: formData.get('phone'),
    guardian: formData.get('guardian'),
    feeStatus: formData.get('feeStatus')
  };

  const selectedRoom = rooms.find((room) => room.id === newStudent.room);

  if (!selectedRoom) {
    alert('Please choose a valid room.');
    return;
  }

  if (selectedRoom.occupied >= selectedRoom.capacity) {
    alert('Selected room is already full. Choose another room.');
    return;
  }

  selectedRoom.occupied += 1;
  selectedRoom.residents.push(newStudent.name);

  students.push(newStudent);
  studentForm.reset();
  renderDashboard();
});

feeForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(feeForm);
  const studentSelection = formData.get('student');

  feeRecords.push({
    student: studentSelection,
    month: formData.get('month'),
    amount: Number(formData.get('amount')),
    status: formData.get('status')
  });

  feeForm.reset();
  renderDashboard();
});

complaintForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(complaintForm);
  complaints.push({
    student: formData.get('student'),
    type: formData.get('type'),
    details: formData.get('details'),
    status: 'Open'
  });

  complaintForm.reset();
  renderDashboard();
});

visitorForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const formData = new FormData(visitorForm);
  visitors.unshift({
    name: formData.get('name'),
    purpose: formData.get('purpose'),
    host: formData.get('host'),
    time: 'Today, just now'
  });

  visitorForm.reset();
  renderDashboard();
});

renderDashboard();
