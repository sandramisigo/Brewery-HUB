//for the dom to be fully loaded before running the script
document.addEventListener('DOMContentLoaded', () => {

//Referencing the elements
const loadBrewerysButton = document.getElementById('load-brewerys');
const breweryTypeSelector = document.getElementById('brewery-type'); 
const brewerySearchInput = document.getElementById('brewery-search');
const breweryListSection = document.getElementById('brewerys');
const breweryList = document.getElementById('brewery-list');
const breweryDetailSection = document.getElementById('brewery-details');
const breweryInformation = document.getElementById('brewery-information');
const favoritesListDisplay = document.getElementById('favorites-list-display');
const viewFavoritesButton= document.getElementById('view-favorites-button');

const favorites = [];

//Adding the event listeners
brewerySearchInput.addEventListener('input', searchbrewerys);
breweryTypeSelector.addEventListener('change',filterByType);
loadBrewerysButton.addEventListener('click',loadBrewerys);
viewFavoritesButton.addEventListener('click', displayFavorites);

//Fetching brewerys from the OPEN BREWERY DB API
function loadBrewerys() {
    fetch(`https://api.openbrewerydb.org/breweries`)
    .then(response => response.json())
    .then(data =>displayBrewerys(data))
    .catch(error => console.error('error encountered:',error));
}

// displaying the brewerys on a list
function displayBrewerys(brewerys) {
    breweryList.innerHTML='';
    brewerys.forEach(brewery => {
        const li = document.createElement('li');
        li.textContent = brewery.name;

//Adding a Favorites button
const favoritesButton = document.createElement('button');
favoritesButton.textContent = 'Add to favorites';
favoritesButton.addEventListener('click', () => addToFavorites(brewery));

li.appendChild(favoritesButton);
breweryList.appendChild(li);

li.addEventListener('click',() => loadBreweryDetails(brewery.id));
 });
 breweryListSection.classList.remove('hidden');
}

//function for fetching and displaying brewery details
function loadBreweryDetails(breweryId) {
    fetch(`https://api.openbrewerydb.org/breweries/${breweryId}`)
    .then(response => response.json())
    .then(brewery => {
      breweryInformation.innerHTML = `
        <h3>${brewery.brewery_type}</h3>
        <p>Type:${brewery.brewery_type}</p>      
        <p>Adress:${brewery.address_1}, ${brewery.state}, ${brewery.city} , ${brewery.country}</p>
        <p>Phone:${brewery.phone}</p>
        <p>Website: <a href="${brewery.website_url}" target="blank">${brewery.website_url}</a></p>
        `;
      breweryDetailSection.classList.remove('hidden');
    })
    .catch(error => console.error(`error encountered:`,error));
}

//function to filter brewery by type
function filterByType(){
    const breweryType = breweryTypeSelector.value;
     let endpoint = `https://api.openbrewerydb.org/breweries`;

    if(breweryType && breweryType !== 'All'){
        endpoint +=`?by_type=${breweryType}`;
    }

    fetch(endpoint)
    .then(response => response.json())
    .then(data => displayBrewerys(data))
    .catch(error => console.error(`error encountered:`, error));
}

//function to search brewerys by name
function searchbrewerys() {
    const searchWord= brewerySearchInput.value;

    fetch(`https://api.openbrewerydb.org/breweries`)
    .then(response=> response.json())
    .then(brewerys => {
        const filteredbrewerys = brewerys.filter(brewery => 
            brewery.name.includes(searchWord)
        );
        displayBrewerys(filteredbrewerys);
    })
    .catch(error => console.error(`error encountered:`, error));
}

//function to add brewery to Favorites
function addToFavorites(brewery){
    if(!favorites.includes(brewery))
        favorites.push(brewery);
        updateFavoritesList();
}

//Function display a Favorites List
function updateFavoritesList() {
    favoritesListDisplay.innerHTML ='';
    
    favorites.forEach((brewery,index) => {
       const li = document.createElement('li');
       li.textContent = brewery.name;

 //adding a "remove from favorites" button
const removeButton = document.createElement('button');
removeButton.textContent="Remove item";
removeButton.addEventListener('click',() => removeFromFavorites(brewery));      
   
li.appendChild(removeButton);
favoritesListDisplay.appendChild(li);
});

//display view favorites if there are favorites
if(favorites.length > 0) {
    viewFavoritesButton.classList.remove('hidden');
} else {
    viewFavoritesButton.classList.add('hidden');
}
}

//function to remove brewery from favorites
function removeFromFavorites(breweryToRemove) {
    const index = favorites.indexOf(breweryToRemove);
    if (index> -1){
        favorites.splice(index,1);   
    }
    updateFavoritesList();
} 
//function to display a prompt message after adding brewery to Favorites
function displayFavorites (){
    prompt('Thank you for Favoriting these Brewerys! You can go ahead and Plan your Visit Now!');
    favoritesListDisplay.length = 0;
    updateFavoritesList();
}

});