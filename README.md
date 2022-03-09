# Welcome to Fakebook!

👉 [Visit Fakebook here](https://secret-fjord-25520.herokuapp.com/) 👈

Fakebook is a simplified clone of Meta's Facebook platform. Users can create profiles, connect with each other, share messages, post photos, and like and comment on content. I created Facebook as my final project for The Odin Project.

<div className="flex justify-center items-center">
<img src="https://github.com/Atlas-1510/facebook/blob/1963fe446ecbbc6fdee9a19ddf738c011854e0b4/readme_images/profile_page.png" width="500px">
</div>

## Concepts

- **Testing**: A key focus of this project was to use test-driven-development. I started by creating the backend express API, and used superset and mongodb-memory-server to run test suites for most API endpoints.
- **Organisation**: The backend API uses a model-routes-controller pattern for code organisation.
- **Types**: This is the first project I have built using TypeScript. While it threw up some difficult challenges during development I found the use of type-safety to be worth the hassle.
- **Responsive-Design**: During the development of the React frontend, I focused on designing the layout of each page for small mobile screens first, and then adjusted styling for larger viewports as required. TailwindCSS was extremely helpful for this approach.
- **OAuth Login**: Users can sign in with their own email and password, or use their Google account to register. Confidential user passwords are protected using hashing provided by the bcryptjs package.
- **Image Upload**: Fakebook allows users to choose their own profile image, and post photos for friends to view. Image upload is managed by Multer, while storage relies on an S3 bucket provided by Amazon Web Services.

## Tools

Fakebook was built using the following:

### Backend

- MongoDB
- Express
- NodeJS
- multer
- Amazon S3 file storage
- supertest
- mongodb-memory-server
- passportjs
- bcrypt
- jest

### Frontend

- React
- react-icons
- tailwindCSS
- react-router
- react-responsive
- react-query
- react testing library
- axios mock
- react-query

## Future areas for improvement

- **Standardised Error Handling**: I found through the course of development that I adopted multiple formats for delivering error messages to the client. In future projects, I will focus on standardising this to ease development.
- **Clear scope and efficient tests**: My original focus on testing in this project wore down over time, particularly as my 'plan' for the project changed over time. On several occasions I found many tests I had built were now obsolete as my plan for the scope and structure of the project changed. In the future, I will place more focus on clarifying the exact scope of the project in order to avoid wasting time on unneeded testing.
- **Efficient network requests**: During the development of the React frontend I used react-query for the first time. I found this library useful for managing API requests and refetching stale data. However, a point where I could improve is using greater use of the react-query's invalidation and mutation tools when user actions are made to prevent unnecessary API requests.
