//#region initialize objects

/* objects for specific classes*/ 

//Small changes
// small update
//const locations = new Locations();
const mapLabelsRS = new MapLabelsRS();
const mapLabelsENG = new MapLabelsENG();
const locationsAPI = new LocationsAPI();

const mapLayerLabelsRS = new MapLayerLabelsRS();
const mapLayerLabelsENG = new MapLayerLabelsENG();

var locationTypeChecked = "";
var locationIdChecked = "";
var automaticChecked = false;

const cityId = 1;
const cityCoords = [43.6433, 21.8667];
const apiUrladdress = new APIUrls();

/* enum class for language */
const appLanguages = Object.freeze({
    Serbian: 'Serbian',
    English: 'English'
});

var dictLocationTypes = {
    1: "cityLocations",
    2: "picnicAreas",
    3: "waterSprings",
    4: "culturalContent",
    5: "baths",
    6: "parks",
    7: "naturalAttractions",
    8: "childrenFacilities",
    9: "sportsFacilities",
    10: "thermalSprings",
    11: "touristSites",
    12: "lookouts",
    13: "sights"
  };

var dictLocationTypeIds = {
    "cityLocations": 1,
    "picnicAreas": 2,
    "waterSprings" :3,
    "culturalContent" : 4,
    "baths" : 5,
    "parks" : 6,
    "naturalAttractions" : 7,
    "childrenFacilities" : 8,
    "sportsFacilities" : 9,
    "thermalSprings" : 10,
    "touristBenefits" : 11,
    "lookouts" : 12,
    "sights" : 13
};

/* variables for toggle menu visibility */

var layersMenuVisibility = false;
var mapLegendMenuVisibility = false;
var languagesVisibility = false;

/* current language variable */

var currentLanguage = appLanguages.Serbian;

/* variables for map and location div */

var mapDivPercentageHeight = '70%';
var locationsPanelPercentageHeight = '30%';
var isHiddenLocationPanel = false;
var locationsForCityArray = {};
var citiesArray = [];
var selectedCity = {};

/* location images */
var slideIndex = 0;

/*var imageURLsList = [];
var imageHeaderTextRS = [];
var imageHeaderTextENG = [];
var locationCoords = [];
var imageLocationTextRS = [];
var imageLocationTextENG = [];
var locationZoomLevels = [];
var locationIds = [];
var imagePositionsArray = [];*/

/*function prepareElementsForSlideShow(locationsPriorityOne){
    locationCoords = [];

    locationsPriorityOne.forEach((location) => (
        imageURLsList.push(location.image_url_location),
        imageHeaderTextRS.push(location.name),
        imageHeaderTextENG.push(location.name),
        imageLocationTextRS.push(location.name),
        imageLocationTextENG.push(location.name),
        locationCoords.push([parseFloat(location.x_coord), parseFloat(location.y_coord)]),
        locationZoomLevels.push(16),
        locationIds.push(location.location_id),
        imagePositionsArray.push(location.image_position)
        ));

        console.log(locationCoords);
}*/

//#endregion

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
    //dots[slideIndex - 1].className += "active";
}

// Auto slide

var slideIndex = 0;
var timeoutValue = 4000;
showSlidesAutomatic();

function showSlidesAutomatic() {
    var i;
    if (isClicked == false ) {
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
    }
}

//#endregion

//#region get data from api

// Defining async function

async function getLocationsAPI(url) {
    
    //activate progress bar
    //document.getElementById("divProgressBar").style.visibility='visible';
    //var progressBarDiv = document.getElementById("divProgressBar");
    //progressBarDiv.style.height = "15px";
    //progressBarDiv.style.padding = "2px";

    // Storing response
    const response =  await locationsAPI.Result; //await fetch(url);

    // Storing data in form of JSON
    if (response){
        var data = response; //await response.json();
        locationsForCityArray = new LocationsTest(data);

        if (automaticChecked == true && locationTypeChecked != "" && locationTypeChecked != null){
            showLocation();
        }

        //document.getElementById("divProgressBar").style.visibility='hidden';
        //progressBarDiv.style.height = "0px";
        //progressBarDiv.style.padding = "0px";
        
        //prepareElementsForSlideShow(locationsForCityArray.getLocationsByPriority(1));
    }
}

function showLocation(){
    var locationTypeId = dictLocationTypeIds[locationTypeChecked];
    var checkBoxCheckedId = dictLocationTypes[locationTypeId] + "CB";

    var locationXCoord = locationsForCityArray.getLocationXCoordByLocationId(locationIdChecked);
    var locationYCoord = locationsForCityArray.getLocationYCoordByLocationId(locationIdChecked);
            
    var midPointCoords = getMidPointCoords(cityCoords,[locationXCoord, locationYCoord]);

    document.getElementById(checkBoxCheckedId).checked = true;
    prepareMarkerElements(locationTypeId, locationIdChecked);

    map.setView(midPointCoords, 13);
}

