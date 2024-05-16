import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import XIcon from "@mui/icons-material/X";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./Header";
import MainFeaturedPost from "./MainFeaturedPost";
import FeaturedPost from "./FeaturedPost";
import Main from "./Main";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const sections = [
  { title: "Academic Resources", url: "#" },
  { title: "Career Services", url: "#" },
  { title: "Campus", url: "#" },
  { title: "Culture", url: "#" },
  { title: "Local Community Resources", url: "#" },
  { title: "Social", url: "#" },
  { title: "Sports", url: "#" },
  { title: " Health and Wellness", url: "#" },
  { title: "Technology", url: "#" },
  { title: "Travel", url: "#" },
  { title: "Alumni", url: "#" },
];

const sidebar = {
  title: "About",
  description:
    "Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.",
  archives: [
    { title: "March 2020", url: "#" },
    { title: "February 2020", url: "#" },
    { title: "January 2020", url: "#" },
    { title: "November 1999", url: "#" },
    { title: "October 1999", url: "#" },
    { title: "September 1999", url: "#" },
    { title: "August 1999", url: "#" },
    { title: "July 1999", url: "#" },
    { title: "June 1999", url: "#" },
    { title: "May 1999", url: "#" },
    { title: "April 1999", url: "#" },
  ],
  social: [
    { name: "GitHub", icon: GitHubIcon },
    { name: "X", icon: XIcon },
    { name: "Facebook", icon: FacebookIcon },
  ],
};

const defaultTheme = createTheme();

export default function Blog({
  user,
  blogs,
  totalBlogs,
  addNewBlog,
  totalBlogsData,
  deleteBlog,
}) {
  console.log("logging from blog", totalBlogsData);
  const [filteredCategory, setFilteredCategory] = useState(null);
  const title = `Blog ${filteredCategory ? filteredCategory : ``} - ${
    user.name
  } ${user.role}`;
  const handleCategoryClick = (category) => {
    console.log("handleCategoryClick", typeof category);
    console.log(`Showing blogs for ${category} category.`);

    // toast.success(`Showing blogs for ${category} category.`, {
    //   position: "top-right",
    //   theme: "light",
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: false,
    // });

    setFilteredCategory(category);
  };

  // const latestBlog = totalBlogsData.length > 0 ? totalBlogsData[0] : null;
  const sortedBlogs = [...totalBlogsData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const filteredBlogs = filteredCategory
    ? sortedBlogs.filter((blog) => blog.categories.includes(filteredCategory))
    : sortedBlogs;
  // add todo
  console.log("filteredBlogs", filteredBlogs);
  const top3Blogs =
    filteredBlogs.length > 0 ? filteredBlogs.slice(1) : sortedBlogs.slice(1);
  const mainFeaturedPost =
    filteredBlogs.length > 0 ? filteredBlogs[0] : sortedBlogs[0];
  // console.log("mainFeaturedPost", mainFeaturedPost);
  const featuredPosts = top3Blogs;

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth='lg'>
        <Header
          user={user}
          title={title}
          sections={sections}
          totalBlogs={totalBlogs}
          addNewBlog={addNewBlog}
          onCategoryClick={handleCategoryClick}
          category={filteredCategory}
        />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <Grid item key={post.blogId} xs={12} sm={6} md={4}>
                {/* todo  */}
                <Link
                  key={post.blogId}
                  to={`/detail-view/${post.blogId}`}
                  style={{ textDecoration: "none" }}
                >
                  <FeaturedPost
                    key={post.blogId}
                    post={post}
                    role={user.role}
                    deleteBlog={deleteBlog}
                  />
                </Link>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={5} sx={{ mt: 3 }}>
            {/* <Main title='From the firehose' posts={latestBlog} /> */}
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
        <ToastContainer />
      </Container>
      <Footer
        title='Footer'
        description='Something here to give the footer a purpose!'
      />
    </ThemeProvider>
  );
}
