// Handle sticky header and burger menu toggle
window.onscroll = function () {
    handleScroll();
};

var stickyHeader = document.querySelector("#sticky-header");
var burgerMenu = document.querySelector("#burger");
var navigationMenu = document.querySelector("#menu");

function handleScroll() {
    if (window.scrollY > 0) {
        stickyHeader.classList.add("sticky");
    } else {
        stickyHeader.classList.remove("sticky");
    }
}

// Toggle burger menu for mobile
burgerMenu.addEventListener("click", () => {
    burgerMenu.classList.toggle("is-active");
    navigationMenu.classList.toggle("is-active");
    if (window.scrollY === 0) {
        stickyHeader.classList.toggle("sticky");
    }
});
