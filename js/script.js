const MOVIES_URL = "https://japceibal.github.io/japflix_api/movies-data.json";

async function getMovies(url) {
  const response = await fetch(url);
  const movies = await response.json();
  return movies;
}

const btnSearch = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const moviesContainer = document.getElementById("lista");

// Función para renderizar estrellas (incluye medias estrellas)
function renderStars(rating) {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    console.log(rating, i);
    if (rating >= i) {
      stars += `<i class="fa fa-star checked"></i>`;
    } else if (rating >= i - 0.5) {
      stars += `<i class="fa fa-star-half-stroke checked"></i>`;
    } else {
      stars += `<i class="fa fa-star"></i>`;
    }
  }
  return stars;
}

// Función principal de búsqueda
async function buscarPeliculas() {
  const searchInput = inputBuscar.value.trim().toLowerCase();
  moviesContainer.innerHTML = ""; // Limpiar resultados previos

  if (searchInput === "") {
    moviesContainer.innerHTML = `<p class="text-light text-center">Por favor, ingrese un texto para buscar</p>`;
    return;
  }

  const movies = await getMovies(MOVIES_URL);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchInput) ||
      movie.overview.toLowerCase().includes(searchInput) ||
      movie.tagline.toLowerCase().includes(searchInput) ||
      movie.genres.some((genre) =>
        genre.name.toLowerCase().includes(searchInput)
      )
  );

  if (filteredMovies.length === 0) {
    moviesContainer.innerHTML = `<p class="text-light text-center">No se encontraron resultados para "<span class="fst-italic">${searchInput}</span>"</p>`;
    return;
  }

  let html = "";
  filteredMovies.forEach((movie) => {
    const rating = movie.vote_average / 2;
    const stars = renderStars(rating);

    const popoverContent = `
      <div>
        <div class="d-flex justify-content-between"><span>Year:</span><span>${
          movie.release_date.split("-")[0]
        }</span></div>
        <div class="d-flex justify-content-between"><span>Runtime:</span><span>${
          movie.runtime
        } mins</span></div>
        <div class="d-flex justify-content-between"><span>Budget:</span><span>$${movie.budget.toLocaleString()}</span></div>
        <div class="d-flex justify-content-between"><span>Revenue:</span><span>$${movie.revenue.toLocaleString()}</span></div>
      </div>
    `;

    html += `
      <li class="list-group-item bg-dark text-light">
        <div class="row" data-bs-toggle="collapse" data-bs-target="#id${
          movie.id
        }" aria-expanded="false" aria-controls="id${
      movie.id
    }" style="cursor: pointer;">
          <div class="col-9">
            <h5 class="fw-bold">${movie.title}</h5>
            <p class="text-muted text-truncate fst-italic">${movie.tagline}</p>
          </div>
          <div class="col-3 d-flex align-items-center justify-content-end text-center text-dark" 
          title="${rating}/5 estrellas">
            ${stars}
          </div>
        </div>
        <div class="collapse bg-dark text-light" id="id${
          movie.id
        }" style="cursor: auto;">
          <div><p>${movie.overview}</p></div>
          <div class="d-flex justify-content-between">
            <div class="text-muted"><p>${movie.genres
              .map((genre) => genre.name)
              .join(" - ")}</p></div>
            <button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-html="true" data-bs-content='${popoverContent.replace(
              /'/g,
              "&apos;"
            )}'>More <i class="fa fa-caret-down"></i></button>
          </div>
        </div>
      </li>
    `;
  });
  moviesContainer.innerHTML = html;

  // Inicializar popovers
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  popoverTriggerList.forEach((el) => {
    new bootstrap.Popover(el, { html: true, trigger: "focus" });
  });
}

// Buscar al hacer click en el botón
btnSearch.addEventListener("click", buscarPeliculas);

// Buscar al presionar Enter en el input
inputBuscar.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    buscarPeliculas();
  }
});
