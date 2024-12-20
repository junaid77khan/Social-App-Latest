import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UploadAvatar() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    try {
      const { files } = e.target;
      if (files.length > 0) {
        setAvatar(files);
      } else {
        setAvatar(null);
      }
    } catch (error) {
      console.log("Something went wrong while uploading avatar", error);
      setAvatar(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", avatar[0]);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/set-avatar`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload avatar. Please try again later.');
      }

      const dataFromServer = await response.json();

      navigate('/');
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    try {
      if (avatar) {
        window.location.reload();
        setAvatar(null);
      }
    } catch (error) {
      console.log("Something went wrong while removing avatar", error);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black opacity-75 flex justify-center items-center z-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      )}

      <div className="flex flex-col h-screen justify-center items-center bg-gray-900 text-xs md:text-lg">
        <div className="bg-gray-800 p-10 rounded-lg shadow-xl max-w-md w-full flex flex-col items-center">
          <h2 className="text-3xl font-semibold text-orange-500 mb-6">Set Avatar</h2>

          <img
            className="h-24 w-24 rounded-full object-fill object-center mb-4"
            src={avatar ? URL.createObjectURL(avatar[0]) : `/image/null-avatar.png`}
            alt="Profile Image"
          />

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div
                onClick={handleRemove}
                className="cursor-pointer bg-gray-500 text-white py-2 px-4 text-sm rounded-md border hover:bg-gray-600 focus:outline-none transition duration-300"
              >
                Remove
              </div>

              <label
                htmlFor="avatar"
                className="cursor-pointer bg-orange-500 text-white py-2 px-4 text-sm rounded-md border border-orange-500 hover:bg-orange-600 focus:outline-none focus:bg-orange-600 transition duration-300"
              >
                Upload
              </label>
            </div>

            <input
              onChange={handleInput}
              type="file"
              name="avatar"
              id="avatar"
              className="hidden"
            />

            {avatar && (
              <button
                type="submit"
                className="bg-orange-500 text-white font-semibold py-2 px-4 text-sm rounded-md hover:bg-orange-600 transition duration-300"
              >
                Save
              </button>
            )}
          </form>

          <div
            className="text-orange-300 font-semibold cursor-pointer underline mt-2"
            onClick={() => navigate("/")}
          >
            Later
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadAvatar;
