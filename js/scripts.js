
var urlQuery;
var urlDetails;
const xhr = new XMLHttpRequest();
const urlBase = "https://search.imdbot.workers.dev/";
var url;

var player1Select;
var player2Select;
var player1Turn = true;
var isReve = false;
var isHigh = true;

var showRequest_array;

var index = 0;
var selectedValue;


const switch1 = document.querySelector('#reviReve');
switch1.addEventListener('change', () => {
  if (switch1.checked) {
    isReve = true;
    console.log("on rev = " + isReve);
  } else {
    isReve = false;
    console.log("on rev = " + isReve);
  }
});

const switch2 = document.querySelector('#hL');
switch2.addEventListener('change', () => {
  if (switch2.checked) {
    isHigh = false;
    console.log("on higher = " + isHigh);
  } else {
    isHigh = true;
    console.log("on higher = " + isHigh);
  }
});


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
    event.preventDefault();
  var userInput = document.querySelector('#userInput').value;
  urlQuery = userInput;

  setURL(urlQuery, "q");
   clearElements('.searchR');
   clearElements('.selectR');
  searchRequest();
  console.log(url);

});




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
console.log(showRequest_array);
//Displays content specifics 
        selectResult();
        });


    });
};

function specificPull (callback) {
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onload = function() {
        console.log("Specifics got");
        if (xhr.status == 200){
            showRequest_array= JSON.parse(xhr.response);
            console.log(showRequest_array);
            callback();
        } else {
//check for error in xhr request (I had many errors)
            console.log('Error, xhr status: ' + xhr.status);
        };
//reset index to 0 to display new search results 
        index = 0; 

    }; 
};

