import { Alert, Button, Spinner, TextInput } from "flowbite-react";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";

const DashProfile = () => {
  const {
    loading,
    error: errorMessage,
    currentUser,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const filePickerRef = useRef();
  const [imageFileUploadingProgress, setImageFileUploadingProgress] =
    useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  console.log("imageFileUploadingProgress", imageFileUploadingProgress);
  console.log("imageFileUploadError", imageFileUploadError);

  const handleImageChange = (e) => {
    console.log("event", e);
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
    console.log("imageFile", imageFile);
    console.log("imageFileUrl", imageFileUrl);
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
      console.log("imageFile", imageFile);
      console.log("imageFileUrl", imageFileUrl);
    }
  }, [imageFile]);
  const uploadImage = async () => {
    //---FIREBASE RULES---//
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read;
    //         allow write: if
    //         request.resource.size< 2*1024*1024 &&
    //         request.resource.contentType.matches('image/.*')
    //       }
    //     }
    //   }
    setImageFileUploading(true);
    setImageFileUploadError(null);
    console.log("uploading image...");
    const storage = getStorage(app);
    console.log("storage", storage);
    const fileName = new Date().getTime() + "_" + imageFile.name;
    console.log("fileName", fileName);
    const storageRef = ref(storage, fileName);
    console.log("storageRef", storageRef);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    console.log("uploadTask", uploadTask);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("progress", progress);
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError(
          "Could not upload image(File must be less than 2MB)"
        );
        setImageFileUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log("downloadURL", downloadURL);
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setUpdateUserSuccess(null);
    setUpdateUserError(null);
    if (Object.keys(formData)?.length === 0) {
      setUpdateUserError("No changes made");
      return; //prevent to submit the empty formValues
    }
    if (imageFileUploading) {
      setUpdateUserError("Please wait for image to upload");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/:${currentUser._id}`, {
        method: "PUT",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data?.success === false) {
        setUpdateUserError(data?.message);
        return dispatch(updateFailure(data?.message));
      }
      if (res?.ok) {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's Profile updated successfully");
      }
    } catch (error) {
      setUpdateUserError(error?.message);
      return dispatch(updateFailure(error?.message));
    }
  };
  return (
    <div className="max-w-lg mx-auto p-3 w-full font-semibold">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
          className="hidden"
          disabled={imageFileUploading}
        />
        <div
          className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadingProgress && (
            <CircularProgressbar
              value={imageFileUploadingProgress || 0}
              text={`${imageFileUploadingProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62,152,199,${
                    imageFileUploadingProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            src={imageFileUrl || currentUser.profilePicture}
            alt="user"
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadingProgress &&
              imageFileUploadingProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure" className="mt-2">
            {imageFileUploadError}
          </Alert>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading || imageFileUploading}
        >
          {loading ? (
            <div>
              <Spinner size-sm />
              <span>Updating...</span>
            </div>
          ) : (
            "Update"
          )}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5 font-semibold">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
      <div>
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}
      </div>
    </div>
  );
};

export default DashProfile;
