console.log("Hello");

const formStatus = document.querySelector(".formBtn");
const form = document.querySelector(".fact-form");

formStatus.addEventListener("click", function () {
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
        formStatus.textContent = "CANCEL";
    }
    else {
        form.classList.add('hidden');
        formStatus.textContent = "SHARE A FACT";
    }
});