function getMidPointCoords(cityCoords, locationCoords){
    var pi = Math.PI;
    var fi1 = cityCoords[0] * (pi/180);
    var l1 = cityCoords[1] * (pi/180);
    var fi2 = locationCoords[0] * (pi/180);
    var l2 = locationCoords[1] * (pi/180);

    const bX = Math.cos(fi2) * Math.cos(l2 - l1);
    const bY = Math.cos(fi2) * Math.sin(l2 - l1);

    const fi3 = Math.atan2(Math.sin(fi1) + Math.sin(fi2), 
                    Math.sqrt((Math.cos(fi1) + bX) * (Math.cos(fi1) + bX) + bY * bY));
    
    const l3 = l1 + Math.atan2(bY, Math.cos(fi1) + bX);

    return [fi3 * (180/pi), l3 * (180/pi)];
}

async function getCitiesAPI(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    if (response){
        var data = await response.json();
        citiesArray = new Cities(data);
        selectedCity = citiesArray.getCityById(1);
    }
}

//#endregion

//#region initialize map and wms layers

// initialize map
var map = L.map('map', { attributionControl: false, zoomControl:false }).setView(cityCoords, 15);

// initialize base layers

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 30,
      attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

osm.addTo(map);

// initialize wms layers (roads, locations and zones)

var wmsLayerRoads = L.tileLayer.wms('http://localhost:8080/geoserver/Sokobanja_portal/wms', {
    layers: "Sokobanja_portal:Putevi",
    format: "image/png",
    transparent: true,
    attribution: "mylayer",
  });

var wmsLayerZones = L.tileLayer.wms('http://localhost:8080/geoserver/Sokobanja_portal/wms', {
    layers: "Sokobanja_portal:Zone",
    format: "image/png",
    transparent: true,
    attribution: "mylayer",
});

/* async functions for loading WMS layers */

async function loadAndHideWMS(layerGroup, wMSLayer){
      await loadWMS(layerGroup, wMSLayer);
      layerGroup.clearLayers();
};

async function loadWMS(layerGroup, wMSLayer){
    layerGroup.addLayer(wMSLayer);
    return;
};

// add geocoder search
//L.Control.geocoder().addTo(map);

//#endregion

//#region create toggle menu

// toggle menu 

const ToggleMenu = L.Control.extend({
    onAdd: map => {
      const container = L.DomUtil.create("div");
      container.innerHTML = `<input type="checkbox" name="" id="check" style="OVERFLOW-Y:scroll;">
                             <div class="container">
                                <label for="check">
                                    <span id="times" onclick="hidePanels()"><img class="menuIcons" style="margin-left: -96px" src="images/MapPage/MenuIcons/ExitBarIcon.svg"></span>
                                    <span id="bars"><img class="menuIcons" src="images/MapPage/MenuIcons/MenuIcon.svg" style="margin-left: -8px"></img></span>
                                </label>
                                <!-- <div class="head"><span id="times" onclick="hidePanels()"><img class="menuIcons" src="images/MapPage/MenuIcons/ExitBarIcon.png"></span></div> -->
                                <div class="toggleMenu">
                                    <li>
                                       <button id="layerGroupButton" class="buttonClass" title="Prikaži slojeve!" onclick="showLayersPanel()">
                                       <img class="menuIcons" src="images/MapPage/MenuIcons/SelectLayerIcon.svg">
                                        </button>
                                    </li>
                                    <!--<li>
                                        <button id="legendMapButton" title="Prikaži legendu!" class="buttonClass" onclick="showMapLegendPanel()">
                                            <i class="fas fa-map"></i>
                                        </button>
                                    </li>-->
                                    <li>
                                        <button id="infoPageButtonId" title="Idi na Info stranu!" class="buttonClass" onclick="goToInfoPage()">
                                            <img class="menuIcons" src="images/MapPage/MenuIcons/InfoIcon.svg">
                                        </button>
                                    </li>
                                    <li>
                                        <button id="homePageButtonId" title="Idi na Home stranu!" class="buttonClass" onclick="location.href = 'Home.html';">
                                            <img class="menuIcons" src="images/MapPage/MenuIcons/HomeIcon.svg">
                                        </button>
                                    </li>
                                    <li>
                                        <button id="primeLocationButtonId" title="Vrati na početnu lokaciju!" class="buttonClass" onclick="goToPrimaryLocation()">
                                            <img class="menuIcons" src="images/MapPage/MenuIcons/MapIcon.svg">
                                        </button>
                                    </li>
                                    <li>
                                        <button id="languagesButtonId" title="Izaberi jezik!" class="buttonClass" onclick="showLanguagesPanel()">
                                            <img class="menuIcons" src="images/MapPage/MenuIcons/LanguageIcon.svg">
                                        </button>
                                    </li>
                                </div>
                            </div>`; 
  return container;
    }
});

map.addControl(new ToggleMenu({ position: "topleft" }));

