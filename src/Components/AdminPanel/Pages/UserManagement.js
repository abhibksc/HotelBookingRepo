import React, { useEffect, useState } from 'react';
import { GetAllUsers } from '../../../CRUD Operations/Get';


const UserManagement = () => {

  const [users, setUsers] = useState([]);

useEffect(()=>{

  const fun = async()=>{

    const response = await GetAllUsers();
    console.log(response);

    if(response.length > 0){
setUsers(response)
      


    }
    

  }

  fun();

},[])






  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>
      <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-4">User List</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th className="p-2 border-b">Id</th>
            <th className="p-2 border-b">Name</th>
            <th className="p-2 border-b">Email</th>
            <th className="p-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="p-2 border-b">{user.id}</td>

              <td className="p-2 border-b">{user.name ? user.name : "N/A"}</td>
              <td className="p-2 border-b">{user.email}</td>
              <td className="p-2 border-b">
                <button className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     




    </div>
  );
};

export default UserManagement;
