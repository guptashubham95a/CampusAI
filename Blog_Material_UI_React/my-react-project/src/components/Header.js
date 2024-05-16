import * as React from "react";
import PropTypes from "prop-types";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import axios from "axios";
import OpenAI from "openai";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import RecommendationButton from "./FetchRecommendation";

import "react-toastify/dist/ReactToastify.css";
import {
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ModalForm from "./ModalForm";
import {
  NotificationsActiveOutlined,
  NotificationsNone,
} from "@mui/icons-material";
import { useEffect } from "react";
const APIKEY = "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";
const openai = new OpenAI({
  apiKey: APIKEY,
  dangerouslyAllowBrowser: true,
});
function Header(props) {
  const {
    sections,
    title,
    user,
    totalBlogs,
    addNewBlog,
    onCategoryClick,
    category,
  } = props;
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribed = async (event) => {
    // todo pending
    // add logic to toggle the button from elasticCloud
    // approach
    // for this category add the user email to the category data in subscription data
    if (category === null) {
      toast.error("Please select category to subscribe.");
      return;
    }
    // todo show message
    console.log("handleSubscribedN isSubscribe getting set to:", !isSubscribed);

    await subscribeOrUnSubCategory(category, user.email, !isSubscribed);
    setIsSubscribed(!isSubscribed);
  };
  const handleLogout = () => {
    console.log(`Logout successful.`);
    // toast.success(`Logout successful.`, {
    //   position: "top-right",
    //   theme: "light",
    // });
    toast.success("Logout successful.");
    navigate("/");
  };
  const subscribeOrUnSubCategory = async (category, email, wantToSubscribe) => {
    if (category === null) {
      console.log("please select category to subscribe.");
      // todo
      // show toast message
      return;
    }
    try {
      // const response = await axios.put("http://localhost:3001/api/updateData", {
      //   category: category,
      //   email: user.email,
      //   wantToSubscribe: true,
      // });

      const response = await axios.put("http://localhost:3001/api/updateData", {
        category: category,
        email: user.email,
        wantToSubscribe: wantToSubscribe,
      });
      toast.success("Subscribtion status changed Successfully!");
      console.log(`subscribeCategory`, wantToSubscribe, response);
    } catch (error) {
      toast.error("Something gone wrong!");
      console.error(error);
      // Handle error
    }
  };
  const fetchPost = async () => {
    const index = "game-of-thrones";
    try {
      // const response = await axios.get(
      //   "http://localhost:3001/api/fetchData/game-of-thrones"
      // );
      // console.log("fetchPost", category, user.email);
      // const response = await axios.post("http://localhost:3001/api/checkEmail");
      // console.log("updateData", response.data);
      // for (let i = 0; i < sections.length; i++) {
      //   const newData = {};
      //   newData[sections[i].title] = [""];
      //   const response = await axios.post(
      //     "http://localhost:3001/api/indexData",
      //     { index: "subscription-details", data: newData }
      //   );
      // console.log("updateData", response);
      // }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleCreatePost = async () => {
    // adding elastic search api to test if it works or not
    console.log("handleCreatePost Using elastic search api:");
    await fetchPost();

    // https://21a43edeb3494f77b2f12633bdea6090.us-central1.gcp.cloud.es.io/books/_search
    // guptashubham95a@gmail.com
    // NEW API Key
    // bHUzSmdvNEJmeW5FTVpXYnpHbHg6dzQ1UktQY2dSOXV3bjBRZGxLelFnUQ==

    // username
    // elastic
    // password
    // 0mCmepAo0amiHeRZ037VZ610

    // API Key
    // amUwM2dvNEJmeW5FTVpXYjVHbmI6QTJMMk1GbGJSOHV6ZDVGZ0dCZUczZw==

    // todo pending remove the comment to make sure that it works

    if (user.role === "GUEST" || user.flagged === true) {
      //   console.log(`You're are not allowed to create Post .`);
      //   // toast.warning(`You're are not allowed to create Post .`, {
      //   //   position: "top-right",
      //   //   theme: "light",
      //   //   closeOnClick: true,
      //   //   pauseOnHover: false,
      //   // });
      toast.error("You're are not allowed to create Post .");
      return;
    }
    // // console.log("from modal", totalBlogs);
    setIsModalOpen(true);
    // Open the modal when "Create Post" button is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const handleManageUsers = () => {
    if (user.role === "ADMINISTRATOR") {
      navigate("/user-management");
    } else {
      console.log(`You're not allowed to manage users.`);
      // toast.warning(`You're not allowed to manage users.`, {
      //   position: "top-right",
      //   theme: "light",
      //   closeOnClick: true,
      //   pauseOnHover: false,
      // });
      toast.error("You're not allowed to manage users.");
      return;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement post creation logic here
    // Close the modal after successful post creation
    setIsModalOpen(false);
  };

  return (
    <div>
      <React.Fragment>
        <Toolbar sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Button size='small' onClick={handleCreatePost}>
            Create Post
          </Button>
          {/* Show "Subscribe" or "Unsubscribe" button based on subscription status */}
          <Button
            size='small'
            onClick={handleSubscribed}
            startIcon={
              !isSubscribed ? (
                <NotificationsNone />
              ) : (
                <NotificationsActiveOutlined />
              )
            }
            style={{ color: isSubscribed ? "red" : "green" }}
          >
            {isSubscribed
              ? "Unsubscribe this category"
              : "Subscribe this category"}
          </Button>

          <Button size='small' onClick={handleManageUsers}>
            Manage Users
          </Button>
          <Typography
            component='h2'
            variant='h5'
            color='inherit'
            align='center'
            noWrap
            sx={{ flex: 1 }}
          >
            {title}
          </Typography>

          <IconButton>
            <SearchIcon
              onClick={() => {
                navigate(`/search-view`);
              }}
            />
          </IconButton>
          <RecommendationButton />
          <Button variant='outlined' size='small' onClick={handleLogout}>
            Log Out
          </Button>
        </Toolbar>
        <Toolbar
          component='nav'
          variant='dense'
          sx={{ justifyContent: "space-between", overflowX: "auto" }}
        >
          {sections.map((section) => (
            <Link
              color='inherit'
              noWrap
              key={section.title}
              variant='body2'
              href={section.url}
              onClick={() => onCategoryClick(section.title)}
              sx={{ p: 1, flexShrink: 0, cursor: "pointer" }}
            >
              {section.title}
            </Link>
          ))}
        </Toolbar>
        {/* <ToastContainer /> */}
      </React.Fragment>

      <ModalForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        totalBlogs={totalBlogs}
        addNewBlog={addNewBlog}
      />
    </div>
  );
}

export default Header;