function goToInfoPage(){
    var url = "Info.html?language=" + currentLanguage + "&cityId=" + cityId + "&locationLiId=pL" + "&locationPanelId=pL";
    window.location.href= url;
}

/* Toggle menu functions */

function showLayersPanel() {
    showHidePanels('mapLegendContainer', 'languagesContainer', 'layersContainer', layersMenuVisibility);
}

function showMapLegendPanel() {
    showHidePanels('layersContainer', 'languagesContainer', 'mapLegendContainer', mapLegendMenuVisibility);
}

function showLanguagesPanel() {
    showHidePanels('layersContainer', 'mapLegendContainer', 'languagesContainer', languagesVisibility);
}

function showHidePanels(containerToHide, containerToHide1, containerToShow, visibleVariableValue){
    document.getElementsByClassName(containerToHide)[0].style.visibility = 'hidden';
    setVisibilityVariable(containerToHide, false);

    document.getElementsByClassName(containerToHide1)[0].style.visibility = 'hidden';
    setVisibilityVariable(containerToHide1, false);

    if (visibleVariableValue == false){
        showHidePanel(containerToShow, 'visible');
        setVisibilityVariable(containerToShow, true);
    }
    else if (visibleVariableValue == true){
        showHidePanel(containerToShow, 'hidden');
        setVisibilityVariable(containerToShow, false);
    }
}

function setVisibilityVariable(containerType, visibility){
    if (containerType == "mapLegendContainer"){
        mapLegendMenuVisibility = visibility;
    }
    else if (containerType == "layersContainer"){
        layersMenuVisibility = visibility;
    }
    else if (containerType == "languagesContainer"){
        languagesVisibility = visibility;
    }
}

function hidePanels(){
    if (layersMenuVisibility == true){
        showHidePanel('layersContainer', 'hidden');
        layersMenuVisibility = false;
    }
    else if (mapLegendMenuVisibility == true){
        showHidePanel('mapLegendContainer', 'hidden');
        mapLegendMenuVisibility = false;
    }
    else if (languagesVisibility == true){
        showHidePanel('languagesContainer', 'hidden');
        languagesVisibility = false;
    }
}

function showHidePanel(className, visibility){
    document.getElementsByClassName(className)[0].style.visibility = visibility;
}

//#endregion

//#region translate all labels

/* function for translate on specific language */

function translateOnSerbian(){
    currentLanguage = appLanguages.Serbian;
    translateOnLanguage(mapLabelsRS, mapLayerLabelsRS);
}

function translateOnEnglish(){
    currentLanguage = appLanguages.English;
    translateOnLanguage(mapLabelsENG, mapLayerLabelsENG);
}

function translateOnLanguage(labels, mapLayerLabels){
    translateMapLayerLabels(mapLayerLabels);
    translateMapButtonLabels(labels);
    
    translateLocationsPanelButton();
    translateLocationHeaders();
}

function translateMapLayerLabels(mapLayerLabels){
    document.getElementById("checkAllLocationsLB").innerHTML = mapLayerLabels.CheckAllLocations;
    document.getElementById("cityLocationsLB").innerHTML = mapLayerLabels.CityLocations;
    document.getElementById("picnicAreasLB").innerHTML = mapLayerLabels.PicnicAreas;
    document.getElementById("waterSpringsLB").innerHTML = mapLayerLabels.WaterSprings;
    document.getElementById("culturalContentLB").innerHTML = mapLayerLabels.CulturalContent;
    document.getElementById("bathsLB").innerHTML = mapLayerLabels.Baths;
    document.getElementById("parksLB").innerHTML = mapLayerLabels.Parks;
    document.getElementById("naturalAttractionsLB").innerHTML = mapLayerLabels.NaturalAttractions;
    document.getElementById("childrenFacilitiesLB").innerHTML = mapLayerLabels.ChildrenFacilities;
    document.getElementById("sportsFacilitiesLB").innerHTML = mapLayerLabels.SportsFacilities;
    document.getElementById("thermalSpringsLB").innerHTML = mapLayerLabels.ThermalSprings; 
    document.getElementById("touristSitesLB").innerHTML = mapLayerLabels.TouristSides;
    document.getElementById("lookoutsLB").innerHTML = mapLayerLabels.Lookouts;
    document.getElementById("sightsLB").innerHTML = mapLayerLabels.Sights;
    //document.getElementById("zonesLB").innerHTML = mapLayerLabels.Zones;
    //document.getElementById("roadsLB").innerHTML = mapLayerLabels.Roads;
}

