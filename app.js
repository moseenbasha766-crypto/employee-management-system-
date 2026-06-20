// Employee Management System - Main Application

// ===== INITIALIZATION =====
// Initialize the application with sample data if empty
function initializeApp() {
    const employees = localStorage.getItem('employees');
    
    // If no employees exist, add sample data
    if (!employees || JSON.parse(employees).length === 0) {
        const sampleEmployees = [
            {
                id: '1001',
                name: 'John Doe',
                email: 'john.doe@company.com',
                department: 'IT',
                position: 'Software Developer',
                salary: 75000,
                status: 'Active',
                createdAt: new Date('2024-01-15').toISOString()
            },
            {
                id: '1002',
                name: 'Jane Smith',
                email: 'jane.smith@company.com',
                department: 'HR',
                position: 'HR Manager',
                salary: 65000,
                status: 'Active',
                createdAt: new Date('2024-02-01').toISOString()
            },
            {
                id: '1003',
                name: 'Robert Johnson',
                email: 'robert.johnson@company.com',
                department: 'Finance',
                position: 'Financial Analyst',
                salary: 70000,
                status: 'Active',
                createdAt: new Date('2024-02-15').toISOString()
            },
            {
                id: '1004',
                name: 'Emily Davis',
                email: 'emily.davis@company.com',
                department: 'Marketing',
                position: 'Marketing Specialist',
                salary: 58000,
                status: 'Inactive',
                createdAt: new Date('2024-03-01').toISOString()
            },
            {
                id: '1005',
                name: 'Michael Wilson',
                email: 'michael.wilson@company.com',
                department: 'Operations',
                position: 'Operations Manager',
                salary: 82000,
                status: 'Active',
                createdAt: new Date('2024-03-15').toISOString()
            },
            {
                id: '1006',
                name: 'Sarah Brown',
                email: 'sarah.brown@company.com',
                department: 'IT',
                position: 'System Administrator',
                salary: 68000,
                status: 'On Leave',
                createdAt: new Date('2024-04-01').toISOString()
            },
            {
                id: '1007',
                name: 'David Miller',
                email: 'david.miller@company.com',
                department: 'Sales',
                position: 'Sales Executive',
                salary: 62000,
                status: 'Active',
                createdAt: new Date('2024-04-15').toISOString()
            }
        ];
        
        localStorage.setItem('employees', JSON.stringify(sampleEmployees));
        console.log('✅ Sample employees loaded successfully!');
    }
    
    // Initialize login status if not set
    if (!localStorage.getItem('isLoggedIn')) {
        localStorage.setItem('isLoggedIn', 'false');
    }
    
    // Display welcome message
    console.log('🏢 Employee Management System initialized');
    console.log('👤 Default Login: admin / admin123');
}

// ===== PAGE ROUTING =====
// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('admin')) return 'login';
    if (path.includes('home')) return 'home';
    if (path.includes('employee-details')) return 'employees';
    if (path.includes('employee-report')) return 'reports';
    return 'index';
}

