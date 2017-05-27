/*jshint esversion: 6 */
/*globals $:false */

//   Module Pattern
(function () {
'use strict';
  //   Start of the ready function
  $(document).ready(function () {
    //create the data object
    let dataObj = {
      albumId : "",
      data: ""
    };
    // function for building album list items
    let listFunction = (image, link, title, artist,i)=>{
      $("#albums").append(
        `<li>
          <div class="album-wrap">
            <a href= "${link}"> 
              <img class="album-art" src="${image}">
            </a>
          </div>
          <span class="album-title" id=${i}>${title}</span>
          <span class="album-artist">${artist}</span>
        </li>`
      );
    };
    // prevents the default action for form submit
    $('form').on('submit', function(e){
      e.preventDefault();
    });
    // performs the album search function on change to the search input
    $("#search").on("change", function(){
      // removes the grey background from the album info page    
      $("#grey").remove();   
      APIfunction();
    });
    // listener for event target on body
    $( "body" ).click(function( event ) {
      // if album title is clicked, call the album info function
      if(event.target.className === "album-title"){
        // create a variable that holds the specicfic album id
        let clickedAlbum = dataObj.data.albums.items[event.target.id].id;
        APIalbumFunction(clickedAlbum);
      }
      // if the clicked element has an id of search-results then run album search function
      if(event.target.id === "search-results"){
      // removes the grey background from the album info page 
      $("#grey").remove();
        APIfunction();
      }
    });
    // “albums” endpoint and the album id to get details for an album if clicked
    // for the album info page
    let APIalbumFunction = (id)=>{
      // url generated from event target id for album data
      let spotifyAPI = `https://api.spotify.com/v1/albums/${id}`;
      // value of the album search input
      let musicSearch = $("#search").val();
      // object data relevant to the spotify API 
      let spotifyOptions = {
        q: musicSearch,
        type: "album",
        format: "json"
      }; 
      //success function for displaying specific album data      
      let displayMusic = (data)=>{
        let albumInfo = "";
        // remove contents from the body
        $('#albums').empty();
        $(".infoDiv").empty();
        // grey background
        // $( "<div id='grey'></div>" ).insertBefore( ".main-content" );
        // append the album info 
        $(".main-content").append(
          `<div class="infoDiv" id="info">
            <span class="grey"></span>
            <p id="search-results">
              <span id="arrow-svg">
                <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
                <path d="M0-.5h24v24H0z" fill="none"/>
                </svg>
              </span>
              Search results
            </p>
            <img class="album-art float" id="info-albumArt" src="${data.images[0].url}">
            <div class="infoDiv-list float" id="list">
              <div class="infoDiv-header" id="list">  
                <h1 class="albumName bold">
                  ${data.name}
                  <span class="album-year">
                    (${data.release_date})
                  </span>
                </h1>
              </div>
              <h2 class="bandName">
                ${data.artists[0].name}
              <h2>
              <h3 class="artistName"></h3>
              <h3 class="tracks bold">track list:</h3>
              <ol class="album-info" id="album-info"></ol>
            <div>
          </div>`);
        console.log(data);//.albums.items[0].artists[0].name
        console.log(data.release_date);//.albums.items[0].artists[0].name
        console.log(data.name);
        // loop through tracks and add them to the ordered list
        for(let i = 0;i<data.tracks.items.length; i++){
          console.log(data.tracks.items[i].name);
          albumInfo += `<li>${data.tracks.items[i].name}</li>`;
        }
        // append the tracks list
        $("#album-info").append(albumInfo);
      };// end APIalbumFunction
      // getjson url , data relevant to the API, function run on success
      $.getJSON(spotifyAPI, spotifyOptions, displayMusic);
    };
    // The album search function 
    let APIfunction = ()=>{
      // API search url
      let spotifyAPI = "https://api.spotify.com/v1/search?";
      // search input value
      let musicSearch = $("#search").val();
      // object data relevant to the spotify API
      let spotifyOptions = {
        q: musicSearch,
        type: "album",
        format: "json"
      };
      // success function that displays the albums 
      let displayMusic = (data)=>{
        $('#albums').empty();
        $('.infoDiv').remove();
        if(data.albums.items.length === 0){
          nullSearch();
        } else {
          console.log(data);//.albums.items[0].artists[0].name
          dataObj.albumId = data.albums.items[0].id;
          dataObj.data = data;
          // loops through each album and displays album, link, name and artist
          for(let i = 0; i < data.albums.items.length; i++){
            let image = data.albums.items[i].images[0].url;
            let link = data.albums.items[i].external_urls.spotify;
            let title = data.albums.items[i].name;
            let artist = data.albums.items[i].artists[0].name;
            listFunction(image,link,title,artist,i);
          }
        }
      };// end callback function
      $.getJSON(spotifyAPI, spotifyOptions, displayMusic);
      return dataObj;
    };
    // Display this <li> if the search form returns no album data
    let nullSearch = ()=>{
      let serch = $("#search").val();
      $("#albums").append(
        `<li class='no-albums desc'>
          <i class='material-icons icon-help'>help_outline</i>No albums found that match: ${serch}.
        </li>`
      );
    };
  }); // end ready
}());//this is the end of the module pattern
