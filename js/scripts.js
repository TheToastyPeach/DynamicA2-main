
var urlQuery;
var urlDetails;
const xhr = new XMLHttpRequest();
const urlBase = "https://search.imdbot.workers.dev/";
var url;

var showRequest_array;

//Pulling searched data from the API
function searchRequest() {
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onload = function() {
        console.log("Grabbed the data!");
        if (xhr.status == 200){
            showRequest_array= JSON.parse(xhr.response);
            console.log(showRequest_array.description);
// console.log(showRequest_array.description[0]["#IMG_POSTER"]); -- How the data is received is strange
        
            while (index <= showRequest_array.description.length - 1){
                searchResult();
            };
//Search for hover states and click events on search results 
            imageSelect(); 

        } else {
//check for error in xhr request (I had many errors)
            console.log('Error, xhr status: ' + xhr.status);
        };
//reset index to 0 to display new search results 
        index = 0; 

    }; 
};

//Co-pilot recommended this but it didn't work so I changed it (Not sure if I have to source this)
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting
  var userInput = document.querySelector('#userInput').value;
  urlQuery = userInput;

  setURL(urlQuery, "q");
  clearElements('.searchR');
  clearElements('.selectR');
  searchRequest();
  console.log(url);

});


var index = 0;
var selectedValue;

//Display the search results
function searchResult() {
    const searchR = document.createElement("div");
    searchR.className = "searchR";
        searchR.innerHTML = "<figure>" 
            + "<img src='" + showRequest_array.description[index]["#IMG_POSTER"] + "'>" 
            + "<p>" + showRequest_array.description[index]["#AKA"] + "</p>"
            + "</figure>"
            index++;
    document.getElementById("PrimaryContent__group").appendChild(searchR);
};

//Selecting the image and adding hover states
//Uses selectResult to display the selected content and index
function imageSelect () {
//Some from co-pilot, altered to work
    const images = document.querySelectorAll('img');

//Get images & index
    images.forEach((image, index) => {
//Hover state
    image.addEventListener('mouseover', () => {
        image.classList.add('hoveringImg');
    });
    image.addEventListener('mouseout', () => {
        image.classList.remove('hoveringImg');
    });

// Loop through each image element and add a click event listener
    image.addEventListener('click', () => {
//Set value of urlDetail
        urlDetails = showRequest_array.description[index]["#IMDB_ID"];


        clearElements('.searchR');
//Sets the target to details
        setURL(urlDetails, "t");
console.log(url);
//Pulls the specifics 
        specificPull();
//Displays content specifics 
        selectResult(index);
        });

    });
};


function specificPull () {
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onload = function() {
        console.log("Specifics got");
        if (xhr.status == 200){
            showRequest_array= JSON.parse(xhr.response);
            console.log(showRequest_array);
        } else {
//check for error in xhr request (I had many errors)
            console.log('Error, xhr status: ' + xhr.status);
        };
//reset index to 0 to display new search results 
        index = 0; 

    }; 
};

//Display the selected result
function selectResult(selectedValue) {
    const selectR = document.createElement("div");
    selectR.className = "selectR";
        selectR.innerHTML = 
            "<div><h2 class='selectR'>" + showRequest_array.description[selectedValue]["#TITLE"] + "</h2>"
            + "<p> Realeased in: <em>" + showRequest_array.description[selectedValue]["#YEAR"] + "</em></p>"
            + "</div>"
            + "<figure> <img src='" + showRequest_array.description[selectedValue]["#IMG_POSTER"] + "'>" 
            + "</figure>";

    document.getElementById("SelectedImage").appendChild(selectR);
};

//Clears the selected elements 
function clearElements (elementId) {
//Provided by co-pilot, altered to work 
    const searchResults = document.querySelectorAll(elementId);
    searchResults.forEach(result => result.remove());
};

function setURL (setValue, type) {
    if (type == "q"){
        url = urlBase + "?q=" + setValue;
    } else if (type == "t") {
        url = urlBase + "?tt=" + setValue;
    };
};


//How you display the contet, finding key words, showing themes or reoccuring content
//That crazy friend 