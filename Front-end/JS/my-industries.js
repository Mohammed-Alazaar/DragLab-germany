document.addEventListener('DOMContentLoaded', () => {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const industryId = button.getAttribute('data-industry-id');

      const confirmDelete = window.confirm('Are you sure you want to delete this industry? This action cannot be undone.');

      if (confirmDelete) {
        const form = document.getElementById(`deleteForm-${industryId}`);
        if (form) form.submit();
      }
    });
  });
});
