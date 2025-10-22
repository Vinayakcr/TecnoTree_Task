import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../Context/AuthContext";

const EditUser = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { accessToken } = useContext(AuthContext);

  useEffect(() => {
    console.log("useEffect fired, id:", id);

    const fetchUser = async () => {
      try {
        console.log("Fetching user data for id:", id);
        const res = await fetch(`/api/users/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!res.ok) throw new Error("Failed to fetch user data");

        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    };

    if (accessToken) fetchUser();
  }, [id, accessToken]);

  const onSuccess = () => {
    console.log("User updated successfully");
    toast.success("User updated successfully!");
    setTimeout(() => navigate("/users"), 3000);
  };

  if (loading) {
    return (
      <p
        style={{
          textAlign: "center",
          marginTop: "50px",
          fontSize: "18px",
          color: "#555",
        }}
      >
        Loading User Data...
      </p>
    );
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <UserForm
        key={id} 
        initialValues={userData}
        mode="edit"
        userId={id}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default EditUser;
