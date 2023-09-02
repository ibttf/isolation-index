import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/globals.css';
import logo from "../styles/logo.png"
mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [showStates,setShowStates]=useState(false);

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
  const [isFfContactClicked,setIsFfContactClicked]=useState(false);
  
  
  

  // const updateOpacity = () => {
  //   if (!map.current) return;
  
  //   // Define the base opacity expression
  //   let opacityExpression = ['+', 1];
  
  //   // Ensure opacity doesn't exceed 1
  //   opacityExpression = ['min', 1, opacityExpression];
  
  //   // Set the calculated opacity expression to the 'quadrant-fill' layer
  //   map.current.setPaintProperty('state-fill', 'fill-opacity', opacityExpression);
  // };




  useEffect(() => {
    const counties=require('../data/counties.geojson');
    const states=require('../data/states.json')
    //SETTING INITIAL MAP IN USA WITH NO ZOOM
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-96, 38],
      zoom: 3.2,
      minZoom: 1,
      dragPan: false,
      scrollZoom: false,
    });


    //Adding county fills and outlines
    map.current.on('load', () => {
      // Adding counties source (includes counties info)
      map.current.addSource('counties', {
        type: 'geojson',
        data: counties,
      });
          // Add the state boundaries source
    map.current.addSource('states', {
      type: 'geojson',
      data: states 
    });

      // county fill layer
      map.current.addLayer({
        id: 'county-fill',
        type: 'fill',
        source: 'counties',
        paint: {
          'fill-color': 'gray',
          'fill-opacity': 0.3
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
      //state fill layer to be rendered dynamically
      map.current.addLayer({
        id: 'state-outline',
        type: 'line',
        source: 'states',
        paint: {
          'line-color': 'black',
          'line-width': 1
        },
        layout: {
          'visibility': 'none' // initially set to invisible
        }
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
  });
        
  },[]);






// SECOND USE EFFECT TO UPDATE THINGS WITHOUT RERENDER
useEffect(() => {
  if (map.current && map.current.isStyleLoaded()) {
    if (showStates) {
      map.current.setLayoutProperty('state-outline', 'visibility', 'visible');
      map.current.setPaintProperty('state-outline', 'line-width', 1);
    } else {
      map.current.setLayoutProperty('state-outline', 'visibility', 'none');
    }
  }
}, [showStates]);


  return (
    <>
    <div className={`opacity-100 bg-white h-full overflow-x-hidden mb-48`} style={{width: "100%"}}>
      {/* DESKTOP SIDEBAR */}
      <div className="w-screen h-fit">
        <div className="bg-blue-100 xl:border-b-8 border-b-4 border-blue-900 xl:p-3 p-1 flex items-center justify-center">
          <img src={logo} alt="logo" className="2xl:w-10 2xl:h-10 xl:w-8 xl:h-8 lg:w-8 lg:h-8 md:w-6 md:h-6 w-4 h-4"/>
          <h1 className=" font-semibold text-red-700 font-mono title">
            <span>
              Connect
            </span>
              America
          </h1>

        </div>
        <div>

        </div>

      </div>

      {/* MAP */}
        <div className="relative mx-auto rounded-3xl mt-12" style={{width: "50vw", height: "70vh"}}>
          
          <div ref={mapContainer} className="top-0 h-full w-full relative">
            {/* This div is positioned absolutely inside the map container */}
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
        <div className="flex w-6/12 pt-24 mx-auto">
          <div className="flex flex-col bodyText w-4/12 " >
            <h1 className="text-gray-600 font-light text-4xl">
              Risk Factors
            </h1>
            <h2 className="text-gray-400">
              Click the checkbox next to the risk factor to see it on the map. Click the risk factor name to read more.
            </h2>
            <div className="flex flex-col my-6 rounded-md h-96 overflow-y-scroll">

            {/* POPULATION OVER 50 */}
            <div onClick={()=>setDisplayedRisk("population")} className="cursor-pointer">
              <div className="w-full mx-auto h-0.5 bg-gray-400 "></div>
                <div 
                    className="flex items-center justify-left text-gray-600 bg-gray-200 p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsPopulationClicked(!isPopulationClicked)}}
                        className={`h-4 w-4 ${isPopulationClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Population Over 50
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* YOUNG PEOPLE*/}
            <div onClick={()=>setDisplayedRisk("population1")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsPopulation1Clicked(!isPopulation1Clicked)}}
                        className={`h-4 w-4 ${isPopulation1Clicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Population Between 16 and 29
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* LGBT POPULATION*/}
            <div onClick={()=>setDisplayedRisk("lgbt")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsLgbtClicked(!isLgbtClicked)}}
                        className={`h-4 w-4 ${isLgbtClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    LGBT Population
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* ETHNIC MINORITIES*/}
            <div onClick={()=>setDisplayedRisk("ethnic")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsEthnicClicked(!isEthnicClicked)}}
                        className={`h-4 w-4 ${isEthnicClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Ethnic Minorities
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* HEALTH AND DISABILITY*/}
            <div onClick={()=>setDisplayedRisk("disability")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsDisabilityClicked(!isDisabilityClicked)}}
                        className={`h-4 w-4 ${isDisabilityClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Disabled Population
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* YOUNG MOTHERS*/}
            <div onClick={()=>setDisplayedRisk("motherhood")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsMotherhoodClicked(!isMotherhoodClicked)}}
                        className={`h-4 w-4 ${isMotherhoodClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Young Mothers
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* SOCIOECONOMIC */}
            <div onClick={()=>setDisplayedRisk("socioeconomic")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsSocioEconomicClicked(!isSocioEconomicClicked)}}
                        className={`h-4 w-4 ${isSocioEconomicClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Socioeconomic Status
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* WIDOWED/DIVORCED */}
            <div onClick={()=>setDisplayedRisk("widowedDivorced")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsWidowedDivorcedClicked(!isWidowDivorcedClicked)}}
                        className={`h-4 w-4 ${isWidowDivorcedClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Widowed/Divorced Population
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>
            {/* PEOPLE LIVING ALONE */}
            <div onClick={()=>setDisplayedRisk("livingAlone")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsLivingAloneClicked(!isLivingAloneClicked)}}
                        className={`h-4 w-4 ${isLivingAloneClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Population Living Alone
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>

            {/* CONTACT WITH FRIENDS AND FAMILY */}
            <div onClick={()=>setDisplayedRisk("ffContact")} className="cursor-pointer">
                <div 
                    className="flex items-center justify-left text-gray-600 bg-white p-4">
                  <div onClick={(e)=>{e.stopPropagation();
                                        setIsFfContactClicked(!isFfContactClicked)}}
                        className={`h-4 w-4 ${isFfContactClicked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-400"} border-2 `}>
                  </div>
                  <p className="mx-2 text-md">
                    Contact with Friends and Family
                  </p>
                </div>
                <div className="w-full mx-auto h-0.5 bg-gray-400"></div>
            </div>

            </div>


          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col bodyText w-8/12 mx-2 " >
            <h1 className="text-gray-600 font-light text-4xl">
              Information
            </h1>
            <h2 className="text-gray-400">
              Read about each risk factor and how it relates to social isolation.
            </h2>
            <div className="flex flex-col my-6 rounded-md">
              {displayActiveInfo()}
            </div>


          </div>
        </div>

        {/* ABOUT THE MAP */}
        <div className="w-10/12 mx-auto">
          <h1 className="text-center text-gray-600 font-light text-4xl">
            About this Map
          </h1>
        </div>

    </div>
    </>
  );



    function displayActiveInfo(){
      if (displayedRisk==="population"){
        return (
          <div>
            Population over 50
          </div>
        )
      }else if (displayedRisk==="population1"){
        return(
          <div>
            Population between 16 and 29
          </div>
        )
      }else if (displayedRisk==="lgbt"){
        return(
          <div>
            LGBT
          </div>
        )
      }else if (displayedRisk==="ethnic"){
        return(
          <div>
            Ethnic Minorities
          </div>
        )
      }else if (displayedRisk==="disability"){
        return(
          <div>
            Disability
          </div>
        )
      }else if (displayedRisk==="motherhood"){
        return(
          <div>
            Motherhood
          </div>
        )
      }else if (displayedRisk==="socioeconomic"){
        return(
          <div>
            Socioeconomic status
          </div>
        )
      }else if (displayedRisk==="widowedDivorced"){
        return(
          <div>
            Widowed Divorced
          </div>
        )
      }else if (displayedRisk==="livingAlone"){
        return(
          <div>
            Living Alone
          </div>
        )
      }else if (displayedRisk==="ffContact"){
        return(
          <div>
            Contact With Friends and Family
          </div>
        )
      }else{
        return(
          <></>
        )
      }

    }


  }


export default Home;