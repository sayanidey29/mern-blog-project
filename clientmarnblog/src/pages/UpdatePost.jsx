import {
  Alert,
  Button,
  FileInput,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const UpdatePost = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadLoading, setImageUploadLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [imageUploadSuccessful, setImageUploadSuccessful] = useState(null);
  const [publishError, setPublishError] = useState(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(null);
  const [publishSuccessData, setPublishSuccessData] = useState(null);
  // console.log("formData", formData);
  console.log("postid", postId);

  useEffect(() => {
    try {
      const fetchpost = async () => {
        const res = await fetch(`/api/post/getPosts?postId=${postId}`);
        console.log("resget", res);
        const data = await res.json();
        if (data?.success === false) {
          console.log(data?.message);
          setPublishError(data?.message);
          return;
        }
        if (res?.ok) {
          setPublishError(null);
          setFormData(data.posts[0]);
        }
      };
      fetchpost();
    } catch (error) {
      setPublishError(error?.message);
      console.log(error?.message);
      return;
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      setImageUploadLoading(true);
      if (!file) {
        setImageUploadLoading(false);
        setImageUploadProgress(null);
        setImageUploadError("Please select an image");
        setImageUploadSuccessful(null);
        return;
      }
      setImageUploadSuccessful(null);
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
          setImageUploadError(null);
          setImageUploadSuccessful(null);
        },
        (error) => {
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
          setImageUploadLoading(false);
          setImageUploadSuccessful(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setImageUploadLoading(false);
            setImageUploadSuccessful("Image uploaded Successfully");
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadProgress(null);
      setImageUploadLoading(false);
      setImageUploadSuccessful(null);
      return setImageUploadError(error?.messagre);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setPublishLoading(true);
      setPublishSuccess(null);
      setPublishSuccessData(null);
      setPublishError(null);
      const res = await fetch(
        `/api/post/updatePosts/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      console.log(res, "response");
      const data = await res.json();
      setPublishLoading(false);
      console.log("data", data);
      if (data.success === false) {
        setPublishSuccess(null);
        setPublishLoading(false);
        setPublishSuccessData(null);
        console.log(data);
        return setPublishError(data.message);
      }
      if (res.ok) {
        setPublishSuccess("Post is Submitted Successfully");
        setPublishSuccessData(data);
        setPublishLoading(false);
        setPublishError(null);
        console.log("updated data", data);
        navigate(`/post-page/${data.slug}`);
      }
    } catch (error) {
      setPublishSuccess(null);
      setPublishLoading(false);
      setPublishSuccessData(null);
      console.log(error);
      return setPublishError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            required
            className="flex-1"
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value });
              setPublishSuccess(null);
              setPublishLoading(false);
              setPublishError(null);
            }}
            disabled={publishLoading}
            value={formData.title}
          />
          <Select
            disabled={publishLoading}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              setPublishSuccess(null);
              setPublishLoading(false);
              setPublishError(null);
            }}
            value={formData.category}
          >
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            disabled={
              imageUploadProgress || imageUploadLoading || publishLoading
            }
            onChange={(e) => {
              console.log("e", e);
              setImageUploadError(null);
              setImageUploadProgress(null);
              setImageUploadSuccessful(null);
              setImageUploadLoading(false);
              setPublishSuccess(null);
              setPublishLoading(false);
              setPublishError(null);
              setFile(e.target.files[0]);
            }}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToPink"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={
              imageUploadProgress || imageUploadLoading || publishLoading
            }
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : imageUploadLoading ? (
              <div>
                <Spinner size="sm" />
                <span>Uploading...</span>
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>
        {imageUploadError && (
          <Alert color="failure" className="my-2">
            {imageUploadError}
          </Alert>
        )}
        {imageUploadSuccessful && (
          <Alert color="success" className="my-2">
            {imageUploadSuccessful}
          </Alert>
        )}
        {formData?.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write Something..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
            setPublishSuccess(null);
            setPublishLoading(false);
            setPublishError(null);
          }}
          disabled={publishLoading}
          value={formData.content}
        />
        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          size="lg"
          className="mb-3"
          disabled={imageUploadProgress || imageUploadLoading || publishLoading}
        >
          {publishLoading ? (
            <div>
              <Spinner size="sm" />
              <span>updating...</span>
            </div>
          ) : (
            "Update Post"
          )}
        </Button>
        {publishError && (
          <Alert color="failure" className="my-3">
            {publishError}
          </Alert>
        )}
        {publishSuccess && (
          <Alert color="success" className="my-3">
            {publishSuccess}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default UpdatePost;
