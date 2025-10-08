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
    // ...

    const langData = modelData[lang]?.[0];
    if (!langData) return;

    // Technical Specifications
    const specContainer = document.getElementById(`specs_${lang}_container`);
    const specs = Array.isArray(langData.technicalSpecifications) ? langData.technicalSpecifications : [];
    if (specs.length === 0) {
      addSpecSection(lang);
    } else {
      specs.forEach((section, si) => {
        const div = document.createElement('div');
        div.className = 'spec-section';
        div.dataset.index = si;
        div.innerHTML = `
          <input type="text" name="technicalSpecifications[${lang}][${si}][sectionTitle]" value="${section.sectionTitle || ''}" placeholder="Section Title">
          <div class="rows-container">
            ${(section.rows || []).map((row, ri) => `
              <div class="row-item">
                <input type="text" name="technicalSpecifications[${lang}][${si}][rows][${ri}][title]" value="${row.title || ''}" placeholder="Title">
                <input type="text" name="technicalSpecifications[${lang}][${si}][rows][${ri}][value]" value="${row.value || ''}" placeholder="Value">
                <button type="button" class="remove-parent">Remove Row</button>
              </div>
            `).join('')}
          </div>
          <button type="button" class="add-spec-row">Add Row</button>
          <button type="button" class="remove-parent">Remove Section</button>
        `;
        specContainer.appendChild(div);
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

function addSpecSection(lang) {
  const container = document.getElementById(`specs_${lang}_container`);
  const index = container.children.length;
  const div = document.createElement('div');
  div.className = 'spec-section';
  div.dataset.index = index;

  div.innerHTML = `
    <input type="text" name="technicalSpecifications[${lang}][${index}][sectionTitle]" placeholder="Section Title">
    <div class="rows-container"></div>
    <button type="button" class="add-spec-row">Add Row</button>
    <button type="button" class="remove-parent">Remove Section</button>
  `;
  container.appendChild(div);
}

function addSpecRow(button) {
  const rowsContainer = button.previousElementSibling;
  const parent = button.closest('.spec-section');
  const lang = parent.closest('.language-section').dataset.lang; // ✅ exact
  const sectionIndex = parent.dataset.index;
  const index = rowsContainer.children.length;

  const rowDiv = document.createElement('div');
  rowDiv.className = 'row-item';
  rowDiv.innerHTML = `
    <input type="text" name="technicalSpecifications[${lang}][${sectionIndex}][rows][${index}][title]" placeholder="Title">
    <input type="text" name="technicalSpecifications[${lang}][${sectionIndex}][rows][${index}][value]" placeholder="Value">
    <button type="button" class="remove-parent">Remove Row</button>
  `;
  rowsContainer.appendChild(rowDiv);
}


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

// ✅ EVENT DELEGATION (all buttons work without CSP violations)
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('add-download-field')) {
    const lang = e.target.dataset.lang;
    addDownloadField(lang);
  }

  if (e.target.classList.contains('add-spec-section')) {
    const lang = e.target.dataset.lang;
    addSpecSection(lang);
  }

  if (e.target.classList.contains('add-spec-row')) {
    addSpecRow(e.target);
  }

  if (e.target.classList.contains('remove-parent')) {
    e.target.closest('.row-item')?.remove() ||
    e.target.closest('.spec-section')?.remove() ||
    e.target.closest('.download-item')?.remove();
  }

  if (e.target.classList.contains('remove-existing-download')) {
    const lang = e.target.dataset.lang;
    const index = e.target.dataset.index;
    removeExistingDownload(lang, index);
  }
});

// ✅ TinyMCE init
tinymce.init({
  selector: '.tinymce-textarea',
  plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat'
});




// /assets/Js/addNewProduct.js  (or a models page JS)
// Independent collapsers per language
document.addEventListener("DOMContentLoaded", function () {
  // initialize: collapse all unless errors exist
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

  // toggle on click (independent)
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
