import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/globals.css';
import logo from "../styles/logo.png"
import {BsShield, BsTree,BsTrainFront} from "react-icons/bs"
import {FiShoppingCart} from "react-icons/fi"
import {PiPersonSimpleBikeBold} from "react-icons/pi"
import {CiDumbbell} from "react-icons/ci"
import {BiMoneyWithdraw} from 'react-icons/bi'

mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const wholeFoodsMarkersRef = useRef([]); // ref to store Whole Foods markers
  const traderJoesMarkersRef = useRef([]); // ref to store Trader Joe's markers
  const gymMarkersRef = useRef([]); // ref to store Gym markers

  const [mapLoaded, setMapLoaded] = useState(false);

  const [lng, setLng] = useState(-122.42);
  const [lat, setLat] = useState(37.75);
  const [zoom, setZoom] = useState(11);

  const [showInfo,setShowInfo]=useState(false);
  
  const [showQuadrantColors,setShowQuadrantColors]=useState(false)
  const [showParks,setShowParks]=useState(false);
  const [showCrime,setShowCrime]=useState(false);
  const [showLocation,setShowLocation]=useState(false);
    const [locationLatLong,setLocationLatLong]=useState(null)
    const [locationName,setLocationName]=useState("")
  const [showGrocery,setShowGrocery]=useState(false);
  //groceries
    const [traderJoes,setTraderJoes]=useState(false);
    const [wholeFoods,setWholeFoods]=useState(false);

  const [showBart,setShowBart]=useState(false);
    const [bartMode,setBartMode]=useState("Walking")
  const [showBudget,setShowBudget]=useState(false)
    const[budgetMax,setBudgetMax]=useState(4750)
  const [showBikes,setShowBikes]=useState(false);
  const [showGyms,setShowGyms]=useState(false);


  const removeAllMarkers = (markerRef) => {
    markerRef.current.forEach(marker => {
      marker.remove();
    });
    markerRef.current.length = 0; // Clear the ref array
  }
  
  
  const showMarkers = () => {
    if (!map.current) return;
    
    const traderjoes_res=require('../data/trader_joes_coordinates.geojson')
    const wholefoods_res=require('../data/whole_foods_coordinates.geojson')
    if (wholeFoods){
      fetch(wholefoods_res)
        .then(r => r.json())
        .then(data => {
          removeAllMarkers(wholeFoodsMarkersRef);
          data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const marker = new mapboxgl.Marker({ color: 'red' })
              .setLngLat(coordinates)
              .addTo(map.current);
            wholeFoodsMarkersRef.current.push(marker);
          });
        })
        .catch(error => {
          console.error("There was an issue loading the Whole Foods data:", error);
        });
    } else {
      removeAllMarkers(wholeFoodsMarkersRef);
    }
  
    if (traderJoes){
      fetch(traderjoes_res)
        .then(r => r.json())
        .then(data => {
          removeAllMarkers(traderJoesMarkersRef);
          data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const marker = new mapboxgl.Marker({ color: 'blue' })
              .setLngLat(coordinates)
              .addTo(map.current);
            traderJoesMarkersRef.current.push(marker);
          });
        })
        .catch(error => {
          console.error("There was an issue loading the Trader Joe's data:", error);
        });
    } else {
      removeAllMarkers(traderJoesMarkersRef);
    }
    if (showGyms) {
      const gyms=require('../data/gym_coordinates.geojson')
      fetch("/static/media/gym_coordinates.e039c3ed6528dac26057.geojson")
        .then(r => r.json())
        .then(data => {
          removeAllMarkers(gymMarkersRef);
          data.features.forEach(feature => {

            const coordinates = feature.geometry.coordinates;
  
            // Create a popup with the gym's name
            const popup = new mapboxgl.Popup({ offset: 25 })
              .setText(feature.properties.name); // Assuming the name is stored in the 'name' property
  
            // Create the marker and bind the popup to it
            const marker = new mapboxgl.Marker({ color: 'green' })
              .setLngLat(coordinates)
              .setPopup(popup) // Bind the popup to the marker
              .addTo(map.current);
  
            // Add a hover event to show the popup
            marker.getElement().addEventListener('mouseenter', () => marker.togglePopup());
            marker.getElement().addEventListener('mouseleave', () => marker.togglePopup());
  
            gymMarkersRef.current.push(marker);
          });
        })
        .catch(error => {
          console.error("There was an issue loading the gym data:", error);
        });
    } else {
      removeAllMarkers(gymMarkersRef);
    }
  }
  
  
  
  

  const updateOpacity = () => {
    if (!map.current) return;
  
    // Define the base opacity expression
    let opacityExpression = ['+', 1];
  
    // Add park_score based opacity if showParks is true
    if (showParks) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'park_score'], 0.1]];
    }
  
    // Add crime_score based opacity if showCrime is true
    if (showCrime) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'crime_score'], 0.1]];
    }
    // Add bike_score based opacity if showBikes is true
    if (showBikes) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'bike_score'], 0.1]];
    }
    if (wholeFoods) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'whole_foods_score'], 0.1]];
    }
    if (traderJoes) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'trader_joes_score'], 0.1]];
    }
    if (showGyms) {
      opacityExpression = ['-', opacityExpression, ['*', ['get', 'gym_score'], 0.1]];
    }
    if (showBart) {
      if (bartMode==="Walking"){
        opacityExpression = ['-', opacityExpression, ['*', ['get', 'walking_bart_score'], 0.1]];
      }else{
        opacityExpression = ['-', opacityExpression, ['*', ['get', 'driving_bart_score'], 0.1]];
      }
    }
    if (showBudget) {
      opacityExpression = [
          '-', 
          opacityExpression, 
          ['case',
              ['>=', ['get', 'cost'], budgetMax], 0.5, 
              0 // default (no decrease)
          ]
      ];
  }
  
    // Ensure opacity doesn't exceed 1
    opacityExpression = ['min', 1, opacityExpression];
  
    // Set the calculated opacity expression to the 'quadrant-fill' layer
    map.current.setPaintProperty('quadrant-fill', 'fill-opacity', opacityExpression);
  };




  useEffect(() => {
    const neighborhoods=require('../data/neighborhoods.geojson');

    //SETTING INITIAL MAP IN BAY AREA
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
      minZoom: 10,
    });

    //ADDING REGION FILLS AND OUTLINES


    map.current.on('load', () => {
      // Adding neighborhoods source (includes quadrants info)
      map.current.addSource('neighborhoods', {
        type: 'geojson',
        data: neighborhoods,
      });

      // Neighborhood fill layer NECESSARY FOR MOUSEMOVE
      map.current.addLayer({
        id: 'neighborhood-fill',
        type: 'fill',
        source: 'neighborhoods',
        paint: {
          'fill-color': 'transparent',
        },
      });

      // Neighborhood outline layer
      map.current.addLayer({
        id: 'neighborhood-outline',
        type: 'line',
        source: 'neighborhoods',
        paint: {
          'line-color': 'white',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });

      // Quadrant fill layer (using same neighborhoods source)
      map.current.addLayer({
        id: 'quadrant-fill',
        type: 'fill',
        source: 'neighborhoods',
        paint: {
          'fill-color': 'rgba(0,51,204,0.7)'
        },
      });

      // Quadrant outline layer (using same neighborhoods source)
      map.current.addLayer({
        id: 'quadrant-outline',
        type: 'line',
        source: 'neighborhoods',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1,
          'line-opacity': 0.5,
        },
      });


    // POPUP BASED ON NEIGHBORHOOD/QUADRANT
      const popupDiv = document.createElement('div');
      popupDiv.style.position = 'absolute';
      popupDiv.style.backgroundColor = '#334155';
      popupDiv.style.color="white";
      popupDiv.style.padding = '10px';
      popupDiv.style.borderRadius = '1px';
      popupDiv.style.pointerEvents = 'none'; // Allow mouse events to pass through
      popupDiv.style.display = 'none'; // Initially hidden
      const h3Elements = popupDiv.querySelectorAll('h3');
      h3Elements.forEach((element) => {
        element.style.color = 'red';
      });
      document.body.appendChild(popupDiv);

      map.current.on('mouseenter', ['neighborhood-fill','quadrant-fill'], (e) => {

        if (e.features.length>1){
          const { name } = e.features[0].properties;
          const { quad } = e.features[1].properties;
  
  
          if (name && quad) {
            popupDiv.innerHTML = `
              
            <div>
            <h3 style="color:white; text-align:center; font-size:15px;">${quad}</h3>
            <p style="color: white; font-size: 13px;">${name}</p>
          </div>
            `;
            popupDiv.style.display = 'block'; // Show the popup
          }
        }

      });

      map.current.on('mousemove', ['neighborhood-fill','quadrant-fill'], (e) => {
        if (e.features.length>1){
          const { name } = e.features[0].properties;
          const { quad } = e.features[1].properties;
  
          
  
          if (name && quad) {
            popupDiv.innerHTML = `
              
            <div>
            <h3 style="color:white; text-align:center; font-size:15px;">${quad}</h3>
            <p style="color: white; font-size: 13px;">${name}</p>
          </div>
            `;
            popupDiv.style.display = 'block'; // Show the popup
          }
        }
        // Update the position of the popup
        const x = e.originalEvent.clientX;
        const y = e.originalEvent.clientY;
        popupDiv.style.left = `${x}px`;
        popupDiv.style.top = `${y}px`;
        popupDiv.style.transform = 'translate(-50%, -140%)';
      });

      map.current.on('mouseleave', ['neighborhood-fill','quadrant-fill'], () => {
        popupDiv.style.display = 'none'; // Hide the popup
      });



        //UPDATE ZOOM AND CENTER OF MAP BASED ON DRAG
        map.current.on('move', () => {
          setZoom(map.current.getZoom().toFixed(2));
        });
  
        map.current.on('drag', () => {
          const center = map.current.getCenter();
          const newLng = Math.max(-122.5, Math.min(-122.3, center.lng));
          const newLat = Math.max(37.7, Math.min(37.8, center.lat));
  
          if (center.lng !== newLng || center.lat !== newLat) {
            map.current.setCenter(new mapboxgl.LngLat(newLng, newLat));
          }
        });
    });



        
      setMapLoaded(true);
  },[]);






