import {useState, useEffect} from 'react';
import Cookie from 'js-cookie';
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import TodoStatus from "./context/TodoStatus";
import Todo from './components/Todo';
import Profile from './components/Profile';

const App = () => {
  const [todoList, setTodoList] = useState([]);

  useEffect(async() => {
    const url = 'http://localhost:3000/todo/';
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer `
      } 
    }
  },[])

  const addTodoItem = (newTodo) => {
    setTodoList((preState) => [...preState, newTodo])
  }

  const removeTodoItem = (id) => {
    const filterTodoList = todoList.filter(todo => todo.id !== id);
    setTodoList(filterTodoList);
  }

  

  return(
    <TodoStatus.Provider 
      value={{
        todoList: todoList,
        addTodoItem: addTodoItem,
        removeTodoItem: removeTodoItem
       }}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Todo />} />
            <Route exact path="/profile" element={<Profile />} />
          </Routes>
        </Router>
       </TodoStatus.Provider>
  )
}


export default App;
