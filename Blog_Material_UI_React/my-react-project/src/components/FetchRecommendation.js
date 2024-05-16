/* global google */
import OpenAI from "openai";
import React, { useState, useEffect } from "react";
import { Button, Modal, Box, Typography, TextField } from "@mui/material";
import axios from "axios";

// const OPENAI_API_KEY = "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";
const OPENAI_API_KEY = "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";
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

async function getLocation() {
  const response = await fetch("https://ipapi.co/json/");
  const locationData = await response.json();
  console.log(locationData);
  return locationData;
}

async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=apparent_temperature`;
  const response = await fetch(url);
  const weatherData = await response.json();
  console.log("weatherData,", weatherData);
  return weatherData;
}

const RecommendationModal = () => {
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState("");
  const [jsonResponse, setjsonResponse] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const locationData = await getLocation();
      setCurrentLocation(locationData);
      const weatherData = await getCurrentWeather(
        locationData.latitude,
        locationData.longitude
      );
      setCurrentWeather(weatherData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (open && map === null) {
      const timeout = setTimeout(() => {
        initializeMap();
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [open, map]);

  const initializeMap = () => {
    if (!currentLocation) {
      console.log("Current location is not available yet.");
      return;
    }

    if (typeof google === "undefined") {
      return;
    }

    const mapCenter = {
      lat: currentLocation.latitude,
      lng: currentLocation.longitude,
    };

    const mapElement = document.getElementById("google-map");
    if (!mapElement) {
      return;
    }

    const mapOptions = {
      center: mapCenter,
      zoom: 10,
    };
    const newMap = new window.google.maps.Map(mapElement, mapOptions);
    setMap(newMap);

    const customMarkerIcon = {
      url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      scaledSize: {
        width: 40,
        height: 40,
      },
    };

    const youAreHereMarker = new window.google.maps.Marker({
      position: mapCenter,
      map: newMap,
      icon: customMarkerIcon,
      label: {
        text: "You are Here!",
        color: "black",
        fontWeight: "bold",
      },
    });

    const youAreHereInfoWindowContent = `
      <div>
        <h3>You are here!</h3>
        <p>Current Location</p>
      </div>
    `;

    const youAreHereInfoWindow = new window.google.maps.InfoWindow({
      content: youAreHereInfoWindowContent,
    });

    youAreHereMarker.addListener("mouseover", () => {
      youAreHereInfoWindow.open(newMap, youAreHereMarker);
    });

    youAreHereMarker.addListener("mouseout", () => {
      youAreHereInfoWindow.close();
    });
  };

  const loadMapAndMarkers = (responseJSON) => {
    // Add markers for each event
    if (typeof google === "undefined") {
      console.error("Google Maps API is not loaded.");
      return;
    }
    const mapCenter = new google.maps.LatLng(
      currentLocation.latitude,
      currentLocation.longitude
    );

    const mapElement = document.getElementById("google-map");
    if (mapElement) {
      const mapOptions = {
        zoom: 12,
        center: mapCenter,
      };
      const newMap = new google.maps.Map(mapElement, mapOptions);

      const customMarkerIcon = {
        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
        scaledSize: {
          width: 40,
          height: 40,
        },
      };

      const youAreHereMarker = new window.google.maps.Marker({
        position: mapCenter,
        map: newMap,
        icon: customMarkerIcon,
        label: {
          text: "You are Here!",
          color: "black",
          fontWeight: "bold",
        },
      });

      const youAreHereInfoWindowContent = `
        <div>
          <h3>You are here!</h3>
          <p>Current Location</p>
        </div>
      `;

      const youAreHereInfoWindow = new window.google.maps.InfoWindow({
        content: youAreHereInfoWindowContent,
      });

      youAreHereMarker.addListener("mouseover", () => {
        youAreHereInfoWindow.open(newMap, youAreHereMarker);
      });

      youAreHereMarker.addListener("mouseout", () => {
        youAreHereInfoWindow.close();
      });

      for (const category in responseJSON) {
        if (responseJSON?.hasOwnProperty(category)) {
          const events = responseJSON[category];
          let markerIcon = "";

          switch (category) {
            case "restaurants":
              markerIcon =
                "http://maps.google.com/mapfiles/ms/icons/orange-dot.png";
              break;
            case "musical_events":
              markerIcon =
                "http://maps.google.com/mapfiles/ms/icons/pink-dot.png";
              break;
            case "sports_events":
              markerIcon =
                "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
              break;
            default:
              markerIcon =
                "http://maps.google.com/mapfiles/ms/icons/black-dot.png";
              break;
          }

          events.forEach((event) => {
            const marker = new window.google.maps.Marker({
              position: {
                lat: event.location.latitude,
                lng: event.location.longitude,
              },
              map: newMap,
              icon: markerIcon,
              title: event.name,
              label: {
                text: event.name,
                color: "black",
                fontWeight: "bold",
              },
            });

            const infoWindowContent = `
              <div>
                <h3>${event.name} (${category})</h3>
                <p><strong>Timing:</strong> ${event.timing ?? "Opens 10 AM"}</p>
                <p><strong>Operating Hours:</strong> ${
                  event.operatingHoursFormatted ?? "Mentioned above"
                }</p>
              </div>
            `;

            const infoWindow = new window.google.maps.InfoWindow({
              content: infoWindowContent,
            });

            marker.addListener("click", () => {
              infoWindow.open(newMap, marker);
            });

            marker.addListener("mouseover", () => {
              infoWindow.open(newMap, marker);
            });

            marker.addListener("mouseout", () => {
              infoWindow.close();
            });
          });
        }
      }
      setMap(newMap);
    }
  };
  // Convert Celsius to Fahrenheit
  const convertCelsiusToFahrenheit = (celsius) => {
    return (celsius * 9) / 5 + 32;
  };

  async function fetchLocalResults(name, latitude, longitude) {
    try {
      const response = await axios.get(
        "http://localhost:3001/search/restaurants",
        {
          params: {
            q: name,
            latitude: latitude,
            longitude: longitude,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  async function fetchEventsResults(name) {
    try {
      const response = await axios.get("http://localhost:3001/search/events", {
        params: {
          q: name,
          city: currentLocation.city,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const handleClick = async () => {
    setOpen(true);
    const weatherDetails = convertCelsiusToFahrenheit(
      currentWeather.hourly.apparent_temperature[0]
    );

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        { role: "system", content: `weather: ${weatherDetails}` },
        { role: "system", content: `city: ${currentLocation.city}` },
        {
          role: "user",
          content: `Generate recommendations for restaurants, musical events, and sports events sports events in city ${currentLocation.city}. Provide 3 suggestions for each category with location in longitude and latitude. Format the recommendations in JSON format with the name, description, and timing details included.`,
        },
      ],
    });

    const recommendation = response.choices[0].message.content;
    var responseJSON = JSON.parse(recommendation);

    let displayRecommendations = "";

    for (const category in responseJSON) {
      if (responseJSON.hasOwnProperty(category)) {
        displayRecommendations += `${category.toUpperCase()}:\n\n`;
        const events = responseJSON[category];

        for (const event of events) {
          displayRecommendations += `Name: ${event.name}\n`;
          displayRecommendations += `Description: ${event.description}\n`;
          displayRecommendations += `Location: ${event.location.latitude}, ${event.location.longitude}\n`;

          if (category === "restaurants") {
            const localResult = await fetchLocalResults(
              event.name,
              event.location.latitude,
              event.location.longitude
            );

            if (localResult !== null) {
              const { operating_hours, hours, open_state } = localResult;
              let operatingHoursFormatted = "";
              for (const day in operating_hours) {
                operatingHoursFormatted += `<p>${day}: ${operating_hours[day]}</p>`;
              }

              event.timing = `${open_state}`;
              event.operatingHoursFormatted = `${operatingHoursFormatted}`;
              displayRecommendations += `Timing: ${open_state}\n\n`;
              const eventIndex = events.indexOf(event);
              responseJSON[category][eventIndex].timing = `${open_state}\n`;
            }
          } else {
            // fetch Events timing from serpAPI
            const eventIndex = events.indexOf(event);
            const eventsResult = await fetchEventsResults(event.name);
            // console.log("fetchEventsResults", eventsResult[0]);

            responseJSON[category][
              eventIndex
            ].timing = `${eventsResult[0].date.when}`;
            // if (typeof event.timing === "object") {
            //   // Convert event.timing object to string
            //   event.timing = JSON.stringify(event.timing);
            //   displayRecommendations += `Timing: ${
            //     event.timing ?? "OPEN-CLOSES 10 PM"
            //   }\n\n`;
            // } else {
            displayRecommendations += `Timing: ${eventsResult[0].date.when}\n\n`;
            // }
          }
        }
      }
    }

    setResponse(displayRecommendations);
    setjsonResponse(responseJSON);
    console.log("displayRecommendations", displayRecommendations);
    console.log("responseJson", responseJSON);
    loadMapAndMarkers(responseJSON);
  };

  const handleClose = () => {
    setOpen(false);
    setMap(null);
    setResponse("");
  };

  return (
    <>
      <Button
        variant='outlined'
        size='small'
        color='primary'
        onClick={handleClick}
      >
        Recommended For You
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1000,
            height: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <Typography id='modal-modal-title' variant='h6' component='h2'>
            Recommended For You
          </Typography>
          <div
            id='google-map'
            style={{ width: "100%", height: "500px" }} // Adjust height as needed
          ></div>
          <Typography variant='body1' gutterBottom>
            Current Location:{" "}
            {currentLocation
              ? `${currentLocation.city}, ${currentLocation.country_name}`
              : "Loading..."}
          </Typography>
          <Typography variant='body1' gutterBottom>
            Current Weather:{" "}
            {currentWeather
              ? `${convertCelsiusToFahrenheit(
                  currentWeather.hourly.apparent_temperature[0]
                )}°F`
              : "Loading..."}
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={10}
            value={response ? response : "Loading Recommendation..."}
            disabled
            variant='outlined'
            sx={{ mt: 2 }}
          />
        </Box>
      </Modal>
    </>
  );
};

export default RecommendationModal;
