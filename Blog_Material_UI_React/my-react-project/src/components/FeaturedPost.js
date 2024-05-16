import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import { styled } from "@mui/system";
import { Image } from "@mui/icons-material";
import { Divider } from "@mui/material";

const StyledCard = styled(Card)({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
});

const StyledCardContent = styled(CardContent)({
  flex: "1 1 auto",
});

const StyledCardMedia = styled(CardMedia)({
  height: 0,
  paddingTop: "56.25%", // 16:9 aspect ratio
});

const TruncatedTypography = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

function FeaturedPost(props) {
  const { post, role, deleteBlog } = props;
  const isModerator = role === "MODERATOR";
  // console.log("FeaturedPost", post);
  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }
  const url =
    "https://images.unsplash.com/photo-1543128639-4cb7e6eeef1b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wJTIwc2V0dXB8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80";
  // console.log("Role", role);
  return (
    <StyledCard>
      <StyledCardMedia style={{ backgroundImage: `url(${post.imageURL})` }} />
      <Divider />
      <StyledCardContent>
        <Typography gutterBottom variant='h5' component='h2'>
          {post.name}
        </Typography>
        <Typography variant='body2' color='textSecondary' component='p'>
          {formatDate(post.date)}
        </Typography>
        <TruncatedTypography
          variant='body2'
          color='textSecondary'
          component='p'
        >
          {post.description}
        </TruncatedTypography>
      </StyledCardContent>
      {role === "MODERATOR" && (
        <IconButton onClick={() => deleteBlog(post.blogId)} color='secondary'>
          <DeleteIcon />
        </IconButton>
      )}
    </StyledCard>
  );
}

export default FeaturedPost;
