const MOVIES_URL = "https://japceibal.github.io/japflix_api/movies-data.json";

async function getMovies(url) {
  const response = await fetch(url);
  const movies = await response.json();

  return movies;
}

const btnSearch = document.getElementById("btnBuscar");

btnSearch.addEventListener("click", async function () {
  const searchInput = document
    .getElementById("inputBuscar")
    .value.toLowerCase();
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
  const moviesContainer = document.getElementById("lista");
  moviesContainer.innerHTML = ""; // Limpiar resultados anteriores

  if (filteredMovies.length === 0) {
    moviesContainer.innerHTML = `<p class="text-light text-center">No se encontraron resultados para "<span class="fst-italic" >${searchInput}</span>"</p>`;
    return;
  }

  filteredMovies.forEach((movie) => {
    const rating = movie.vote_average / 2;

    // Generar Estrellas
    let stars = "";
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars += `<div><i class="fa fa-star checked"></i></div>`;
      } else {
        stars += `<div><i class="fa fa-star"></i></div>`;
      }
    }

    // Contenido del popover como HTML
    const popoverContent = `
      <div>
        <div class="d-flex justify-content-between">
          <span>Year:</span>
          <span>${movie.release_date.split("-")[0]}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Runtime:</span>
          <span>${movie.runtime} mins</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Budget:</span>
          <span>$${movie.budget.toLocaleString()}</span>
        </div>
        <div class="d-flex justify-content-between">
          <span>Revenue:</span>
          <span>$${movie.revenue.toLocaleString()}</span>
        </div>
      </div>
    `;

    // Generar tarjeta
    moviesContainer.innerHTML += `
        <li class="list-group-item bg-dark text-light">
          <div class="row" data-bs-toggle="collapse" data-bs-target="#${
            "id" + movie.id
          }" aria-expanded="false" aria-controls="${"id" + movie.id}" style="cursor: pointer;">
            <div class="col-9">
              <h5 class="fw-bold">${movie.title}</h5>
              <p class="text-muted text-truncate fst-italic">${
                movie.tagline
              }</p>
            </div>
            <div class="col-3 d-flex align-items-center justify-content-end">
              ${stars}
            </div>
          </div>

          <div class="collapse bg-dark text-light" id="${"id" + movie.id}" style="cursor: auto;">
            <div>
              <p>${movie.overview}</p>
            </div>
            
            <div class="d-flex justify-content-between">
              <div class="text-muted">
                <p>${movie.genres.map((genre) => genre.name).join(" - ")}</p>
              </div>
            
            
              <button type="button" class="btn btn-secondary" data-bs-container="body" data-bs-toggle="popover" data-bs-placement="bottom" data-bs-html="true" data-bs-content="${popoverContent.replace(
                /"/g,
                "&apos;"
              )}">More <i class="fa fa-caret-down"></i></button>
            
            </div>
          </div>
        </li>
            `;
  });
  
  // Inicializar popovers de bootstrap después de renderizar el HTML dinámico
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]'
  );
  popoverTriggerList.forEach((el) => {
    new bootstrap.Popover(el, {
      html: true,
      trigger: "focus",
    });
  });
  
});
