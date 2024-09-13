import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface ISignup {
  name: string;
  email: string;
  password: string;
}

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignup>();
  const router = useRouter()

  const onSubmit: SubmitHandler<ISignup> = async (data) => {
    // console.log(data); 
  
    try {
      
      const res = await axios.post("https://task-manager-zrno.onrender.com/v1/signup",data)
      
      if(res.status === 201){
        router.push("/login")
      }
    } catch (error) {
      console.error("Error signing up:", error);  
    }
  };

  return (
    <div className="bg-black w-full h-screen text-white flex justify-center items-center">
      <div className="glass-card w-1/3 h-fit py-20">
        <h1 className="text-center text-3xl font-semibold text-[#00FFFF]">
          Signup Form
        </h1>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-8 mt-6 w-10/12"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
                <input
                  id="name"
                  type="text"
                  className="mt-1 p-2 border rounded-md w-full text-black"
                  {...register("name", { required: "Name is required" })}
                />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

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
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
