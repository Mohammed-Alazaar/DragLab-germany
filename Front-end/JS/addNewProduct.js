
// // for the dynamic input fields for highlitghed features
// function addFeature() {
//     const container = document.getElementById('dynamicFeatureContainer');
//     const index = container.children.length;
//     const featurePairDiv = document.createElement('div');
//     featurePairDiv.className = 'feature-input-pair';

//     // Create feature input
//     const featureInput = document.createElement('input');
//     featureInput.type = 'text';
//     featureInput.name = `features[${index}][feature]`;
//     featureInput.placeholder = `Feature ${index + 1}`;
//     featurePairDiv.appendChild(featureInput);

//     // Create feature detail input
//     const detailInput = document.createElement('input');
//     detailInput.type = 'text';
//     detailInput.name = `features[${index}][featureDetail]`;
//     detailInput.placeholder = `Feature Detail ${index + 1}`;
//     featurePairDiv.appendChild(detailInput);

//     // Create remove button
//     const removeButton = document.createElement('button');
//     removeButton.type = 'button';
//     removeButton.textContent = 'Remove';
//     removeButton.onclick = function() { removeFeature(this); };
//     featurePairDiv.appendChild(removeButton);

//     // Append the whole set to the container
//     container.appendChild(featurePairDiv);
// }

// function removeFeature(button) {
//     button.parentNode.remove();
// }



// Event delegation + safe defaults
document.addEventListener("DOMContentLoaded", function () {
  // default: collapse all language bodies unless they contain errors
  document.querySelectorAll(".language-section").forEach(section => {
    const body = section.querySelector(".language-body");
    const btn  = section.querySelector(".language-toggle");
    if (!body || !btn) return;

    if (body.querySelector(".is-invalid, .form-error")) {
      // open if there are validation errors
      body.classList.remove("collapse");
      section.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
    } else {
      body.classList.add("collapse");
      section.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    }
  });

  // click handler (works for all current/future .language-toggle)
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".language-toggle");
    if (!btn) return;

    const section = btn.closest(".language-section");
    const body = section && section.querySelector(".language-body");
    if (!body) return;

    const isCollapsed = body.classList.toggle("collapse"); // toggle class
    section.classList.toggle("is-open", !isCollapsed);
    btn.setAttribute("aria-expanded", String(!isCollapsed));

    // debug (optional): open DevTools console to see clicks firing
    // console.log("Toggle:", { section, collapsed: isCollapsed });
  });
});
