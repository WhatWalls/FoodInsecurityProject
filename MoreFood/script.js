const savedCount = document.getElementById("count");
const savedButton = document.getElementById("saved");

console.log(savedCount);

let familiesSaved = 0;

savedButton.addEventListener("click", () => {
  familiesSaved++;
  savedCount.innerHTML = `Families Saved: ${familiesSaved}`;
})

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  map = new Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 8,
  });
}

initMap();
