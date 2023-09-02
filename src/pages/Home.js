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
  
  
  

  const updateOpacity = () => {
    if (!map.current) return;
  
    // Define the base opacity expression
    let opacityExpression = 0.1;
  
    if (isPopulationClicked) {
      opacityExpression = [
        'case', 
        ['has', 'ELDERLY_PPL_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'ELDERLY_PPL_SCORE'], 0.1]],
        opacityExpression
      ];
    }
    if (isPopulation1Clicked) {
      opacityExpression = [
        'case', 
        ['has', 'YOUNG_PPL_SCORE'],
        ['+', opacityExpression, ['*', ['get', 'YOUNG_PPL_SCORE'], 0.1]],
        opacityExpression
      ];
    }
  
    // Ensure opacity doesn't exceed 1
    opacityExpression = ['max', 0.1, opacityExpression];
  
    // Set the calculated opacity expression to the 'county-fill' layer
    map.current.setPaintProperty('county-fill', 'fill-opacity', opacityExpression);
  };

  useEffect(() => {
    const counties=require('../data/counties.geojson');
    const states=require('../data/states.json')
    //SETTING INITIAL MAP IN USA WITH NO ZOOM
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-96, 38],
      zoom: 3.8,
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

      // county fill layer
      map.current.addLayer({
        id: 'county-fill',
        type: 'fill',
        source: 'counties',
        paint: {
          'fill-color': '#d3d3d3',
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
      // Add state abbreviation data
      // const stateAbbreviations = [
      //   { state: 'AL', abbreviation: 'AL', coordinates: [-86.9023, 32.806671], 'z-index':30 },
      //   { state: 'AK', abbreviation: 'AK', coordinates: [-152.4044, 61.370716], 'z-index':30 },
      //   { state: 'AZ', abbreviation: 'AZ', coordinates: [-111.4312, 33.729759], 'z-index':30 },
      //   { state: 'AR', abbreviation: 'AR', coordinates: [-92.3731, 34.969704], 'z-index':30 },
      //   { state: 'CA', abbreviation: 'CA', coordinates: [-119.4179, 36.7783], 'z-index':30 },
      //   { state: 'CO', abbreviation: 'CO', coordinates: [-105.3111, 39.059811], 'z-index':30 },
      //   { state: 'CT', abbreviation: 'CT', coordinates: [-73.0877, 41.597782], 'z-index':30 },
      //   { state: 'DE', abbreviation: 'DE', coordinates: [-75.5976, 39.318523], 'z-index':30 },
      //   { state: 'FL', abbreviation: 'FL', coordinates: [-81.6868, 27.766279], 'z-index':30 },
      //   { state: 'GA', abbreviation: 'GA', coordinates: [-83.6431, 33.040619], 'z-index':30 },
      //   { state: 'HI', abbreviation: 'HI', coordinates: [-157.4983, 21.094318], 'z-index':30 },
      //   { state: 'ID', abbreviation: 'ID', coordinates: [-114.4788, 44.240459], 'z-index':30 },
      //   { state: 'IL', abbreviation: 'IL', coordinates: [-89.1994, 40.349457], 'z-index':30 },
      //   { state: 'IN', abbreviation: 'IN', coordinates: [-86.2583, 39.849426], 'z-index':30 },
      //   { state: 'IA', abbreviation: 'IA', coordinates: [-93.5010, 42.011539], 'z-index':30 },
      //   { state: 'KS', abbreviation: 'KS', coordinates: [-96.8005, 38.526600], 'z-index':30 },
      //   { state: 'KY', abbreviation: 'KY', coordinates: [-84.2700, 37.668140], 'z-index':30 },
      //   { state: 'LA', abbreviation: 'LA', coordinates: [-91.8749, 31.169546], 'z-index':30 },
      //   { state: 'ME', abbreviation: 'ME', coordinates: [-69.3819, 44.693947], 'z-index':30 },
      //   { state: 'MD', abbreviation: 'MD', coordinates: [-76.8021, 39.063946], 'z-index':30 },
      //   { state: 'MA', abbreviation: 'MA', coordinates: [-71.5301, 42.230171], 'z-index':30 },
      //   { state: 'MI', abbreviation: 'MI', coordinates: [-84.5361, 43.326618], 'z-index':30 },
      //   { state: 'MN', abbreviation: 'MN', coordinates: [-93.9002, 45.694454], 'z-index':30 },
      //   { state: 'MS', abbreviation: 'MS', coordinates: [-89.6787, 32.741646], 'z-index':30 },
      //   { state: 'MO', abbreviation: 'MO', coordinates: [-92.5663, 38.456085], 'z-index':30 },
      //   { state: 'MT', abbreviation: 'MT', coordinates: [-110.4544, 46.921925], 'z-index':30 },
      //   { state: 'NE', abbreviation: 'NE', coordinates: [-99.9018, 41.125370], 'z-index':30 },
      //   { state: 'NV', abbreviation: 'NV', coordinates: [-117.2240, 38.313515], 'z-index':30 },
      //   { state: 'NH', abbreviation: 'NH', coordinates: [-71.5639, 43.452492], 'z-index':30 },
      //   { state: 'NJ', abbreviation: 'NJ', coordinates: [-74.5210, 40.298904], 'z-index':30 },
      //   { state: 'NM', abbreviation: 'NM', coordinates: [-106.2485, 34.840515], 'z-index':30 },
      //   { state: 'NY', abbreviation: 'NY', coordinates: [-74.9384, 42.165726], 'z-index':30 },
      //   { state: 'NC', abbreviation: 'NC', coordinates: [-79.8064, 35.630066], 'z-index':30 },
      //   { state: 'ND', abbreviation: 'ND', coordinates: [-99.7840, 47.528912], 'z-index':30 },
      //   { state: 'OH', abbreviation: 'OH', coordinates: [-82.7649, 40.388783], 'z-index':30 },
      //   { state: 'OK', abbreviation: 'OK', coordinates: [-96.9289, 35.565342], 'z-index':30 },
      //   { state: 'OR', abbreviation: 'OR', coordinates: [-122.0709, 44.572021], 'z-index':30 },
      //   { state: 'PA', abbreviation: 'PA', coordinates: [-77.2098, 40.590752], 'z-index':30 },
      //   { state: 'RI', abbreviation: 'RI', coordinates: [-71.5118, 41.680893], 'z-index':30 },
      //   { state: 'SC', abbreviation: 'SC', coordinates: [-80.9450, 33.856892], 'z-index':30 },
      //   { state: 'SD', abbreviation: 'SD', coordinates: [-99.9018, 44.299782], 'z-index':30 },
      //   { state: 'TN', abbreviation: 'TN', coordinates: [-86.6923, 35.747845], 'z-index':30 },
      //   { state: 'TX', abbreviation: 'TX', coordinates: [-97.5635, 31.054487], 'z-index':30 },
      //   { state: 'UT', abbreviation: 'UT', coordinates: [-111.8624, 40.150032], 'z-index':30 },
      //   { state: 'VT', abbreviation: 'VT', coordinates: [-72.7107, 44.045876], 'z-index':30 },
      //   { state: 'VA', abbreviation: 'VA', coordinates: [-78.169968, 37.769337], 'z-index':30 },
      //   { state: 'WA', abbreviation: 'WA', coordinates: [-121.490494, 47.400902], 'z-index':30 },
      //   { state: 'WV', abbreviation: 'WV', coordinates: [-80.954000, 38.491226], 'z-index':30 },
      //   { state: 'WI', abbreviation: 'WI', coordinates: [-89.616508, 44.268543], 'z-index':30 },
      //   { state: 'WY', abbreviation: 'WY', coordinates: [-107.302490, 42.755966], 'z-index':30 },
      // ];
      // Add state abbreviation labels
      // stateAbbreviations.forEach(function (state) {
      //   map.current.addSource(state.state, {
      //     type: 'geojson',
      //     data: {
      //       type: 'FeatureCollection',
      //       features: [
      //         {
      //           type: 'Feature',
      //           geometry: {
      //             type: 'Point',
      //             coordinates: state.coordinates,
      //           },
      //           properties: {
      //             abbreviation: state.abbreviation,
      //           },
      //         },
      //       ],
      //     },
      //   });


      //   map.current.addLayer({
      //     'id': state.state + '-label',
      //     'type': 'symbol',
      //     'source': state.state,
      //     'layout': {
      //         'text-field': ['get', 'abbreviation'],
      //         'text-size': 12,
      //         'text-anchor': 'top',
      //         'symbol-sort-key': ['get', 'z-index']
      //     }
      //   });
      // });




















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
    updateOpacity();
    //SHOW STATE OUTLINES ON CLICK
    if (showStates) {
      map.current.setLayoutProperty('state-outline', 'visibility', 'visible');
      map.current.setPaintProperty('state-outline', 'line-width', 1);
    } else {
      map.current.setLayoutProperty('state-outline', 'visibility', 'none');
    }
  }
}, [isPopulationClicked, isPopulation1Clicked, showStates]);


  return (
    <>
    <div className={`opacity-100 bg-white h-full overflow-x-hidden mb-48`} style={{width: "100%"}}>
      {/* DESKTOP SIDEBAR */}
      <div className="w-screen h-fit">
        <div className="bg-blue-100 xl:border-b-8 border-b-4 border-blue-900 xl:p-3 p-1 flex items-center justify-center">
          
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

        <div className="relative mx-auto rounded-3xl" style={{width: "80vw", height: "80vh"}}>
          <h1 className="text-gray-600 font-light text-4xl text-center my-6">Social Isolation Risk Factors Map</h1>
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
        <div className="flex w-6/12 pt-24 mx-auto">
          <div className="flex flex-col bodyText w-4/12 " >
            <h1 className="text-gray-600 font-light text-4xl">
              Risk Factors
            </h1>
            <h2 className="text-gray-400">
              Click the checkbox next to the risk factor to see it on the map. Click the risk factor name to read more.
            </h2>
            <div className="flex flex-col my-6 rounded-md">

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
                    Population Over 55
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
                    Population Between 15 and 24
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
        <div className="w-6/12 mx-auto text-gray-600">
          <h1 className="text-center my-8 font-light text-4xl">
            About this Map
          </h1>
          
          <div class="lg:text-sm text-xs bg-white pb-16 px-8 rounded-md font-light">
            <div class="lg:text-lg text-md mb-1">
              <b>How does ConnectAmerica work?</b>
            </div>
              ConnectAmerica is a simple data visualization tool that allows you to see which counties and states in the US are most at risk of social isolation based on various factors.
            <ul class="list-decimal ml-6">
              <li class="mt-1">
                <b >Viewing Risk Factors</b>: From the left sidebar below the map, click the box next to each risk factor to view how they affect different counties and states. You can click on the bottom right checkbox to either show an outline for each state or just to see the counties.</li>
              <li class="mt-1">
                <b >Reading about Risk Factors</b>: From the left sidebar below the map, click the name of the risk factor to read more about how it is related to social isolation.</li>
              </ul>
              <div class="lg:text-lg text-sm mt-4 mb-1"><b>Where do you get the data?</b>
              </div>We source our data mostly from US Census data, as well as other publicly available datasets, and apply additional processing to aggregate the disparate datasets into a convenient and accessible format.
                <ul class="ml-6 list-disc">
                  <li class="mt-1"><b>County Borders, State Borders, Racial Breakdowns, Age Breakdowns </b>: 2020 Census Data  <a href="https://hub.arcgis.com/datasets/esri::usa-counties/about" target="_blank" rel="noreferrer" class="text-blue-500 underline">ArcGIS</a></li>
                  <li class="mt-1"><b>Proportion Living Alone </b>: 2020 Census Data  <a href="https://hub.arcgis.com/datasets/esri::usa-counties/about" target="_blank" rel="noreferrer" class="text-blue-500 underline">ArcGIS</a> (Calculated as a proportion of single-person households over total households)</li>
                </ul>
              </div>
      
        </div>
        {/* REFERENCES */}
        <div className="w-6/12 mx-auto text-gray-600">
          <h1 className="text-center my-8 font-light text-4xl">
            References
          </h1>
          
          <div class="lg:text-sm text-xs bg-white pb-16 px-8 rounded-md font-light">
            <ul class="list-decimal ml-6">
              <li class="mt-1">
                [1] something 
              </li>
              <li class="mt-1">
                [1] something 
              </li>
            </ul>
            </div>
      
          </div>

    </div>
    </>
  );



    function displayActiveInfo(){
      if (displayedRisk==="population"){
        return (
          <div>
              Population over 50
              <p>
              As we get older, risk factors that might lead to loneliness can begin to increase and converge – once we have one risk factor, we may start having more. This can make the experience of loneliness hard to change, particularly in older age. Key risk factors associated with older age include (but are not limited to) [10]:

                  Facing bereavement
                  Living alone
                  Living with limiting disabilities or illnesses
                  Caring for a partner
                  Physical and mental health difficulties, making it harder to participate in activities and maintain relationships
                  Low fixed incomes, such as pensions, making activities unaffordable
                  Digital exclusion
                  Reduced mobility and loss of access to affordable, reliable, and/or suitable modes of transport

              </p>
              Social isolation (the objective state of having few social relationships or infrequent social contact with others) and loneliness (a subjective feeling of being isolated) are serious yet underappreciated public health risks that affect a significant portion of the older adult population. Approximately one-quarter (24 percent) of community-dwelling Americans aged 65 and older are considered to be socially isolated, and a significant proportion of adults in the United States report feeling lonely (35 percent of adults aged 45 and older and 43 percent of adults aged 60 and older).  https://www.ncbi.nlm.nih.gov/books/NBK557972/       
          </div>
        )
      }else if (displayedRisk==="population1"){
        return(
          <div>
            Population between 16 and 29
            <p>
            36 percent of respondents to a national survey of approximately 950 Americans reported feeling lonely “frequently” or “almost all the time or all the time” in the prior four weeks, compared with 25 percent who recalled experiencing serious issues in the two months prior to the pandemic. Perhaps most striking is that 61 percent of those aged 18 to 25 reported high levels. (https://news.harvard.edu/gazette/story/2021/02/young-adults-teens-loneliness-mental-health-coronavirus-covid-pandemic/)
            </p>
            <p>
            Different reasons have been suggested for why young people might feel so lonely. Experiences of bullying, moving schools, illness or disability, changes in family circumstances or not getting on with family, and isolation from the pandemic could all contribute to loneliness.

              Milestones like leaving or furthering education, seeking employment, moving out of the parental home, and establishing long-term romantic relationships could all alter social networks [5].
              16-24 year olds might have less experience of regulating intense emotions, or of loneliness in general, due to their age [6].
              55% of lonely young people said that ‘not having money to attend or take part in activities’ impacts how lonely they feel [2]. This is especially pertinent during the cost of living crisis [7].
              Social media may also be a contributing factor: 56% of young people say ‘seeing friends having fun on social media has a negative impact’ [2].https://www.campaigntoendloneliness.org/risk-factors-for-loneliness/#:~:text=People%20who%20have%20poor%20mental,very%20good%20health%20%5B14%5D.
            </p>
          </div>
        )
      }else if (displayedRisk==="lgbt"){
        return(
          <div>
            LGBT
            <p>
            LGBTQ+ people are at a greater risk of loneliness [16]. Recent evidence in this area is limited, but so far shows that: 

            Social rejection, exclusion, and discrimination can lead LGBTQ people to feel more lonely [17].
            Older lesbian and gay people seem to be lonelier than their heterosexual counterparts [18].
            Older LGBT people are particularly vulnerable to loneliness, as they are more likely to be single, living alone, and have less contact with relatives [19].
            A 2023 study found high rates of loneliness and social isolation among transgender and gender diverse people [20]. A report on trans mental health found that, on a scale of 1 (never feeling isolated) to 7 (constant isolation), the average score was 3.9 – indicating a significant level of isolation among trans people [21].

            Internalised stigma seems to correlate with loneliness amongst lesbian, gay, and bisexual people [22]. Belonging to a sexual minority can be a risk factor for loneliness, with minority stress a contributing factor [23], as well as experiences of sexual orientation discrimination [24].
            </p>
          </div>
        )
      }else if (displayedRisk==="ethnic"){
        return(
          <div>
            Ethnic Minorities
            <p>
            There is a mixed picture on whether people from ethnic minorities are more likely to be lonely, while there is clear evidence of the impact of discrimination on loneliness:

            During the pandemic, people from ethnic minority backgrounds (23%) were more likely to experience loneliness compared to people from white backgrounds (17%) [13].
            Older Black and Asian adults are more likely to report having fewer close friends and friends who live locally [25].
            In the workplace, workers from ethnic minorities are more likely to feel that they often or always have no one to talk to at work (13%), compared to white workers (9%) [26].
            People from BAME backgrounds more frequently report feeling they are less able to access community activities and support [27].
            </p>
            <p>
            A possible explanation of different levels of loneliness between native and migrant populations is the feeling of belonging to or fitting one’s environment, as suggested by the following findings: Older migrants in Canada who are of European (and especially British and French origin) do not feel lonelier than native Canadians, but those of non-European origin do (de Jong Gierveld et al., 2015). Children in Denmark who share self-identified ethnicity with larger parts of their classrooms are less likely to feel lonely than those sharing it with smaller parts of their classroom (controlling for migration background) (Madsen et al., 2016). The number of local relatives and friends (and contact frequency with the latter) is linked to lower levels of loneliness among migrants in Belgium, while the frequency of transnational contact with friends and family does not impact their loneliness significantly (Koelet and de Valk, 2016).
            In summary, both race and migration are possibly associated with loneliness rather indirectly (which would confirm their classification as distal factors of loneliness), with the channels of influence being either objective socio-economic circumstances, such as health or income, or subjective feelings of belonging. pdf

            </p>
          </div>
        )
      }else if (displayedRisk==="disability"){
        return(
          <div>
            Disability
            <p>
            People who have poor mental health, a long-term health condition, or a disability are at an increased risk of loneliness. 
            </p>
            <p>
            Lasgaard et al. (2016)
              • Denmark
              • 2013
              • Danish National Health Survey • Cross-section
              • N=33,285 (aged 16-102, 50.4% women)

• Ethnicity, unemployment, disability pension and mental health conditions are universal predictors for all ages
            </p>
            <p>
            Pagan (2020)
            Disability is a strong predictor of loneliness
          • For men the strength of the relationship between disability and loneliness decreases with age, the same holds for moderate disability and loneliness for women, while the relationship between severe disability and loneliness strengthens with age for women
            </p>
            <p>
            von Soest et al. (2018)
            Disability is linked to higher levels of loneliness using both measures,
            </p>
          </div>
        )
      }else if (displayedRisk==="motherhood"){
        return(
          <div>
            Motherhood
            <p>
            Family circumstances can contribute to loneliness, such as: adult children leaving home, bereavement, becoming single, weak familial relationships, and being at home with young children [31]. Becoming a parent can also contribute, especially at a young age: 

              83% of mothers under 30 feel lonely at least some of the time [32]
              43% of mothers under 30 feel lonely often or always [32]
              Pregnant people and new parents who experience additional hardships (e.g. immigrants, non-binary people, parents with postpartum depression) [33], lack social support [34] or feel isolated [35] may be at a higher risk of loneliness. 
            </p>
          </div>
        )
      }else if (displayedRisk==="socioeconomic"){
        return(
          <div>
            Socioeconomic status
            <p>
              Socialising with others outside of home may cost money, whether it is travelling to visit friends and family, or participating in social activities, such as sports or events, to meet new people. Therefore, those who do not have enough financial means may be disadvantaged in their ability to form and maintain social connections, and consequently, more vulnerable to feelings of loneliness. What is more, lacking financial resources may be linked to other factors that potentially impact social integration and loneliness, such as worse health. Given that, an individual’s financial situation can be expected to be linked to loneliness, but mostly through indirect channels.
            </p>
            <p>
            A predominantly negative (i.e., protective) relationship between a better financial situation and loneliness has been confirmed by cross-sectional studies (e.g. Hawkley et al., 2020b; Niedzwiedz et al., 2016), including a meta-analysis on loneliness in older adults (Pinquart and Sörensen, 2001).
            </p>
            <p>
            Having enough financial resources is more important in relation to loneliness in middle-aged adults compared to young or older adults (Luhmann and Hawkley, 2016; Pagan, 2020) and the effect of financial imbalance on loneliness weakens with increasing age (Franssen et al., 2020).
            </p>
          </div>
        )
      }else if (displayedRisk==="widowedDivorced"){
        return(
          <div>
            Widowed Divorced
            <p>
            In cross-sectional studies, having a partner or a spouse is consistently linked to lower levels of loneliness, while being single, divorced or widowed are associated with higher levels of loneliness (e.g. Cohen-Mansfield et al., 2016; Nicolaisen and Thorsen, 2014b; von Soest et al., 2018). This relationship between partner status and loneliness is also often found to be one of the strongest among all predictors, especially when it comes to widowhood (Fokkema et al., 2012; Hajek and König, 2020; Lykes and Kemmelmeier, 2013).
            </p>
            <p>
            Longitudinal studies broadly confirm the above and suggest that the relationship between partner status and loneliness may be causal. Negative changes in partner status, i.e., partner loss, lead to increased loneliness at a later date among middle-aged and older adults (Aartsen and Jylhä, 2011; Dahlberg et al., 2021; Nicolaisen and Thorsen, 2014b).
            </p>
            <p>
            There is evidence that loneliness increases already before a divorce or a separation, while no such change is observed for widowhood, where the change in loneliness happens only after the event (Buecker et al., 2021)
            </p>
            <p>
            To conclude, partner status (or its change) is one of the most important direct (proximal) determinants of loneliness. The group especially at risk of feeling lonely are widows, but also people who are divorced or single. 
            </p>
          </div>
        )
      }else if (displayedRisk==="livingAlone"){
        return(
          <div>
            Living Alone
            <p>
            Similarly to having a partner or a spouse, living with other people (e.g. partner, children, parents, friends) may be a protective factor for loneliness mainly (i) if it is linked to a presence of intimate figures that can provide emotional or other support to the individual, or (ii) if it provides more opportunities to socialise.
            </p>
            <p>
            in cross-sectional studies, living alone is consistently shown to be associated with significantly higher levels of loneliness compared to other living arrangements, and it is often one of the strongest predictors (e.g. Altschul et al., 2021; Hansen and Slagsvold, 2016; Lykes and Kemmelmeier, 2013; Nyqvist et al., 2019; Sundström et al., 2009). Digging deeper, it looks like it is the presence of a partner in the household that makes the biggest difference in loneliness, at least for older adults (de Jong Gierveld et al., 2012; Greenfield and Russell, 2011; Hansen and Slagsvold, 2016).
            </p>
            <p>
            living alone is strongly associated with more feelings of loneliness and living with others is linked to less loneliness, especially if there is a partner present in the household. In case of old adults, living in nursing homes or residential care is possibly associated with higher levels of loneliness than community living. Living arrangements seem to be one of the more proximal factors of loneliness, possibly operating through their impact on an individual’s social network. 
            </p>
          </div>
        )
      }else if (displayedRisk==="ffContact"){
        return(
          <div>
            Contact With Friends and Family
            <p>
            Social network, i.e., a network of social interactions and personal relationships8, has been theoretically proposed as the most proximal factor of loneliness (Hawkley et al., 2008), meaning that the other factors’ influence on loneliness is channelled through it. I
            </p>
            <p>
            More often than not, social network size and presence of at least one close, intimate figure (a confidant) are negatively linked to feelings of loneliness (i.e., linked to lower levels of loneliness) (e.g. de Jong Gierveld et al., 2015; Lykes and Kemmelmeier, 2013; Nyqvist et al., 2019). 
            </p>
            <p>
            Closely linked to the number of social contacts in one’s network is the frequency of socialising with them. The evidence shows quite consistently that the more frequently people socialise with others, the less lonely they are (e.g. Ejlskov et al., 2017; Franssen et al., 2020; Pinquart and Sörensen, 2001; Victor and Yang, 2012).
            </p>
            <p>
            Contact with friends is generally more protective than contact with family members and neighbours (de Jong Gierveld et al., 2015; Franssen et al., 2020; Koelet and de Valk, 2016; Nyqvist et al., 2016; Pinquart and Sörensen, 2001)9, but sometimes it is the relatives who matter the most (Hawkley et al., 2020b; ten Kate et al., 2020), with the difference being possibly due to different cultural settings (Lykes and Kemmelmeier, 2013).
            </p>
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