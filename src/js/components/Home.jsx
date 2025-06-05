import React from "react";
import TodolistFetch, { TodoListFetch } from "./TodoListFetch.jsx";



//create your first component
const Home = () => {
	return (
		<div className="d-flex flex-column min-vh-100 text-center">
		<TodoListFetch/>

		</div>	
	)
}

export default Home;