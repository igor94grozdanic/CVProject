//#region slideshow functions

var slideIndex = 1;
var isClicked = false;
showSlides(slideIndex);

function plusSlides(n) {
    isClicked = true;
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    //var dots = document.getElementsByClassName("dot");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++){
        slides[i].style.display = "none";
    }

    /*for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }*/

    slides[slideIndex - 1].style.display = "block";
    slideImageIndex = 0;
    //dots[slideIndex - 1].className += "active";
}

// Auto slides

var slideIndex = 0;
var timeoutValue = 9000;
showSlidesAutomatic();

var slideImageIndex = 0;
var timeoutImageValue = 3000;

//showSubImagesAutomatic();

function showSlidesAutomatic() {
    /*var i;
    
    if (isClicked == false) {
        slideImageIndex = 0;
        var slides = document.getElementsByClassName("mySlides");

        for (i = 0; i < slides.length; i++){
            slides[i].style.display = "none";
        }

        slideIndex++;

        if (slideIndex > slides.length) {
            slideIndex = 1;
        }

        slides[slideIndex - 1].style.display = "block";
        setTimeout(showSlidesAutomatic, timeoutValue);
    }
    else {
        isClicked = false;
        setTimeout(showSlidesAutomatic, timeoutValue);
    }*/
    let i;
    let slides = document.getElementsByClassName("mySlides");

    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }

    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1} 
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlidesAutomatic, 3500); // Change image every 3.5 seconds
}

function showSubImagesAutomatic() {
    var i;

    var slideSubImages = document.getElementsByClassName("subImage");
        var slideImagesArray = [];
        var showImagesArray = [];

        switch (slideIndex) {
            case 1:
                slideImagesArray = [0, 1, 2, 3, 4, 5];
                showImagesArray = [6, 12];
            break;
            case 2:
                slideImagesArray = [6, 7, 8, 9, 10, 11];
                showImagesArray = [0, 12];
            break;
            case 3:
                slideImagesArray = [12, 13, 14, 15, 16, 17];
                showImagesArray = [0, 6];
            break;
        }

        for (i = 0; i < slideSubImages.length; i++){
            slideSubImages[i].style.display = "none";
        }

        slideImageIndex++;

        if (slideImageIndex > 6) {
            slideImageIndex = 1;
        }

        var imageIndex = slideImagesArray[slideImageIndex - 1];

        slideSubImages[imageIndex].style.display = "block";
        slideSubImages[showImagesArray[0]].style.display = "block";
        slideSubImages[showImagesArray[1]].style.display = "block";

        setTimeout(showSubImagesAutomatic, timeoutImageValue);
}

function goToMapPage(){
    window.location.href= "Map.html";
}

function alertMessage(){
    alert('Grad nije trenutno dostupan / The city is not available now');
}

//#endregion