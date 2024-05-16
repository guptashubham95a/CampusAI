import {
  Box,
  Typography,
  styled,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Paper,
} from "@mui/material";
import OpenAI from "openai";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
const recommendActivities = async () => {
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
    // Extract weather information
    const weather = weatherData.weather[0];
    const temp = weatherData.main;
    // Generate activity recommendation prompt based on weather
    const prompt = `The weather is currently ${weather.main},${weather.description} and temperature ${temp.temp} in city ${city}. What are some activities I can do?`;
    // console.log("recommendActivities prompt", prompt);
    // Generate activity recommendations using OpenAI
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
          content: `What are some activities I can do in City ${city}? recommend activities based on current weather conditions, also add timings for the events`,
        },
      ],
    });

    // Extract generated activity recommendations
    const recommendation = response.choices[0].message.content
      .trim()
      .toString();
    console.log("response recommendation1", recommendation);

    return recommendation;
  } catch (error) {
    console.error("Error recommending activities:", error);
    return null;
  }
};

const Container = styled(Box)(({ theme }) => ({
  margin: "50px 100px",
  [theme.breakpoints.down("md")]: {
    margin: 0,
  },
}));

const Image = styled("img")({
  width: "100%",
  height: "50vh",
  objectFit: "cover",
});

const Heading = styled(Typography)`
  font-size: 38px;
  font-weight: 600;
  text-align: center;
  margin: 50px 0 10px 0;
`;

const Author = styled(Box)(({ theme }) => ({
  color: "#878787",
  display: "flex",
  margin: "20px 0",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));

const ReplyForm = styled("form")(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ReplyAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(4),
  height: theme.spacing(4),
}));

const DetailView = ({ blogs, users }) => {
  const { blogId } = useParams();
  const blogData = blogs.find((blog) => blog.blogId == blogId);

  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(false); // State for auto-reply toggle
  const toggleAutoReply = () => {
    setAutoReplyEnabled(!autoReplyEnabled); // Toggle auto-reply state
  };
  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };
  const getReplyfromOpenAI = async ({ title, description }) => {
    // Open AI API key
    // working hawk API Key
    // sk - vl11oXiW723VVxzxjuLMT3BlbkFJBYKBbVbdvrxq7xzD0tMD
    // const title = "Everything You Need to Know About the 2023 ICC World Cup";
    // const description =
    //   "A total of 48 matches were played between the ten ICC Cricket World Cup 2023 teams. It brought together the best cricketing nations worldwide to compete for the prestigious title of World Champions.After a gruelling competition, the final game of the tournament was held on 19th November 2023, between league-toppers India and Australia. Australia, the five-time champions, edged out India in the summit clash, earning their sixth ICC Cricket World Cup victory, the most for any team.";
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          { role: "system", content: `Title: ${title}` },
          { role: "system", content: `Description: ${description}` },
          {
            role: "user",
            content:
              "You will give short reply on behalf of me within 1-3 sentences based on blog data that I provided for social media. you can also include emojis",
          },
        ],
        model: "gpt-3.5-turbo-16k",
      });
      // console.log(
      //   "getReplyfromOpenAI",
      //   completion.choices[0].message.content.trim().toString()
      // );
      return completion.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  };
  const handleSubmitReply = (event) => {
    event.preventDefault();
    if (reply.trim() !== "") {
      console.log(`Reply Added!.`);
      // toast.success(`Reply Added!.`, {
      //   position: "top-right",

      //   theme: "light",
      //   closeOnClick: false,
      //   pauseOnHover: false,
      // });
      setReplies([...replies, { text: reply, timestamp: new Date() }]);
      setReply("");
    }
  };
  const url =
    "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";
  if (!blogData) {
    return <div>Blog not found</div>;
  }

  const handleAIReply = async () => {
    setLoading(true);
    // Set loading to true when API call starts
    // Call your AI reply API here

    try {
      const response = await getReplyfromOpenAI({
        title: blogData.name,
        description: blogData.description,
      });
      console.log(
        "handleAIReply",
        response.toString().trim().replace(/^"|"$/g, "")
      );
      setReply(response.toString().trim().replace(/^"|"$/g, ""));

      // await recommendActivities();
    } catch (error) {
      console.error("Error fetching AI reply:", error);
      // toast.error("Failed to fetch AI reply");
    } finally {
      setLoading(false);
      // Set loading to false after API call completes
    }
    // setTimeout(() => {
    //   setReply("handleAIReply"); // Update reply state with simulated AI reply
    //   setLoading(false); // Set loading to false after 3 seconds
    // }, 3000);
  };

  const author = users.find((user) => user.userId == blogData.userId);
  const name = author ? author.name : "Unknown Author";

  return (
    <Container>
      <Image src={url} alt='post' />
      <Heading>{blogData.name}</Heading>
      <Author>
        <Typography>
          Author: <span style={{ fontWeight: 600 }}>{name}</span>
        </Typography>
        <Typography style={{ marginLeft: "auto" }}>
          Posted On: {new Date(blogData.date).toDateString()}
        </Typography>
      </Author>
      {/* <Typography>{blogData.description}</Typography> */}
      <Paper elevation={3} sx={{ padding: "20px", mt: 2 }}>
        <Typography variant='h4' gutterBottom>
          {blogData.name}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar alt='Avatar' src='/avatar.jpg' />
          <Typography variant='subtitle2' color='textSecondary' sx={{ ml: 1 }}>
            {name} - {new Date(blogData.date).toDateString()}
          </Typography>
        </Box>
        <Typography variant='body1' paragraph>
          {blogData.description}
        </Typography>
      </Paper>
      {/* Reply Form */}
      <Box mt={2} sx={{ width: "50%" }}>
        {" "}
        {/* Adjust width here */}
        <ReplyForm onSubmit={handleSubmitReply}>
          <TextField
            label='Leave a reply'
            multiline
            fullWidth
            value={reply}
            onChange={handleReplyChange}
            variant='outlined'
            margin='normal'
          />
          <Button type='submit' variant='contained' color='primary'>
            Submit
          </Button>{" "}
          <Button onClick={toggleAutoReply} variant='contained' color='primary'>
            {autoReplyEnabled ? "Disable Auto Reply" : "Enable Auto Reply"}
          </Button>{" "}
          {autoReplyEnabled && (
            <Button
              variant='contained'
              color='secondary'
              onClick={handleAIReply}
              disabled={loading}
            >
              {loading ? "Loading..." : "AI Reply"}
            </Button>
          )}
        </ReplyForm>
      </Box>
      {/* Reply List */}
      <Box mt={2} sx={{ width: "50%" }}>
        {" "}
        {/* Adjust width here */}
        <List>
          {replies
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 4)
            .map((reply, index) => (
              <React.Fragment key={index}>
                <ListItem key={index}>
                  <ListItemAvatar>
                    <ReplyAvatar alt='Avatar' src='/avatar.jpg' />
                  </ListItemAvatar>
                  <ListItemText
                    primary={name}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component='span'
                          variant='body2'
                          color='text.primary'
                        >
                          {reply.text}
                        </Typography>
                        <Typography
                          sx={{ display: "inline" }}
                          component='span'
                          variant='body2'
                          color='text.secondary'
                        >
                          {` - ${new Date(reply.timestamp).toLocaleString()}`}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index !== replies.length - 1 && <Divider variant='inset' />}
              </React.Fragment>
            ))}
        </List>{" "}
      </Box>{" "}
      <ToastContainer />
    </Container>
  );
};

export default DetailView;
