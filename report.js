// Employee Reports

// Generate department report
function getDepartmentReport() {
    const employees = getEmployees();
    const report = {};
    
    employees.forEach(emp => {
        if (!report[emp.department]) {
            report[emp.department] = {
                count: 0,
                totalSalary: 0,
                employees: []
            };
        }
        report[emp.department].count++;
        report[emp.department].totalSalary += parseFloat(emp.salary || 0);
        report[emp.department].employees.push(emp);
    });
    
    // Calculate average salary for each department
    Object.keys(report).forEach(dept => {
        report[dept].averageSalary = report[dept].totalSalary / report[dept].count;
        report[dept].percentage = (report[dept].count / employees.length) * 100;
    });
    
    return report;
}

// Generate status report
function getStatusReport() {
    const employees = getEmployees();
    const report = {};
    
    employees.forEach(emp => {
        if (!report[emp.status]) {
            report[emp.status] = 0;
        }
        report[emp.status]++;
    });
    
    return report;
}

// Display reports
function displayReports() {
    const employees = getEmployees();
    
    // Update summary stats
    const totalEl = document.getElementById('reportTotal');
    const totalSalaryEl = document.getElementById('reportTotalSalary');
    const avgSalaryEl = document.getElementById('reportAvgSalary');
    const deptCountEl = document.getElementById('reportDepartments');
    
    if (totalEl) {
        totalEl.textContent = employees.length;
    }
    
    if (totalSalaryEl) {
        const total = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
        totalSalaryEl.textContent = '$' + total.toLocaleString();
    }
    
    if (avgSalaryEl) {
        const total = employees.reduce((sum, emp) => sum + parseFloat(emp.salary || 0), 0);
        const avg = employees.length > 0 ? total / employees.length : 0;
        avgSalaryEl.textContent = '$' + avg.toLocaleString();
    }
    
    if (deptCountEl) {
        const departments = new Set(employees.map(emp => emp.department));
        deptCountEl.textContent = departments.size;
    }
    
    // Display department report
    displayDepartmentReport();
    
    // Display status report
    displayStatusReport();
}

// Display department report
function displayDepartmentReport() {
    const tbody = document.getElementById('departmentReportBody');
    if (!tbody) return;
    
    const report = getDepartmentReport();
    const departments = Object.keys(report);
    
    if (departments.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 30px; color: #999;">
                    No data available
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = departments.map(dept => {
        const data = report[dept];
        return `
            <tr>
                <td><strong>${dept}</strong></td>
                <td>${data.count}</td>
                <td>$${data.totalSalary.toLocaleString()}</td>
                <td>$${data.averageSalary.toLocaleString()}</td>
                <td>${data.percentage.toFixed(1)}%</td>
            </tr>
        `;
    }).join('');
}

// Display status report
function displayStatusReport() {
    const tbody = document.getElementById('statusReportBody');
    if (!tbody) return;
    
    const report = getStatusReport();
    const employees = getEmployees();
    const total = employees.length;
    const statuses = Object.keys(report);
    
    if (statuses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3" style="text-align: center; padding: 30px; color: #999;">
                    No data available
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = statuses.map(status => {
        const count = report[status];
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return `
            <tr>
                <td><span class="status-badge ${status.toLowerCase().replace(' ', '')}">${status}</span></td>
                <td>${count}</td>
                <td>${percentage.toFixed(1)}%</td>
            </tr>
        `;
    }).join('');
}

// Export to CSV
function exportToCSV() {
    const employees = getEmployees();
    
    if (employees.length === 0) {
        alert('No data to export!');
        return;
    }
    
    // Headers
    const headers = ['ID', 'Name', 'Email', 'Department', 'Position', 'Salary', 'Status', 'Created At'];
    const rows = employees.map(emp => [
        emp.id,
        emp.name,
        emp.email,
        emp.department,
        emp.position,
        emp.salary,
        emp.status,
        new Date(emp.createdAt).toLocaleDateString()
    ]);
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    rows.forEach(row => {
        csvContent += row.join(',') + '\n';
    });
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `employee_report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Refresh report
function refreshReport() {
    displayReports();
    alert('Report refreshed successfully!');
}

// Initialize report page
document.addEventListener('DOMContentLoaded', function() {
    displayReports();
});

// Auto-refresh report every 5 minutes
setInterval(displayReports, 5 * 60 * 1000);