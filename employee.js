// Employee Data Management

// Get all employees from localStorage
function getEmployees() {
    const employees = localStorage.getItem('employees');
    return employees ? JSON.parse(employees) : [];
}

// Save employees to localStorage
function saveEmployees(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}

// Add new employee
function addEmployee(employeeData) {
    const employees = getEmployees();
    const newEmployee = {
        id: Date.now().toString(),
        ...employeeData,
        createdAt: new Date().toISOString()
    };
    employees.push(newEmployee);
    saveEmployees(employees);
    return newEmployee;
}

// Update employee
function updateEmployee(id, updatedData) {
    const employees = getEmployees();
    const index = employees.findIndex(emp => emp.id === id);
    if (index !== -1) {
        employees[index] = { 
            ...employees[index], 
            ...updatedData,
            updatedAt: new Date().toISOString()
        };
        saveEmployees(employees);
        return true;
    }
    return false;
}

// Delete employee
function deleteEmployee(id) {
    const employees = getEmployees();
    const filtered = employees.filter(emp => emp.id !== id);
    saveEmployees(filtered);
    return true;
}

// Get employee by ID
function getEmployeeById(id) {
    const employees = getEmployees();
    return employees.find(emp => emp.id === id);
}

// Search employees
function searchEmployees(searchTerm) {
    const employees = getEmployees();
    if (!searchTerm) return employees;
    
    const term = searchTerm.toLowerCase();
    return employees.filter(emp => 
        emp.name.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term)
    );
}

// Filter employees
function filterEmployees(department, status) {
    let employees = getEmployees();
    
    if (department) {
        employees = employees.filter(emp => emp.department === department);
    }
    
    if (status) {
        employees = employees.filter(emp => emp.status === status);
    }
    
    return employees;
}

// Display employees in table
function displayEmployees(employees) {
    const tbody = document.getElementById('employeeTableBody');
    if (!tbody) return;
    
    // If no employees provided, get all
    if (!employees) {
        employees = getEmployees();
    }
    
    if (employees.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #999;">
                    <div style="font-size: 3rem; margin-bottom: 10px;">📭</div>
                    <p>No employees found. Add your first employee!</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = employees.map(emp => `
        <tr>
            <td><code>#${emp.id.slice(-6)}</code></td>
            <td><strong>${emp.name}</strong></td>
            <td>${emp.email}</td>
            <td><span class="department-badge">${emp.department}</span></td>
            <td>${emp.position}</td>
            <td>$${parseFloat(emp.salary).toLocaleString()}</td>
            <td><span class="status-badge ${emp.status.toLowerCase().replace(' ', '')}">${emp.status}</span></td>
            <td>
                <button class="btn btn-secondary btn-sm" onclick="editEmployee('${emp.id}')">✏️</button>
                <button class="btn btn-danger btn-sm" onclick="deleteEmployeeHandler('${emp.id}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// Edit employee
function editEmployee(id) {
    const employee = getEmployeeById(id);
    if (!employee) {
        alert('Employee not found!');
        return;
    }
    
    document.getElementById('modalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeId').value = employee.id;
    document.getElementById('name').value = employee.name;
    document.getElementById('email').value = employee.email;
    document.getElementById('department').value = employee.department;
    document.getElementById('position').value = employee.position;
    document.getElementById('salary').value = employee.salary;
    document.getElementById('status').value = employee.status;
    
    document.getElementById('employeeModal').style.display = 'block';
}

// Delete employee handler
function deleteEmployeeHandler(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        deleteEmployee(id);
        displayEmployees();
        updateDashboardStats();
        alert('Employee deleted successfully!');
    }
}

// Handle add employee button
document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.getElementById('addEmployeeBtn');
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            document.getElementById('modalTitle').textContent = 'Add New Employee';
            document.getElementById('employeeForm').reset();
            document.getElementById('employeeId').value = '';
            document.getElementById('employeeModal').style.display = 'block';
        });
    }
    
    // Close modal
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('employeeModal').style.display = 'none';
        });
    }
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('employeeModal');
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    const employeeForm = document.getElementById('employeeForm');
    if (employeeForm) {
        employeeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const id = document.getElementById('employeeId').value;
            const employeeData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                department: document.getElementById('department').value,
                position: document.getElementById('position').value.trim(),
                salary: parseFloat(document.getElementById('salary').value),
                status: document.getElementById('status').value
            };
            
            // Validation
            if (!employeeData.name || !employeeData.email || !employeeData.department || 
                !employeeData.position || !employeeData.salary) {
                alert('Please fill in all fields!');
                return;
            }
            
            if (isNaN(employeeData.salary) || employeeData.salary <= 0) {
                alert('Please enter a valid salary amount!');
                return;
            }
            
            let success = false;
            let message = '';
            
            if (id) {
                // Update existing employee
                success = updateEmployee(id, employeeData);
                message = 'Employee updated successfully!';
            } else {
                // Add new employee
                addEmployee(employeeData);
                message = 'Employee added successfully!';
                success = true;
            }
            
            if (success) {
                displayEmployees();
                updateDashboardStats();
                document.getElementById('employeeModal').style.display = 'none';
                alert(message);
                employeeForm.reset();
            } else {
                alert('Error saving employee!');
            }
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim();
            const employees = searchEmployees(searchTerm);
            displayEmployees(employees);
        });
    }
    
    // Filter functionality
    const filterDepartment = document.getElementById('filterDepartment');
    const filterStatus = document.getElementById('filterStatus');
    
    if (filterDepartment) {
        filterDepartment.addEventListener('change', applyFilters);
    }
    
    if (filterStatus) {
        filterStatus.addEventListener('change', applyFilters);
    }
    
    function applyFilters() {
        const department = document.getElementById('filterDepartment').value;
        const status = document.getElementById('filterStatus').value;
        const searchTerm = document.getElementById('searchInput').value.trim();
        
        let employees = getEmployees();
        
        // Apply search
        if (searchTerm) {
            employees = searchEmployees(searchTerm);
        }
        
        // Apply filters
        if (department) {
            employees = employees.filter(emp => emp.department === department);
        }
        
        if (status) {
            employees = employees.filter(emp => emp.status === status);
        }
        
        displayEmployees(employees);
    }
    
    // Initial display
    displayEmployees();
    updateDashboardStats();
});

// Update dashboard stats
function updateDashboardStats() {
    const employees = getEmployees();
    
    const totalEl = document.getElementById('totalEmployees');
    const deptEl = document.getElementById('departmentCount');
    const activeEl = document.getElementById('activeEmployees');
    const salaryEl = document.getElementById('totalSalary');
    
    if (totalEl) {
        totalEl.textContent = employees.length;
    }
    
    if (deptEl) {
        const departments = new Set(employees.map(emp => emp.department));
        deptEl.textContent = departments.size;
    }
    
    if (activeEl) {
        const active = employees.filter(emp => emp.status === 'Active').length;
        activeEl.textContent = active;
    }
    
    if (salaryEl) {
        const total = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
        salaryEl.textContent = '$' + total.toLocaleString();
    }
}