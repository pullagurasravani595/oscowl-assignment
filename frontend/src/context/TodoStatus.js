import React from 'react';

const TodoStatus = React.createContext({
    todoList: [],
    addTodoItem: () => {},
    removeTodoItem: () => {}
});

export default TodoStatus
