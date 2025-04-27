$(document).ready(function () {
    const fileInput = $('#add-photos');
    const fileNameText = $('.file-name');
    const selectedPhotosContainer = $('.selected-photos');
    
    let totalPhotos = selectedPhotosContainer.children().length;
    let uploadedPhotoNames = new Set(); // Use a Set to track uploaded photo names for uniqueness

    fileInput.on('change', function (event) {
        const selectedFiles = event.target.files;
        let imageFiles = [];
        let duplicateFilesSkipped = 0;

        // Filter out non-image files and duplicates by name
        for (let i = 0; i < selectedFiles.length; i++) {
            if (selectedFiles[i].type.match('image.*') && !uploadedPhotoNames.has(selectedFiles[i].name)) {
                imageFiles.push(selectedFiles[i]);
                uploadedPhotoNames.add(selectedFiles[i].name); // Add to the set of uploaded names
            } else if (uploadedPhotoNames.has(selectedFiles[i].name)) {
                duplicateFilesSkipped += 1;
            }
        }

        if (imageFiles.length > 0) {
            totalPhotos += imageFiles.length;
            fileNameText.text(`${totalPhotos} file(s) selected`);

            imageFiles.forEach((file) => {
                const photoDiv = $('<div>').addClass('selected-photo').css('position', 'relative');
                const deleteBtn = $('<button>').text('X').addClass('delete-photo-btn')
                    .css({
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        zIndex: '100'
                    });

                const photoImage = $('<img>')
                    .attr('src', URL.createObjectURL(file))
                    .attr('alt', file.name);

                deleteBtn.on('click', function() {
                    $(this).parent().remove();
                    totalPhotos -= 1;
                    uploadedPhotoNames.delete(file.name); // Remove from the set of uploaded names
                    fileNameText.text(`${totalPhotos - duplicateFilesSkipped} file(s) selected`);
                });

                photoDiv.append(deleteBtn).append(photoImage);
                selectedPhotosContainer.append(photoDiv);
            });
        } else if (duplicateFilesSkipped > 0) {
            alert('Duplicate photos are not uploaded.');
        }

        if (!selectedPhotosContainer.hasClass('ui-sortable')) {
            selectedPhotosContainer.sortable({
                placeholder: "ui-state-highlight",
                cursor: "move",
                tolerance: "pointer"
            });
            selectedPhotosContainer.disableSelection();
        }
    });
});






// for the input fields for delivery time
$(document).ready(function() {
    $('#deliveryTimeTo').change(function() {
        var from = $('#deliveryTimeFrom').val();
        var to = $(this).val();
        
        if (parseInt(to) < parseInt(from)) {
            alert('The "To" day must be greater than or equal to the "From" day.');
            $(this).val(''); // Clear the "To" input
        }
    });

    $('#deliveryTimeFrom').change(function() {
        var from = $(this).val();
        var to = $('#deliveryTimeTo').val();
        
        if (to && parseInt(from) > parseInt(to)) {
            alert('The "From" day must be less than or equal to the "To" day.');
            $(this).val(''); // Clear the "From" input
        }
    });
});



// for the thumbnail preview


$(document).ready(function () {
    $('#product-thumbnail').on('change', function (event) {
        var selectedFile = event.target.files[0];
        
        // Clear the previous preview
        var previewContainer = $('#thumbnail-preview');
        previewContainer.empty();
        
        // Check if a file is selected and it's an image
        if (selectedFile && selectedFile.type.match('image.*')) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                var img = $('<img>').attr('src', e.target.result).css({
                    maxWidth: '100px', // Set the maximum width of the thumbnail preview
                    maxHeight: '100px' // Set the maximum height of the thumbnail preview
                });
                previewContainer.append(img);
            };
            
            reader.readAsDataURL(selectedFile);
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    var quantityInput = document.getElementById('quantity');

    quantityInput.addEventListener('input', enforceInteger);

    function enforceInteger(event) {
        var value = event.target.value;
        // Replace any non-digit character with an empty string
        var integerValue = value.replace(/\D/g, '');
        event.target.value = integerValue;
    }
});


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