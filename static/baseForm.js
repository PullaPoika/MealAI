var currentTab = 0;
setFormValues()
showTab(currentTab);

function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("form-container");
    x[n].style.display = "flex";
    // ... and fix the Previous/Next buttons:
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:
    fixStepIndicator(n)
}

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("form-container");
    // Exit the function if any field in the current tab is invalid:
    if (n == 1 && !validateForm()) return false;
    // Hide the current tab:
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        storeFormValues(Array.from(document.getElementsByTagName("input")));
        document.getElementById("baseForm").submit();
        return false;
    }
    // Otherwise, display the correct tab:
    showTab(currentTab);
}

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, z, i, valid = true;
    x = document.getElementsByClassName("form-container");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab:
    for (i = 0; i < y.length; i++) {
        // If a field is empty...
        if (y[i].value == "") {
            if (y[i].classList.contains('hidden')) {
                y[i].nextElementSibling.classList.add('btn-danger');
                y[i].nextElementSibling.classList.remove('btn-secondary');
            }
            // add an "invalid" class to the field:
            y[i].className += " invalid";
            // and set the current valid status to false:
            valid = false;
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

function fixStepIndicator(n) {
    // This function removes the "active" class of all steps...
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}

//form slideshow with animations https://stackoverflow.com/questions/55029042/how-to-add-slide-effect-when-clicking-next-in-a-form


function dropdownChosen(option, target, dropdownId) {
    document.getElementById(target).value = option;
    var dropdown = document.getElementById(dropdownId)
    dropdown.innerText = option;
    dropdown.classList.remove('btn-danger');
    dropdown.classList.add('btn-secondary');
}

function storeFormValues(fields) {
    if (fields) {
        fields.forEach((field) => {
            localStorage.setItem(field.id, field.value);
        })
    }
}

function setFormValues() {
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        var element = document.getElementById(key)
        if (element) {
            element.value = localStorage.getItem(key)
            //show the chosen element on the dropdown
            if (element.classList.contains('dropdown-input')) {
                dropdownChosen(element.value, element.id, element.nextElementSibling.id)
            }
        }
    }
}

var age = document.querySelector("#age")
age.addEventListener("change", (event) => {
    console.log(age.value)
    if (age.value < 0 || age.value > 150) {
        age.value = 30
    }
});

var days = document.querySelector("#days")
age.addEventListener("change", (event) => {
    console.log(age.value)
    if (days.value < 1 || days.value > 5) {
        days.value = 3
    }
});
