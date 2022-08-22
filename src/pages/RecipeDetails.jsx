import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

function RecipesDetails() {
  const [recipe, setRecipe] = useState('');
  const [video, setVideo] = useState('');
  const [ingredients, setIngredients] = useState('');
  const location = useLocation();
  const { id } = useParams();
  const drinkEndpoint = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
  const foodEndpoint = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  const nullNull = 'null - null';
  useEffect(() => {
    const fetchApi = async () => {
      let data = {};
      if (location.pathname.includes('drink')) {
        const drinkResponse = await fetch(drinkEndpoint);
        data = await drinkResponse.json();
        setRecipe(data.drinks[0]);
        const ingredientFilter = Object.entries(data.drinks[0])
          .filter((ingredient) => ingredient[0].includes('strIngredient'));
        const measureFilter = Object.entries(data.drinks[0])
          .filter((measure) => measure[0].includes('strMeasure'));
        const ingredientsList = ingredientFilter
          .map((ingredient, index) => `${ingredient[1]} - ${measureFilter[index][1]}`);
        console.log(ingredientsList);
        const filterIngredients = ingredientsList
          .filter((ingredient) => ingredient !== nullNull && ingredient !== 'null - ');
        setIngredients(filterIngredients);
        console.log('ingredientes:', ingredientFilter);
        console.log('measures:', measureFilter);
      }
      if (location.pathname.includes('food')) {
        const foodResponse = await fetch(foodEndpoint);
        data = await foodResponse.json();
        setRecipe(data.meals[0]);
        setVideo(data.meals[0].strYoutube.replace('watch?v=', 'embed/'));
        const ingredientFilter = Object.entries(data.meals[0])
          .filter((ingredient) => ingredient[0].includes('strIngredient'));
        console.log(ingredientFilter);
        const measureFilter = Object.entries(data.meals[0])
          .filter((measure) => measure[0].includes('strMeasure'));
        console.log(measureFilter);
        const ingredientsList = ingredientFilter
          .map((ingredient, index) => `${ingredient[1]} - ${measureFilter[index][1]}`);
        console.log(ingredientsList);
        const filterIngredients = ingredientsList
          .filter((ingredient) => ingredient !== nullNull && ingredient !== ' - ');
        setIngredients(filterIngredients);
      }
      console.log(data);
    };
    fetchApi();
  }, []);
  return (
    <div>
      {location.pathname.includes('drink') ? (
        <div>
          <h1 data-testid="recipe-title">{recipe.strDrink}</h1>
          <p data-testid="recipe-category">
            {' '}
            {recipe.strAlcoholic}
          </p>
          <img
            data-testid="recipe-photo"
            src={ recipe.strDrinkThumb }
            alt="imagem da receita"
          />
          <p data-testid="instructions">{recipe.strInstructions}</p>
        </div>
      ) : (
        <div>
          <h1 data-testid="recipe-title">{recipe.strMeal}</h1>
          <p data-testid="recipe-category">
            {' '}
            {recipe.strCategory}
          </p>
          <img
            data-testid="recipe-photo"
            src={ recipe.strMealThumb }
            alt="imagem da receita"
          />
          <p data-testid="instructions">{recipe.strInstructions}</p>
          <iframe
            data-testid="video"
            src={ video }
            title="recipe video"
          />
        </div>
      )}
      ;
      <ul>
        {Array.isArray(ingredients) && ingredients.map((ingredient, index) => (
          (ingredient !== 'null - null' || ingredient !== '-')
          && (
            <li
              key={ index }
              data-testid={ `${index}-ingredient-name-and-measure` }
            >
              {ingredient}
            </li>
          )
        ))}
      </ul>
      <div
        data-testid={ `${0}-recomendation-card` }
      />
    </div>);
}

export default RecipesDetails;
