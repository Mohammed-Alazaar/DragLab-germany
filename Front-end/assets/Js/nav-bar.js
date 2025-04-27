/* $(document).ready(function () {
    $(".hamburger-menu").click(function () {
        $(".menu-items").toggle();
    });
});
 */
$(document).ready(function () {
    $(".nav-bar-icons-user-normal-screen-size").hide();
    $("#nav-bar-icons-user-details").click(function () {
        $(".nav-bar-icons-user-normal-screen-size").toggle();
    });
});

$(document).ready(function() {
    $(".openbtn").click(function() {
        var sidebarWidth = $("#mySidebar").width();
        if (sidebarWidth > 0) {
            $("#mySidebar").width(0);
        } else {
            $("#mySidebar").width(250);
        }
    });

    $(document).click(function(e) {
        var sidebar = $("#mySidebar");
        var openBtn = $(".openbtn");
        // Check if the target of the click isn't the container nor a descendant of the container
        if (!sidebar.is(e.target) && sidebar.has(e.target).length === 0 && !openBtn.is(e.target)) {
            sidebar.width(0);
        }
    });

    $(".openbtn, #mySidebar").click(function(e) {
        e.stopPropagation(); // This is to prevent the document click from firing when clicking inside the sidebar or the button itself
    });
});


