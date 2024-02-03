var shoppingList = {}

if (plan[0] == "error") {
    var div = document.createElement("div");
    div.innerHTML = "There was an error loading in your plan, try again at another time"
}
plan['days'].forEach((day, dayIndex) => {
    var div = document.createElement("div");
    var title = document.createElement("h2");
    title.innerHTML = ("Day: " + (dayIndex + 1))
    title.className = "plan-day-title"

    if (dayIndex == 0) {
        div.className = "carousel-item active";
    } else {
        div.className = "carousel-item";
    }
    div.innerHTML = `
        <div class="row row-cols-1 row-cols-md-3 g-4">
            <div class="plan-carusel-item">
                <div class="col">
                </div>
            </div>
        </div>`

    document.getElementsByClassName("carousel-inner")[0].append(div)
    document.getElementsByClassName("carousel-item")[dayIndex].insertBefore(title, document.getElementsByClassName("carousel-item")[dayIndex].firstChild)

    Object.entries(day).forEach((meal) => {
        var row = document.createElement("div");
        row.className = "card h-100";
        row.innerHTML += `
            <div class="card-body">
                <h5 class="card-title">${meal[0]}</h5>
                <p class="card-text">${meal[1]}</p>
                <button class="btn btn-success" type="button" onClick="addToShoppingList('${meal[1]}')">Add to List</button>
            </div>`
        document.getElementsByClassName('col')[dayIndex].append(row)
    })
});


async function getIngredients(meals) {
    var ingredients = [];
    try {
        const response = await fetch(`/gen_ingredients?meals=${meals}`);
        ingredients = await response.json();
        console.log(ingredients)
    } catch (error) {
        console.log('There was an error', error);
    }
    return ingredients['ingredients']
}

async function addToShoppingList(meal) {
    var ingredients = await getIngredients(meal)
    var ingLen = ingredients.length;
    ingredients.forEach((ingred) => {
        ingredients = ingred.charAt(0).toUpperCase() + ingred.substring(1).toLowerCase();
        var li;
        var button = document.createElement("button");
        button.className = "noselect remove-button";
        button.innerHTML = `<span class="text">Remove</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>`
        //Source: https://uiverse.io/cssbuttons-io/stupid-impala-51
        button.addEventListener('click', removeCurrentShoppingListItem);

        if (ingredients in shoppingList) {
            shoppingList[ingredients] += 1;
            document.getElementById(ingredients).innerHTML = `${ingredients} X ${shoppingList[ingredients]}`
            document.getElementById(ingredients).append(button)
            li = document.getElementById(ingredients)
        } else {
            li = document.createElement("li")
            li.className = "list-group-item"
            document.getElementById('shopping-list').append(li)
            li.setAttribute('id', ingredients);
            shoppingList[ingredients] = 1;
            li.innerHTML = `${ingredients} X ${shoppingList[ingredients]}`
            li.append(button)
        }

        function removeCurrentShoppingListItem() {
            removeShoppingListItem(li, ingredients, button)
        }
    })
}

async function addAllToShoppingList() {
    plan['days'].forEach((day, dayIndex) => {
        Object.entries(day).forEach((meal) => {
            addToShoppingList(meal[1])
        })
    })
}

function removeAllToShoppingList() {
    while (document.getElementById('shopping-list').firstChild) {
        document.getElementById('shopping-list').removeChild(document.getElementById('shopping-list').firstChild);
    }
    shoppingList = {}
}

function removeShoppingListItem(item, ingredients, button) {
    shoppingList[item.id] -= 1
    item.innerHTML = `${ingredients} X ${shoppingList[ingredients]}`
    if (shoppingList[item.id] < 1) {
        delete shoppingList[item.id]
        item.remove();
    }
    item.append(button)
}

function manualShoppingListRow() {
    input = document.getElementById('manual-shopping-list-input').value
    quantity = parseInt(document.getElementById('qnt').value)

    if (input && quantity > 0) {
        document.getElementById('manual-shopping-list-input').value = ''
        document.getElementById('qnt').value = 1
        var li;
        var ingredients = input.charAt(0).toUpperCase() + input.substring(1).toLowerCase();
        var button = document.createElement("button");
        button.className = "noselect remove-button";
        button.innerHTML = `<span class="text">Remove</span><span class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"></path></svg></span>`
        //Source: https://uiverse.io/cssbuttons-io/stupid-impala-51
        button.addEventListener('click', removeCurrentShoppingListItem);


        if (ingredients in shoppingList) {
            shoppingList[ingredients] += quantity;
            document.getElementById(ingredients).innerHTML = `${ingredients} X ${shoppingList[ingredients]}`
            document.getElementById(ingredients).append(button)
            li = document.getElementById(ingredients)
        } else {
            li = document.createElement("li")
            li.className = "list-group-item"
            document.getElementById('shopping-list').append(li)
            li.setAttribute('id', ingredients);
            shoppingList[ingredients] = quantity;
            li.innerHTML = `${ingredients} X ${shoppingList[ingredients]}`
            li.append(button)
        }

        function removeCurrentShoppingListItem() {
            removeShoppingListItem(li, ingredients, button)
        }
    }

}
