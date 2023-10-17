
var urlQuery;
const xhr = new XMLHttpRequest();
const urlBase = "https://search.imdbot.workers.dev/?q=";
var url;

var showRequest_array;

function searchRequest() {
    xhr.open("GET", url, true);
    xhr.send(null);
    xhr.onload = function() {
        console.log("Grabbed the data!");
        if (xhr.status == 200){
            showRequest_array= JSON.parse(xhr.response);
            console.log(showRequest_array);
            // console.log(showRequest_array.description[0]["#IMG_POSTER"]); -- How the data is received is strange
        
            while (index <= showRequest_array.description.length - 1){
                searchResult();
            };
            imageSelect(); //Search for hover states and click events on search results 

        } else {
            console.log('Error, xhr status: ' + xhr.status); //check for error in xhr request (I had many errors)
        };

        index = 0; //reset index to 0 to display new search results 

    }; 
};

//Co-pilot recommended this but it didn't work so I changed it (Not sure if I have to source this)
const form = document.querySelector('form');
form.addEventListener('submit', (event) => {
  event.preventDefault(); // prevent the form from submitting
  var userInput = document.querySelector('#userInput').value;
  urlQuery = userInput;
  url = urlBase + urlQuery;

  //Clears the previous search results, provided by co-pilot
  const searchResults = document.querySelectorAll('.searchR');
  searchResults.forEach(result => result.remove());

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
            + "<img src='" + showRequest_array.description[index]["#IMG_POSTER"]
            + "'>" 
            + "<p>" + showRequest_array.description[index]["#AKA"] + "</p>"
            + "</figure>"
            index++;
    document.getElementById("PrimaryContent__group").appendChild(searchR);
};

//Selecting the image and adding hover states
//Uses selectResult to display the selected content and index
function imageSelect () {;
    //From co-pilot
    const images = document.querySelectorAll('img');

    
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
          //Clears the previous search results, provided by co-pilot
        const searchResults = document.querySelectorAll('.searchR');
        searchResults.forEach(result => result.remove());
        selectResult(index);
        });

    });
};

//Display the selected result
function selectResult(selectedValue) {
    const selectR = document.createElement("div");
    selectR.className = "selectR";
        selectR.innerHTML = "<figure>" 
            + "<img src='" + showRequest_array.description[selectedValue]["#IMG_POSTER"] + "'>" 
            + "</figure>"
            + "<div><p>" + showRequest_array.description[selectedValue]["#AKA"] + "</p></div>";

    document.getElementById("SelectedImage").appendChild(selectR);
};


//How you display the contet, finding key words, showing themes or reoccuring content
//That crazy friend 