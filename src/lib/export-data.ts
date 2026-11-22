// Dynamic imports: xlsx/jspdf are heavy and only needed on export; this keeps them
// in separate Vite chunks instead of the main bundle.
export async function exportToExcel(filename: string, rows: Array<Record<string, unknown>>) {
    if (rows.length === 0) return
    const XLSX = await import('xlsx')
    const worksheet = XLSX.utils.json_to_sheet(rows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report')
    XLSX.writeFile(workbook, filename)
}

export async function exportToPdf(
    filename: string,
    title: string,
    rows: Array<Record<string, unknown>>,
    headers: string[],
) {
    if (rows.length === 0) return
    const { jsPDF } = await import('jspdf')
    const autoTable = (await import('jspdf-autotable')).default
    const doc = new jsPDF()
    doc.text(title, 14, 16)
    const values = rows.map((row) => headers.map((header) => String(row[header] ?? '')))
    autoTable(doc, { head: [headers], body: values })
    doc.save(filename)
}
