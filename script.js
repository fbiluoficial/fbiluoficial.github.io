// Estado da aplicação
let records = JSON.parse(localStorage.getItem('records')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let editingId = null;
let editingCategoryId = null;
let currentCategoryFilter = '';

// Sistema de histórico
const maxHistorySteps = 3;
let history = [];
let currentHistoryIndex = -1;

// Funções de formatação
const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

const calculateTotal = (weight, pricePerKg) => {
    return weight * pricePerKg;
};

// Funções de histórico
function saveHistoryState(action) {
    const state = {
        records: JSON.parse(JSON.stringify(records)),
        categories: JSON.parse(JSON.stringify(categories)),
        action: action
    };
    
    if (currentHistoryIndex < history.length - 1) {
        history = history.slice(0, currentHistoryIndex + 1);
    }
    
    history.push(state);
    if (history.length > maxHistorySteps) {
        history.shift();
    }
    currentHistoryIndex = history.length - 1;
    updateHistoryButtons();
}

function undo() {
    if (currentHistoryIndex > 0) {
        currentHistoryIndex--;
        const state = history[currentHistoryIndex];
        records = JSON.parse(JSON.stringify(state.records));
        categories = JSON.parse(JSON.stringify(state.categories));
        saveToLocalStorage();
        renderTable();
        updateCategorySelects();
        updateHistoryButtons();
    }
}

function redo() {
    if (currentHistoryIndex < history.length - 1) {
        currentHistoryIndex++;
        const state = history[currentHistoryIndex];
        records = JSON.parse(JSON.stringify(state.records));
        categories = JSON.parse(JSON.stringify(state.categories));
        saveToLocalStorage();
        renderTable();
        updateCategorySelects();
        updateHistoryButtons();
    }
}

// Funções de UI
function updateSummary() {
    const filteredRecords = currentCategoryFilter 
        ? records.filter(record => record.categoryId === parseInt(currentCategoryFilter))
        : records;

    const totalReceived = filteredRecords
        .filter(record => record.isPaid)
        .reduce((sum, record) => sum + calculateTotal(record.weight, record.pricePerKg), 0);

    const totalPending = filteredRecords
        .filter(record => !record.isPaid)
        .reduce((sum, record) => sum + calculateTotal(record.weight, record.pricePerKg), 0);

    document.getElementById('totalReceived').textContent = formatCurrency(totalReceived);
    document.getElementById('totalPending').textContent = formatCurrency(totalPending);
}

function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    const filteredRecords = currentCategoryFilter 
        ? records.filter(record => record.categoryId === parseInt(currentCategoryFilter))
        : records;

    filteredRecords.forEach((record, index) => {
        const total = calculateTotal(record.weight, record.pricePerKg);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <button onclick="togglePayment(${index})" class="status-button ${record.isPaid ? 'paid' : 'pending'}">
                    ${record.isPaid ? 'Pago' : 'Pendente'}
                </button>
            </td>
            <td>${record.weight} kg</td>
            <td>${formatCurrency(record.pricePerKg)}</td>
            <td>${formatCurrency(total)}</td>
            <td>${record.userName || '-'}</td>
            <td>${getCategoryName(record.categoryId)}</td>
            <td>
                <button onclick="editRecord(${index})" class="action-button edit">
                    <span class="material-icons">edit</span>
                </button>
                <button onclick="deleteRecord(${index})" class="action-button delete">
                    <span class="material-icons">delete</span>
                </button>
            </td>
        `;
        tableBody.appendChild(tr);
    });

    updateSummary();
}

function updateCategorySelects() {
    const customSelect = document.getElementById('customCategorySelect');
    const optionsContainer = customSelect.querySelector('.options-container');
    const selectedOption = customSelect.querySelector('.selected-option');
    const recordCategory = document.getElementById('recordCategory');

    // Atualizar select personalizado
    optionsContainer.innerHTML = '<div class="option" data-value="">Todas as Categorias</div>';
    categories.forEach(category => {
        const option = document.createElement('div');
        option.className = 'option';
        option.dataset.value = category.id;
        option.innerHTML = `
            ${category.name}
            <span class="material-icons delete-icon">close</span>
        `;
        
        option.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-icon')) {
                currentCategoryFilter = category.id;
                selectedOption.textContent = category.name;
                customSelect.classList.remove('open');
                renderTable();
            }
        });

        const deleteIcon = option.querySelector('.delete-icon');
        deleteIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
                deleteCategory(category.id);
            }
        });

        optionsContainer.appendChild(option);
    });

    // Atualizar select do formulário
    recordCategory.innerHTML = '<option value="">Selecione uma categoria</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        recordCategory.appendChild(option);
    });
}

// Funções de gerenciamento de dados
function saveToLocalStorage() {
    localStorage.setItem('records', JSON.stringify(records));
    localStorage.setItem('categories', JSON.stringify(categories));
}

function getCategoryName(categoryId) {
    if (!categoryId) return 'Sem Categoria';
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Sem Categoria';
}

// Funções CRUD
function addCategory(categoryName) {
    saveHistoryState('Adição de categoria');
    const newCategory = {
        id: Date.now(),
        name: categoryName
    };
    categories.push(newCategory);
    saveToLocalStorage();
    updateCategorySelects();
}

function deleteCategory(id) {
    saveHistoryState('Exclusão de categoria');
    categories = categories.filter(cat => cat.id !== parseInt(id));
    records = records.map(record => {
        if (record.categoryId === parseInt(id)) {
            return { ...record, categoryId: null };
        }
        return record;
    });
    
    if (currentCategoryFilter === id) {
        currentCategoryFilter = '';
        document.querySelector('.selected-option').textContent = 'Todas as Categorias';
    }
    
    saveToLocalStorage();
    updateCategorySelects();
    renderTable();
}

function togglePayment(index) {
    saveHistoryState('Alteração de pagamento');
    records[index].isPaid = !records[index].isPaid;
    saveToLocalStorage();
    renderTable();
}

function editRecord(index) {
    editingId = index;
    const record = records[index];
    
    document.getElementById('weight').value = record.weight;
    document.getElementById('pricePerKg').value = record.pricePerKg;
    document.getElementById('userName').value = record.userName || '';
    document.getElementById('recordCategory').value = record.categoryId || '';
    document.getElementById('isPaid').checked = record.isPaid;
    
    document.getElementById('modalTitle').textContent = 'Editar Registro';
    document.getElementById('recordModal').style.display = 'block';
}

function deleteRecord(index) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        saveHistoryState('Exclusão de registro');
        records.splice(index, 1);
        saveToLocalStorage();
        renderTable();
    }
}

// Event Listeners
document.getElementById('addRecordBtn').addEventListener('click', () => {
    editingId = null;
    document.getElementById('recordForm').reset();
    document.getElementById('modalTitle').textContent = 'Novo Registro';
    document.getElementById('recordModal').style.display = 'block';
});

document.getElementById('recordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        weight: parseFloat(document.getElementById('weight').value),
        pricePerKg: parseFloat(document.getElementById('pricePerKg').value),
        userName: document.getElementById('userName').value.trim(),
        categoryId: document.getElementById('recordCategory').value ? parseInt(document.getElementById('recordCategory').value) : null,
        isPaid: document.getElementById('isPaid').checked
    };
    
    if (editingId !== null) {
        saveHistoryState('Edição de registro');
        records[editingId] = { ...records[editingId], ...formData };
        editingId = null;
    } else {
        saveHistoryState('Novo registro');
        records.push({ 
            id: Date.now(),
            ...formData 
        });
    }
    
    saveToLocalStorage();
    renderTable();
    closeModal('recordModal');
    document.getElementById('recordForm').reset();
});

document.getElementById('categoryForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const categoryName = document.getElementById('categoryName').value.trim();
    
    if (categoryName) {
        if (editingCategoryId !== null) {
            saveHistoryState('Edição de categoria');
            const category = categories.find(cat => cat.id === editingCategoryId);
            if (category) {
                category.name = categoryName;
            }
            editingCategoryId = null;
        } else {
            addCategory(categoryName);
        }
        
        saveToLocalStorage();
        updateCategorySelects();
        closeModal('categoryModal');
        e.target.reset();
    }
});

document.getElementById('addCategoryBtn').addEventListener('click', () => {
    document.getElementById('categoryModalTitle').textContent = 'Nova Categoria';
    document.getElementById('categoryModal').style.display = 'block';
    editingCategoryId = null;
});

document.getElementById('customCategorySelect').addEventListener('click', (e) => {
    if (e.target.closest('.selected-option')) {
        document.getElementById('customCategorySelect').classList.toggle('open');
    }
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('#customCategorySelect')) {
        document.getElementById('customCategorySelect').classList.remove('open');
    }
});

// Botões de histórico
document.getElementById('undoBtn').addEventListener('click', undo);
document.getElementById('redoBtn').addEventListener('click', redo);

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
    } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'Z')) {
        e.preventDefault();
        redo();
    }
});

function updateHistoryButtons() {
    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    
    if (undoBtn && redoBtn) {
        undoBtn.disabled = currentHistoryIndex <= 0;
        redoBtn.disabled = currentHistoryIndex >= history.length - 1;
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Fechar modais quando clicar no X ou fora do modal
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        closeBtn.closest('.modal').style.display = 'none';
    });
});

window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeToggle').querySelector('.theme-toggle-icon').textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Inicialização
updateCategorySelects();
renderTable();
updateHistoryButtons();

// Restaurar tema
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').querySelector('.theme-toggle-icon').textContent = '☀️';
}
