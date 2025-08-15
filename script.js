let selectedFiles = [];

document.getElementById('pdfInput').addEventListener('change', function (event) {
    const files = Array.from(event.target.files);

    files.forEach(file => {
        if (!selectedFiles.some(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    });

    renderFileList();
});

function renderFileList() {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = "";

    selectedFiles.forEach((file, index) => {
        const div = document.createElement('div');
        div.classList.add('file-item');

        div.innerHTML = `
            ${file.name}
            <button onclick="removeFile(${index})">Remover</button>
        `;

        fileList.appendChild(div);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    renderFileList();
}

document.getElementById('mergeBtn').addEventListener('click', async () => {
    if (selectedFiles.length < 2) {
        alert("Selecione pelo menos 2 PDFs para juntar.");
        return;
    }

    const mergedPdf = await PDFLib.PDFDocument.create();

    for (const file of selectedFiles) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();

    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'PDF-Mesclado.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);


    document.getElementById('reloadBtn').style.display = 'inline-block';
});


document.getElementById('reloadBtn').addEventListener('click', () => {
    location.reload();
});

