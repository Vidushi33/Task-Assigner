import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface IProps {
  isAdmin?: boolean;
}

interface INotification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Navbar = ({ isAdmin = false }: IProps) => {
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState("");
  const [notification, setNotification] = useState<INotification[]>([]);

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
      getNotification();
    }
  }, [token]);

  const getNotification = async () => {
    try {
      const res = await axios.get<INotification[]>(
        "https://task-manager-zrno.onrender.com/tasks/get-notifications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotification(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const router = useRouter();

  const markAsRead = async (id: number) => {
    console.log(token);
    try {
      const res = await axios.post(
        `https://task-manager-zrno.onrender.com/tasks/mark-read/${id}`, {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-between py-4 px-6 bg-white">
      <div className="flex gap-7">
        <h1 className="text-3xl font-biold text-black">TASK MANAGER</h1>
      </div>

      {!isAdmin && (
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#0B5ED7] text-white py-2 rounded-md w-44 mx-auto font-semibold"
          >
            View Notification
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <ul>
              {notification.map((notification) => (
                <li
                  key={notification.id}
                  className={`mb-2 p-2 border rounded-md ${
                    notification.isRead ? "bg-gray-200" : "bg-blue-50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{notification.message}</span>
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-blue-500 hover:text-blue-700 font-semibold"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded-md mt-4"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
