document.addEventListener('DOMContentLoaded', () => {
  // Open Product Modal
  document.querySelectorAll('.delete-product-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const productId = form.dataset.productId;
      document.getElementById('deleteProductModal').style.display = 'block';
      document.getElementById('deleteProductId').value = productId;
    });
  });

  // Open Model Modal
  document.querySelectorAll('.delete-model-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const productId = form.dataset.productId;
      const modelId = form.dataset.modelId;
      document.getElementById('deleteModelModal').style.display = 'block';
      document.getElementById('deleteModelProductId').value = productId;
      document.getElementById('deleteModelId').value = modelId;
    });
  });

  // Close Product Modal
  document.querySelectorAll('.close-product-modal').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('deleteProductModal').style.display = 'none';
    });
  });

  // Close Model Modal
  document.querySelectorAll('.close-model-modal').forEach(el => {
    el.addEventListener('click', () => {
      document.getElementById('deleteModelModal').style.display = 'none';
    });
  });

  // Close modals by clicking outside
  window.addEventListener('click', function (event) {
    if (event.target === document.getElementById('deleteProductModal')) {
      document.getElementById('deleteProductModal').style.display = 'none';
    }
    if (event.target === document.getElementById('deleteModelModal')) {
      document.getElementById('deleteModelModal').style.display = 'none';
    }
  });
});
