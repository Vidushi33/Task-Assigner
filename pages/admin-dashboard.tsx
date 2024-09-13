import Navbar from '@/components/navbar'
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'
import UserList from './userList'

const AdminDashboard = () => {
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
      <Navbar isAdmin />
      <UserList />
    </div>
  )
}

export default AdminDashboard