function translateMapButtonLabels(labels){
    document.getElementById("layerGroupButton").title = labels.LayerGroupButtonTitle;
    //document.getElementById("legendMapButton").title = labels.LegendMapButtonTitle;
    document.getElementById("infoPageButtonId").title = labels.InfoPageButtonTitle;
    document.getElementById("homePageButtonId").title = labels.HomePageButtonTitle;
    document.getElementById("primeLocationButtonId").title = labels.PrimeLocationButtonTitle;
    document.getElementById("serbianLanguageButtonId").title = labels.SerbianLanguageButtonTitle;
    document.getElementById("englishLanguageButtonId").title = labels.EnglishLanguageButtonTitle;
    document.getElementById("languagesButtonId").title = labels.LanguagesButtonTitle;
    document.getElementById("languagesButtonId").title = labels.LanguagesButtonTitle;
    //document.getElementById("progressBar").title = labels.MapProgressBarTitle;
}

function translateLocationsPanelButton(){
    var mapLegend = document.getElementById("mapLegendId");
    var mapLegendContainer = document.getElementById("mapLegendContainerId");

    if (currentLanguage == appLanguages.Serbian){
        var currentMapLabels = mapLabelsRS;
        mapLegend.src = "./images/Legend_srp.png";
        mapLegend.style.height = "550px";
        mapLegendContainer.style.height = "550px";
    }
    else if (currentLanguage == appLanguages.English){
        var currentMapLabels = mapLabelsENG;
        mapLegend.src = "./images/Legend_eng.png";
        mapLegend.style.height = "610px";
        mapLegendContainer.style.height = "610px";
    }

    var imageUrl = document.getElementById("locationsButtonId").style.backgroundImage;

    if (imageUrl == 'url("./images/fullscreen.svg")'){
        document.getElementById("locationsButtonId").title = currentMapLabels.FullScreenPreview;
    }
    else {
        document.getElementById("locationsButtonId").title = currentMapLabels.ExitFullScreenPreview;
    }
}

function translateLocationHeaders(){
    var serbianVisibility = 'visible';
    var englishVisibility = 'hidden';

    var textElements = document.getElementsByClassName('text');
    var engTextElements = document.getElementsByClassName('engtext');

    if (currentLanguage == appLanguages.English){
        serbianVisibility = 'hidden';
        englishVisibility = 'visible';
    }

    for (i = 0; i < textElements.length; i++){
        const element = document.getElementById(textElements[i].id);
        element.style.visibility = serbianVisibility;
    }

    for (i = 0; i < engTextElements.length; i++){
        const element = document.getElementById(engTextElements[i].id);
        element.style.visibility = englishVisibility;
    }
        
    /*if (currentLanguage == appLanguages.Serbian){
        var currentImageHeaders = imageHeaderTextRS;
        var currentImageDescriptionText = imageLocationTextRS;
    }
    else if (currentLanguage == appLanguages.English){
        var currentImageHeaders = imageHeaderTextENG;
        var currentImageDescriptionText = imageLocationTextENG;
    }*/

    //document.getElementById('locationImageHeader').innerHTML = currentImageHeaders[slideIndex];
    //document.getElementById('locationImageText').innerHTML = currentImageDescriptionText[slideIndex];
}

//#endregion

//#region layers panel and zoom to location functions

// zoom to location

function goToPrimaryLocation(){
    map.setView(cityCoords, 15);
}

function zoomToLocation(zoomValue, locationId){
    var locationXCoord = locationsForCityArray.getLocationXCoordByLocationId(locationId);
    var locationYCoord = locationsForCityArray.getLocationYCoordByLocationId(locationId);
    var locationTypeId = locationsForCityArray.getLocationTypeIdByLocationId(locationId);

    var locationType = dictLocationTypes[locationTypeId];
    var checkedLocationCB = locationType + "CB";
    
    if (document.getElementById(checkedLocationCB).checked == false){
        document.getElementById(checkedLocationCB).checked = true;
        prepareMarkerElements(locationTypeId, locationId);
    }
    else {
        createCirclePulseMarker([locationXCoord, locationYCoord], locationTypesLayerGroupsArray[locationTypeId - 1]);
    }

	//map.setView([locationXCoord + 0.0012, locationYCoord], zoomValue);
    map.setView([locationXCoord, locationYCoord], zoomValue);
}

function createCirclePulseMarker(coords, locationsGroup){
    var circleMarker = L.marker(coords, {icon: circlePulseIcon}).addTo(map);
    locationsGroup.addLayer(circleMarker);
}

/* layers panel */

