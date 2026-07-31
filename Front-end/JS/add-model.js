document.addEventListener('DOMContentLoaded', function () {
  let modelData = {};
  const md = document.getElementById('model-data');
  try {
    modelData = JSON.parse(md?.textContent || '{}') || {};
  } catch (e) {
    console.error('❌ Failed to parse model-data JSON:', e);
    modelData = {};
  }

  ['EN', 'ES', 'DE', 'TR', 'FR'].forEach(lang => {
    const langData = modelData[lang]?.[0];
    if (!langData) return;

    // Technical Specifications — use new table builder
    const specContainer = document.getElementById(`specs_${lang}_container`);
    const specs = Array.isArray(langData.technicalSpecifications) ? langData.technicalSpecifications : [];
    if (specs.length === 0) {
      addSpecSection(lang);
    } else {
      specs.forEach(section => {
        addSpecSection(lang, section.sectionTitle || '', section.rows || []);
      });
    }

    // Downloads
    const downloadContainer = document.getElementById(`download_${lang}_container`);
    const downloads = Array.isArray(langData.downloads) ? langData.downloads : [];
    if (downloads.length === 0) {
      addDownloadField(lang);
    } else {
      downloads.forEach((file, index) => {
        const div = document.createElement('div');
        div.className = 'download-item';
        div.id = `existing-download-${lang}-${index}`;
        div.innerHTML = `
          <div>
            📝 <strong>${file.fileName || ''}</strong> (${file.fileCategory || ''}) - ${file.fileSize || ''}
            <a href="/${file.filePath}" target="_blank">Download</a>
          </div>
          <input type="hidden" name="existingDownloads_${lang}[]" value='${JSON.stringify(file)}'>
          <input type="hidden" name="deletedDownloads_${lang}[]" value="${file.filePath}" disabled>
          <button type="button" class="remove-existing-download" data-lang="${lang}" data-index="${index}">❌ Delete</button>
        `;
        downloadContainer.appendChild(div);
      });
    }
  });
});

// ─── Spec helpers ────────────────────────────────────────────────────────────

function escHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function addSpecSection(lang, sectionTitle = '', rows = []) {
  const container = document.getElementById(`specs_${lang}_container`);
  const sectionIndex = container.children.length;

  const div = document.createElement('div');
  div.className = 'spec-section';
  div.dataset.index = sectionIndex;
  div.dataset.lang = lang;

  div.innerHTML = `
    <div class="spec-section-header">
      <input type="text"
             name="technicalSpecifications[${lang}][${sectionIndex}][sectionTitle]"
             value="${escHtml(sectionTitle)}"
             placeholder="Section title  (e.g. General, Dimensions, Performance)">
      <button type="button" class="remove-spec-section" title="Remove section">✕</button>
    </div>
    <table class="spec-table">
      <thead>
        <tr>
          <th>Specification</th>
          <th>Value</th>
          <th></th>
        </tr>
      </thead>
      <tbody class="rows-container"></tbody>
    </table>
    <button type="button" class="add-spec-row" data-lang="${lang}">+ Add Row</button>
  `;

  container.appendChild(div);

  const addRowBtn = div.querySelector('.add-spec-row');
  if (rows.length > 0) {
    rows.forEach(row => addSpecRow(addRowBtn, row.title || '', row.value || ''));
  } else {
    addSpecRow(addRowBtn);
  }
}

function addSpecRow(btn, titleVal = '', valueVal = '') {
  const section = btn.closest('.spec-section');
  const tbody = section.querySelector('tbody.rows-container');
  const lang = section.dataset.lang;
  const sectionIndex = section.dataset.index;
  const rowIndex = tbody.children.length;

  const tr = document.createElement('tr');
  tr.className = 'row-item';
  tr.innerHTML = `
    <td><input type="text"
               name="technicalSpecifications[${lang}][${sectionIndex}][rows][${rowIndex}][title]"
               value="${escHtml(titleVal)}"
               placeholder="e.g. Weight"></td>
    <td><input type="text"
               name="technicalSpecifications[${lang}][${sectionIndex}][rows][${rowIndex}][value]"
               value="${escHtml(valueVal)}"
               placeholder="e.g. 12 kg"></td>
    <td><button type="button" class="remove-spec-row" title="Remove row">✕</button></td>
  `;
  tbody.appendChild(tr);
}

