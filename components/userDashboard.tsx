import axios from "axios";
import React, { useEffect, useState } from "react";
import UserTaskCard, { Status } from "./userTaskCard";

 interface IProps {
  id: number
  name: any
  description: string
  duration: number
  isStarted: boolean
  isCompleted: boolean
  startTime: any
  endTime: any
  proofPhotoUrl: any
  marked_completed_at: any
  status: Status 
  createdAt: string
  updatedAt: string
}

const UserDashboard = () => {
  const [tasks, setTasks] = useState<IProps[]>([]);
  const [token, setToken] = useState("");

 const getToken = () => {
    const storedToken = localStorage.getItem("AUTH_TOKEN");
    if (storedToken) {
      setToken(storedToken);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  useEffect(() => {
    if (token) {
      getTasks();
    }
  }, [token]);

  const getTasks = async () => {
    try {
      const res = await axios.get(
        "https://task-manager-zrno.onrender.com/tasks/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(res.data); 
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  return (
    <div className="m-10 grid grid-cols-4 gap-10">
      {" "}
      {tasks.map((task, index) => (
        <UserTaskCard
        id={task.id}
          key={index}
          description={task.description}
          duration={task.duration}
          endTime={task.endTime}
          name={task.name}
          startTime={task.startTime}
          status={task.status}
          isCompleted={task.isCompleted}
        />
      ))}
    </div>
  );
};

export default UserDashboard;
