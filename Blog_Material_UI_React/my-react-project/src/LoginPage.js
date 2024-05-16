import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
import toast, { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

function SignIn({ handleLogin, blogs, users }) {
  const [role, setRole] = useState("STUDENT");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loginError, setLoginError] = useState(false); // New state for login error
  const [showPassword, setShowPassword] = useState(false); // State to track password visibility

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    // Validate email
    if (!email || !email.includes("@")) {
      setEmailError(true);
      return;
    } else {
      setEmailError(false);
    }

    // Validate password
    if (!password || password.length < 6) {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    // Check authentication
    const matchedUser = users.find(
      (user) => user.email === email && user.password === password
    );
    // Filter out the blogs belonging to the current user
    if (matchedUser && matchedUser.role !== role) {
      console.log("Your login role does not matches.");
      // toast.info("Your login role does not matches.", {
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      // });
      toast.error("Your login role does not matches.");
      return;
    }
    if (matchedUser && matchedUser.flagged) {
      console.log("Your account is disabled by Administrator.");
      // toast.info("Your account is disabled by Administrator.", {
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: false,
      // });
      toast.error("Your account is disabled by Administrator.");
      return;
    }
    const currentUserBlogs =
      matchedUser &&
      blogs.filter((blog) => blog.postedBy === matchedUser.userId);

    if (matchedUser) {
      // Authentication successful
      console.log("Authentication successful. User:", matchedUser);
      console.log("Blogs for User:", currentUserBlogs);
      // Here you can redirect the user to the desired page or perform any other action
      // Navigate to blog page with user details
      handleLogin(matchedUser);
      toast.success("LoggedIn Successfully!");
      //   console.log("Len", blogs.length);
      navigate("/blog", {
        // state: {
        // //   user: matchedUser,
        // //   blogs: currentUserBlogs,
        //   //   totalBlogs: blogs.length,
        // },
      });

      return;
    } else {
      // Authentication failed
      toast.error("Authentication failed.");
      console.log("Authentication failed.");
      setLoginError(true); // Set login error state to true
    }
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign in as {role}
          </Typography>
          {loginError && ( // Display error message if login error state is true
            <Typography color='error' variant='body2'>
              Invalid email or password. Please try again.
            </Typography>
          )}
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              error={emailError}
              helperText={emailError ? "Please enter a valid email" : ""}
              margin='normal'
              required
              fullWidth
              id='email'
              label='Email Address'
              name='email'
              autoComplete='email'
            />
            <TextField
              error={passwordError}
              helperText={
                passwordError ? "Password must be at least 6 characters" : ""
              }
              margin='normal'
              required
              fullWidth
              name='password'
              label='Password'
              type={showPassword ? "text" : "password"}
              id='password'
              autoComplete='current-password'
            />

            <FormControlLabel
              control={
                <Checkbox
                  //   defaultValue={showPassword}
                  value={showPassword}
                  color='primary'
                  onChange={() => {
                    console.log("Password visibility changed");
                    // toast("Password visibility changed", {
                    //   hideProgressBar: false,
                    //   closeOnClick: true,
                    // });
                    setShowPassword(!showPassword);
                  }}
                />
              }
              label='show password'
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container justifyContent='space-between'>
              <Button onClick={() => setRole("STUDENT")}>Student</Button>
              <Button onClick={() => setRole("FACULTY")}>FACULTY</Button>
              <Button onClick={() => setRole("MODERATOR")}>Moderator</Button>
              <Button onClick={() => setRole("ADMINISTRATOR")}>
                Administrator
              </Button>
            </Grid>
          </Box>
        </Box>
        {/* <ToastContainer /> */}
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