const LayersPanel = L.Control.extend({
    onAdd: map => {
      const container = L.DomUtil.create("div");
      container.innerHTML = `<div class="layersContainer" style="OVERFLOW-Y:scroll; height:400px;">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="checkAllLocationsCB" onclick="showHideAllLocations()">
                                    <label class="form-check-label" for="checkAllLocationsCB" id="checkAllLocationsLB">
                                        Izaberi sve
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="cityLocationsCB" onclick="showHideMarkersforLocationType(1, cityLocationsCB)">
                                    <img class="layersContainerImages" src="images/Markers/CityLocations.svg"/>
                                    <label class="form-check-label" for="cityLocationsCB" id="cityLocationsLB">
                                        Gradske lokacije
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="picnicAreasCB" onclick="showHideMarkersforLocationType(2, picnicAreasCB)">
                                    <img class="layersContainerImages" src="images/Markers/PicnicAreas.svg"/>
                                    <label class="form-check-label" for="picnicAreasCB" id="picnicAreasLB">
                                        Izletišta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="waterSpringsCB" onclick="showHideMarkersforLocationType(3, waterSpringsCB)">
                                    <img class="layersContainerImages" src="images/Markers/WaterSprings.svg"/>
                                    <label class="form-check-label" for="waterSpringsCB" id="waterSpringsLB">
                                        Izvorišta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="culturalContentCB" onclick="showHideMarkersforLocationType(4, culturalContentCB)">
                                    <img class="layersContainerImages" src="images/Markers/CulturalContent.svg"/>
                                    <label class="form-check-label" for="culturalContentCB" id="culturalContentLB">
                                        Kulturni sadržaji
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="bathsCB" onclick="showHideMarkersforLocationType(5, bathsCB)">
                                    <img class="layersContainerImages" src="images/Markers/Baths.svg"/>
                                    <label class="form-check-label" for="bathsCB" id="bathsLB">
                                        Kupališta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="parksCB" onclick="showHideMarkersforLocationType(6, parksCB)">
                                    <img class="layersContainerImages" src="images/Markers/Parks.svg"/>
                                    <label class="form-check-label" for="parksCB" id="parksLB">
                                        Parkovi
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="naturalAttractionsCB" onclick="showHideMarkersforLocationType(7, naturalAttractionsCB)">
                                    <img class="layersContainerImages" src="images/Markers/NaturalAttractions.svg"/>
                                    <label class="form-check-label" for="naturalAttractionsCB" id="naturalAttractionsLB">
                                        Prirodne atrakcije
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="childrenFacilitiesCB" onclick="showHideMarkersforLocationType(8, childrenFacilitiesCB)">
                                    <img class="layersContainerImages" src="images/Markers/ChildrenFacilities.svg"/>
                                    <label class="form-check-label" for="childrenFacilitiesCB" id="childrenFacilitiesLB">
                                        Sadržaji za decu
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="sportsFacilitiesCB" onclick="showHideMarkersforLocationType(9, sportsFacilitiesCB)">
                                    <img class="layersContainerImages" src="images/Markers/SportsFacilities.svg"/>
                                    <label class="form-check-label" for="sportsFacilitiesCB" id="sportsFacilitiesLB">
                                        Sportski sadržaji
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="thermalSpringsCB" onclick="showHideMarkersforLocationType(10, thermalSpringsCB)">
                                    <img class="layersContainerImages" src="images/Markers/ThermalSprings.svg"/>
                                    <label class="form-check-label" for="thermalSpringsCB" id="thermalSpringsLB">
                                        Termalna izvorišta
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="touristSitesCB" onclick="showHideMarkersforLocationType(11, touristSitesCB)">
                                    <img class="layersContainerImages" src="images/Markers/TouristSites.svg"/>
                                    <label class="form-check-label" for="touristSitesCB" id="touristSitesLB">
                                        Turističke pogod
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="lookoutsCB" onclick="showHideMarkersforLocationType(12, lookoutsCB)">
                                    <img class="layersContainerImages" src="images/Markers/Lookouts.svg"/>
                                    <label class="form-check-label" for="lookoutsCB" id="lookoutsLB">
                                        Vidikovci
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="sightsCB" onclick="showHideMarkersforLocationType(13, sightsCB)">
                                    <img class="layersContainerImages" src="images/Markers/Sights.svg"/>
                                    <label class="form-check-label" for="sightsCB" id="sightsLB">
                                        Znamenitosti
                                    </label>
                                </div>
                            </div>`; 
  return container;
    }
});

map.addControl(new LayersPanel({ position: "topleft" }));

/*<div class="form-check">
    <input class="form-check-input" type="checkbox" value="" id="zonesCB" onclick="showHideZones()">
    <label class="form-check-label" for="sightsCB" id="zonesLB">
        Zone
    </label>
</div>
    <div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="roadsCB" onclick="showHideRoads()">
        <label class="form-check-label" for="sightsCB" id="roadsLB">
            Putevi
        </label>
</div>*/


const MapLegendPanel = L.Control.extend({
    onAdd: map => {
      const container = L.DomUtil.create("div");
      container.innerHTML = `<div id="mapLegendContainerId" class="mapLegendContainer" style="margin-top:45px; OVERFLOW-Y:scroll;">
                                <img id="mapLegendId" src="./images/Legend_srp.png" alt="Map legend"></img>
                            </div>`; 
  return container;
    }
});

map.addControl(new MapLegendPanel({ position: "topleft" }));

/*const MapProgressBar = L.Control.extend({
    onAdd: map => {
      const container = L.DomUtil.create("div");
      container.innerHTML = `<div id="divProgressBar" class="progress">
                                <div id="progressBar" title="Učitavanje Zona i Puteva" class="fill a"></div>
                             </div>`; 
  return container;
    }
});

map.addControl(new MapProgressBar({ position: "top" }));*/

