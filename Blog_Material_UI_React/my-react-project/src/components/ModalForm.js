import React, { useState } from "react";
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import emailjs from "emailjs-com";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ModalForm({ isOpen, onClose, user, totalBlogs, addNewBlog }) {
  const categories = [
    "Academic Resources",
    "Technology",
    "Health and Wellness",
    "Career Services",
    "Local Community Resources",
    "Social",
    "Campus",
    "Culture",
    "Sports",
  ];

  const [postData, setPostData] = useState({
    postedBy: user.userId,
    userId: user.userId,
    blogId: 1 + totalBlogs,
    imageURL: "",
    date: new Date().toISOString().substr(0, 10),
    category: "",
    name: "",
    description: "",
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({
      ...postData,
      [name]: value,
    });
    // console.log("handleChange->", name, "->", value);
  };
  const sendEmailNotification = async (to_email, to_name, postData) => {
    // const { title, category, description } = postData;

    // Prepare the email parameters
    const emailParams = {
      from_name: "UML Blog Site",
      to_name: to_name,
      to_email: to_email,
      subject: `New Post on Blogging Site: ${postData.name}`,
      message_html: `
      <p>Dear ${to_name},</p>
      <p>We're excited to inform you about our new blog post in ${postData.category} Category.</p>
      <p><strong>Title:</strong> ${postData.name}</p>
      <p><strong>Category:</strong> ${postData.category}</p>

      <p><strong>Posted On:</strong> ${postData.date}</p>

      <p>Read more on our blogging website!</p>
      <p>You are receiving this email because you subscribed to updates for this blog category on our website. You can unsubscribe anytime by visiting site.</p>

      <p>Best regards,<br/>Shubham Gupta<br/>UML CSP-586</p>
      `,
      // can add this description but it would make it longer
      // <p><strong>Description:</strong> ${postData.description}</p>
    };

    // Send the email using EmailJS
    emailjs
      .send(
        "service_z2whckp",
        "template_9lptyk2",
        emailParams,
        "EwYH_bchYXCZhYwyA"
      )
      .then((result) => {
        console.log("Email notification sent successfully!", result.text);
      })
      .catch((error) => {
        console.error("Error sending email notification:", error.text);
      });
  };
  const storePost = async (data) => {
    const index = "search-posts";

    try {
      console.log("storePost ");
      const response = await axios.post("http://localhost:3001/api/indexData", {
        index: index,
        data: data,
      });
      console.log("Storing post", data.category);

      const mailResponse = await axios.get(
        `http://localhost:3001/api/getEmailData/${data.category}`
      );

      const subscribersMailIds = mailResponse.data;

      for (let i = 0; i < subscribersMailIds.length; i++) {
        const email = subscribersMailIds[i];
        await sendEmailNotification(email, user.name, data);
      }
      toast.success("Email notification sent successfully!");
    } catch (error) {
      toast.error("Something Went Wrong");
      console.error(error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    addNewBlog(postData);
    toast.success("New Post Created Successfully!");
    storePost(postData);

    // console.log("Submitted Post Data:", postData);

    // approach
    // find all the subscribed members from elasticcloud subcribtion data for this specific category and send them email.
    //  can do batch processing to send emails notifications to all the subscribed members
    // sendEmailNotification("sgupta101@hawk.iit.edu", "Shubbu", postData);

    setPostData({
      postedBy: user.userId,
      userId: user.userId,
      blogId: 1 + totalBlogs,
      imageURL: "",
      date: new Date().toISOString().substr(0, 10),
      category: "",
      name: "",
      description: "",
    });

    onClose(); // Close the modal after form submission
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          maxHeight: "90vh", // Limit the maximum height of the modal
          overflowY: "auto",
        }}
      >
        <Typography id='modal-modal-title' variant='h6' component='h2'>
          Enter the Post Details
        </Typography>
        <Box component='form' onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin='normal'
            label='Post Name'
            variant='outlined'
            name='name'
            value={postData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin='normal'
            label='Image URL'
            variant='outlined'
            name='imageURL'
            value={postData.imageURL}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin='normal'
            label='Description'
            variant='outlined'
            multiline
            rows={4}
            name='description'
            value={postData.description}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin='normal'
            type='date'
            label='Date'
            variant='outlined'
            name='date'
            value={postData.date}
            onChange={handleChange}
            required
            InputProps={{
              readOnly: true, // Make the input field read-only
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            fullWidth
            select
            margin='normal'
            label='Categories'
            variant='outlined'
            name='category'
            value={postData.category}
            onChange={handleChange}
            SelectProps={{
              native: true,
            }}
            required
          >
            <option value='' disabled>
              Select Category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>
          <Button type='submit' variant='contained' color='primary'>
            Create
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

ModalForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalForm;
