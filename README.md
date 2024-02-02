# YOUR PROJECT TITLE
#### Video Demo:  <https://youtu.be/VbbPSFb7WVE>
#### NOTICE:
In order for the app to work a OpenAI API key needs to be added to the app.py file
#### Description:
##### General overview:
My final project for CS50 was a Flask website that generates personalized meal plans based on a form that the user fills out. After the meal plan is generated each meal can be added into the shopping cart. The user can also leave reviews on the page of the plan.

The form the user fills out includes questions about their information, goals, preferences, budget, and cooking time. All this is passed to the OpenAI API via Python and in return it generates a JSON object that includes the plan.

The plan is displayed in a bootstrap carousel where each day is its slide. Each meal can be added to the shopping list individually or all meals can be added. When a meal is added it creates another call for the API with the meal and it returns with the ingredients needed. The user can manually add and remove items from the shopping list if they feel like the AI made a mistake.

The user can also leave a review of the plan. The review form asks for the name, content, and how many stars the user wishes to give out of 5. The review is then stored in a SQL database and when a user visits the homepage there will be another bootstrap carousel that shows random reviews others have left.

##### Each file and what it does:
In the project there are 4 HTML pages each with its own JS script as well, 3 images, the app.py, styles.css, and the review database.

The index page has a call to action with a button that leads the user to fill out the form, simple instructions on how to use the website, reviews from other users, and a quick explanation on how everything works

The baseForm page has a bootstrap carousel where each slide has 2 questions on it. When the slide changes there is a slight animation for the input fields. No input field can be empty but if the user doesn't want to answer for example for the cousine preference they may write 'none' or something similar to let the AI know that there is no preference.

The plan page has a carousel with each slide representing a day in the plan and each slide has a list of all the meals for that day. Each meal can be manually added to the shopping cart or they can be all added at the same time. The shopping cart is a list of ingredients that make up the meals. Each item has the name of the ingredient, the number of that ingredient needed and a button to remove the ingredients from the list. After the list, there is an option to add items manually. A the footer there is a button that leads to the review page.

The review form asks for the user name, and the review itself and there is a custom 5-star radio button that was heavily inspired from <https://codepen.io/hesguru/pen/BaybqXv>.

The app.py script handles all the backend work like redirecting the user and making the API calls. This file does include a personal API key. I don't know how else this should be handled so that other people can use the site without having to generate and place in their own key. The key has a few bucks in its balance and might run out if there is a lot of testing.

##### Personal Note:

I am very interested in fitness and have certain fitness goals that require having a meal plan. I also wanted to try working with AI because it is the future and I want to be able to understand how you work with it. This is why I made the project that I did. Working on this project has taught me a ton of things about working on bigger projects and working with AI.
