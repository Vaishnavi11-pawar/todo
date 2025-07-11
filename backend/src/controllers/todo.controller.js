import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { pool } from "../db/index.js";
import {v4 as uuidv4} from 'uuid';


export const addtask = asyncHandler(async(req, res) => {
   try {
     const {task} = req.body;
     if (task.trim() === "") {
         throw new ApiError(401,"All fields are required.");
     }
     const taskid = uuidv4();
 
     const userId = req.user.id;
     if (!userId) {
        throw new ApiError(401,"user not found")
     }
     await pool.query("INSERT INTO tasks (id, task, user_id) VALUES (?, ?, ?) ", [taskid, task, userId]);

     return res
        .status(200)
        .json({
            status:"success",
            message: "task added successfully"
        });
   } catch (error) {
        console.log("error while adding the task: ", error);
   }
})

export const getTasks = asyncHandler(async(req, res) => {
    try {
      const userId = req.user?.id;
      if(!userId) {
         throw new ApiError(401, "User not found");
      }

      const page = 1;
      const limit = 10;
      const offset = (page - 1)*limit;

      const [tasks] = await pool.query("SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?", [userId, limit, offset]);
      const [countResult] = await pool.query("SELECT COUNT(*) as total FROM tasks WHERE user_id = ?", [userId]);
      const totalTasks = countResult[0].total;
      const totalPages = Math.ceil(totalTasks/limit);

      return res
         .status(200)
         .json(new ApiResponse(200, {tasks, currentPage: page,
            totalPages,
            totalTasks,
         }, "Tasks fetched successfully."))

    } catch (error) {
         console.log("Error while fetching the task: ", error);
         return res
            .status(500)
            .json(new ApiError(500, "Internal server error"))
    }

})

export const updateTask = asyncHandler(async(req, res) => {
   try {
      const {taskId} = req.params;
      const {task} = req.body;
      const userId = req.user?.id;

      if (!taskId) {
         throw new ApiError(400, "Task id is required.")
      }
      if (!task || task.trim() === "" ){
         throw new ApiError(400, "Enter the task");
      }
      const [existingTask] = await pool.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
      if (existingTask.length === 0) {
         throw new ApiError(404, "Task is not found.")
      }

      await pool.query("UPDATE tasks SET task = ? WHERE id = ? AND user_id = ?", [task, taskId, userId])
      return res
         .status(200)
         .json(new ApiResponse(200, null, "Task updated successfully."))
   } catch (error) {
      console.log("Error while updating the task: ", error);
      return res
         .status(500)
         .json(new ApiError(500, "Internal server error"));
   }
})

export const deleteTask = asyncHandler(async(req, res) => {
   try {
      const {taskId} = req.params;
      const userId = req.user?.id;

      if (!taskId) {
         throw new ApiError(400, "Task Id is required.")
      }
      const [existingTask] = await pool.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId])
      if (existingTask.length === 0) {
         throw new ApiError(404, "task not found");
      }

      await pool.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);

      return res
         .status(200)
         .json(new ApiResponse(200, null, "Task deleted successfully."));

   } catch (error) {
      console.log("Error while deleting the task");
      return res
         .status(500)
         .json(new ApiError(500, "Internal server error"));  
   }
})

export const updateTaskStatus = asyncHandler(async(req, res) => {
   try {
      const {taskId} = req.params;
      const userId = req.user?.id;
      if (!taskId) {
         throw new ApiError(400, "Task id is required.");
      }
      const [existingTask] = await pool.query("SELECT * FROM tasks WHERE id = ? AND user_id = ?", [taskId, userId]);
      if (existingTask.length === 0) {
         throw new ApiError(404, "Task not found.");
      }
      await pool.query("UPDATE tasks SET status = 'completed' WHERE id = ? AND user_id = ?", [taskId, userId]);
      return res
         .status(200)
         .json(new ApiResponse(200, null, "Task status marked as completed."));
   } catch (error) {
      console.log("Error while updating task status: ", error);
      return res
         .status(500)
         .json(new ApiError(500, "Internal server error"));
   }
})