//#endregion

//#region languages panel 
/* languages panel */

const LanguagesPanel = L.Control.extend({
    onAdd: map => {
      const container = L.DomUtil.create("div");
      container.innerHTML = `<div class="languagesContainer">
                                <button id="serbianLanguageButtonId" title="Prevedi na srpski jezik!" class="buttonClass" style="border: none; width:25px; height:25px;" onclick="translateOnSerbian()">
                                    <img src="./images/Serbia-Flag-icon.svg" alt="" class="image-flag" style="margin-top: 5px; width:25px; height:25px;"></img> 
                                </button>
                                <button id="englishLanguageButtonId" title="Prevedi na engleski jezik!" class="buttonClass" style="border: none; width:25px; height:25px;" onclick="translateOnEnglish()">
                                    <img src="./images/GBR-flag-icon.svg" alt="" class="image-flag" style="margin-top: 5px; margin-left: 10px; width:25px; height:25px;"></img>
                                </button>
                            </div>`; 
  return container;
    }
});

map.addControl(new LanguagesPanel({ position: "topleft" }));

//#endregion

//#region page layout functions and button for show-hide locations

/* button for show-hide panel with locations */

// showing button for show/hide panel 
const Coordinates = L.Control.extend({
    onAdd: map => {
      const container = L.DomUtil.create("div");
      /*map.addEventListener("mousemove", e => {
          container.innerHTML = `<h2>Latitude is ${e.latlng.lat.toFixed(4)} <br> and Longitude is  ${e.latlng.lng.toFixed(4)} </h2>`;
         });*/
      container.innerHTML = `<div>
                                <button id="locationsButtonId" 
                                        type="button"
                                        title="Prikaži pun ekran!" 
                                        class="showHideLocations" 
                                        onclick="showHideLocations()" 
                                        style="background: url('./images/fullscreen.svg') no-repeat;">
                                </button>`;
    return container;
    }
});

map.addControl(new Coordinates({ position: "bottomright" }));

/* page layout functions */

// set even listener for resizing page elements and map legend image
window.addEventListener('resize', changePageLayout);

function changePageLayout(){
    changeMapLegendImage();
    changePageLayout();
}

/* change image for map legend based on window width and height */

function changeMapLegendImage(){
    var mapLegendContainer = document.getElementById("mapLegendContainerId");
    var mapLegend = document.getElementById("mapLegendId");

    if ($(document).height() <= 600 || $(document).width() <= 500){
        //document.getElementById("mapLegendId").src = "./images/Legend_srp.png";
        mapLegend.style.width = "260px;"
        mapLegendContainer.style.width = "260px;"
    }
    else if ($(document).height() > 600 || $(document).width() > 500){
        //document.getElementById("mapLegendId").src = "./images/Legend_srp.png";
        mapLegend.style.width = "280px;"
        mapLegendContainer.style.width = "280px;"
    }
}

/* change page layout for the map and locations */

function changePageLayout(){
    /*if (($(document).height() <= 600 || $(document).width() <= 500) && isHiddenLocationPanel == false){
        resizeDivElements(mapDivPercentageHeight, '100%', locationsPanelPercentageHeight, '100%', 'top', mapDivPercentageHeight);
        layout = 'vertical';
    } 
    else if (($(document).height() <= 600 || $(document).width() <= 500) && isHiddenLocationPanel == true){
        resizeDivElements('100%', '100%', '0%', '0%', 'none', '0%');
        layout = 'vertical';
    }
    else if (($(document).height() > 600 || $(document).width() > 500) && isHiddenLocationPanel == false){
        resizeDivElements('100%', mapDivPercentageHeight, '100%', locationsPanelPercentageHeight, 'right', mapDivPercentageHeight);
        layout = 'horizontal';
    }
    else if (($(document).height() > 600 || $(document).width() > 500) && isHiddenLocationPanel == true){
        resizeDivElements('100%', '100%', '0%', '0%', 'none', '0%');
        layout = 'horizontal';
    }*/

    if (($(document).height() > $(document).width()) && isHiddenLocationPanel == false){
        resizeDivElements(mapDivPercentageHeight, '100%', locationsPanelPercentageHeight, '100%', 'top', mapDivPercentageHeight);
        layout = 'vertical';
    } 
    else if (($(document).height() > $(document).width()) && isHiddenLocationPanel == true){
        resizeDivElements('100%', '100%', '0%', '0%', 'none', '0%');
        layout = 'vertical';
    }
    else if (($(document).height() <= $(document).width()) && isHiddenLocationPanel == false){
        resizeDivElements('100%', mapDivPercentageHeight, '100%', locationsPanelPercentageHeight, 'right', mapDivPercentageHeight);
        layout = 'horizontal';
    }
    else if (($(document).height() <= $(document).width()) && isHiddenLocationPanel == true){
        resizeDivElements('100%', '100%', '0%', '0%', 'none', '0%');
        layout = 'horizontal';
    }

    map._onResize(); 
}

