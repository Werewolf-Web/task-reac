import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const exportTasksToCSV = (tasks) => {
  const csvContent = [
    ['Date', 'Time', 'Title', 'Description'].join(','),
    ...tasks.map(task => [
      formatDate(task.date),
      task.time,
      `"${(task.title || '').replace(/"/g, '""')}"`,
      `"${(task.description || '').replace(/"/g, '""')}"`,
    ].join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `tasks_${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const exportTasksToExcel = (tasks) => {
  const data = tasks.map(task => ({
    Date: formatDate(task.date),
    Time: task.time,
    Title: task.title,
    Description: task.description || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Tasks');

  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 12 },
    { wch: 25 },
    { wch: 40 },
  ];

  XLSX.writeFile(workbook, `tasks_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportTasksToPDF = (tasks) => {
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  doc.setFontSize(18);
  doc.text('Tasks Report', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(10);
  const exportDate = new Date().toLocaleString();
  doc.text(`Generated: ${exportDate}`, margin, yPosition);
  yPosition += 8;

  doc.text(`Total Tasks: ${tasks.length}`, margin, yPosition);
  yPosition += 10;

  doc.setFontSize(9);
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  tasks.forEach((task, index) => {
    const taskDate = formatDate(task.date);
    const taskContent = [
      `${index + 1}. ${task.title}`,
      `Date: ${taskDate} | Time: ${task.time}`,
    ];

    if (task.description) {
      taskContent.push(`Description: ${task.description}`);
    }

    let lineHeight = 6;
    let tempY = yPosition;

    taskContent.forEach((line, lineIndex) => {
      const isBold = lineIndex === 0;
      if (isBold) {
        doc.setFont(undefined, 'bold');
      }

      const wrappedText = doc.splitTextToSize(line, contentWidth - 4);
      const textHeight = wrappedText.length * lineHeight;

      if (tempY + textHeight > pageHeight - margin) {
        doc.addPage();
        tempY = margin;
      }

      doc.text(wrappedText, margin + 2, tempY);
      tempY += textHeight;
      doc.setFont(undefined, 'normal');
    });

    yPosition = tempY + 3;

    if (yPosition > pageHeight - margin - 5) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setDrawColor(220, 220, 220);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 4;
  });

  doc.save(`tasks_${new Date().toISOString().slice(0, 10)}.pdf`);
};
