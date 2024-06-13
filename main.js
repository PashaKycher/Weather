// инпут для ввода города
let cityWeather = document.querySelector('.cityWeather')
// кнопка для отправки запроса
let getRequestWeather = document.querySelector('.getRequestWeather')
// поля вывода запроса
let postRequestWeather = document.querySelector('.postRequestWeather')
let weatherNow = document.querySelector('.weatherNow')
let allNews = document.querySelector('.allNews')

// погода
class WeatherInCity {
	constructor(weatherMain, weatherIcon, mainTemp, cityName, weatherTime) {
		this.weatherMain = weatherMain
		this.weatherIcon = weatherIcon
		this.mainTemp = mainTemp
		this.cityName = cityName
		this.weatherTime = weatherTime
	}

	weather() {
		let div = document.createElement('div')

		div.innerHTML = `<p class="name">${this.cityName}</p>`
		div.innerHTML += `<p class="temp">${(this.mainTemp - 274.15).toFixed(
			1
		)} C</p>`
		div.innerHTML += `<p class="main">${this.weatherMain}</p>`
		div.innerHTML += `<img src="https://openweathermap.org/img/wn/${this.weatherIcon}@2x.png" alt="" class="icon">`
		div.innerHTML += `<p class="time">${this.weatherTime}</p>`

		weatherNow.append(div)
	}

	weathers() {
		let div = document.createElement('div')

		div.innerHTML = `<p class="name">${this.cityName}</p>`
		div.innerHTML += `<p class="temp">${(this.mainTemp - 274.15).toFixed(
			1
		)} C</p>`
		div.innerHTML += `<p class="main">${this.weatherMain}</p>`
		div.innerHTML += `<img src="https://openweathermap.org/img/wn/${this.weatherIcon}@2x.png" alt="" class="icon">`
		div.innerHTML += `<p class="time">${this.weatherTime}</p>`

		postRequestWeather.append(div)
	}
}

// новости
class NewsOfCountry {
	constructor(title, urlNews, author, publishedAt) {
		this.title = title
		this.urlNews = urlNews
		this.author = author
		this.publishedAt = publishedAt
	}
	newsCreation() {
		let div = document.createElement('div')

		div.innerHTML = `<div class="oneNews">
				<div class="newsData">
					<a href=${this.urlNews} class="urlNews" target="_blank">${this.title}</a>
					<div class="rek">
						<p class="author">${this.author}</p>
						<p class="publishedAt">${this.publishedAt}</p>
					</div>
				</div>
			</div>`

		allNews.append(div)
	}
	
}

// функция обработки запроса и получения данных
function weatherData() {
	// значение с инпута
	let city = cityWeather.value
	// чистим див
	cityWeather.value = ''
	postRequestWeather.innerHTML = ''
	weatherNow.innerHTML = ''
	allNews.innerHTML = ''
	// ставим див
	weatherNow.style.display = 'block'
	allNews.style.display = 'block'

	// проверяем веденное значение, получаем координаты
	if (city.length < 3) {
		alert('The entered value is not valid')
	}

	let urlCoordinates = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=c6f3ca7cba0e64850fbadcde5f144ad1`

	fetch(urlCoordinates)
		.then(response => response.json())
		.then(json => {
			console.log(json)
			// имя страны
			let country = json[0].country
			// запрос на получение погоды
			let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${json[0].lat}&lon=${json[0].lon}&appid=c6f3ca7cba0e64850fbadcde5f144ad1`

			fetch(url)
				.then(response => response.json())
				.then(json => {
					console.log(json)
					let cityName = json.city.name
					let weather = new WeatherInCity(
						json.list[0].weather[0].main,
						json.list[0].weather[0].icon,
						json.list[0].main.temp,
						cityName,
						json.list[0].dt_txt
					)
					weather.weather()
					for (i = 1; i < json.list.length; i++) {
						let list = json.list[i]
						let weathers = new WeatherInCity(
							list.weather[0].main,
							list.weather[0].icon,
							list.main.temp,
							cityName,
							list.dt_txt
						)
						weathers.weathers()
					}
					let urlNews = `https://newsapi.org/v2/top-headlines?country=${country}&apiKey=eef011350d784309916c78dcd08bcfc3`
					fetch(urlNews)
						.then(response => response.json())
						.then(json => {
							console.log(json)
							for (i = 0; i < json.articles.length; i++) {
								let list = json.articles[i]
								let news = new NewsOfCountry(
									list.title,
									list.url,
									list.author,
									list.publishedAt
								)
								news.newsCreation()		
							}
						})
				})
		})
}

// обработка по нажатию по кнопки
getRequestWeather.addEventListener('click', function () {
	weatherData()
})

// обработка по нажатию по кнопки
cityWeather.addEventListener('keydown', function (e) {
	if (e.code == 'Enter') {
		weatherData()
	}
})
