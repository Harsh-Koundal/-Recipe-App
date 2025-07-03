const search = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const recipesContainer = document.querySelector('#recipesContainer');
const main = document.querySelector('main')

searchButton.addEventListener('click',()=>{
    const query = search.value.trim();
    if(query === "") return;

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res =>res.json())
    .then(data=>{
        recipesContainer.innerHTML = "";
        if(data.meals){
             data.meals.forEach(meal => {
                const card = document.createElement('div');
                card.classList.add('recipe-card');
                card.innerHTML = `
                <img src = '${meal.strMealThumb}'>
                <h3>${meal.strMeal}</h3>
                 <div class="btns">
                 <p class="description" onClick="showDetails('${meal.idMeal}')">Description of the recipe.</p>
                 <button  id="save" onclick="saveFavorite('${meal.idMeal}')">&#x2764;</button>
                 </div>
                 
                `;
                recipesContainer.appendChild(card);
             });
        }else{
            recipesContainer.innerHTML = "<p>No recipes found.</p>";
      }
    });
});

function showDetails(id){

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];
              
        const detailsDiv = document.getElementById('recipeDetails');
        detailsDiv.addEventListener('click',()=>{
        detailsDiv.style.display = 'none'
        })
        detailsDiv.style.display = 'block'
        detailsDiv.innerHTML = `
        <div class="details">
        <h2>${meal.strMeal}
        <img src = "${meal.strMealThumb}">
        <p><strong>Category:</strong> ${meal.strCategory}</p>
        <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
        <a href="${meal.strYoutube}" target="_blank">Watch Tutorial</a>
        </div>
        `;

    });
}
function saveFavorite(id){
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if(!favorites.includes(id)){
        favorites.push(id);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('recipe saved!');

    }else {
    alert('Already saved!');
  }

}

function loadFavorites(){
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    recipesContainer.innerHTML = "";
    if(favorites.length === 0){
        recipesContainer.innerHTML = "<p>Favorites saved</p>";
        return;
    }
    favorites.forEach(id =>{
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        .then(res => res.json())
        .then(data =>{
            const meal = data.meals[0];
            const card = document.createElement('div');
            card.classList.add('recipe-card');
            card.innerHTML += `
            <h3>${meal.strMeal}</h3>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <button class="btn" onclick="showDetails('${meal.idMeal}')">View Details</button>
        `;
            recipesContainer.appendChild(card);
        });
    });
}
