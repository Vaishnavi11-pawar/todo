import React from 'react'
import '../../styles/home.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {

  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editText, setEditText] = useState("");
  

  const handleAddTask = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      return;
    }
    try {
      const response = await axios.post('/api/v1/addTask', {task}, { headers: { 'Authorization': `Bearer ${token}`} })
      console.log("Task added successfully: ", response.data);
      setTask("");

      const res = await axios.get('/api/v1/getTask', {
        headers: { Authorization: `Bearer ${token}`}
      });
      setTodos(res.data.data.tasks);
    } catch (error) {
      console.log("Error adding task: ", error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      return;
    }

    axios.get('/api/v1/getTask',{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      setTodos(res.data.data.tasks);
      console.log("Tasks fetched successfully: ", res);
    })
    .catch(err => {
      console.log("Error while fetching tasks: ", err);
    });
  }, [])

  const handleMarkCompleted = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      return;
    }
    try {
      await axios.patch(`/api/v1/updateStatus/${taskId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res = await axios.get('/api/v1/getTask', {
        headers: {Authorization: `Bearer ${token}`},
      });
      setTodos(res.data.data.tasks);
    } catch (error) {
      console.log("Error updating task status: ", error);
    }
  }

  const handleUpdateTask = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log("No token found");
      return;
    }
    try {
      await axios.put(`/api/v1/task/${taskId}`, { task: editText }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const res = await axios.get('/api/v1/getTask', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data.data.tasks);
      setEditTaskId(null);
      setEditText("");
    } catch (error) {
      console.log("Error updating task: ", error);
    }
  }

  const handleDeleteTask = async (taskId) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("No token found");
    return;
  }

  try {
    await axios.delete(`/api/v1/task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const res = await axios.get('/api/v1/getTask', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(res.data.data.tasks);

    console.log("Task deleted successfully");
  } catch (error) {
    console.log("Error deleting task: ", error);
  }
};


  return (
    <div className='screen'>
        <div className='box'>
            <div className='heading'>
                <h2>ToDo List</h2>
            </div>
            <div className='body'>
                <input value={task} onChange={(e) => setTask(e.target.value)} type="text" placeholder="Enter task" />
                <button onClick={handleAddTask}>Add</button>
            </div>
            {
              todos?.map(todo => (
                <div className='tasks' key={todo.id}>
                  <div className='task'>
                    {
                      editTaskId === todo.id ? (
                        <input 
                        type="text" 
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        placeholder='Edit task'
                        />
                      ) : (
                        <>
                          <p className='work'>{todo.task}</p>
                          <p className='date'>{new Date(todo.created_at).toLocaleString()}</p>
                        </>
                      )
                    }
                    
                  </div>
                  <div className='status'>
                    {
                      editTaskId === todo.id ? ( 
                        <>
                          <button onClick={() => handleUpdateTask(todo.id)}>Save</button>
                          <button onClick={() => {setEditTaskId(null); setEditText(""); }}>Cancel</button>
                        </>
                      ) : (
                        <button className='edit'
                        onClick={() => {
                          setEditTaskId(todo.id);
                          setEditText(todo.task);
                        }}
                        >Edit</button>
                      )
                    }
                    
                    <button className='delete' onClick={() => handleDeleteTask(todo.id)}>Delete</button>
                    <button className='completed' onClick={() => handleMarkCompleted(todo.id)} disabled={todo.status === 'completed'}>{todo.status === 'completed' ? 'Completed' : 'Complete'}</button>
                  </div>
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Home