import Navbar from "@/components/navbar";
import UserDashboard from "@/components/userDashboard";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("AUTH_TOKEN");
    if (!storedToken) router.push("/login");
  }, []);
  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/bg-image.jpg")' }}
    >
      <Navbar />
      <UserDashboard />
    </div>
  );
}
