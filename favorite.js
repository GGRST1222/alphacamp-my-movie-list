const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const IMAGE_URL = BASE_URL + "/posters/"

const movies = JSON.parse(localStorage.getItem("favoriteMovies"))
const panel = document.querySelector("#data-panel")
const homeBtn = document.querySelectorAll(".home-btn")
const switchDisplay = document.querySelector("#switch-display")

let DISPLAY_MODE = JSON.parse(localStorage.getItem("DISPLAY_MODE")) || "CARD"
// get local storage

renderMovieList(movies)

// post movies to #data-panel
function renderMovieList(movies) {
	let contentHTML = ""

	if (DISPLAY_MODE === "CARD") {
		movies.forEach((movie) => {
			const movieTitle = movie.title
			const imgSrc = IMAGE_URL + movie.image
			const movieId = movie.id
			contentHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 mb-4">
                <div class="card h-100">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#movie-modal">
                        <img src=${imgSrc} class="card-img-top" data-id=${movieId} alt="Movie Poster"/>
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">${movieTitle}</h5>
                    </div>
                    <div class="card-footer">
                        <div class="row justify-content-around">
                            <button class="btn btn-primary btn-show-movie col-5" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${movieId}>More</button>
                            <button class="btn btn-danger btn-remove-favorite col-5" data-id=${movieId}><i class="fa fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            `
			// console.log(movie)
		})
	}

	if (DISPLAY_MODE === "BAR") {
		contentHTML += `<table class="table table-striped"><tbody>`

		movies.forEach((movie) => {
			const movieTitle = movie.title
			const movieId = movie.id
			contentHTML += `
            <tr class="">
                <th class="align-middle">${movieTitle}</th>
                <td class="">
                    <button class="btn btn-primary btn-show-movie ms-2" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${movieId}>More</button>
                    <button class="btn btn-danger btn-remove-favorite ms-2" data-id=${movieId}><i class="fa fa-trash"></i></button>
                </td>
            </tr>
            `
		})
		contentHTML += `</tbody></table>`
	}
	panel.innerHTML = contentHTML
}

function removeFromFavorite(id) {
	if (!movies || !movies.length) return

	const movieIndex = movies.findIndex((movie) => movie.id === id)

	if (movieIndex === -1) return

	movies.splice(movieIndex, 1)
	localStorage.setItem("favoriteMovies", JSON.stringify(movies))
	renderMovieList(movies)
}


function showMovieModal(id) {
	const model_title = document.querySelector("#movie-modal-title")
	const model_image = document.querySelector("#movie-modal-image")
	const model_date = document.querySelector("#movie-modal-date")
	const model_description = document.querySelector("#movie-modal-description")

	const data = movies.find((movie) => movie.id === id)

	model_title.innerText = data.title
	model_image.innerHTML = `
    <img src=${IMAGE_URL + data.image} alt="movie-poster" class="img-fluid">
    `
	model_date.innerText = "Release date：" + data.release_date
	model_description.innerText = data.description
}

// add panel's event listener
panel.addEventListener("click", (event) => {
	const target = event.target

	if (target.matches(".btn-show-movie")) {
		showMovieModal(Number(target.dataset.id))
	} else if (target.matches(".btn-remove-favorite, .btn-remove-favorite *")) {
		removeFromFavorite(Number(target.closest(".btn-remove-favorite").dataset.id))
	}
})


switchDisplay.addEventListener("click", (event) => {
	const target = event.target

	if (target.matches(".bar-mode, .bar-mode *") && DISPLAY_MODE === "CARD") {
		DISPLAY_MODE = "BAR"
	} else if (target.matches(".card-mode, .card-mode *") && DISPLAY_MODE === "BAR") {
		DISPLAY_MODE = "CARD"
	} else {
		return
	}
	localStorage.setItem("DISPLAY_MODE", JSON.stringify(DISPLAY_MODE))
	renderMovieList(movies)
})