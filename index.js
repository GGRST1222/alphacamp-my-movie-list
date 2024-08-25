const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const IMAGE_URL = BASE_URL + "/posters/"

const panel = document.querySelector("#data-panel")
const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector("#search-form")
const homeBtn = document.querySelectorAll(".home-btn")
const paginator = document.querySelector("#paginator")
const switchDisplay = document.querySelector("#switch-display")

const MOVIES_PER_PAGE = 12
const movies = []

let filterMovies = []
let DISPLAY_MODE = JSON.parse(localStorage.getItem("DISPLAY_MODE")) || "CARD"
let CURRENT_PAGE = 1

// get API
axios
	.get(INDEX_URL)
	.then((response) => {
		movies.push(...response.data.results) // spread operator

		renderPaginator(movies.length)
		renderMovieList(getMovieByPage(CURRENT_PAGE))
		activePage(CURRENT_PAGE)
	})
	.catch((err) => {
		console.log(err)
	})

function renderPaginator(amount) {
	const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
	let rawHTML = ""

	for (let page = 1; page <= numberOfPages; page++) {
		rawHTML += `
        <li class="page-item" data-page=${page}>
            <a class="page-link" href="#" data-page=${page}>${page}</a>
        </li>
        `
	}
	paginator.innerHTML = rawHTML
}

function getMovieByPage(page) {
	const data = filterMovies.length ? filterMovies : movies
	const startIndex = (page - 1) * MOVIES_PER_PAGE

	activePage(page)

	return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

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
                            <button class="btn btn-info btn-add-favorite col-5" data-id=${movieId}><i class="fa fa-heart"></i></button>
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
            <tr>
                <th class="align-middle">${movieTitle}</th>
                <td>
                    <button class="btn btn-primary btn-show-movie ms-2" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id=${movieId}>More</button>
                    <button class="btn btn-info btn-add-favorite ms-2" data-id=${movieId}><i class="fa fa-heart"></i></button>
                </td>
            </tr>
            `
		})
		contentHTML += `</tbody></table>`
	}
	panel.innerHTML = contentHTML
}

// add movie to favorite
function addToFavorite(id) {
	// console.log(movieId)
	const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
	const movie = movies.find((movie) => movie.id === id)

	if (list.some((movie) => movie.id === id)) {
		return alert("此電影已經在收藏清單中！")
	}
	list.push(movie)
	localStorage.setItem("favoriteMovies", JSON.stringify(list))
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

// toggle page navigation item
function activePage(page) {
	const links = document.querySelectorAll(".page-item")

	links.forEach((link) => {
		if (Number(link.dataset.page) === page) link.classList.add("active")
		else link.classList.remove("active")
	})
}

// add panel's event listener
panel.addEventListener("click", (event) => {
	const target = event.target

	if (target.matches(".btn-show-movie") || target.matches(".card-img-top")) {
		showMovieModal(Number(target.dataset.id))
	} else if (target.matches(".btn-add-favorite, .btn-add-favorite *")) {
		addToFavorite(Number(target.closest(".btn-add-favorite").dataset.id))
	}
})

// search submit
searchForm.addEventListener("submit", () => {
	event.preventDefault()

	const keyword = searchInput.value.trim().toLowerCase()

	if (!keyword.length) {
		// renderMovieList(movies)
	}

	filterMovies = movies.filter((movie) => movie.title.toLowerCase().includes(keyword))

	if (filterMovies.length === 0) {
		return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
	}

	renderPaginator(filterMovies.length)
	renderMovieList(getMovieByPage(1))
})

paginator.addEventListener("click", (event) => {
	if (event.target.tagName !== "A") return

	const page = Number(event.target.dataset.page)
	CURRENT_PAGE = page

	renderMovieList(getMovieByPage(page))
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
	renderMovieList(getMovieByPage(CURRENT_PAGE))
})