/* hide or show location panel */

function showHideLocations(){
    if (isHiddenLocationPanel == false){
        resizeDivElements('100%', '100%', '0%', '0%', 'none', '0%');
        document.getElementById("locationsButtonId").style.backgroundImage = "url('./images/Exit-full-screen.svg')";
        document.getElementById("locationPanel").style.visibility='hidden';
        translateLocationsPanelButton();
        isHiddenLocationPanel = true;
    }
    else {
        isHiddenLocationPanel = false;
        document.getElementById("locationsButtonId").style.backgroundImage = "url('./images/fullscreen.svg')";
        document.getElementById("locationPanel").style.visibility='visible';
        translateLocationsPanelButton();
        changePageLayout();
    }

    map._onResize(); 
}

/* function for resize map and location div */ 

function resizeDivElements(mapHeight, mapWidth, panelHeight, panelWidth, marginType, marginValue){
    var mapDiv = document.getElementById('map');
    //var progressBarDiv = document.getElementById('divProgressBar');
    var locationPanel = document.getElementById('locationPanel');

    mapDiv.style.height = mapHeight;
    mapDiv.style.width = mapWidth;

    //progressBarDiv.style.width = mapWidth;
    
    locationPanel.style.height = panelHeight;
    locationPanel.style.width = panelWidth;

    if(marginType == 'top'){
        locationPanel.style.right = '0%';
        locationPanel.style.top= marginValue;
    }
    else if (marginType == 'right'){
        locationPanel.style.right = '0%';
        locationPanel.style.top= '0%';
    }
}

//#region functions for show-hide layers

/* create layer groups for or layers */ 

var cityLocationsGroup = L.layerGroup().addTo(map);
var picnicAreasGroup = L.layerGroup().addTo(map);
var waterSpringsGroup = L.layerGroup().addTo(map);
var culturalContentsGroup = L.layerGroup().addTo(map);
var bathsGroup = L.layerGroup().addTo(map);
var parksGroup = L.layerGroup().addTo(map);
var naturalAttractionsGroup = L.layerGroup().addTo(map);
var childrenFacilitiesGroup = L.layerGroup().addTo(map);
var sportsFacilitiesGroup = L.layerGroup().addTo(map);
var thermalSpringsGroup = L.layerGroup().addTo(map);
var touristSitesGroup = L.layerGroup().addTo(map);
var lookoutsGroup = L.layerGroup().addTo(map);
var sightsGroup = L.layerGroup().addTo(map);
var priorityOneLocationsLayerGroup = L.layerGroup().addTo(map);

var locationTypesLayerGroupsArray = [cityLocationsGroup, picnicAreasGroup, waterSpringsGroup,
                                     culturalContentsGroup, bathsGroup, parksGroup,
                                     naturalAttractionsGroup, childrenFacilitiesGroup, sportsFacilitiesGroup,
                                     touristSitesGroup, thermalSpringsGroup, lookoutsGroup, 
                                     sightsGroup]

var zonesGroup = L.layerGroup().addTo(map);
var roadsGroup = L.layerGroup().addTo(map);

/* functions for layer locations */

function showHideMarkersforLocationType(locationTypeId, elementId){
    if (document.getElementById(elementId.id).checked == true){
        prepareMarkerElements(locationTypeId, '0');
    }
    else { 
        locationTypesLayerGroupsArray[locationTypeId - 1].clearLayers();
    }

    map.setView(cityCoords, 13);
}

// show or hide all locations
function showHideAllLocations(){
    var visibility = document.getElementById("checkAllLocationsCB").checked;

    for (let i = 1; i <= 13; i++) {
        var location = getLocation(i);
        location.checked = visibility;
        showHideMarkersforLocationType(i, location);
    }

    /*document.getElementById("zonesCB").checked = visibility;
    document.getElementById("roadsCB").checked = visibility;
    showHideZones();
    showHideRoads();*/
}

// get locationCheckBox element for location type
function getLocation(locationTypeId){
    var checkBox = dictLocationTypes[locationTypeId] + "CB";
    return document.getElementById(checkBox);
}

// show or hide zone layer
/*function showHideZones(){
    if (document.getElementById("zonesCB").checked == true){
        zonesGroup.addLayer(wmsLayerZones);
    }
    else { 
        zonesGroup.clearLayers();
    }
}*/

// show or hide road layer
/*function showHideRoads(){
    if (document.getElementById("roadsCB").checked == true){
        roadsGroup.addLayer(wmsLayerRoads);
    }
    else { 
        roadsGroup.clearLayers();
    }
}*/

