const MOVIES_URL = "https://japceibal.github.io/japflix_api/movies-data.json";

async function getMovies() {
  const response = await fetch(MOVIES_URL);
  const movies = await response.json();

  return movies;
}

function showMovies(movies) {
  const moviesContainer = document.getElementById("lista");
    movies.forEach((movie) => {
    const rating = movie.vote_average / 2;

    // Generate stars HTML
    let stars = "";
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            stars += `<div><i class="fa fa-star checked"></i></div>`;
        } else {
            stars += `<div><i class="fa fa-star"></i></div>`;
        }
    }

    moviesContainer.innerHTML += `
        <li class="list-group-item bg-dark text-light">
            <div class="row" data-bs-toggle="collapse" data-bs-target="#${"id"+ movie.id}" aria-expanded="false" aria-controls="${"id"+ movie.id}">
                <div class="col-9">
                    <h5 class="fw-bold">${movie.title}</h5>
                    <p class="text-muted text-truncate fst-italic">${movie.tagline}</p>
                </div>
                <div class="col-3 d-flex align-items-center justify-content-end">
                    ${stars}
                </div>
            </div>

            <div class="collapse" id="${"id"+ movie.id}">
                <div class="card card-body bg-dark text-light">
                    <p class="card-text">${movie.overview}</p>
                </div>
            </div>
        </li>
            `;
  });
}

getMovies().then((movies) => showMovies(movies));
