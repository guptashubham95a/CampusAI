import Blog from "./components//Blog.js";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./LoginPage";
import "./App.css";
import UserManagementPage from "./UserManagementPage.js";
// import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DetailView from "./components/DetailView.js";
import OpenAI from "openai";
import { Widget, addResponseMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
import SearchView from "./components/SearchView.js";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState({});

  const blogsData = [
    {
      postedBy: 123,
      name: "Tech-Expo",
      userId: 123,
      blogId: 1,
      date: new Date().toISOString(),
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      imageURL:
        "https://www.tiretechnologyinternational.com/wp-content/uploads/2019/03/IMG_3576.jpg",
      // imageURL:
      //   "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
      categories: ["Academic Resources", "Technology", "Health and Wellness"],
      //   Technology
      // https://unsplash.com/photos/turned-on-gray-laptop-computer-XJXWbfSo2f0
      // Health and Wellness
      //   https://unsplash.com/photos/silhouette-photography-of-woman-doing-yoga-F2qh3yjz6Jk
      // Academic Resources
      //   https://unsplash.com/photos/man-standing-in-front-of-people-sitting-beside-table-with-laptop-computers-gMsnXqILjp4
      flagged: false,
    },
    {
      postedBy: 1,
      userId: 1,
      blogId: 2,
      name: "Local Community Resources",
      date: new Date().toISOString(),
      description:
        "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
      imageURL:
        "https://www.columbiasouthern.edu/media/k1ifrmk1/lady-at-desk.jpg",
      //   social
      //  https://unsplash.com/photos/a-group-of-people-standing-on-top-of-a-lush-green-field-80PiD-wsuIg
      //   Career Services
      //   https://unsplash.com/photos/three-men-sitting-while-using-laptops-and-watching-man-beside-whiteboard-wD1LRb9OeEo
      // Local Community Resources
      //   https://unsplash.com/photos/man-standing-in-front-of-people-sitting-beside-table-with-laptop-computers-gMsnXqILjp4
      categories: ["Career Services", "Local Community Resources", "Social"],
      flagged: false,
    },
    {
      postedBy: 321,
      userId: 321,
      blogId: 3,
      name: "Sports energy",
      date: new Date().toISOString(),
      description:
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      imageURL:
        //   sports
        "https://static01.nyt.com/images/2020/07/21/autossell/sports-reboot-promo-still/sports-reboot-promo-still-videoLarge.jpg",

      //   campus
      // https://unsplash.com/photos/people-walking-near-paccar-hall-university-of-washington-during-daytime-6zlgM-GUd6I
      //   culture
      // https://unsplash.com/photos/assorted-color-umbrella-hanged-above-pathway-near-houses-zbg2-gyo_hM
      categories: ["Campus", "Culture", "Sports"],
      flagged: false,
    },
  ];
  const usersD = [
    {
      name: "John Doe",
      userId: 123,
      age: 25,
      role: "STUDENT",
      email: "john.doe@example.com",
      password: "password123",
      flagged: false,
    },
    {
      name: "Guest Doe",
      userId: 18,
      age: 25,
      role: "GUEST",
      email: "john.doe@example.com",
      password: "123456",
      flagged: true,
    },
    {
      name: "Shubham Gupta",
      userId: 1,
      age: 25,
      role: "MODERATOR",
      email: "sg@gmail.com",
      password: "123456",
      flagged: false,
    },
    {
      name: "Jane Smith",
      userId: 456,
      age: 30,
      role: "MODERATOR",
      email: "disable@gmail.com",
      password: "123456",
      flagged: true,
    },
    {
      name: "admin",
      userId: 789,
      age: 40,
      role: "ADMINISTRATOR",
      email: "guptashubh95a@gmail.com",
      password: "123456",
      flagged: false,
    },
    {
      name: "Bob Brown",
      userId: 321,
      age: 22,
      role: "STUDENT",
      email: "bob.brown@example.com",
      password: "password321",
      flagged: false,
    },
    {
      name: "Emily Davis",
      userId: 654,
      age: 35,
      role: "MODERATOR",
      email: "emily.davis@example.com",
      password: "password654",
      flagged: false,
    },
    {
      name: "Bhavya Chawla",
      userId: 981,
      age: 25,
      role: "ADMINISTRATOR",
      email: "bchawla@hawk.iit.edu",
      password: "123456",
      flagged: false,
    },
    {
      name: "Prakhar Nag",
      userId: 982,
      age: 25,
      role: "ADMINISTRATOR",
      email: "pnag@hawk.iit.edu",
      password: "123456",
      flagged: false,
    },
    {
      name: "Shubham Gupta",
      userId: 999,
      age: 22,
      role: "STUDENT",
      email: "sgupta101@hawk.iit.edu",
      password: "123456",
      flagged: false,
    },
    {
      name: "Michael Wilson",
      userId: 987,
      age: 45,
      role: "ADMINISTRATOR",
      email: "michael.wilson@example.com",
      password: "password987",
      flagged: false,
    },
  ];
  const [users, setUsers] = useState(usersD);
  const [blogs, setBlogs] = useState(blogsData);
  const [widgetOpened, setWidgetOpened] = useState(false);
  const [count, setCount] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const openaiLogo =
    "https://static.vecteezy.com/system/resources/previews/022/227/364/non_2x/openai-chatgpt-logo-icon-free-png.png";

  useEffect(() => {
    addResponseMessage(`Hello there! 👋 I'm here to assist you! \nI can recommend activities and events based on your location, weather, and other factors.\nFeel free to ask anytime. 😊
    `);

    const callAPI = async () => {
      setIsLoading(true);
      const response = await recommendActivities();
      console.log("useEffect recommendActivities", response);
      setIsLoading(false);
      addResponseMessage(response);
    };

    callAPI();
  }, []);
  const toggleWidget = () => {
    setWidgetOpened(!widgetOpened);
  };
  const APIKEY = "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";
  const openai = new OpenAI({
    apiKey: APIKEY,
    dangerouslyAllowBrowser: true,
  });

  // Function to get user's location using IP address
  const getUserLocation = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      console.log("getUserLocation", data);
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
      };
    } catch (error) {
      console.error("Error getting user location:", error);
      return null;
    }
  };

  // Function to get current weather based on latitude and longitude
  const getCurrentWeather = async (latitude, longitude, city) => {
    try {
      const apiKey = "d351700c4ae1104bf52d3deb777ba0ee";
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      console.log("getCurrentWeather", data);
      return data;
    } catch (error) {
      console.error("Error getting current weather:", error);
      return null;
    }
  };

  // Function to recommend activities based on weather conditions and events
  const recommendActivities = async (prompt = "") => {
    try {
      // Get user's location
      const location = await getUserLocation();
      if (!location) {
        return "Unable to fetch user location.";
      }

      // Get current weather based on user's location
      const { latitude, longitude, city } = location;
      const weatherData = await getCurrentWeather(latitude, longitude, city);
      if (!weatherData) {
        return "Unable to fetch current weather data.";
      }
      const defaultPrompt = `What are some activities I can do in City ${city}? recommend activities based on current weather conditions, also add timings for the events`;
      // Extract weather information
      const weather = weatherData.weather[0];
      const temp = weatherData.main.temp;
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          { role: "system", content: `weather: ${weather.main}` },
          { role: "system", content: `Description: ${weather.description}` },
          { role: "system", content: `temprature details: ${temp} in Celsius` },
          {
            role: "user",
            content: prompt || defaultPrompt,
          },
        ],
      });

      // Extract generated activity recommendations
      const recommendation = response.choices[0].message.content.toString();
      console.log("response recommendation1", recommendation);

      return recommendation;
    } catch (error) {
      console.error("Error recommending activities:", error);
      return "";
    }
  };

  const handleNewUserMessage = async (newMessage) => {
    // You can send the new message to your backend for processing here
    // For demonstration purposes, let's just echo back the user's message
    if (count > 3) {
      addResponseMessage(
        "Sorry, Unecessary API calls to Open AI more that 3 times is not allowed."
      );
      return;
    }
    setIsLoading(true);
    const response = await recommendActivities("");
    setIsLoading(false);
    addResponseMessage(response);
    setCount(count + 1);
  };
  const updateUsers = (newFlagged, userIds) => {
    // Map over the array of userIds and update each corresponding user
    const updatedUsers = users.map((user) => {
      if (userIds.includes(user.userId)) {
        return { ...user, flagged: newFlagged };
      } else {
        return user;
      }
    });
    console.log("updateUsers", updatedUsers);
    // Update the state with the new array of users
    setUsers(updatedUsers);
  };
  // Function to handle successful login
  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    // console.log("handleLogin", loggedInUser);
  };
  const addNewBlog = (blogData) => {
    setBlogs([...blogs, blogData]);
    console.log("addNewBlog", blogs);
    // console.log("handleLogin", loggedInUser);
  };
  const deleteBlog = (blogId) => {
    const updatedBlogs = blogs.filter((blog) => blog.blogId !== blogId);

    setBlogs(updatedBlogs);
    console.log("deleteBlog", updatedBlogs);
    // console.log("handleLogin", loggedInUser);
  };
  return (
    <Router>
      {/* <div className='App'> */}
      <div>
        <Routes>
          <Route
            path='/'
            element=<SignIn
              handleLogin={handleLogin}
              blogs={blogs}
              users={users}
            />
          />
          <Route
            path='/blog'
            element=<Blog
              user={user}
              totalBlogs={blogs.length}
              totalBlogsData={blogs}
              addNewBlog={addNewBlog}
              deleteBlog={deleteBlog}
            />
          />
          <Route
            path='/detail-view/:blogId'
            element={<DetailView blogs={blogs} users={users} />}
          />
          <Route path='/search-view' element={<SearchView />} />
          <Route
            path='/user-management'
            element={
              <UserManagementPage users={users} updateUsers={updateUsers} />
            }
          />
          {/* <Route path='/blog' component={BlogPage} /> */}
        </Routes>
        <Toaster />
        {/* <ToastContainer /> */}
        {/* todo */}
        <Widget
          handleNewUserMessage={handleNewUserMessage}
          handleSubmit={handleNewUserMessage}
          title=' OpenAI-assisted Agent'
          subtitle="I'll recommend activites to you"
          senderPlaceHolder={
            isLoading
              ? "Fetching activites from Open-AI"
              : "Press Submit to get recommendations.."
          }
          handleToggle={toggleWidget}
          resizable={true}
          autofocus={true}
          profileAvatar={openaiLogo}
        />
      </div>
    </Router>
    // <>
    //   <Blog />
    // </>
  );
}

export default App;
