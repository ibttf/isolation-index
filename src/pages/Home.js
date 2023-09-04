import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/globals.css';
import logo from "../styles/logo.png"
import {FaSearchLocation} from "react-icons/fa"
import { references } from '../data/references';
import {AiOutlineArrowDown, AiOutlineQuestion, AiOutlineBook} from "react-icons/ai"
import {BsMap, BsPencil} from "react-icons/bs"
mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [showStates,setShowStates]=useState(false);
  const [isRefClicked,setIsRefClicked]=useState(false);


  const [displayedRisk,setDisplayedRisk]=useState("")
  const [isPopulationClicked,setIsPopulationClicked]=useState(false);
  const [isPopulation1Clicked,setIsPopulation1Clicked]=useState(false);
  const [isLgbtClicked,setIsLgbtClicked]=useState(false);
  const [isEthnicClicked,setIsEthnicClicked]=useState(false);
  const [isDisabilityClicked,setIsDisabilityClicked]=useState(false);
  const [isMotherhoodClicked,setIsMotherhoodClicked]=useState(false);
  const [isSocioEconomicClicked,setIsSocioEconomicClicked]=useState(false);
  const [isWidowDivorcedClicked,setIsWidowedDivorcedClicked]=useState(false);
  const [isLivingAloneClicked,setIsLivingAloneClicked]=useState(false);
  
  
  const updateOpacity = () => {
    if (!map.current) return;
  
    // Define the base opacity expression
    let opacityExpression = 0.1;
  
    if (isPopulationClicked) {
      opacityExpression = [
        'case',
        ['has', 'ELDERLY_PPL_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'ELDERLY_PPL_SCORE'], 0.05]],
        opacityExpression
      ];
    }
    if (isPopulation1Clicked) {
      opacityExpression = [
        'case',
        ['has', 'YOUNG_PPL_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'YOUNG_PPL_SCORE'], 0.05]],
        opacityExpression
      ];
    }
  
    if (isEthnicClicked) {
      opacityExpression = [
        'case',
        ['has', 'NON_WHITE_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'NON_WHITE_SCORE'], 0.05]],
        opacityExpression
      ];
    }
    if (isLivingAloneClicked) {
      opacityExpression = [
        'case',
        ['has', 'LIVE_ALONE_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'LIVE_ALONE_SCORE'], 0.05]],
        opacityExpression
      ];
    }
    if (isWidowDivorcedClicked) {
      opacityExpression = [
        'case',
        ['has', 'DIVORCED_WIDOWED_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'DIVORCED_WIDOWED_SCORE'], 0.05]],
        opacityExpression
      ];
    }
    if (isMotherhoodClicked) {
      opacityExpression = [
        'case',
        ['has', 'YOUNG_MOTHER_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'YOUNG_MOTHER_SCORE'], 0.05]],
        opacityExpression
      ];
    }
    if (isLgbtClicked) {
      opacityExpression = [
        'case',
        ['has', 'LGBT_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'LGBT_SCORE'], 0.05]],
        opacityExpression
      ];
    }
  
    if (isSocioEconomicClicked) {
      opacityExpression = [
        'case',
        ['has', 'POVERTY_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'POVERTY_SCORE'], 0.05]],
        opacityExpression
      ];
    }
    if (isDisabilityClicked) {
      opacityExpression = [
        'case',
        ['has', 'POVERTY_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'POVERTY_SCORE'], 0.05]],
        opacityExpression
      ];
    }
  
    // Ensure opacity doesn't exceed 1
    opacityExpression = ['max', 0.1, ['min', 1.0, opacityExpression]];
  
    // Set the calculated opacity expression to the 'county-fill' layer
    map.current.setPaintProperty('county-fill', 'fill-opacity', opacityExpression);
  };



useEffect(() => {
  const counties=require('../data/counties.geojson');
  const states=require('../data/states.json');

  map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-96, 38],
      zoom: getZoomLevel(),
      minZoom: 1,
      dragPan: false,
      scrollZoom: false,
  });

  map.current.on('load', () => {

      // Adding counties source (includes counties info)
      map.current.addSource('counties', {
        type: 'geojson',
        data: counties,
      });
      // Adding states source (includes counties info)
      map.current.addSource('states', {
        type: 'geojson',
        data: states,
      });

      // county fill layer
      map.current.addLayer({
        id: 'county-fill',
        type: 'fill',
        source: 'counties',
        paint: {
          'fill-color': 'red',
          'fill-opacity': 0.1, // Set initial opacity to 0.1
        },
      });

      // county outline layer
      map.current.addLayer({
        id: 'county-outline',
        type: 'line',
        source: 'counties',
        paint: {
          'line-color': 'white',
          'line-width': 0.3,
          'line-opacity': 1,
        },
      });

      // state outline layer
      map.current.addLayer({
        id: 'state-outline',
        type: 'line',
        source: 'states',
        layout: {
          'visibility': 'none',  // Set the initial visibility to 'none'
        },
        paint: {
          'line-color': 'black',
          'line-width': 0.3,
          'line-opacity': 1,
        },
      });





    // POPUP BASED ON county
      
    
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

      map.current.on('mousemove', 'county-fill', (e) => {
        // Check if there are any features under the mouse pointer
        if (e.features.length) {
            const { NAME } = e.features[0].properties;
            const {STATE_NAME} =e.features[0].properties;
            if (NAME && STATE_NAME) {
                popupDiv.innerHTML = `
                    <div style="text-align: center;>
                    <h4 style="color: white; font-size: 16px;">${STATE_NAME}</h4>
                    <p style="color: white; font-size: 13px;">${NAME}</p>
                    </div>
                `;
                popupDiv.style.display = 'block'; // Show the popup
            }
        } else {
            popupDiv.style.display = 'none'; // Hide the popup if there's no feature under the pointer
        }
    
        // Update the position of the popup
        const x = e.originalEvent.clientX;
        const y = e.originalEvent.clientY + window.scrollY - 10; // Subtract 10 pixels to position the popup 10 pixels above the cursor
        popupDiv.style.left = `${x}px`;
        popupDiv.style.top = `${y}px`;
        popupDiv.style.transform = 'translate(-50%, -100%)'; // Adjust the vertical translation
    });
    
    map.current.on('mouseleave', 'county-fill', () => {
        popupDiv.style.display = 'none'; // Hide the popup
    });

      // Fit the bounds to the continental U.S.
      const bounds = [
          [-125, 24],  // Southwest coordinates
          [-66, 49]   // Northeast coordinates
      ];
      map.current.fitBounds(bounds, { padding: 20 });
  });

  // Adjust zoom level when the window is resized
  window.addEventListener('resize', () => {
      map.current.setZoom(getZoomLevel());
  });

  return () => {
      // Cleanup: Remove the event listener when the component is unmounted
      window.removeEventListener('resize', () => {
          map.current.setZoom(getZoomLevel());
      });
  };

}, []);

// Function to determine zoom level based on screen width
const getZoomLevel = () => {
  const width = window.innerWidth;
  
  if (width <= 480) {
      return 3.4;  // Zoom level for small screens
  } else if (width <= 768) {
      return 3.6;  // Zoom level for medium screens
  } else {
      return 3.5;  // Zoom level for large screens
  }
};




  // SECOND USE EFFECT TO UPDATE THINGS WITHOUT RERENDER
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded() && map.current.getLayer('state-outline')) {
      updateOpacity();

      // SHOW STATE OUTLINES ON CLICK
      if (showStates) {
        map.current.setLayoutProperty('state-outline', 'visibility', 'visible');
      } else {
        map.current.setLayoutProperty('state-outline', 'visibility', 'none');
      }
    }
  }, [isPopulationClicked, isPopulation1Clicked, isLgbtClicked, isEthnicClicked, isDisabilityClicked, isMotherhoodClicked, isWidowDivorcedClicked, isSocioEconomicClicked, isLivingAloneClicked, showStates]);
  
  return (
    <>
    <div className={`opacity-100 bg-white h-full overflow-x-hidden lg:mb-4 mb-18`} style={{width: "100%"}}>
      {/* DESKTOP SIDEBAR */}
      <div className="w-screen h-fit">
        <div className="grid grid-cols-2 w-full bg-white xl:border-b-4 border-b-4 border-gray-600 xl:p-3 p-1 items-center">
          
          <h1 className="text-gray-700 title text-left">
            <div onClick={()=>window.location.reload()} className="cursor-pointer flex items-center">
              <FaSearchLocation className="mx-4 text-blue-500 lg:w-8 lg:h-8 sm:w-6 sm:h-6 w-4 h-4"/>
              Isolation Index
              </div>
          </h1>
          <div className="grid grid-cols-4 items-center text-center text-gray-500 pr-6 whitespace-nowrap navbar-text" >
            <div className="flex items-center w-full text-center justify-center">
              <BsMap className="mr-1 lg:h-6 sm:w-4 sm:h-4 w-1 h-1" />
              <a className="text-center hover:text-gray-600" href="#map">Map</a>
            </div>
            <div className="flex items-center w-full justify-center text-center">
              <BsPencil className="mr-1 lg:h-6 sm:w-4 sm:h-4 w-1 h-1" />
              <a className="text-center hover:text-gray-600" href="#risk-factors">Risk Factors</a>
            </div>

            <div className="flex items-center w-full justify-center text-center">
              <AiOutlineQuestion className="mr-1 lg:h-6 sm:w-4 sm:h-4 w-1 h-1" />
            <a className="text-center hover:text-gray-600" href="#about">About</a>
            </div>
            <div className="flex items-center w-full justify-center text-center">
              <AiOutlineBook className="mr-1 lg:h-6 sm:w-4 sm:h-4 w-1 h-1" />
              <a className="text-center hover:text-gray-600" href="#references">References</a>
            </div>
          </div>
        </div>
        <div>

        </div>

      </div>

      {/* MAP */}

        <div id="map" className="relative mx-auto rounded-3xl map-container" style={{width: "80vw"}}>
          <h1 className="text-gray-600 font-light text-center lg:my-6 my-3 header-2">Social Isolation Risk Factors Map</h1>
          <h2 className="text-gray-600 font-light subTitle text-center lg:mb-6 mb-3">
            View how various factors impact social isolation in American counties.
          </h2>
          <div ref={mapContainer} className="top-0 h-full w-full relative">
            <label className="absolute bottom-4 right-4 flex items-center p-2 bg-white rounded-md shadow-md z-20">
              <input 
                type="checkbox"
                checked={showStates}
                onChange={() => setShowStates(!showStates)}
                className="mr-2 cursor-pointer"
              />
              Show State Boundaries
            </label>
          </div>
        </div>


        {/* RISK FACTORS */}
        <div id="risk-factors" className="flex md:pt-60 pt-36 mx-auto body-1">
          <div className="flex flex-col bodyText w-4/12 " >
            <h1 className="text-gray-600 font-light header-2">
              Risk Factors
            </h1>
            <h2 className="text-gray-400 bodyText2">
              Click the checkbox next to the risk factor to see it on the map. Click the risk factor name to read more.
            </h2>
            <div className="flex flex-col my-6 rounded-md">

            {/* POPULATION OVER 50 */}
            <div onClick={()=>setDisplayedRisk("population")} className="cursor-pointer">
              <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400 "></div>
                <div 
                    className="flex items-center justify-left text-gray-600 bg-gray-200 hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsPopulationClicked(!isPopulationClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isPopulationClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Population Over 55
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* YOUNG PEOPLE*/}
            <div onClick={()=>setDisplayedRisk("population1")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white  hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsPopulation1Clicked(!isPopulation1Clicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isPopulation1Clicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Population Between 15 and 24
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* LGBT POPULATION*/}
            <div onClick={()=>setDisplayedRisk("lgbt")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-gray-200 hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsLgbtClicked(!isLgbtClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isLgbtClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    LGBT Population
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* ETHNIC MINORITIES*/}
            <div onClick={()=>setDisplayedRisk("ethnic")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsEthnicClicked(!isEthnicClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isEthnicClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Ethnic Minorities
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* HEALTH AND DISABILITY*/}
            <div onClick={()=>setDisplayedRisk("disability")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-gray-200 hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsDisabilityClicked(!isDisabilityClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isDisabilityClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Disabled Population
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* YOUNG MOTHERS*/}
            <div onClick={()=>setDisplayedRisk("motherhood")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsMotherhoodClicked(!isMotherhoodClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isMotherhoodClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Young Mothers
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* SOCIOECONOMIC */}
            <div onClick={()=>setDisplayedRisk("socioeconomic")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-gray-200 hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsSocioEconomicClicked(!isSocioEconomicClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isSocioEconomicClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Socioeconomic Status
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* WIDOWED/DIVORCED */}
            <div onClick={()=>setDisplayedRisk("widowedDivorced")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsWidowedDivorcedClicked(!isWidowDivorcedClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isWidowDivorcedClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Widowed/Divorced Population
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            {/* PEOPLE LIVING ALONE */}
            <div onClick={()=>setDisplayedRisk("livingAlone")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-gray-200 hover:bg-blue-100 lg:p-4 p-1 bodyText2">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsLivingAloneClicked(!isLivingAloneClicked)}}
                        className={`lg:h-4 lg:w-4 h-2 w-2 ${isLivingAloneClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} lg:border-2 border-1 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Population Living Alone
                  </p>
                </div>
                <div className="w-full mx-auto lg:h-0.5 h-0.25 bg-gray-400"></div>
            </div>
            </div>


          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col bodyText w-8/12 mx-2 " >
            <h1 className="text-gray-600 font-light header-2">
              Information
            </h1>
            <h2 className="text-gray-400 bodyText2">
              Read about each risk factor and how it relates to social isolation.
            </h2>
            <div className="flex flex-col my-6 rounded-md">
              {displayActiveInfo()}
            </div>


          </div>
        </div>

        {/* ABOUT THE MAP */}
        <div id="about" className="lg:w-9/12 w-11/12 mx-auto text-gray-600">
          <h1 className="text-center my-8 font-light header-2">
            About this Map
          </h1>
          
          <div class="bodyText2 bg-white pb-16 px-8 rounded-md font-light">
            <div class="subTitle mb-1">
              <b>How does Isolation Index work?</b>
            </div>
              Isolation Index is a simple data visualization tool that allows you to see which counties and states in the US are most at risk of social isolation based on various factors.
            <ul class="list-decimal ml-6">
              <li class="mt-1">
                <b >Viewing Risk Factors</b>: From the left sidebar below the map, click the box next to each risk factor to view how they affect different counties and states, as well as how they overlap with other factors. Darker, redder shades indicate higher risk of social isolation. You can click on the bottom right checkbox to either show an outline for each state or just to see the counties.</li>
              <li class="mt-1">
                <b >Reading about Risk Factors</b>: From the left sidebar below the map, click the name of the risk factor to read more about how it is related to social isolation.</li>
              </ul>
              <div class="subTitle mt-4 mb-1"><b>Where do you get the data?</b>
              </div>We source our data entirely from US Census data, as well as other publicly available datasets, and apply additional processing to aggregate the disparate datasets into a convenient and accessible format. Often, percentages exist, but just as often, we have to calculate them manually.
                <ul class="ml-6 list-disc">
                  <li class="mt-1"><b>County Borders, State Borders, Racial Breakdowns, Age Breakdowns </b>: 2020 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data</a></li>
                  <li class="mt-1"><b>Proportion Living Alone </b>: 2020 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data </a> (Calculated as a proportion of single-person households over total households)</li>
                  <li class="mt-1"><b>Widowed/Divorced People </b>: 2020 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data </a> (Calculated as a proportion of widows and divorces over total population)</li>
                  <li class="mt-1"><b>Disabled People </b>: 2021 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data </a> (Calculated as a proportion of disabled peoples over total population)</li>
                  <li class="mt-1"><b>Young Mothers </b>: 2021 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data </a> (Calculated as a proportion of women who gave birth in the last 12 months who were 29 and under over total women who gave birth in the last 12 months)</li>
                  <li class="mt-1"><b>LGBT </b>: 2018 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data </a> (Calculated as a proportion of same-sex partner households over total households)</li>
                  <li class="mt-1"><b>Socioeconomic </b>: 2018 <a href="https://data.census.gov" target="_blank" rel="noreferrer" class="text-blue-500 underline"> Census Data </a> (Calculated as a proportion of people under the poverty line over total population)</li>
              </ul>
              <div class="bodyText2 my-1 ">
                  * It should be noted that US Census Data is often incomplete for some US Counties. To account for these disparities, we backfilled missing data with the next available entry in the dataset. This may result in some discrepancies that are not entirely accurate representations of every county.
              </div>
              <div className="bodyText2">
                <br></br>
                Isolation Index was created in one week as a passion project by <a className="underline text-blue-500 cursor-pointer active:text-blue-800" href="https://www.royleedev.com" target="_blank">Roy Lee</a>.
              </div>
              </div>
      
        </div>
        {/* REFERENCES */}
        <div id="references" className="lg:w-9/12 w-full mx-auto text-gray-600">
          <h1  onClick={()=> setIsRefClicked(!isRefClicked)} className="text-center my-8 font-light flex items-center justify-center  header-2">
            References 
            <AiOutlineArrowDown className={`${isRefClicked ? "rotate-180" : ""} duration-100 lg:w-6 lg:h-6 sm:w-4 sm:h-4 w-2 h-2`}/>
          </h1>
          
          {isRefClicked?
            <div class="bodyText2 bg-white pb-16 px-8 rounded-md font-light">
            <ul class="list-decimal lg:ml-6">
                  {
                  
                  Object.keys(references).map((reference)=>{
                    return(
                    <>
                      <h4 className="bodyText2">
                        {reference}
                        <a className="text-blue-500" href={references[reference]} target="_blank">{references[reference]}</a>
                      </h4>
                      <br></br>
                      
                    </>
                    )
                  })}
            </ul>
            </div>:
            <></>}
      
          </div>

    </div>
    </>
  );



    function displayActiveInfo(){
      if (displayedRisk==="population"){
        return (
          <div className="p-4">
          <h1 className="subTitle2 font-semibold lg:mb-4 mb-1">OLDER POPULATION</h1>
          <p className="lg:mb-4 mb-1 bodyText2">
              As individuals age, they often encounter an increasing number of risk factors that can contribute to feelings of loneliness. Once one risk factor emerges, it's not uncommon for others to follow. For instance, approximately 24% of Americans aged 65 and older who live in communities are regarded as socially isolated <span className="font-semibold">[1]</span>. Furthermore, a considerable number of U.S. adults report feelings of loneliness, with 35% of those aged 45 and over and 43% of those aged 60 and over expressing such sentiments <span className="font-semibold">[1]</span>.
          </p>
          <p className="lg:mb-4 mb-1 bodyText2">
              These compounding factors can intensify the experience of loneliness, making it particularly challenging to address in one's later years. Prominent risk factors associated with aging encompass, but are not restricted to, the following <span className="font-semibold">[2]</span>:
          </p>
          <ul className="list-disc bodyText2 pl-5 lg:mb-4 mb-1 bodyText2">
              <li className="lg:mb-2 mb-1">Experiencing bereavement</li>
              <li className="lg:mb-2 mb-1">Living independently</li>
              <li className="lg:mb-2 mb-1">Managing limiting disabilities or health conditions</li>
              <li className="lg:mb-2 mb-1">Taking care of a partner</li>
              <li className="lg:mb-2 mb-1">Grappling with physical and mental health challenges that impede participation in activities and the maintenance of relationships</li>
              <li className="lg:mb-2 mb-1">Relying on fixed incomes, like pensions, which can render some activities financially out of reach</li>
              <li className="lg:mb-2 mb-1">Experiencing digital exclusion</li>
              <li className="lg:mb-2 mb-1">Facing reduced mobility and lacking access to dependable, affordable transportation options</li>
          </ul>
      </div>
        )
      }else if (displayedRisk==="population1"){
        return(
          <div className="p-4">
          <h1 className="subTitle2 font-semibold lg:mb-4 mb-1">YOUNGER POPULATION</h1>
          <p className="lg:mb-4 mb-1 bodyText2">
              For individuals aged 16 to 29, loneliness appears to be a pronounced concern. A national survey of approximately 950 Americans discovered that 36% of respondents felt lonely either "frequently" or "almost always" during the preceding month. This contrasts with 25% who remembered encountering significant issues in the eight weeks leading up to the pandemic. Alarmingly, a staggering 61% of those between the ages of 18 and 25 reported heightened feelings of loneliness <span className="font-semibold">[3]</span>.
          </p>
          <p className="lg:mb-4 mb-1 bodyText2">
              Several factors have been postulated to explain the pronounced feelings of loneliness among the youth:
          </p>
          <ul className="list-disc bodyText2 pl-5 lg:mb-4 mb-1 bodyText2">
              <li className="lg:mb-2 mb-1">Experiences of Bullying: Negative social interactions can leave lasting emotional scars.</li>
              <li className="lg:mb-2 mb-1">Transitions: Events like changing schools can disrupt established social connections.</li>
              <li className="lg:mb-2 mb-1">Health Concerns: Illnesses or disabilities can lead to feelings of isolation.</li>
              <li className="lg:mb-2 mb-1">Family Dynamics: Alterations in family situations or disagreements with family members.</li>
              <li className="lg:mb-2 mb-1">Pandemic-Induced Isolation: The enforced solitude due to lockdowns and social distancing.</li>
              <li className="lg:mb-2 mb-1">Life Milestones: Such as progressing in education, job seeking, moving out of the family home, and forging long-term romantic relationships can reshape social networks<span className="font-semibold">[4]</span>.</li>
              <li className="lg:mb-2 mb-1">Emotional Regulation: Individuals aged 16-24 might have limited experience managing intense emotions or understanding loneliness due to their age<span className="font-semibold">[5]</span>.</li>
              <li className="lg:mb-2 mb-1">Financial Constraints: 55% of young individuals identifying as lonely stated that financial restrictions, preventing them from engaging in activities, heighten their feelings of loneliness<span className="font-semibold">[6]</span>. This sentiment is particularly poignant given the current cost of living crisis<span className="font-semibold">[7]</span>.</li>
              <li className="lg:mb-2 mb-1">Social Media Influence: Approximately 56% of the youth believe that seeing their peers enjoying themselves on social platforms adversely affects their mood<span className="font-semibold">[6]</span>.</li>
          </ul>
      </div>
        )
      }else if (displayedRisk==="lgbt"){
        return(
          <div className="p-4">
          <h1 className="subTitle2 font-semibold lg:mb-4 mb-1">LGBT</h1>
          <p className="lg:mb-4 mb-1 bodyText2">
              The LGBTQ+ community faces heightened risks of loneliness<span className="font-semibold">[8]</span>. Although there's limited recent research on this topic, the available data paints a somber picture:
          </p>
          <ul className="list-disc bodyText2 pl-5 lg:mb-4 mb-1 bodyText2">
              <li className="lg:mb-2 mb-1">Social Dynamics: Experiences of social rejection, exclusion, and discrimination can intensify feelings of loneliness among LGBTQ individuals<span className="font-semibold">[9]</span>.</li>
              <li className="lg:mb-2 mb-1">Comparative Loneliness: Elderly gay and lesbian individuals tend to report higher levels of loneliness than their heterosexual peers<span className="font-semibold">[10]</span>.</li>
              <li className="lg:mb-2 mb-1">Lifestyle Factors: Older members of the LGBT community are particularly prone to feelings of loneliness. This is attributed to factors such as a higher likelihood of being single, living alone, and having limited interactions with family<span className="font-semibold">[11]</span>.</li>
              <li className="lg:mb-2 mb-1">Transgender Loneliness: Research from 2023 indicates elevated rates of loneliness and social isolation among transgender and gender-diverse individuals<span className="font-semibold">[12]</span>. Further emphasizing this, a mental health report on transgender individuals revealed an average isolation score of 3.9 on a scale where 7 signifies constant feelings of isolation<span className="font-semibold">[13]</span>.</li>
              <li className="lg:mb-2 mb-1">Internalized Stigma: Amongst gay, lesbian, and bisexual individuals, there's a notable correlation between internalized stigma and loneliness<span className="font-semibold">[14]</span>.</li>
              <li className="lg:mb-2 mb-1">Minority Stress: Identifying as a sexual minority might elevate loneliness risks, with factors like minority stress and experiences of discrimination based on sexual orientation exacerbating the situation<span className="font-semibold">[15][16]</span>.</li>
          </ul>
      </div>
        )
      }else if (displayedRisk==="ethnic"){
        return(
          <div className="p-4">
              <h2 className="subTitle2 font-bold lg:mb-4 mb-1">Ethnic Minorities</h2>
              <p className="lg:mb-4 mb-1 bodyText2">
                  Migration often disrupts one's social network, necessitating the formation of new connections in a new country. This process might be hindered by barriers such as language or cultural differences, leading to feelings of loneliness. Even second-generation migrants, born in the host country, can face challenges in forming social connections due to cultural differences or their immediate social environment. Feelings of not belonging or experiences of discrimination can exacerbate loneliness. Additionally, many migrants, especially political or economic ones, might have lower financial resources or health issues compared to the native population, which can further contribute to feelings of loneliness. Understanding the primary causes of migrants' loneliness can aid in crafting effective policies to address the issue.
              </p>

              <h3 className=" lg:mb-2 mb-1 bodyText2">Key findings related to ethnic minorities and loneliness include:</h3>
              <ul className="list-disc bodyText2 pl-6">
                  <li className="lg:mb-2 mb-1">Pandemic Impact: During the pandemic, 23% of individuals from ethnic minority backgrounds reported experiencing loneliness, compared to 17% from white backgrounds[17].</li>
                  <li className="lg:mb-2 mb-1">Social Networks: Older Black and Asian adults often report fewer close friends and local acquaintances than their counterparts[18].</li>
                  <li className="lg:mb-2 mb-1">Workplace Loneliness: Ethnic minority workers are more likely to feel isolated at work, with 13% often or always feeling they have no one to talk to, compared to 9% of white workers[19].</li>
                  <li>Community Access: People from BAME backgrounds frequently feel less equipped to access community activities and support[20].</li>
              </ul>
          </div>

        )
      }else if (displayedRisk==="disability"){
        return(
          <div className="p-4">
              <h2 className="subTitle2 font-bold lg:mb-4 mb-1">Disability</h2>
              <p className="lg:mb-4 mb-1 bodyText2">
                  Individuals with poor mental health, long-term health conditions, or disabilities often experience heightened feelings of loneliness. A closer examination of relevant studies sheds light on this correlation. A 2016 study found that ethnicity, unemployment, disability pensions, and mental health conditions act as universal indicators of loneliness across all ages [21].
              </p>
              <p className="lg:mb-4 mb-1 bodyText2">
                  A more recent study in 2020 pinpointed disability as a significant predictor of loneliness, with a few caveats [22]:
              </p>
              <ul className="list-disc bodyText2 pl-6 lg:mb-4 mb-1">
                  <li className="lg:mb-2 mb-1">For men, the association between disability and loneliness diminishes with age.</li>
                  <li className="lg:mb-2 mb-1">Among women, while the tie between moderate disability and loneliness weakens with age, the relationship intensifies for severe disability.</li>
              </ul>
              <p className="bodyText2">
                  As well as another study in 2018, finding that disability is one of the strongest correlating factors with social isolation [23]
              </p>
          </div>

        )
      }else if (displayedRisk==="motherhood"){
        return(
          <div className="p-4">
              <h2 className="subTitle2 font-bold lg:mb-4 mb-1">Young Motherhood</h2>
              <p className="lg:mb-4 mb-1 bodyText2">
                  The transition into motherhood, particularly at a younger age, can be a significant contributor to feelings of loneliness. Various familial dynamics and circumstances underscore this relationship:
              </p>
              <ul className="list-disc bodyText2 pl-6 lg:mb-4 mb-1">
                  <li className="lg:mb-2 mb-1">Family Circumstances: Situations such as adult children moving out, bereavement, becoming single, fragile family bonds, and staying at home with young children are all potential factors that can heighten loneliness[24].</li>
                  <li className="lg:mb-2 mb-1">Young Mothers: A notable percentage of younger mothers report experiencing loneliness:
                      <ul className="list-decimal pl-6 mt-2">
                          <li className="lg:mb-2 mb-1">83% of mothers under 30 indicate feeling lonely at least occasionally[25].</li>
                          <li className="lg:mb-2 mb-1">43% of mothers under 30 express feeling lonely often or consistently[25].</li>
                      </ul>
                  </li>
                  <li>Vulnerable Groups: Pregnant individuals and new parents who encounter added challenges, such as being immigrants, identifying as non-binary, or suffering from postpartum depression, are particularly susceptible to loneliness[26]. Additionally, a lack of social support[27] or feelings of isolation[28] can exacerbate these feelings.</li>
              </ul>
          </div>

        )
      }else if (displayedRisk==="socioeconomic"){
        return(
        <div className="p-4">
            <h2 className="subTitle2 font-bold lg:mb-4 mb-1">Socioeconomic Status</h2>
            <p className="lg:mb-4 mb-1 bodyText2">
                The economic standing of an individual can play a pivotal role in their experiences of loneliness. Several aspects of socioeconomic status and their relation to loneliness include:
            </p>
            <ul className="list-disc bodyText2 pl-6 lg:mb-4 mb-1">
                <li className="lg:mb-2 mb-1">Costs of Socialization: Engaging in activities outside the home, such as traveling to meet friends or family, participating in events, or simply socializing, often comes with associated costs. Those with limited financial means may find it challenging to maintain and establish social connections, thereby increasing their vulnerability to loneliness.</li>
                <li className="lg:mb-2 mb-1">Indirect Impact: Financial constraints can also indirectly influence loneliness. For instance, inadequate financial resources can be associated with other factors like poor health, which can further hamper social integration and intensify feelings of loneliness.</li>
                <li>Research Findings:
                    <ul className="list-decimal pl-6 mt-2">
                        <li className="lg:mb-2 mb-1">There's a consistent finding that a more stable financial situation is protective against loneliness for both younger and older adults[29][30],[31].</li>
                        <li className="lg:mb-2 mb-1">The importance of having sufficient financial resources in relation to feelings of loneliness is more pronounced in middle-aged adults compared to younger or older age groups[32][22].</li>
                        <li>Interestingly, the impact of financial disparities on loneliness seems to diminish with age[34].</li>
                    </ul>
                </li>
            </ul>
        </div>
    
        )
      }else if (displayedRisk==="widowedDivorced"){
        return(
        <div className="p-4">
            <h2 className="subTitle2 font-bold lg:mb-4 mb-1">Widowed & Divorced</h2>
            <p className="lg:mb-4 mb-1 bodyText2">
                Relationship status, particularly when it pertains to having a partner or spouse, is intrinsically tied to experiences of loneliness. Here's an overview:
            </p>
            <ul className="list-disc bodyText2 pl-6 lg:mb-4 mb-1">
                <li className="lg:mb-2 mb-1">Relationship Status and Loneliness: Cross-sectional studies consistently show that having a partner or spouse is associated with lower levels of loneliness[34]. Conversely, being single, divorced, or widowed is linked with higher levels of loneliness[35]. Among all predictors, the link between partner status and loneliness is often one of the most robust, especially in cases of widowhood[23][36][37].</li>
                <li className="lg:mb-2 mb-1">Longitudinal Insights: Longitudinal studies reinforce these findings, suggesting a causal relationship between partner status and loneliness[38]. Notably, negative shifts in partner status, such as the loss of a partner, often lead to a subsequent rise in loneliness among middle-aged and older adults [39][40].</li>
                <li>Timing of Loneliness: Intriguingly, feelings of loneliness seem to intensify even before events like divorce or separation[41]. In contrast, for widowhood, a spike in loneliness typically occurs post-event[35].</li>
            </ul>
        </div>

        )
      }else if (displayedRisk==="livingAlone"){
        return(
          <div className="p-4">
              <h2 className="subTitle2 font-bold lg:mb-4 mb-1">Living Alone</h2>
              <p className="lg:mb-4 mb-1 bodyText2">
                  The living arrangement, particularly whether one lives alone or with others, holds significant implications for feelings of loneliness. Here's a deep dive into the association:
              </p>
              <ul className="list-disc bodyText2 pl-6 lg:mb-4 mb-1">
                  <li className="lg:mb-2 mb-1">Living with Others as a Protective Factor: Living with others, be it a partner, children, parents, or friends, might serve as a shield against loneliness[42]. This protection can stem from the emotional and other support provided by intimate figures or the sheer opportunities for socialization that cohabitation offers.</li>
                  <li className="lg:mb-2 mb-1">Findings from Cross-Sectional Studies: Cross-sectional studies have consistently illustrated that living alone correlates with markedly higher levels of loneliness compared to living with others[43][38][44][45]. Delving further, the presence of a partner in a household appears to be the most influential factor in mitigating loneliness, especially among older adults[46][47][43].</li>
                  <li>Living Alone and Its Ramifications: Being alone is strongly tied to heightened feelings of loneliness. Conversely, cohabiting with others, especially a partner, seems to alleviate such feelings[43]. For the elderly, residing in nursing homes or similar residential care might be linked to increased loneliness compared to those living in communities[42].</li>
              </ul>
          </div>
        )
      }else{
        return(
          <>
          </>
        )
      }

    }



  }


export default Home;