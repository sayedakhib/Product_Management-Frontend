# Product Management App

A full-stack product management system with inventory, CSV import/export, and image support.

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- MongoDB (local or cloud, e.g. MongoDB Atlas)
1. Open a terminal and navigate to the `backend` folder:
	```sh
	cd backend
	```

2. Install dependencies:
	```sh
	npm install
	```

3. Create a `.env` file in the `backend` folder with the following (edit as needed):
	```
	MONGODB_URI=mongodb://localhost:27017/productdb
	PORT=5000
	```

4. Start the backend server:
	```sh
	npm start
	```

## Frontend Setup


## Backend Repository

The backend source code is available at: [Product_Management-Backend GitHub Repo](https://github.com/sayedakhib/Product_Management-Backend/)

To integrate the backend with this frontend:
- Clone the backend repository from the link above (if not already present).
- Follow the Backend Setup instructions below to install dependencies and run the backend server.
- Make sure the backend server is running before starting the frontend.

1. Open a new terminal and navigate to the `frontend` folder:
	```sh
	cd frontend
	```

2. Install dependencies:
	```sh
	npm install
	```

3. Start the frontend development server:
	```sh
	npm run dev
	```

4. Open your browser and go to [http://localhost:5173](http://localhost:5173)

## Notes

- Make sure MongoDB is running locally or update the `MONGODB_URI` in `.env` to your cloud connection string.
- The backend runs on port 5000 by default; the frontend runs on 5173.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
