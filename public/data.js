document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#students-table tbody");

    try {
        const response = await fetch('/api/students'); // Ensure this route is defined in your Express app
        const data = await response.json();

        if (data && data.length) {
            data.forEach(student => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.first_name}</td>
                    <td>${student.last_name}</td>
                    <td>${student.school}</td>
                    <td>${student.phone}</td>
                    <td>${student.mother_name || 'N/A'}</td>
                    <td>${student.mother_phone || 'N/A'}</td>
                    <td>${student.father_name || 'N/A'}</td>
                    <td>${student.father_phone || 'N/A'}</td>
                    <td>${new Date(student.created_at).toLocaleString()}</td>
                `;

                tableBody.appendChild(row);
            });
        } else {
            const row = document.createElement("tr");
            row.innerHTML = `<td colspan="9" style="text-align: center;">Нет данных</td>`;
            tableBody.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        const row = document.createElement("tr");
        row.innerHTML = `<td colspan="9" style="text-align: center;">Ошибка загрузки данных</td>`;
        tableBody.appendChild(row);
    }
});

