// Mock employee data
const mockEmployees = [{
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        department: 'Engineering',
        role: 'Developer'
    },
    {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        department: 'Marketing',
        role: 'Manager'
    },
    {
        id: 3,
        firstName: 'Robert',
        lastName: 'Johnson',
        email: 'robert.j@example.com',
        department: 'HR',
        role: 'Coordinator'
    },
    {
        id: 4,
        firstName: 'Emily',
        lastName: 'Williams',
        email: 'emily.w@example.com',
        department: 'Finance',
        role: 'Analyst'
    },
    {
        id: 5,
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.b@example.com',
        department: 'Operations',
        role: 'Manager'
    },
    {
        id: 6,
        firstName: 'Sarah',
        lastName: 'Davis',
        email: 'sarah.d@example.com',
        department: 'Engineering',
        role: 'Designer'
    },
    {
        id: 7,
        firstName: 'David',
        lastName: 'Miller',
        email: 'david.m@example.com',
        department: 'Marketing',
        role: 'Analyst'
    },
    {
        id: 8,
        firstName: 'Lisa',
        lastName: 'Wilson',
        email: 'lisa.w@example.com',
        department: 'HR',
        role: 'Manager'
    },
    {
        id: 9,
        firstName: 'James',
        lastName: 'Moore',
        email: 'james.m@example.com',
        department: 'Finance',
        role: 'Coordinator'
    },
    {
        id: 10,
        firstName: 'Jennifer',
        lastName: 'Taylor',
        email: 'jennifer.t@example.com',
        department: 'Operations',
        role: 'Developer'
    },
    {
        id: 11,
        firstName: 'Thomas',
        lastName: 'Anderson',
        email: 'thomas.a@example.com',
        department: 'Engineering',
        role: 'Developer'
    },
    {
        id: 12,
        firstName: 'Patricia',
        lastName: 'Thomas',
        email: 'patricia.t@example.com',
        department: 'Marketing',
        role: 'Designer'
    }
];

// DOM Elements
const employeeGrid = document.getElementById('employee-grid');
const searchInput = document.getElementById('search-input');
const filterBtn = document.getElementById('filter-btn');
const filterDropdown = document.getElementById('filter-dropdown');
const resetFilterBtn = document.getElementById('reset-filter');
const applyFilterBtn = document.getElementById('apply-filter');
const sortBtn = document.getElementById('sort-btn');
const sortOptions = document.getElementById('sort-options');
const addEmployeeBtn = document.getElementById('add-employee-btn');
const formOverlay = document.getElementById('form-overlay');
const closeFormBtn = document.getElementById('close-form');
const formTitle = document.getElementById('form-title');
const employeeForm = document.getElementById('employee-form');
const cancelFormBtn = document.getElementById('cancel-form');
const pagination = document.getElementById('pagination');

// Filter elements
const filterFirstName = document.getElementById('filter-first-name');
const filterDepartment = document.getElementById('filter-department');
const filterRole = document.getElementById('filter-role');

// Form elements
const employeeIdInput = document.getElementById('employee-id');
const firstNameInput = document.getElementById('first-name');
const lastNameInput = document.getElementById('last-name');
const emailInput = document.getElementById('email');
const departmentInput = document.getElementById('department');
const roleInput = document.getElementById('role');

// Error elements
const firstNameGroup = document.getElementById('first-name-group');
const lastNameGroup = document.getElementById('last-name-group');
const emailGroup = document.getElementById('email-group');
const departmentGroup = document.getElementById('department-group');
const roleGroup = document.getElementById('role-group');

// App State
let employees = [...mockEmployees];
let filteredEmployees = [...mockEmployees];
let currentPage = 1;
let itemsPerPage = 10;
let currentSort = '';
let currentFilters = {
    firstName: '',
    department: '',
    role: ''
};

// Initialize the app
function init() {
    renderEmployees();
    setupEventListeners();
    renderPagination();
}

// Set up event listeners
function setupEventListeners() {
    // Search
    searchInput.addEventListener('input', handleSearch);

    // Filter
    filterBtn.addEventListener('click', toggleFilterDropdown);
    resetFilterBtn.addEventListener('click', resetFilters);
    applyFilterBtn.addEventListener('click', applyFilters);

    // Sort
    sortBtn.addEventListener('click', toggleSortOptions);
    document.querySelectorAll('.sort-option').forEach(option => {
        option.addEventListener('click', handleSort);
    });

    // Add employee
    addEmployeeBtn.addEventListener('click', openAddEmployeeForm);

    // Form
    closeFormBtn.addEventListener('click', closeForm);
    cancelFormBtn.addEventListener('click', closeForm);
    employeeForm.addEventListener('submit', handleFormSubmit);

    // Click outside to close dropdowns
    document.addEventListener('click', (e) => {
        if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
            filterDropdown.classList.remove('show');
        }

        if (!sortBtn.contains(e.target) && !sortOptions.contains(e.target)) {
            sortOptions.classList.remove('show');
        }
    });
}

