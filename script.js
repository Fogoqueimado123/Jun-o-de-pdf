 let selectedFiles = [];

    function ajustarLayout() {
      const largura = window.innerWidth;
      const botoes = document.querySelectorAll(".custom-btn, .merge-btn, .reload-btn");
      const titulo = document.querySelector("h1");
      const texto = document.querySelector("p");

      if (largura <= 480) {
      
        titulo.style.fontSize = "1.5rem";
        texto.style.fontSize = "1rem";
        botoes.forEach(btn => {
          btn.style.fontSize = "1rem";
          btn.style.padding = "12px";
        });
      } else if (largura <= 768) {

        titulo.style.fontSize = "1.8rem";
        texto.style.fontSize = "1.1rem";
        botoes.forEach(btn => {
          btn.style.fontSize = "1.05rem";
          btn.style.padding = "14px";
        });
      } else {

        titulo.style.fontSize = "2rem";
        texto.style.fontSize = "1.2rem";
        botoes.forEach(btn => {
          btn.style.fontSize = "1.1rem";
          btn.style.padding = "15px";
        });
      }
    }

    window.addEventListener("resize", ajustarLayout);
    window.addEventListener("load", ajustarLayout);


    document.getElementById("pdfInput").addEventListener("change", function (event) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        if (!selectedFiles.some(f => f.name === file.name)) {
          selectedFiles.push(file);
        }
      });
      renderFileList();
    });

    function renderFileList() {
      const fileList = document.getElementById("fileList");
      fileList.innerHTML = "";
      selectedFiles.forEach((file, index) => {
        const div = document.createElement("div");
        div.classList.add("file-item");
        div.innerHTML = `${file.name} <button onclick="removeFile(${index})">Remover</button>`;
        fileList.appendChild(div);
      });
    }

    function removeFile(index) {
      selectedFiles.splice(index, 1);
      renderFileList();
    }

    document.getElementById("mergeBtn").addEventListener("click", async () => {
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
      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "PDF-Mesclado.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      document.getElementById("reloadBtn").style.display = "block";
    });

    document.getElementById("reloadBtn").addEventListener("click", () => {
      location.reload();
    });