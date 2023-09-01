import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/globals.css';
import logo from "../styles/logo.png"
mapboxgl.accessToken = process.env.REACT_APP_TOKEN;

const Home = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const [isPopulationClicked,setIsPopulationClicked]=useState(false);
  const [isPopulationGeneralClicked,setIsPopulationGeneralClicked]=useState(false);

  
  
  

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
    const states=require('../data/states.json');

    //SETTING INITIAL MAP IN USA WITH NO ZOOM
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [-96, 38],
      zoom: 3.5,
      minZoom: 1,
      dragPan: false,
      scrollZoom: false,
    });


    //Adding state fills and outlines
    map.current.on('load', () => {
      // Adding states source (includes states info)
      map.current.addSource('states', {
        type: 'geojson',
        data: states,
      });

      // State fill layer
      map.current.addLayer({
        id: 'state-fill',
        type: 'fill',
        source: 'states',
        paint: {
          'fill-color': 'blue',
          'fill-opacity': 0.7
        },
      });

      // Neighborhood outline layer
      map.current.addLayer({
        id: 'state-outline',
        type: 'line',
        source: 'states',
        paint: {
          'line-color': 'white',
          'line-width': 2,
          'line-opacity': 1,
        },
      });

    // POPUP BASED ON STATE
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

      map.current.on('mousemove', 'state-fill', (e) => {
        // Check if there are any features under the mouse pointer
        if (e.features.length) {
            const { name } = e.features[0].properties;
    
            if (name) {
                popupDiv.innerHTML = `
                    <div>
                    <p style="color: white; font-size: 13px;">${name}</p>
                    </div>
                `;
                popupDiv.style.display = 'block'; // Show the popup
            }
        } else {
            popupDiv.style.display = 'none'; // Hide the popup if there's no feature under the pointer
        }
    
        // Update the position of the popup
        const x = e.originalEvent.clientX;
        const y = e.originalEvent.clientY;
        popupDiv.style.left = `${x}px`;
        popupDiv.style.top = `${y}px`;
        popupDiv.style.transform = 'translate(-50%, -140%)';
    });
    
    map.current.on('mouseleave', 'state-fill', () => {
        popupDiv.style.display = 'none'; // Hide the popup
    });
  });
        
  },[]);






//SECOND USE EFFECT TO UPDATE THINGS WITHOUT RERENDER

  // useEffect(() => {
  //   if (map.current && map.current.isStyleLoaded() && mapLoaded) {
  //     updateOpacity();
  //     }

  // }, [map.current]);



  return (
    <>
    <div className={`opacity-100 bg-white h-full overflow-x-hidden`} style={{width: "100%"}}>
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
      <div className=" mx-auto rounded-3xl mt-12" style={{width: "50vw", height: "70vh"}}>
        
        <div ref={mapContainer} className="top-0 h-full w-full" />
      </div>

        {/* FILTERS */}
        <div className="flex w-6/12 pt-24 mx-auto">
          <div className="flex flex-col bodyText w-4/12 " >
            <h1 className="text-gray-600 font-light text-4xl">
              Filters
            </h1>
            <h2 className="text-gray-400">
              Click the checkbox next to the filter to see it on the map. Click the filter name to read more.
            </h2>
            <div className="flex flex-col my-6 rounded-md h-72 overflow-y-scroll">

            {/* FILTER ONE */}
            <div onClick={()=>setIsPopulationGeneralClicked(true)} className="cursor-pointer">
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

            </div>


          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col bodyText w-8/12 mx-2 " >
            <h1 className="text-gray-600 font-light text-4xl">
              Information
            </h1>
            <h2 className="text-gray-400">
              Read about each filter and how it relates to social isolation.
            </h2>
            <div className="flex flex-col my-6 rounded-md">
              {displayActiveInfo()}
            </div>


          </div>
        </div>
        

    </div>
    </>
  );



    function displayActiveInfo(){
      if (isPopulationGeneralClicked){
        return (
          <div>
            Population over 50
          </div>
        )
      }

    }


  }


export default Home;