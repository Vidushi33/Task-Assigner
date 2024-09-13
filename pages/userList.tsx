import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface IUser {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  email: string;
  name: string;
  isActive: boolean;
  role: string;
}

interface ITask {
  duration: number;
  description: string;
  assignedTo: number;
  name: string;
}

const UserList = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [assignTask, setAssignTask] = useState({
    duration: "",
    description: "",
    name: "",
    id: "",
  });
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showNotiModal, setShowNotiModal] = useState(false);
  const [users, setUsers] = useState<IUser[]>([]);
  const [userTasks, setUserTasks] = useState([]);
  const [message, setMessage] = useState("");

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
      getUser();
    }
  }, [token]);

  const getUser = async () => {
    try {
      const res = await axios.get<IUser[]>(
        "https://task-manager-zrno.onrender.com/tasks/user-list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAssignTask = async (e: any) => {
    e.preventDefault();
    try {
      const payload = {
        name: assignTask.name,
        duration: Number(assignTask.duration),
        description: assignTask.description,
        assignedTo: Number(assignTask.id),
      };

      const res = await axios.post<ITask>(
        "https://task-manager-zrno.onrender.com/tasks/create",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 200 || 204 || 201) {
        alert("Task Assigned");
        setShowAssignModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShowTask = async (id: string) => {
    setShowTaskModal(true);
    try {
      console.log(id);
      const res = await axios.get(
        `https://task-manager-zrno.onrender.com/tasks/task-by-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      setUserTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateNoti = async (e: any) => {
    e.preventDefault();
    console.log(message);
    try {
      const res = await axios.post(
        `https://task-manager-zrno.onrender.com/tasks/notification/${assignTask.id}`,
        { message: message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res);
      if (res.status === 201 || 200 || 204 || 203) {
        alert("Notification Sent");
        setShowNotiModal(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveTask = async (id:any, status:any) => {
    try {
      const payload = {taskId:id, status:status}
      const res = await axios.put(
        "https://task-manager-zrno.onrender.com/tasks/approve",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowTaskModal(false)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 w-fit">
      <h1 className="text-2xl font-semibold mb-4">User List</h1>
      <ul>
        {users
          .filter((datum) => datum.role === "user")
          .map((user) => (
            <li key={user.id} className="mb-2 flex  items-center">
              <span className="w-60">{user.name}</span>
              <div>
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded-md mr-2"
                  onClick={() => {
                    setShowAssignModal(true);
                    setAssignTask({ ...assignTask, id: user.id });
                  }}
                >
                  Assign Task
                </button>
                <button
                  className="bg-green-500 text-white py-1 px-3 rounded-md mr-2"
                  onClick={() => handleShowTask(user.id)}
                >
                  Show Task
                </button>
                <button
                  className="bg-yellow-500 text-white py-1 px-3 rounded-md"
                  onClick={() => {
                    setShowNotiModal(true);
                    setAssignTask({ ...assignTask, id: user.id });
                  }}
                >
                  Send Notification
                </button>
              </div>
            </li>
          ))}
      </ul>

      {showAssignModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Assign Task</h2>
            <form onSubmit={handleAssignTask}>
              <div className="mb-4">
                <label htmlFor="task" className="block text-sm font-medium">
                  Task Name
                </label>
                <input
                  type="text"
                  name="name"
                  className="mt-1 p-2 border rounded-md w-full"
                  value={assignTask.name}
                  onChange={(e) =>
                    setAssignTask({ ...assignTask, name: e.target.value })
                  }
                  required
                />
                <label
                  htmlFor="task"
                  className="mt-2 block text-sm font-medium"
                >
                  Task Description
                </label>
                <input
                  type="text"
                  name="description"
                  className="mt-1 p-2 border rounded-md w-full"
                  value={assignTask.description}
                  onChange={(e) =>
                    setAssignTask({
                      ...assignTask,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="hours" className="block text-sm font-medium">
                  Total Hours Required
                </label>
                <input
                  type="number"
                  name="duration"
                  className="mt-1 p-2 border rounded-md w-full"
                  value={assignTask.duration}
                  onChange={(e) =>
                    setAssignTask({ ...assignTask, duration: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                // onClick={handleAssignTask}
                className="bg-green-500 text-white py-2 px-4 rounded-md"
              >
                Assign Task
              </button>
              <button
                type="button"
                className="ml-4 bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={() => {
                  setShowAssignModal(false);
                  setAssignTask({
                    ...assignTask,
                    id: "",
                    duration: "",
                    description: "",
                    name: "",
                  });
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <ul>
              {userTasks?.map((task: any) => (
                <li key={task.id} className="mb-4">
                  <div className="grid grid-cols-4">
                    <span>{task.name}</span>
                    <span>{task.description}</span>
                    <span>{task.proofPhotoUrl ? <Image src={task.proofPhotoUrl} width={50} height={50} alt="photo" /> : "Not submitted"}</span>
                    <span>{task.status}</span>
                  </div>
                  {task.isCompleted && task.status=="pending" && (
                    <div className="mt-2 flex gap-6 justify-end">
                      <button
                        className="bg-green-500 text-white py-1 px-3 rounded-md"
                        onClick={() => handleApproveTask(task.id, "approved")}
                        value="accept"
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded-md"
                        onClick={() => handleApproveTask(task.id, "rejected")}
                        value="reject"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="mt-40 bg-red-500 text-white py-2 px-4 rounded-md"
              onClick={() => setShowTaskModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showNotiModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Create Notification</h2>
            <form onSubmit={handleCreateNoti}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium">
                  Message
                </label>
                <input
                  type="text"
                  name="message"
                  className="mt-1 p-2 border rounded-md w-full"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                // onClick={handleCreateNoti}
                className="bg-green-500 text-white py-2 px-4 rounded-md"
              >
                Send Notification
              </button>
              <button
                type="button"
                className="ml-4 bg-red-500 text-white py-2 px-4 rounded-md"
                onClick={() => {
                  setShowNotiModal(false);
                  setMessage("");
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