function prepareMarkerElements(locationTypeId, checkedLocationId){
    var locationsForLocationTypeId = locationsForCityArray.getLocationsByTypeId(locationTypeId);
    for (const location of locationsForLocationTypeId) {
        CreateMarker([parseFloat(location.x_coord), parseFloat(location.y_coord)], location.name, 
                     locationTypesLayerGroupsArray[locationTypeId - 1], markerIconsArray[locationTypeId - 1],
                     location.image_url_location, locationTypeId, location.location_id, checkedLocationId);
    }
}

/* initialize variables for icons for map markers */

var cityLocationsIcon = L.icon({
    iconUrl: './images/Markers/CityLocations.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30], // point from which the popup should open relative to the iconAnchor
    className: 'blinking'
});

var picnicAreasIcon = L.icon({
    iconUrl: './images/Markers/PicnicAreas.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var waterSpringsIcon = L.icon({
    iconUrl: './images/Markers/WaterSprings.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var culturalContentIcon = L.icon({
    iconUrl: './images/Markers/CulturalContent.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var bathsIcon = L.icon({
    iconUrl: './images/Markers/Baths.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var parksIcon = L.icon({
    iconUrl: './images/Markers/Parks.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var naturalAttractionsIcon = L.icon({
    iconUrl: './images/Markers/NaturalAttractions.svg',
    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var childrenFacilitiesIcon = L.icon({
    iconUrl: './images/Markers/ChildrenFacilities.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var sportsFacilitiesIcon = L.icon({
    iconUrl: './images/Markers/SportsFacilities.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var thermalSpringsIcon = L.icon({
    iconUrl: './images/Markers/ThermalSprings.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var touristSitesIcon = L.icon({
    iconUrl: './images/Markers/CityLocations.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var lookoutsIcon = L.icon({
    iconUrl: './images/Markers/Lookouts.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var sightsIcon = L.icon({
    iconUrl: './images/Markers/Sights.svg',

    iconSize:     [32, 37], // size of the icon
    iconAnchor:   [16, 37], // point of the icon which will correspond to marker's location
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
});

var circlePulseIcon = L.divIcon({
    // Specify a class name we can refer to in CSS.
    className: 'css-icon',
    html: '<div class="gps_ring"></div>'
    // Set marker width and height
    ,iconSize: [30,30]
    // ,iconAnchor: [11,11]
});

var markerIconsArray = [cityLocationsIcon, picnicAreasIcon, waterSpringsIcon,
                        culturalContentIcon, bathsIcon, parksIcon, 
                        naturalAttractionsIcon, childrenFacilitiesIcon, sportsFacilitiesIcon,
                        thermalSpringsIcon, touristSitesIcon, lookoutsIcon,
                        sightsIcon]

/* create marker function */ 

function CreateMarker(coords, markerName, locationsGroup, markerIcon, imageUrlLocation, locationTypeId, locationId, checkedLocationId){
    tabHeader = dictLocationTypes[locationTypeId];
    var locationLiId = tabHeader + "LiId";
    var locationPanelId = tabHeader + "Panel" + locationId + "Id";

    var aHref = "Info.html?language=" + currentLanguage + "&cityId=" + cityId + "&locationLiId=" + 
                locationLiId + "&locationPanelId=" + locationPanelId;

    marker = L.marker(coords, {
      title: markerName,
      icon: markerIcon
    }).addTo(map);

    marker.bindPopup('<b style="font-size:20px">' + markerName +'</b>' + 
                     '</br>' +
                     '</br>' +
                     '<div>' + 
                        '<img style="width:100%" src="' + imageUrlLocation + '" alt="images"></img>' + 
                        '<a href="' + aHref + '">info</a>' +
                    '</div>',
    {minWidth:250});

    locationsGroup.addLayer(marker);

    if (checkedLocationId == locationId){
        // Create three markers and set their icons to circlePulseIcon
        var circleMarker = L.marker(coords, {icon: circlePulseIcon}).addTo(map);
        locationsGroup.addLayer(circleMarker);
    }
}

//#endregion

//#region get current location (test code)

/** GET CURRENT LOCATION **/

/*var map = L.map('map').fitWorld();

var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

function onLocationFound(e) {
    var radius = e.accuracy / 2;

    var locationMarker = L.marker(e.latlng).addTo(map)
        .bindPopup('You are within ' + radius + ' meters from this point').openPopup();

    var locationCircle = L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 16});*/

/* TABS MENU JS CODE */

/*const tabcontents = document.querySelectorAll(".tabcontent");
const tabLinks = document.querySelectorAll(".tabs a");

function openTab(event, tabName){*/
    /* REMOVE ALL TABCONTENTS */
    //tabcontents.forEach((tabcontent) => (tabcontent.style.display = "none"));
    
    /* REMOVE TABLINKS ACTIVE CLASSES */
    //tabLinks.forEach((tabLink) => tabLink.classList.remove("active"));

    /* ADD ACTIVE CLASS ON TABLINK AND OPEN IT */
    //event.currentTarget.classList.add("active");
    //document.getElementById(tabName).style.display = "block";
//}

//#endregion