//SECOND USE EFFECT TO UPDATE THINGS WITHOUT RERENDER

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && mapLoaded) {
    
      updateOpacity();
      showMarkers();

      
      map.current.setPaintProperty('quadrant-fill', 'fill-color', showQuadrantColors
      ? [
          'match',
          ['get', 'quad'],
          'SE', 'rgba(144, 238, 144, 0.7)', // lightgreen with 0.7 opacity
          'SW', 'rgba(255, 165, 0, 0.7)',    // orange with 0.7 opacity
          'NE', 'rgba(0,51,204,0.7)',  // blue with 0.7 opacity
          'NW', 'rgba(255, 0, 0, 0.7)',      // red with 0.7 opacity
          'rgba(0,51,204,0.7)'         // Default value if no match, blue with 0.7 opacity
        ]
      : 'rgba(0,51,204,0.7)' // static color fill with 0.7 opacity
    );

      }

      

  }, [showQuadrantColors, showParks, showCrime, showBikes, locationLatLong, wholeFoods, traderJoes, showGyms, showBart, bartMode, showBudget,budgetMax, map.current]);





  const handleZoomIn = () => {
    map.current.zoomTo(map.current.getZoom() + 1, { duration: 200 });
  };

  const handleZoomOut = () => {
    map.current.zoomTo(map.current.getZoom() - 1, { duration: 200 });
  };


  return (
    <>
    <div className={`${showInfo ? " opacity-50" : "opactiy-100"}  bg-white flex h-screen w-screen overflow-hidden`} onClick={()=>setShowInfo(false)}>
      {/* DESKTOP SIDEBAR */}
      <div className="xl:w-1/4 w-1/2 h-screen overflow-y-scroll">
        <div style={{width:"100%"}} className="bg-blue-100 xl:border-b-8 border-b-4 border-blue-900 xl:p-3 p-1 flex items-center justify-center">
          <img src={logo} alt="logo" className="2xl:w-10 2xl:h-10 xl:w-8 xl:h-8 lg:w-8 lg:h-8 md:w-6 md:h-6 w-4 h-4"/>
          <h1 className=" font-semibold text-red-700 font-mono title">
            <span>
              Bay
            </span>
              borhood
          </h1>
          <p className="lg:border-2 sm:border-1 border-0.5 rounded-full justify-center items-center flex ml-2 xl:-mt-4 lg:-mt-2 
                  text-gray-400 border-gray-400 xl:h-5 xl:w-5 w-4 h-4  font-semibold
                  hover:text-gray-700 hover:border-gray-700 duration-200 cursor-pointer
                  font-serif lg:text-xs text-xxs"
                  
                   onClick={(e)=>{
                    e.stopPropagation()
                    setShowInfo(true)
                    }}>i</p>
        </div>
        <div>

        </div>
        <div className="flex flex-col xl:py-4 xl:px-3 py-2 px-1">
          <h1 className=" text-gray-900 font-semibold subTitle" >Add More Filters</h1>
          <h3 className="mb-1 text-gray-600 subTitle2" >Continue refining your ideal neighborhoods</h3>
          <div className="grid grid-cols-1 grid-flow-row lg:gap-2 sm:gap-1 gap-0.5 xl:border-b-4 border-b-2 border-blue-900 bodyText" >
            <div onClick={()=>setShowCrime(true)}
            className={`lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showCrime ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <BsShield className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Safety
            </div>
            <div onClick={()=>setShowGyms(true)}
              className={` lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showGyms ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <CiDumbbell className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Gyms
            </div>
            <div onClick={()=>setShowParks(true)}
              className={` lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showParks ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <BsTree className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Parks
            </div>
          
            <div onClick={()=>setShowGrocery(true)}
            className={` lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showGrocery ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <FiShoppingCart className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Grocery Chains
            </div>
            <div onClick={()=>setShowBart(true)}
              className={` lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showBart ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <BsTrainFront className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>BART Stations
            </div>
            <div onClick={()=>setShowBudget(true)}
            className={`lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showBudget ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <BiMoneyWithdraw className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Budget
            </div>
            <div onClick={()=>setShowBikes(true)}
            className={`mb-2 lg:w-8/12 w-fit  whitespace-nowrap xl:py-2 xl:px-3 lg:py-1 lg:px-2 py-0.25 px-1.5 md:border-2 border-1 border-gray-300 ${showBikes ? "bg-gray-100 cursor-not-allowed opacity-50" : "opacity-100 hover:bg-gray-100 bg-white cursor-pointer"} rounded-lg flex items-center   duration-200`}>
              <PiPersonSimpleBikeBold className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>BikeShare
            </div>
            </div>


          <div className="flex flex-col">
            <h1 className=' text-gray-900 font-semibold subTitle'>
              Filters
            </h1>
            <h2 className="text-gray-600 subTitle2" >
              Click to delete
            </h2>
            <div>
              {displayActiveFilters()}
            </div>
          </div>
        </div>
        
      </div>

      <div className="" style={{width: "100%"}}>
        <div className="absolute top-2 right-2 z-10 flex flex-col">
          <button className="text-xl font-extrabold text-black rounded-t-xl border-2 shadow-2xl  bg-white hover:bg-gray-200 duration-200 p-1 w-9 h-10" onClick={handleZoomIn}>
            +
          </button>
          <button className="text-xl font-extrabold text-black rounded-b-xl border-2 border-t-0 shadow-2xl bg-white hover:bg-gray-200 duration-200 p-1 w-9 h-10" onClick={handleZoomOut}>
            -
          </button>
        </div>
        
        <div className="absolute bottom-8 right-2 z-10 flex flex-col">
          <button className="xl:text-md md:text-sm text-xs font-semibold text-black rounded-md lg:border-2 border-1  bg-white hover:bg-gray-200 duration-200 p-1 w-full" onClick={()=>{setShowQuadrantColors(!showQuadrantColors)}}>
            {showQuadrantColors ? "Hide Quadrant Colors" : "Show Quadrant Colors"}
          </button>
      
        </div>
        
        <div ref={mapContainer} className="top-0 h-full w-full" />
      </div>

    </div>
    {
      showInfo ? 
      <div className="absolute opacity-100 left-0 right-0 mx-auto about-container">
          <div class="lg:text-sm text-xs bg-white pb-16 px-8 rounded-md">
            <h1 className="lg:text-3xl sm:text-xl text-lg font-semibold text-center py-6">
              About
            </h1>
            <div class="lg:text-lg text-md mb-1">
              <b>How does Bayborhood work?</b>
            </div>
            Bayborhood helps you discover suitable neighborhoods in San Francisco, based on your preferences.
            <ul class="list-decimal ml-6">
              <li class="mt-1">
                <b >Adding Filters</b>: From the left sidebar, add filters to narrow down your search. You can also click on some filters to fine-tune your preferences.</li>
                <li class="mt-1"><b>View Map</b>: The map is interactive and will update as you add filters. Darker areas indicate higher alignment with your preferences. You can hover over a neighborhood to see its name and the quadrant it's in.</li>
                <li class="mt-1"><b>See Quadrants</b>: On the bottom right, toggle "See Quadrants" to color-coordinate the map to color every neighborhood separately by their quadrant.</li>
              </ul>
              <div class="lg:text-lg text-sm mt-4 mb-1"><b>Where do you get the data?</b>
              </div>We source our data from several public datasets, and apply additional processing to aggregate the disparate datasets into a convenient and accessible format.
              <ul class="ml-6 list-disc">
                <li class="mt-1"><b>Neighborhoods and Quadrants</b>: 2022 Neighborhood Analysis  <a href="https://data.sfgov.org" target="_blank" rel="noreferrer" class="text-blue-500 underline">DataSF</a></li>
              <li class="mt-1"><b>Grocery Chains and Gyms</b>: <a href="https://developer.foursquare.com/docs/places-api-overview" target="_blank" rel="noreferrer" class="text-blue-500 underline">Foursquare Places API</a></li>
                <li class="mt-1"><b>Parks</b>: <a href="https://data.sfgov.org" target="_blank" rel="noreferrer" class="text-blue-500 underline">Data SF</a></li>
                <li class="mt-1"><b>BikeShare</b>: <a href="https://www.lyft.com/bikes/bay-wheels/system-data" target="_blank" rel="noreferrer" class="text-blue-500 underline">Lyft API</a></li>
                <li class="mt-1"><b>BART Stations</b>: <a href="https://www.bart.gov/schedules/developers/api" target="_blank" rel="noreferrer" class="text-blue-500 underline">BART API</a> (Distance calculated by <a href="https://www.microsoft.com/en-us/maps/bing-maps/distance-matrix" target="_blank">Bing Distance API</a>)</li></a></li>
                <li class="mt-1"><b>Safety</b>: <a href="https://data.sfgov.org" target="_blank" rel="noreferrer" class="text-blue-500 underline">Data SF</a></li>
                <li class="mt-1"><b>Housing Prices</b>: <a href="https://developers.rentcast.io/reference/market-statistics" target="_blank" rel="noreferrer" class="text-blue-500 underline">RentCast </a>(calculated by ZIP Code)</li>
                {/* <li class="mt-1"><b>Housing Prices</b>: <a href="" target="_blank" rel="noreferrer" class="text-blue-500 underline">Streeteasy Data Dashboard</a></li> */}
              </ul>
              </div>
        
      </div>
      :
      <></>
    }
    </>
  );







  function displayActiveFilters(){
    return (
    <div className="flex flex-col bodyText">
        {
          showCrime ?
            <div onClick={()=>setShowCrime(false)}
              className={`lg:border-l-8 border-l-6 xl:my-2 my-0.5 border-yellow-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex items-center duration-200 mr-2 cursor-pointer`}>
              
              <BsShield className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Safety
            </div>
          :
            <></>
        }
        {
          showParks ?
            <div onClick={()=>setShowParks(false)}
              className={`lg:border-l-8 border-l-6 xl:my-2 my-0.5 border-red-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex items-center duration-200 mr-2 cursor-pointer`}>
              <BsTree className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Parks
            </div>
          :
            <></>
        }
        {
          showGrocery ?
            <div onClick={()=>{
                setShowGrocery(false);
                setWholeFoods(false)
                setTraderJoes(false)}}
              className={`lg:border-l-8 border-l-6 xl:my-2 my-0.5 border-green-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
                <FiShoppingCart className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Grocery Chains
                </div>
               <div className="grid grid-cols-2 lg:gap-2 gap-1">
                  <div onClick={(e)=>{e.stopPropagation()
                                      setTraderJoes(!traderJoes)}} 
                      className={`${traderJoes ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg xl:px-2 px-0.5 py-1 cursor-pointer bodyText2`}>
                    Trader Joe's
                  </div>
                  <div onClick={(e)=>{e.stopPropagation()
                                      e.preventDefault()
                                      setWholeFoods(!wholeFoods)}} 
                      className={`${wholeFoods ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg xl:px-2 px-0.5 py-1 cursor-pointer bodyText2`}>
                    Whole Foods
                  </div>
                </div>
            </div>
          :
            <></>
        }
        {
          showBart ?
            <div onClick={()=>setShowBart(false)}
              className={`lg:border-l-8 border-l-6 xl:my-2 my-0.5 border-blue-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
               <BsTrainFront className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>BART Stations
                </div>
               <div className="grid grid-cols-2 lg:gap-2 gap-1">
                  <div onClick={(e)=>{e.stopPropagation()
                                      setBartMode("Walking")}} 
                      className={`${bartMode==="Walking" ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg xl:px-2 px-0.5 py-1 cursor-pointer 2xl:text-md bodyText2`}>
                    Walking
                  </div>
                  <div onClick={(e)=>{e.stopPropagation()
                                      setBartMode("Transit")}} 
                                      className={`${bartMode==="Transit" ? "bg-blue-500 border-blue-200" : "bg-white border-gray-500" } duration-100 text-center border-2 rounded-lg xl:px-2 px-0.5 py-1 cursor-pointer 2xl:text-md bodyText2`}>
                    Transit
                  </div>
                </div>
            </div>
          :
            <></>
        }
        {
          showGyms ?
            <div onClick={()=>setShowGyms(false)}
              className={`lg:border-l-8 border-l-6 xl:my-2 my-0.5 border-purple-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
               <CiDumbbell className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Gyms
                </div>
            </div>
          :
            <></>
        }
        {
          showBudget ?
            <div onClick={()=>setShowBudget(false)}
              className={`lg:border-l-8 border-l-6 xl:my-2 my-0.5 border-amber-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex flex-col duration-200 mr-2 cursor-pointer`}>
               
               <div className="flex items-center">
               <BiMoneyWithdraw className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>Budget
                </div>
                <div onClick={(e=>{e.stopPropagation()})}  
                    className={`bodyText2`}>
                    <div class="slidecontainer">
                      <p>Monthly Rent:</p>
                      <input onChange={(e)=>{
                                    setBudgetMax(parseInt(e.target.value))
                                    }} type="range" min="2500" max="7000" class="slider" id="myRange" />
                      <div className="flex flex-col py-2 px-2 bg-gray-50 rounded-lg w-full mx-auto border-0.5 border-black">
                        <p className="">Average Monthly Rent: </p><span className="font-semibold">${budgetMax}</span>
                      </div>
                    </div>
                </div>

            </div>
          :
            <></>
        }
        {
          showBikes ?
            <div onClick={()=>setShowBikes(false)}
              className={`lg:border-l-8 border-l-6 my-0.5 border-gray-400 bg-gray-100 hover:bg-gray-200 w-full lg:p-2 py-1 lg:px-2 px-0.5 whitespace-nowrap  rounded-lg flex items-center duration-200 mr-2 cursor-pointer`}>
                <PiPersonSimpleBikeBold className="xl:w-4 xl:h-4 w-2 h-2 mx-1"/>BikeShare
            </div>
          :
            <></>
        }


    </div>
    
    )
    
  }
  
};

export default Home;