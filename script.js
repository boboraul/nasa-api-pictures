// NASA Api
const count = 6;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const savedConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'});
    if (page === 'results') {
    
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');

    } else {
       
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page) {
    
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    
    currentArray.forEach((result) => {
        // Card Container
        
        const card = document.createElement('div');
        card.classList.add('card');
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day'
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        const saveText = document.createElement('p');
        saveText.onclick = `saveFavorite('${result.url}')`;
       
        saveText.classList.add('clickable');
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        if (page === 'results') {
            saveText.setAttribute('onclick' , `saveFavorite('${result.url}')`);
            saveText.textContent = 'Add to favorites';
            resultsNav.classList.add('hidden');
            favoritesNav.classList.remove('hidden');

        } else {
            saveText.setAttribute('onclick' , `removeFavorite('${result.url}')`);
            saveText.textContent = 'Remove from favorites';
            favoritesNav.classList.add('hidden');
            resultsNav.classList.remove('hidden');
        }
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);  
    });
}

function updateDOM(page) {
    // Get Fvorites from localStorage
    if (localStorage.getItem('nasaFavApod')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavApod'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// get 10 images from NASA API
async function getNasaPictures() {
    // Show Loader
    loader.classList.remove('hidden');
    try {
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        
        updateDOM('results');
        
    } catch(error) {
        console.log('catch error-> ' + error);
    }
}

function saveFavorite(itemUrl) {
    // Loop through Results Array to select Favorite
    resultsArray.forEach((item) => {
        
        if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
           
            favorites[itemUrl] = item;   
            favStr = JSON.stringify(favorites);   
            localStorage.setItem("nasaFavApod", favStr);

            savedConfirmed.hidden = false;
            setTimeout(() => {
                savedConfirmed.hidden = true;
            }, 2000);
        }
        
    });
}

function removeFavorite(itemUrl) {
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
        localStorage.setItem("nasaFavApod", JSON.stringify(favorites));
    }
    updateDOM('favorites');
    
}

getNasaPictures();
