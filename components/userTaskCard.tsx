import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export type Status = "pending" | "approved" | "rejected";

interface ITask {
  name: string;
  description: string;
  duration: number;
  startTime: string | null;
  endTime: string | null;
  status: Status;
  id: number;
  isCompleted:boolean
}


interface IUploadImage {
  photo: any;
}

const UserTaskCard = ({
  description,
  duration,
  endTime,
  name,
  startTime,
  status,
  id,
  isCompleted
}: ITask) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [token, setToken] = useState("");
  const router = useRouter();

  const getToken = () => {
    const storedToken = localStorage.getItem("AUTH_TOKEN");
    if (storedToken) {
      setToken(storedToken);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const startTask = async () => {
    try {
      const res = await axios.put(
        "https://task-manager-zrno.onrender.com/tasks/start",
        { taskId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      router.refresh();
      console.log(res);
      return res;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUploadImage>();


  const endTask: SubmitHandler<IUploadImage> = async (data) => {
    try {
      const payload = { image: data.photo[0].name.image, taskId: id };
      const res = await axios.post(
        "https://task-manager-zrno.onrender.com/tasks/complete-task",
        payload,
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
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
        <h2 className="text-xl font-semibold mb-2">{name}</h2>
        <p className="text-gray-700 mb-2">{description}</p>
        <p className="text-gray-700 mb-2">Duration: {duration}</p>

        <div className="mb-2">
          <span className="font-medium">Start Time: </span>
          {startTime ? (
            <span>{new Date(startTime).toLocaleDateString("en-GB")}</span>
          ) : (
            <button
              onClick={startTask}
              className="text-blue-500 underline hover:text-blue-700"
            >
              Start Now
            </button>
          )}
        </div>

        <div className="mb-2">
          <span className="font-medium">End Time: </span>
          {endTime && (
            <span>{new Date(endTime).toLocaleDateString("en-GB")}</span>
          )}
          {startTime ? (
            <button
              onClick={() => setShowModal(true)}
              className="text-blue-500 underline hover:text-blue-700"
            >
              {!isCompleted && ("End Now")}
            </button>
          ) : (
            <span className="text-gray-500">(Task not started)</span>
          )}
        </div>

        <div className="mb-2">
          <span className="font-medium">Status: </span>
          <span
            className={`${
              status === "approved"
                ? "text-green-500"
                : status === "rejected"
                ? "text-red-500"
                : "text-yellow-500"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {showModal && (
        <>
          {" "}
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-xl font-semibold mb-4">
                Mark Task as Completed
              </h2>

              <form onSubmit={handleSubmit(endTask)}>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Upload a Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register("photo", { required: true })}
                    className="border p-2 w-full"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="ml-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default UserTaskCard;
