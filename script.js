// Estado da aplicação
let records = JSON.parse(localStorage.getItem('records')) || [];
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let categories = JSON.parse(localStorage.getItem('categories')) || [];
let editingId = null;
let editingCategoryId = null;
let currentCategoryFilter = '';

// Elementos DOM
const recordModal = document.getElementById('recordModal');
const noteModal = document.getElementById('noteModal');
const categoryModal = document.getElementById('categoryModal');
const recordForm = document.getElementById('recordForm');
const noteForm = document.getElementById('noteForm');
const categoryForm = document.getElementById('categoryForm');
const tableBody = document.getElementById('tableBody');
const addRecordBtn = document.getElementById('addRecordBtn');
const newNoteBtn = document.getElementById('newNoteBtn');
const addCategoryBtn = document.getElementById('addCategoryBtn');
const categorySelect = document.getElementById('categorySelect');
const recordCategory = document.getElementById('recordCategory');
const categoryContextMenu = document.getElementById('categoryContextMenu');
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

const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Sem Categoria';
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Sem Categoria';
};

// Funções de atualização da interface
const updateSummary = () => {
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
};

const renderTable = () => {
    tableBody.innerHTML = '';
    const filteredRecords = currentCategoryFilter 
        ? records.filter(record => record.categoryId === parseInt(currentCategoryFilter))
        : records;

    filteredRecords.forEach((record, index) => {
        const total = calculateTotal(record.weight, record.pricePerKg);
        const row = document.createElement('tr');
        if (record.isPaid) {
            row.classList.add('checked-row');
        }
        row.innerHTML = `
            <td>
                <div class="checkbox-container">
                    ${record.isPaid ? '<i class="material-icons">check_circle</i>' : ''}
                    <input type="checkbox" ${record.isPaid ? 'checked' : ''} 
                    onchange="togglePayment(${index})">
                </div>
            </td>
            <td>${record.weight.toFixed(2)}</td>
            <td>${formatCurrency(record.pricePerKg)}</td>
            <td>${formatCurrency(total)}</td>
            <td>${record.userName || ''}</td>
            <td>${getCategoryName(record.categoryId)}</td>
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

// Funções de gerenciamento de dados
const saveToLocalStorage = () => {
    localStorage.setItem('records', JSON.stringify(records));
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('categories', JSON.stringify(categories));
};

const updateCategorySelects = () => {
    // Atualiza o select de filtro
    categorySelect.innerHTML = '<option value="">Todas as Categorias</option>';
    // Atualiza o select do formulário
    recordCategory.innerHTML = '<option value="">Selecione uma categoria</option>';
    
    categories.forEach(category => {
        // Adiciona ao select de filtro
        const filterOption = document.createElement('option');
        filterOption.value = category.id;
        filterOption.textContent = category.name;
        categorySelect.appendChild(filterOption);
        
        // Adiciona ao select do formulário
        const formOption = document.createElement('option');
        formOption.value = category.id;
        formOption.textContent = category.name;
        recordCategory.appendChild(formOption);
    });
};

const addCategory = (categoryName) => {
    const newCategory = {
        id: Date.now(),
        name: categoryName
    };
    categories.push(newCategory);
    saveToLocalStorage();
    updateCategorySelects();
};

const updateCategory = (id, newName) => {
    const category = categories.find(cat => cat.id === parseInt(id));
    if (category) {
        category.name = newName;
        saveToLocalStorage();
        updateCategorySelects();
        renderTable();
    }
};

const deleteCategory = (id) => {
    const index = categories.findIndex(cat => cat.id === parseInt(id));
    if (index !== -1) {
        if (confirm('Tem certeza que deseja excluir esta categoria? Os registros associados serão mantidos, mas ficarão sem categoria.')) {
            // Atualiza os registros que usavam esta categoria
            records.forEach(record => {
                if (record.categoryId === parseInt(id)) {
                    record.categoryId = null;
                }
            });
            
            categories.splice(index, 1);
            saveToLocalStorage();
            updateCategorySelects();
            renderTable();
        }
    }
};

// Event Listeners
categorySelect.addEventListener('change', (e) => {
    currentCategoryFilter = e.target.value;
    renderTable();
});

addCategoryBtn.addEventListener('click', () => {
    editingCategoryId = null;
    categoryForm.reset();
    document.getElementById('categoryModalTitle').textContent = 'Nova Categoria';
    categoryModal.style.display = 'block';
});

window.editRecord = (index) => {
    editingId = index;
    const record = records[index];
    document.getElementById('weight').value = record.weight;
    document.getElementById('pricePerKg').value = record.pricePerKg;
    document.getElementById('isPaid').checked = record.isPaid;
    document.getElementById('userName').value = record.userName || '';
    document.getElementById('recordCategory').value = record.categoryId || '';
    document.getElementById('modalTitle').textContent = 'Editar Registro';
    recordModal.style.display = 'block';
};

recordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = {
        weight: parseFloat(document.getElementById('weight').value),
        pricePerKg: parseFloat(document.getElementById('pricePerKg').value),
        isPaid: document.getElementById('isPaid').checked,
        userName: document.getElementById('userName').value.trim(),
        categoryId: document.getElementById('recordCategory').value ? parseInt(document.getElementById('recordCategory').value) : null
    };

    if (editingId !== null) {
        records[editingId] = formData;
    } else {
        records.push(formData);
    }

    recordModal.style.display = 'none';
    renderTable();
});

// Inicialização
updateCategorySelects();
renderTable();

window.togglePayment = (index) => {
    records[index].isPaid = !records[index].isPaid;
    renderTable();
};

window.deleteRecord = (index) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        records.splice(index, 1);
        renderTable();
    }
};

addRecordBtn.addEventListener('click', () => {
    editingId = null;
    recordForm.reset();
    categorySelect.value = '';
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
        categoryModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === recordModal) {
        recordModal.style.display = 'none';
    }
    if (event.target === noteModal) {
        noteModal.style.display = 'none';
    }
    if (event.target === categoryModal) {
        categoryModal.style.display = 'none';
    }
});

noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const noteText = document.getElementById('noteText').value;
    addNote(noteText);
    noteModal.style.display = 'none';
    alert('Anotação salva com sucesso!');
});

const addNote = (note) => {
    notes.push({
        text: note,
        date: new Date().toISOString()
    });
    saveToLocalStorage();
};

categoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const categoryName = document.getElementById('categoryName').value.trim();
    
    if (editingCategoryId !== null) {
        updateCategory(editingCategoryId, categoryName);
    } else {
        addCategory(categoryName);
    }
    
    categoryModal.style.display = 'none';
});

categorySelect.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'OPTION' && e.target.value !== '') {
        e.preventDefault();
        const rect = e.target.getBoundingClientRect();
        categoryContextMenu.style.display = 'block';
        categoryContextMenu.style.left = e.clientX + 'px';
        categoryContextMenu.style.top = e.clientY + 'px';
        editingCategoryId = parseInt(e.target.value);
    }
});

document.getElementById('editCategory').addEventListener('click', () => {
    const category = categories.find(cat => cat.id === editingCategoryId);
    if (category) {
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryModalTitle').textContent = 'Editar Categoria';
        categoryModal.style.display = 'block';
        categoryContextMenu.style.display = 'none';
    }
});

document.getElementById('deleteCategory').addEventListener('click', () => {
    deleteCategory(editingCategoryId);
    categoryContextMenu.style.display = 'none';
});

document.addEventListener('click', (e) => {
    if (!categoryContextMenu.contains(e.target)) {
        categoryContextMenu.style.display = 'none';
    }
});

// Função para fechar modal
window.closeModal = (modalId) => {
    document.getElementById(modalId).style.display = 'none';
};

// Theme toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.querySelector('.theme-toggle-icon').textContent = isDark ? '☀️' : '🌙';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
});
