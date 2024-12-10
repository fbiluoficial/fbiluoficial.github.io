// Estado da aplicação
let records = JSON.parse(localStorage.getItem('records')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let editingId = null;

// Elementos DOM
const recordModal = document.getElementById('recordModal');
const noteModal = document.getElementById('noteModal');
const recordForm = document.getElementById('recordForm');
const noteForm = document.getElementById('noteForm');
const tableBody = document.getElementById('tableBody');
const addRecordBtn = document.getElementById('addRecordBtn');
const newNoteBtn = document.getElementById('newNoteBtn');
const closeBtns = document.querySelectorAll('.close');

// Funções de utilidade
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const calculateTotal = (weight, pricePerKg) => {
    return weight * pricePerKg;
};

// Funções de atualização da interface
const updateSummary = () => {
    const totalReceived = records
        .filter(record => record.isPaid)
        .reduce((sum, record) => sum + calculateTotal(record.weight, record.pricePerKg), 0);

    const totalPending = records
        .filter(record => !record.isPaid)
        .reduce((sum, record) => sum + calculateTotal(record.weight, record.pricePerKg), 0);

    document.getElementById('totalReceived').textContent = formatCurrency(totalReceived);
    document.getElementById('totalPending').textContent = formatCurrency(totalPending);
};

const renderTable = () => {
    tableBody.innerHTML = '';
    records.forEach((record, index) => {
        const total = calculateTotal(record.weight, record.pricePerKg);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.weight.toFixed(2)}</td>
            <td>${formatCurrency(record.pricePerKg)}</td>
            <td>${formatCurrency(total)}</td>
            <td>
                <input type="checkbox" ${record.isPaid ? 'checked' : ''} 
                onchange="togglePayment(${index})">
            </td>
            <td class="action-buttons">
                <button class="edit-button" onclick="editRecord(${index})">Editar</button>
                <button class="delete-button" onclick="deleteRecord(${index})">Excluir</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    updateSummary();
    saveToLocalStorage();
};

// Funções de manipulação de dados
const saveToLocalStorage = () => {
    localStorage.setItem('records', JSON.stringify(records));
    localStorage.setItem('notes', JSON.stringify(notes));
};

const addRecord = (record) => {
    records.push(record);
    renderTable();
};

const updateRecord = (index, record) => {
    records[index] = record;
    renderTable();
};

const addNote = (note) => {
    notes.push({
        text: note,
        date: new Date().toISOString()
    });
    saveToLocalStorage();
};

// Event handlers
window.togglePayment = (index) => {
    records[index].isPaid = !records[index].isPaid;
    renderTable();
};

window.editRecord = (index) => {
    editingId = index;
    const record = records[index];
    document.getElementById('weight').value = record.weight;
    document.getElementById('pricePerKg').value = record.pricePerKg;
    document.getElementById('isPaid').checked = record.isPaid;
    document.getElementById('modalTitle').textContent = 'Editar Registro';
    recordModal.style.display = 'block';
};

window.deleteRecord = (index) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        records.splice(index, 1);
        renderTable();
    }
};

// Event Listeners
addRecordBtn.addEventListener('click', () => {
    editingId = null;
    recordForm.reset();
    document.getElementById('modalTitle').textContent = 'Adicionar Registro';
    recordModal.style.display = 'block';
});

newNoteBtn.addEventListener('click', () => {
    noteForm.reset();
    noteModal.style.display = 'block';
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        recordModal.style.display = 'none';
        noteModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === recordModal) {
        recordModal.style.display = 'none';
    }
    if (event.target === noteModal) {
        noteModal.style.display = 'none';
    }
});

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        weight: parseFloat(document.getElementById('weight').value),
        pricePerKg: parseFloat(document.getElementById('pricePerKg').value),
        isPaid: document.getElementById('isPaid').checked
    };

    if (editingId !== null) {
        updateRecord(editingId, formData);
    } else {
        addRecord(formData);
    }

    recordModal.style.display = 'none';
});

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteText = document.getElementById('noteText').value;
    addNote(noteText);
    noteModal.style.display = 'none';
    alert('Anotação salva com sucesso!');
});

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☀️' : '🌙';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
});

// Inicialização
renderTable();
