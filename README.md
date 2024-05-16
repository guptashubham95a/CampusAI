# AI-Based Blogging Platform

## Specifications

### Sections

This project implements a blog management system using React.js and Material-UI. Users can create, view, and manage blog posts. Key features include user authentication, creating new blog posts, viewing blog posts, and managing users.

## Features

### AI-Based Unique features

- **Auto-AI reply**: The OpenAI API is also used to generate auto-replies to posts by feeding the blog data. This feature helps users engage with the Chicago Explorer platform and receive timely responses to their queries or comments.
- **AI Places recommendations from OpenAI**: OpenAI generates personalized recommendations for restaurants, musical events, and sports events in their location. By analyzing user preferences and constraints, OpenAI provides diverse and relevant suggestions to cater to individual tastes.
- **search with auto-completion**: Elasticsearch is used as the database for Chicago Explorer, storing user preferences, blog data, and other relevant information. Its search functionality is leveraged for integrating search features with auto-completion, enabling users to find relevant recommendations quickly and efficiently.

- **User Roles Authentication**: log in, and log out securely(Student, Faculty, Staff, Moderator, and Administrator).
- **Create Blog Posts**: Authenticated users can create new blog posts with a title, description, and image, categories.
- **View/Reply/Delete Blog Posts**: Users can view/reply to all blog posts on the homepage, with featured posts displayed prominently.
- Moderators can delete blog posts.
- **Filter Blog Posts by Categories**: Users can view all blog posts on the homepage, by filtering categories.
- **Manage Users**: Administrators can manage user accounts, including updating roles and flagging users.
- **Responsive Design**: The application is fully responsive, providing an optimal viewing experience across a wide range of devices.

## To run the code

In the project directory, you can run:

### `npm config set legacy-peer-deps true`

### `npm npm install`

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Technologies Used

- **React.js**: Frontend JavaScript library for building user interfaces.
- **Elasticsearch**: Elasticsearch is used as the database for Chicago Explorer and integrating search features with auto-completion
- **OpenAI GPT-3**: The OpenAI GPT-3 model is utilized for generating personalized recommendations and auto-replies based on user queries and preferences. It leverages natural language processing to provide diverse and relevant suggestions.
- **Node.js/Express.js**: The backend is powered by Node.js and Express.js, providing a scalable and efficient server-side environment for handling requests, processing data, and interacting with APIs.
- **StubHub API and Google Events API**: The StubHub API and Google Events API are used to retrieve real-time event timings and hours for musical events and sports events recommended by Chicago Explorer.
- **Google Maps API**: Chicago Explorer integrates with the Google Maps API to visualize recommended venues and events on interactive maps. By plotting locations and providing navigation features, Google Maps enhances the user experience and helps users explore Chicago with ease.
- **Material-UI**: React component library implementing Google's Material Design.
- **React Router**: Declarative routing for React applications.
- **React Toastify**: Notification library for React applications.

## Contributing

Contributions are welcome! If you have any ideas for improving Chicago Explorer or would like to add new features, feel free to submit a pull request.

Fork the repository.
Create a new branch (git checkout -b feature-improvement)
Commit your changes (git commit -am 'Add new feature')
Push to the branch (git push origin feature-improvement)
Submit a pull request.
