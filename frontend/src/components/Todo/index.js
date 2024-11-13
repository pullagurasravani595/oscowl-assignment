import {useState, useEffect} from 'react';
import TodoStatus from "../../context/TodoStatus";
import './index.css';

const apiStatusMode = {
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
    initial: 'INITIAL',
  }

const Todo = () => {
    const [apiStatus, setApiStatus] = useState(apiStatusMode.initial);

    return(
        <TodoStatus.Consumer>
            {value => {
                const {todoList} = value;
                return (
                    <div className="todo-container">
                        <div>
                            <h1>Create Task</h1>
                        </div>
                        <div className='todo-add-container'>
                            <div className="input-container">
                                <input type="text" placeholder='Enter your task' className='input-element' />
                            </div>
                            <div className='button-container'>
                                <button type="button" className='add-button'>Add</button>
                            </div>
                        </div>
                        <div>
                            <div>
                                <h3>My Task</h3>
                            </div>
                            <div className='list-head-container'>
                                <div className='todo-name-container'>
                                    <h5>Todo Name</h5>
                                </div>
                                <div className='todo-status-container'>
                                    <h5>Status</h5>
                                </div>
                                <div className='todo-action-container'>
                                    <h5>Action</h5>
                                </div>
                            </div>
                            {/* <ul>
                                {todoList.map(eachTodo => {
                                    <li>
                                        <p>{eachTodo.}</p>
                                    </li>
                                })}
                            </ul> */}
                        </div>
                    </div>
                )
            }}
        </TodoStatus.Consumer>
    )

}

export default Todo;