import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

type ILogin = {
  email: string;
  password: string;
};

interface IProps {
  accessToken: string;
  role: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();
  const router = useRouter();
  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    try {
      const res = await axios.post<IProps>(
        "https://task-manager-zrno.onrender.com/v1/login",
        data
      );
      // console.log(res);
      localStorage.setItem("AUTH_TOKEN", res.data.accessToken);

      res.data.role == "user"
        ? router.push("/")
        : router.push("/admin-dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };
  return (
    <div className="bg-black w-full h-screen text-white flex justify-center items-center">
      <div className="glass-card w-1/3 h-fit py-40">
        <h1 className="text-center text-3xl font-semibold text-[#00FFFF]">
          Login Form
        </h1>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-8 mt-6 w-10/12"
          >
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 p-2 border rounded-md w-full text-black"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 p-2 border rounded-md w-full text-black"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-[#00FFFF] text-black py-2 rounded-md w-40 mx-auto font-semibold"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
