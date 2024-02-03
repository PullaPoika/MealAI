var currentCarouselIndex = 1;
const stack = document.getElementById("carousel-inner")
var reviews = [];

window.onload = async function() {
    var reviewCarousel = document.getElementById('reviewCarousel')

    const carousel = new bootstrap.Carousel(reviewCarousel, {
        pause: true,
        ride: false
    })

    try {
        const response = await fetch("/get_review");
        reviews = await response.json();
    } catch (error) {
        console.log('There was an error', error);
    }


    stack.append(generateReviewElement(false));
    stack.append(generateReviewElement(true));
    stack.append(generateReviewElement(false));
}

function generateReviewElement(is_active) {
    if (reviews.length > 0) {
        r = Math.floor(Math.random() * (reviews.length));

        var div = document.createElement("div");

        // Set the attributes and styles of the div element
        if (is_active) {
            div.className = "carousel-item active";
        } else {
            div.className = "carousel-item";
        }

        div.innerHTML =
            "<p>" + reviews[r]['content'] + "</p> <span> " + reviews[r]['writer'] + " </span> <span>" + reviews[r]['stars'] + "/5</span>";
        reviews.splice(r, 1)
        return div
    }

    return ' ';
}


function moveSlideButton(going_forward) {
    var totalItems = $('.carousel-item').length;

    if (going_forward) {
        currentCarouselIndex++;

        if (currentCarouselIndex == totalItems - 1) {
            stack.append(generateReviewElement(false));
        }
    } else {
        if (currentCarouselIndex == 1) {
            stack.insertBefore(generateReviewElement(false), stack.firstChild);
        } else {
            currentCarouselIndex--;
        }
    }

    console.log('total: ', totalItems)
    console.log('currentIndex: ', currentCarouselIndex)
}
