function randomFloat(min, max) {
	return +(Math.random() * (max - min) + min).toFixed(2)
}

function randomInt(min, max) {
	return Math.floor(randomFloat(min, max))
}

function generateDescription(min, max, words) {
	const count = randomInt(min, max)

	const string = Array(count)
		.fill(undefined)
		.map(_ => words[randomInt(0, words.length - 1)])
		.join(' ')
		.toLowerCase()

	return string[0].toUpperCase() + string.slice(1, -1)
}

function generateProducts(count) {
	const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec porttitor eros ut lacus condimentum, posuere lacinia lectus tincidunt. Proin mollis eget est in efficitur. Quisque mollis enim ligula, at iaculis sem dignissim sed. Maecenas ac pulvinar mi, ac consequat lacus. Phasellus tincidunt nisi a arcu suscipit pulvinar. Nullam a tellus';
	const words = lorem.match(/[a-z]+/gi)

	return Array(count).fill(undefined).map((_, idx) => ({
		id: idx + 1,
		name: `Product #${idx+1}`,
		price: randomFloat(25, 1200),
		description: generateDescription(3, 20, words),
	}))
}

function formatProducts(products) {
	return products
		.map(product => `[${product.id}]: ${product.name} [${product.price}$]`)
		.join('\n')
}




const store = {
	visitors: 0,
	products: generateProducts(30),
	profit: 50,
	buyProduct: function (id) {
		const product = this.products.find(p => p.id === id)

		if(product === undefined) {
			return
		}

		this.profit += product.price
		this.products = this.products.filter(p => p.id !== id)

		this.onProductChange?.()
	},
	getProducts: function() {
		return formatProducts(this.products)
	},
	onProductChange: undefined
}


const container = document.querySelector('#products')

function generateProductFromTemplate(product) {
	const productContainer = document.createElement('div')
	productContainer.className = 'product'

	const productName = document.createElement('div')
	productName.className = 'product__name'
	productName.textContent = product.name

	const productPrice = document.createElement('div')
	productPrice.className = 'product__price'
	productPrice.textContent = product.price + ' $'

	const button = document.createElement('button')
	button.textContent = 'BUY'
	button.onclick = () => {
		store.buyProduct(product.id)
	}

	productContainer.append(productName, productPrice, button)

	return productContainer
}



function update() {
	container.innerHTML = ''

	const products = store.products.map(p => generateProductFromTemplate(p))

	container.append(...products)
}

store.onProductChange = update

update()