//Display the selected result
function selectResult() {
    // pass a callback function to specificPull -- waiting for specificPull to finish
    specificPull(function() { 
        const selectR = document.createElement("div");
        selectR.className = "selectR";
            selectR.innerHTML = 
//Title and Image
                "<div><figure><h2 class='selectR'>" + showRequest_array.main.titleText.text + "</h2>"
                + " <img src='" + showRequest_array.short.image + "'>" 
                + "</figure></div>"
//Show or Movie Details 
                + "<div class='centerContent'>"
                    + "<div><h3> Summary: </h3></div>"
                    + "<div><p>" + showRequest_array.short.description + "</p>"
                    + "<h3>Rating & Release </h3>"
                    + "<p> Rating: " + showRequest_array.short.contentRating + "</p>" 
                    + "<p> Realease Date: " + showRequest_array.short.datePublished + "</p>"
                    + (showRequest_array.main.worldwideGross ? // scuffed if statement
                        "<h3> Box Office: </h3>"
                        + "<p>" + JSON.parse(showRequest_array.main.worldwideGross.total.amount).toLocaleString() + "$ USD</p>"
                        : "") // if there are no box office details, don't display anything
                    + "<h3> Genre/s: </h3>"
                    + "<p>" + showRequest_array.short.genre + "</p>"
                    + "<h3> Average Rating: </h3>"
                    +  "<p>" + showRequest_array.short.aggregateRating.ratingValue + " stars on IMDB</p>"
                + "</div>"
//Vote button
                + "<div class='centerContent'><button type='button' class='main-button' id='film-choice-button'> Choose this film </button>"
                + " <button type='button' class='main-button' id='back-button'> Go back </button></div>"
                + "</div>";


        document.getElementById("SelectedImage").appendChild(selectR);
        playerChoice();
        
    });

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

//Get the current player's choice and store it
function playerChoice () {
    const chooseBckBtn = document.getElementById('back-button');
    chooseBckBtn.addEventListener('click', () => {
        clearElements('.selectR');
        createContentSearch();
    });
    const chooseFilmBtn = document.getElementById('film-choice-button');
    chooseFilmBtn.addEventListener('click', () => {
        if (player1Turn == true) {
            player1Select = {
                title: showRequest_array.main.titleText.text,
                image: showRequest_array.short.image,
                date: showRequest_array.short.datePublished,
                review: showRequest_array.short.aggregateRating.ratingValue,
                revenue: showRequest_array.main.worldwideGross.total.amount
            
            };
            player1Turn = false;
            console.log(player1Select);
            clearElements('.selectR');
        } else {
            player2Select = {
                title: showRequest_array.main.titleText.text,
                image: showRequest_array.short.image,
                date: showRequest_array.short.datePublished,
                review: showRequest_array.short.aggregateRating.ratingValue,
                revenue: showRequest_array.main.worldwideGross.total.amount
            };
            player1Turn = true;
            console.log(player2Select);
            clearElements('.selectR');
            var temp = comparePlayerChoice();
            console.log(temp);
            displayWinner(temp);
        };

    });
};


function comparePlayerChoice() {
    console.log(isReve);
    console.log(isHigh);
    if (isHigh) { 
        if (isReve) {
            var temp = player1Select.revenue - player2Select.revenue;
            if (temp > 0) {
                return 1;
            } else if (temp < 0) {
                return 2;
            } else {
                return 0;
            };
        } else {
            var temp = player1Select.review - player2Select.review;
            if (temp > 0) {
                return 1;
            } else if (temp < 0) {
                return 2;
            } else {
                return 0;
            };
        }
    } else {
        if (isReve) {
            var temp = player1Select.revenue - player2Select.revenue;
            if (temp > 0) {
                return 2;
            } else if (temp < 0) {
                return 1;
            } else {
                return 0;
            };
        } else {
            var temp = player1Select.review - player2Select.review;
            if (temp > 0) {
                return 2;
            } else if (temp < 0) {
                return 1;
            } else {
                return 0;
            };
        };
    };
};

function displayWinner (winNum) {
    clearElements('.selectR');
    clearElements('.searchR');
    const hide = document.getElementById('ContentSearch');
    hide.style.display = "none";
    const hideMe = document.getElementById('clearMe');
    hideMe.style.display = "none";
    const hideSwitch = document.getElementById('SortingChoice');
    hideSwitch.style.display = "none";

    const selectR = document.createElement("div");
    selectR.className = "selectR";S
    if (winNum == 1) {
        console.log("Player 1 wins");
        selectR.innerHTML = 
//Title and Image
            "<div><figure><h2 class='selectR'>" + player1Select.title + " is the winner! </h2>"
            + " <img src='" + player1Select.image + "'>" 
            + "<p> Realease Date: " + player1Select.date + "</p>"
            + "</figure></div>"
//Show or Movie Details 
            + "<div class='centerContent'>"
                + "<h3>Revenue in the box office: </h3>"
                + "<h4>$ " + JSON.parse(player1Select.revenue).toLocaleString() + "</h4>" 
                + "<h3> Rating: </h3>"
                + "<h4>" + player1Select.review + " / 10 </h4>"
            + "</div>";
            document.getElementById("SelectedImage").appendChild(selectR);
    } else if (winNum == 2) {
        console.log("Player 2 wins");
        selectR.innerHTML = 
//Title and Image
            "<div><figure><h2 class='selectR'>" + player2Select.title + " is the winner! </h2>"
            + " <img src='" + player2Select.image + "'>" 
            + "<p> Realease Date: " + player2Select.date + "</p>"
            + "</figure></div>"
//Show or Movie Details 
            + "<div class='centerContent'>"
                + "<h3>Revenue in the box office: </h3>"
                + "<h4>$ " + JSON.parse(player2Select.revenue).toLocaleString() + "</h4>" 
                + "<h3> Rating: </h3>"
                + "<h4>" + player2Select.review + " / 10 </h4>"
                +"<div class='centerContent'><button type='button' class='main-button' id='reset-button'> Wanna play again? </button>"
            + "</div>";
            document.getElementById("SelectedImage").appendChild(selectR);
            const resetBtn = document.getElementById('reset-button');
            resetBtn.addEventListener('click', () => {
                location.reload();
            });
    };
};




    