function copySpecsToAllLanguages() {
  const enContainer = document.getElementById('specs_EN_container');
  const sections = Array.from(enContainer.querySelectorAll('.spec-section')).map(section => {
    const titleInput = section.querySelector('.spec-section-header input');
    const rows = Array.from(section.querySelectorAll('tbody .row-item')).map(row => {
      const inputs = row.querySelectorAll('input[type="text"]');
      return {
        title: inputs[0] ? inputs[0].value : '',
        value: inputs[1] ? inputs[1].value : ''
      };
    });
    return { title: titleInput ? titleInput.value : '', rows };
  });

  ['ES', 'DE', 'TR', 'FR'].forEach(lang => {
    const container = document.getElementById(`specs_${lang}_container`);
    container.innerHTML = '';
    sections.forEach(section => addSpecSection(lang, section.title, section.rows));
  });

  const btn = document.getElementById('copy-specs-to-all');
  const orig = btn.textContent;
  btn.textContent = '✓ Copied to all languages!';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
  }, 2500);
}

// ─── Excel import / template download ────────────────────────────────────────

function importSpecsFromExcel(lang) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls,.csv';

  input.onchange = function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (ev) {
      try {
        const data = new Uint8Array(ev.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

        // Skip header row if it looks like one
        let startRow = 0;
        if (rows.length > 0) {
          const first = rows[0];
          const h0 = String(first[0] || '').toLowerCase();
          const h1 = String(first[1] || '').toLowerCase();
          if (h0 === 'section' || h1 === 'specification' || h1 === 'spec') {
            startRow = 1;
          }
        }

        // Group rows into sections
        // Column A = section name (empty = reuse last section)
        // Column B = specification name
        // Column C = value
        const sections = {};
        const sectionOrder = [];
        let currentSection = '';

        for (let i = startRow; i < rows.length; i++) {
          const row = rows[i];
          const colA = String(row[0] || '').trim();
          const colB = String(row[1] || '').trim();
          const colC = String(row[2] || '').trim();

          if (!colA && !colB && !colC) continue; // skip blank rows

          if (colA) {
            currentSection = colA;
          }
          if (!currentSection) currentSection = 'General';

          if (!sections[currentSection]) {
            sections[currentSection] = [];
            sectionOrder.push(currentSection);
          }

          if (colB) {
            sections[currentSection].push({ title: colB, value: colC });
          }
        }

        if (sectionOrder.length === 0) {
          alert('No data found.\nMake sure the file has columns:\nSection | Specification | Value');
          return;
        }

        // Populate the spec table
        const container = document.getElementById(`specs_${lang}_container`);
        container.innerHTML = '';
        sectionOrder.forEach(title => addSpecSection(lang, title, sections[title]));

      } catch (err) {
        console.error('Excel import error:', err);
        alert('Could not read the file. Please use a valid .xlsx, .xls, or .csv file.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  input.click();
}

function downloadSpecTemplate() {
  const rows = [
    ['Section', 'Specification', 'Value'],
    ['General', 'Weight', '12 kg'],
    ['General', 'Dimensions', '100 x 50 x 30 cm'],
    ['General', 'Material', 'Stainless Steel'],
    ['General', 'Color', 'White / Grey'],
    ['Performance', 'Capacity', '4 L/h'],
    ['Performance', 'Power Supply', '220V / 50Hz'],
    ['Performance', 'Power Consumption', '1200 W'],
    ['Performance', 'Temperature Range', '5°C – 95°C'],
    ['Certifications', 'Standards', 'CE, ISO 9001'],
  ];

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [{ wch: 18 }, { wch: 24 }, { wch: 22 }];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Specifications');
  XLSX.writeFile(wb, 'specs-template.xlsx');
}

// ─── Download helpers ─────────────────────────────────────────────────────────

function addDownloadField(lang) {
  const container = document.getElementById(`download_${lang}_container`);
  const div = document.createElement('div');
  div.className = 'download-item';
  div.innerHTML = `
    <input type="text" name="downloadFileNames_${lang}[]" placeholder="File Name">
    <select name="downloadCategories_${lang}[]">
      <option value="Catalogs">Catalogs</option>
      <option value="Certificates">Certificates</option>
      <option value="Logo">Logo</option>
    </select>
    <input type="file" name="downloadFiles_${lang}" multiple />
    <button type="button" class="remove-parent">Remove</button>
  `;
  container.appendChild(div);
}

function removeExistingDownload(lang, index) {
  const wrapper = document.getElementById(`existing-download-${lang}-${index}`);
  if (!wrapper) return;

  const keepInput = wrapper.querySelector(`input[name="existingDownloads_${lang}[]"]`);
  if (keepInput) keepInput.disabled = true;

  const deleteInput = wrapper.querySelector(`input[name="deletedDownloads_${lang}[]"]`);
  if (deleteInput) deleteInput.disabled = false;

  wrapper.style.display = 'none';
}

// ─── Event delegation ─────────────────────────────────────────────────────────

document.addEventListener('click', function (e) {

  if (e.target.classList.contains('add-download-field')) {
    addDownloadField(e.target.dataset.lang);
  }

  if (e.target.classList.contains('add-spec-section')) {
    addSpecSection(e.target.dataset.lang);
  }

  if (e.target.classList.contains('add-spec-row')) {
    addSpecRow(e.target);
  }

  if (e.target.classList.contains('remove-spec-section')) {
    e.target.closest('.spec-section')?.remove();
  }

  if (e.target.classList.contains('remove-spec-row')) {
    e.target.closest('.row-item')?.remove();
  }

  if (e.target.id === 'copy-specs-to-all') {
    copySpecsToAllLanguages();
  }

  if (e.target.classList.contains('btn-import-specs')) {
    importSpecsFromExcel(e.target.dataset.lang);
  }

  if (e.target.id === 'download-specs-template') {
    downloadSpecTemplate();
  }

  // Downloads only (spec rows now use remove-spec-row)
  if (e.target.classList.contains('remove-parent')) {
    e.target.closest('.download-item')?.remove();
  }

  if (e.target.classList.contains('remove-existing-download')) {
    removeExistingDownload(e.target.dataset.lang, e.target.dataset.index);
  }
});

// ─── TinyMCE ──────────────────────────────────────────────────────────────────

tinymce.init({
  selector: '.tinymce-textarea',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
});

// ─── Language collapse ────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function () {

  // Industry checkbox: enforce max 4 selections
  function enforceMaxIndustries() {
    const checkboxes = document.querySelectorAll('.industry-slug-checkbox');
    const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;
    checkboxes.forEach(function (cb) {
      if (!cb.checked) {
        cb.disabled = checkedCount >= 4;
        const label = cb.closest('label');
        if (label) {
          label.style.opacity = checkedCount >= 4 ? '0.4' : '1';
          label.style.cursor = checkedCount >= 4 ? 'not-allowed' : 'pointer';
        }
      }
    });
  }
  document.querySelectorAll('.industry-slug-checkbox').forEach(function (cb) {
    cb.addEventListener('change', enforceMaxIndustries);
  });
  enforceMaxIndustries();

  // Collapse all language sections unless they have errors
  document.querySelectorAll(".language-section").forEach(section => {
    const body = section.querySelector(".language-body");
    const btn  = section.querySelector(".language-toggle");
    if (!body || !btn) return;

    if (body.querySelector(".is-invalid, .form-error")) {
      body.classList.remove("collapse");
      section.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      body.classList.add("collapse");
      section.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // Toggle on click
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".language-toggle");
    if (!btn) return;
    const section = btn.closest(".language-section");
    const body = section && section.querySelector(".language-body");
    if (!body) return;
    const collapsed = body.classList.toggle("collapse");
    section.classList.toggle("is-open", !collapsed);
    btn.setAttribute("aria-expanded", String(!collapsed));
  });
});
