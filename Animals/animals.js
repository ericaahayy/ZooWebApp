const seeDetailsButtons = document.querySelectorAll(".card-button");

seeDetailsButtons.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    const detailsPageURL = this.getAttribute("href");
    window.open(detailsPageURL, "_blank");
  });
});

//for animal card popups (display info)
const animalCards = document.querySelectorAll(".animal-card");
const popups = document.querySelectorAll(".popup");

animalCards.forEach((card, index) => {
  card.addEventListener("click", () => {
    popups[index].style.display = "block";
  });
});

const closeBtns = document.querySelectorAll(".close");

closeBtns.forEach((closeBtn, index) => {
  closeBtn.addEventListener("click", (event) => {
    event.preventDefault();
    popups[index].style.display = "none";
  });
  //filter animals by species
  document.addEventListener("DOMContentLoaded", function () {
    var speciesFilter = document.getElementById("speciesFilter");
    var animalCards = document.querySelectorAll(".animal-card");
    speciesFilter.addEventListener("change", function () {
      var selectedSpecies = speciesFilter.value;
      animalCards.forEach(function (card) {
        var cardSpecies = card.classList[1];
        if (selectedSpecies === "all" || cardSpecies === selectedSpecies) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
});