// ===== UI HELPERS =====
// Show notification
function showNotification(message, type = 'success') {
    const colors = {
        success: '#48bb78',
        error: '#fc8181',
        warning: '#f6ad55',
        info: '#667eea'
    };
    
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 500;
        animation: slideInRight 0.5s ease;
        max-width: 400px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .department-badge {
        display: inline-block;
        padding: 4px 12px;
        background: #ebf4ff;
        color: #4299e1;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 500;
    }
`;
document.head.appendChild(styleSheet);

// ===== DATA VALIDATION =====
// Validate employee data
function validateEmployee(employee) {
    const errors = [];
    
    if (!employee.name || employee.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
    }
    
    if (!employee.email || !employee.email.includes('@')) {
        errors.push('Please enter a valid email address');
    }
    
    if (!employee.department) {
        errors.push('Please select a department');
    }
    
    if (!employee.position || employee.position.trim().length < 2) {
        errors.push('Position must be at least 2 characters');
    }
    
    if (!employee.salary || isNaN(employee.salary) || employee.salary <= 0) {
        errors.push('Please enter a valid salary amount');
    }
    
    if (!employee.status) {
        errors.push('Please select a status');
    }
    
    return errors;
}

// ===== FORMATTING HELPERS =====
// Format currency
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Get employee initials
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// ===== STATISTICS =====
// Calculate department statistics
function getDepartmentStats() {
    const employees = getEmployees();
    const stats = {};
    
    employees.forEach(emp => {
        if (!stats[emp.department]) {
            stats[emp.department] = {
                count: 0,
                totalSalary: 0,
                activeCount: 0,
                inactiveCount: 0
            };
        }
        stats[emp.department].count++;
        stats[emp.department].totalSalary += parseFloat(emp.salary || 0);
        if (emp.status === 'Active') {
            stats[emp.department].activeCount++;
        } else {
            stats[emp.department].inactiveCount++;
        }
    });
    
    return stats;
}

// Get salary statistics
function getSalaryStats() {
    const employees = getEmployees();
    const salaries = employees.map(emp => parseFloat(emp.salary || 0));
    
    if (salaries.length === 0) {
        return { min: 0, max: 0, avg: 0, total: 0 };
    }
    
    return {
        min: Math.min(...salaries),
        max: Math.max(...salaries),
        avg: salaries.reduce((a, b) => a + b, 0) / salaries.length,
        total: salaries.reduce((a, b) => a + b, 0)
    };
}

// ===== EXPORT FUNCTIONS =====
// Export data to JSON
function exportToJSON() {
    const employees = getEmployees();
    const data = {
        employees: employees,
        exportedAt: new Date().toISOString(),
        totalEmployees: employees.length,
        version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employees_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Import data from JSON
function importFromJSON(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.employees && Array.isArray(data.employees)) {
                if (confirm(`This will replace all existing employees (${getEmployees().length} current). Continue?`)) {
                    saveEmployees(data.employees);
                    showNotification(`✅ Successfully imported ${data.employees.length} employees!`, 'success');
                    location.reload();
                }
            } else {
                showNotification('❌ Invalid data format!', 'error');
            }
        } catch (error) {
            showNotification('❌ Error reading file!', 'error');
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// ===== SEARCH AND FILTER =====
// Advanced search
function advancedSearch(query, filters = {}) {
    let employees = getEmployees();
    
    // Text search
    if (query) {
        const searchTerm = query.toLowerCase();
        employees = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.email.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm) ||
            emp.position.toLowerCase().includes(searchTerm) ||
            emp.id.includes(searchTerm)
        );
    }
    
    // Apply filters
    if (filters.department) {
        employees = employees.filter(emp => emp.department === filters.department);
    }
    
    if (filters.status) {
        employees = employees.filter(emp => emp.status === filters.status);
    }
    
    if (filters.minSalary) {
        employees = employees.filter(emp => parseFloat(emp.salary) >= filters.minSalary);
    }
    
    if (filters.maxSalary) {
        employees = employees.filter(emp => parseFloat(emp.salary) <= filters.maxSalary);
    }
    
    return employees;
}

// ===== BULK OPERATIONS =====
// Bulk delete employees
function bulkDelete(ids) {
    if (!ids || ids.length === 0) return false;
    
    if (confirm(`Delete ${ids.length} selected employees?`)) {
        let employees = getEmployees();
        employees = employees.filter(emp => !ids.includes(emp.id));
        saveEmployees(employees);
        showNotification(`✅ Deleted ${ids.length} employees`, 'success');
        return true;
    }
    return false;
}

// Bulk status update
function bulkUpdateStatus(ids, status) {
    if (!ids || ids.length === 0) return false;
    
    let employees = getEmployees();
    employees = employees.map(emp => {
        if (ids.includes(emp.id)) {
            return { ...emp, status: status, updatedAt: new Date().toISOString() };
        }
        return emp;
    });
    saveEmployees(employees);
    showNotification(`✅ Updated ${ids.length} employees to ${status}`, 'success');
    return true;
}

// ===== DASHBOARD FUNCTIONS =====
// Update dashboard in real-time
function updateDashboard() {
    const employees = getEmployees();
    const total = employees.length;
    const active = employees.filter(emp => emp.status === 'Active').length;
    const departments = new Set(employees.map(emp => emp.department)).size;
    const totalSalary = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
    
    // Update DOM elements if they exist
    const elements = {
        totalEmployees: total,
        activeEmployees: active,
        departmentCount: departments,
        totalSalary: formatCurrency(totalSalary)
    };
    
    Object.keys(elements).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = elements[id];
        }
    });
    
    // Update user display
    const userDisplay = document.getElementById('userDisplay');
    if (userDisplay) {
        const username = localStorage.getItem('username') || 'Admin';
        userDisplay.textContent = `👤 ${username}`;
    }
    
    // Update userName
    const userName = document.getElementById('userName');
    if (userName) {
        const username = localStorage.getItem('username') || 'Admin';
        userName.textContent = username;
    }
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Ctrl + N: Add new employee (on employees page)
    if (e.ctrlKey && e.key === 'n') {
        const addBtn = document.getElementById('addEmployeeBtn');
        if (addBtn) {
            e.preventDefault();
            addBtn.click();
        }
    }
    
    // Ctrl + S: Save form (when modal is open)
    if (e.ctrlKey && e.key === 's') {
        const modal = document.getElementById('employeeModal');
        if (modal && modal.style.display === 'block') {
            e.preventDefault();
            const form = document.getElementById('employeeForm');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
    }
    
    // Escape: Close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('employeeModal');
        if (modal && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});

// ===== AUTO-SAVE FEATURE =====
let autoSaveTimer = null;

function enableAutoSave() {
    // Save employees data every 30 seconds
    autoSaveTimer = setInterval(() => {
        const employees = getEmployees();
        if (employees.length > 0) {
            // Just trigger a save operation
            saveEmployees(employees);
            console.log('💾 Auto-saved employees data');
        }
    }, 30000);
}

function disableAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

// ===== PERFORMANCE MONITORING =====
function logPerformance() {
    console.log('📊 Performance Metrics:');
    console.log(`  - Total Employees: ${getEmployees().length}`);
    console.log(`  - LocalStorage Size: ${(new Blob([localStorage.getItem('employees') || '']).size / 1024).toFixed(2)} KB`);
    console.log(`  - Page Load Time: ${performance.now().toFixed(0)}ms`);
}

// ===== INITIALIZE APPLICATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeApp();
    
    // Log performance
    logPerformance();
    
    // Enable auto-save
    enableAutoSave();
    
    // Update dashboard if on home page
    if (window.location.pathname.includes('home')) {
        updateDashboard();
    }
    
    console.log('🚀 Employee Management System is ready!');
    console.log('💡 Press Ctrl+N to add new employee (on employees page)');
    console.log('💡 Press Escape to close modal');
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', function() {
    disableAutoSave();
    console.log('🔄 Cleaning up application...');
});

// ===== EXPOSE GLOBAL FUNCTIONS =====
// Make functions available globally for inline HTML event handlers
window.getEmployees = getEmployees;
window.saveEmployees = saveEmployees;
window.addEmployee = addEmployee;
window.updateEmployee = updateEmployee;
window.deleteEmployee = deleteEmployee;
window.getEmployeeById = getEmployeeById;
window.displayEmployees = displayEmployees;
window.editEmployee = editEmployee;
window.deleteEmployeeHandler = deleteEmployeeHandler;
window.searchEmployees = searchEmployees;
window.filterEmployees = filterEmployees;
window.updateDashboardStats = updateDashboardStats;
window.showNotification = showNotification;
window.formatCurrency = formatCurrency;
window.formatDate = formatDate;
window.getInitials = getInitials;
window.exportToCSV = exportToCSV;
window.refreshReport = refreshReport;
window.getDepartmentReport = getDepartmentReport;
window.getStatusReport = getStatusReport;
window.displayDepartmentReport = displayDepartmentReport;
window.displayStatusReport = displayStatusReport;
window.displayReports = displayReports;
window.bulkDelete = bulkDelete;
window.bulkUpdateStatus = bulkUpdateStatus;
window.advancedSearch = advancedSearch;
window.exportToJSON = exportToJSON;
window.importFromJSON = importFromJSON;

console.log('✅ All functions exported globally!');