// Render employees based on current filters, sort, and pagination
function renderEmployees() {
    employeeGrid.innerHTML = '';

    if (filteredEmployees.length === 0) {
        employeeGrid.innerHTML = `
            <div class="empty-state">
                <h3>No employees found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    // Calculate pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredEmployees.length);
    const employeesToDisplay = filteredEmployees.slice(startIndex, endIndex);

    employeesToDisplay.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'employee-card';
        employeeCard.innerHTML = `
            <h3 class="employee-name">${employee.firstName} ${employee.lastName}</h3>
            <div class="employee-id">ID: ${employee.id}</div>
            <div class="employee-detail"><strong>Email:</strong> ${employee.email}</div>
            <div class="employee-detail"><strong>Department:</strong> ${employee.department}</div>
            <div class="employee-detail"><strong>Role:</strong> ${employee.role}</div>
            <div class="employee-actions">
                <button class="edit-btn" data-id="${employee.id}">Edit</button>
                <button class="delete-btn" data-id="${employee.id}">Delete</button>
            </div>
        `;
        employeeGrid.appendChild(employeeCard);
    });

    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditEmployeeForm(btn.dataset.id));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteEmployee(btn.dataset.id));
    });
}

// Render pagination controls
function renderPagination() {
    pagination.innerHTML = '';

    const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

    if (totalPages <= 1) return;

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = `page-btn ${currentPage === 1 ? 'disabled' : ''}`;
    prevBtn.textContent = 'Previous';
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderEmployees();
            renderPagination();
        }
    });
    pagination.appendChild(prevBtn);

    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        const firstPageBtn = document.createElement('button');
        firstPageBtn.className = `page-btn ${currentPage === 1 ? 'active' : ''}`;
        firstPageBtn.textContent = '1';
        firstPageBtn.addEventListener('click', () => {
            currentPage = 1;
            renderEmployees();
            renderPagination();
        });
        pagination.appendChild(firstPageBtn);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderEmployees();
            renderPagination();
        });
        pagination.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }

        const lastPageBtn = document.createElement('button');
        lastPageBtn.className = `page-btn ${currentPage === totalPages ? 'active' : ''}`;
        lastPageBtn.textContent = totalPages;
        lastPageBtn.addEventListener('click', () => {
            currentPage = totalPages;
            renderEmployees();
            renderPagination();
        });
        pagination.appendChild(lastPageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = `page-btn ${currentPage === totalPages ? 'disabled' : ''}`;
    nextBtn.textContent = 'Next';
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderEmployees();
            renderPagination();
        }
    });
    pagination.appendChild(nextBtn);

    // Items per page selector
    const itemsPerPageContainer = document.createElement('div');
    itemsPerPageContainer.className = 'items-per-page';
    itemsPerPageContainer.innerHTML = `
        <span>Items per page:</span>
        <select class="pagination-select" id="items-per-page">
            <option value="10" ${itemsPerPage === 10 ? 'selected' : ''}>10</option>
            <option value="25" ${itemsPerPage === 25 ? 'selected' : ''}>25</option>
            <option value="50" ${itemsPerPage === 50 ? 'selected' : ''}>50</option>
            <option value="100" ${itemsPerPage === 100 ? 'selected' : ''}>100</option>
        </select>
    `;
    pagination.appendChild(itemsPerPageContainer);

    document.getElementById('items-per-page').addEventListener('change', (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderEmployees();
        renderPagination();
    });
}

// Search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();

    if (searchTerm === '') {
        applyCurrentFilters();
        return;
    }

    filteredEmployees = employees.filter(employee => {
        return (
            employee.firstName.toLowerCase().includes(searchTerm) ||
            employee.lastName.toLowerCase().includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm)
        );
    });

    currentPage = 1;
    renderEmployees();
    renderPagination();
}

// Filter functionality
function toggleFilterDropdown() {
    filterDropdown.classList.toggle('show');
}

function resetFilters() {
    filterFirstName.value = '';
    filterDepartment.value = '';
    filterRole.value = '';

    currentFilters = {
        firstName: '',
        department: '',
        role: ''
    };

    applyCurrentFilters();
    filterDropdown.classList.remove('show');
}

function applyFilters() {
    currentFilters = {
        firstName: filterFirstName.value.toLowerCase(),
        department: filterDepartment.value,
        role: filterRole.value
    };

    applyCurrentFilters();
    filterDropdown.classList.remove('show');
}

function applyCurrentFilters() {
    filteredEmployees = employees.filter(employee => {
        const firstNameMatch = !currentFilters.firstName ||
            employee.firstName.toLowerCase().includes(currentFilters.firstName);
        const departmentMatch = !currentFilters.department ||
            employee.department === currentFilters.department;
        const roleMatch = !currentFilters.role ||
            employee.role === currentFilters.role;

        return firstNameMatch && departmentMatch && roleMatch;
    });

    // Apply current sort if any
    if (currentSort) {
        applySort(currentSort);
    } else {
        currentPage = 1;
        renderEmployees();
        renderPagination();
    }
}

// Sort functionality
function toggleSortOptions() {
    sortOptions.classList.toggle('show');
}

function handleSort(e) {
    const sortOption = e.target.dataset.sort;
    applySort(sortOption);
    sortOptions.classList.remove('show');
}

function applySort(sortOption) {
    currentSort = sortOption;

    const [field, direction] = sortOption.split('-');

    filteredEmployees.sort((a, b) => {
        let comparison = 0;

        if (field === 'firstName') {
            comparison = a.firstName.localeCompare(b.firstName);
        } else if (field === 'department') {
            comparison = a.department.localeCompare(b.department);
        }

        return direction === 'desc' ? -comparison : comparison;
    });

    currentPage = 1;
    renderEmployees();
    renderPagination();
}

// Employee form functionality
function openAddEmployeeForm() {
    formTitle.textContent = 'Add Employee';
    employeeIdInput.value = '';
    employeeForm.reset();
    resetFormErrors();
    formOverlay.classList.add('show');
}

function openEditEmployeeForm(id) {
    const employee = employees.find(emp => emp.id === parseInt(id));

    if (employee) {
        formTitle.textContent = 'Edit Employee';
        employeeIdInput.value = employee.id;
        firstNameInput.value = employee.firstName;
        lastNameInput.value = employee.lastName;
        emailInput.value = employee.email;
        departmentInput.value = employee.department;
        roleInput.value = employee.role;

        resetFormErrors();
        formOverlay.classList.add('show');
    }
}

function closeForm() {
    formOverlay.classList.remove('show');
}

function resetFormErrors() {
    firstNameGroup.classList.remove('invalid');
    lastNameGroup.classList.remove('invalid');
    emailGroup.classList.remove('invalid');
    departmentGroup.classList.remove('invalid');
    roleGroup.classList.remove('invalid');
}

function validateForm() {
    let isValid = true;

    // First name validation
    if (!firstNameInput.value.trim()) {
        firstNameGroup.classList.add('invalid');
        isValid = false;
    } else {
        firstNameGroup.classList.remove('invalid');
    }

    // Last name validation
    if (!lastNameInput.value.trim()) {
        lastNameGroup.classList.add('invalid');
        isValid = false;
    } else {
        lastNameGroup.classList.remove('invalid');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
        emailGroup.classList.add('invalid');
        isValid = false;
    } else {
        emailGroup.classList.remove('invalid');
    }

    // Department validation
    if (!departmentInput.value) {
        departmentGroup.classList.add('invalid');
        isValid = false;
    } else {
        departmentGroup.classList.remove('invalid');
    }

    // Role validation
    if (!roleInput.value) {
        roleGroup.classList.add('invalid');
        isValid = false;
    } else {
        roleGroup.classList.remove('invalid');
    }

    return isValid;
}

function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    const employeeData = {
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        department: departmentInput.value,
        role: roleInput.value
    };

    if (employeeIdInput.value) {
        // Edit existing employee
        const id = parseInt(employeeIdInput.value);
        const index = employees.findIndex(emp => emp.id === id);

        if (index !== -1) {
            employees[index] = {
                ...employees[index],
                ...employeeData
            };
        }
    } else {
        // Add new employee
        const newId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1;
        employees.push({
            id: newId,
            ...employeeData
        });
    }

    // Reapply current filters and sort
    applyCurrentFilters();
    closeForm();
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== parseInt(id));
        applyCurrentFilters();
    }
}

// Initialize the app
init();
