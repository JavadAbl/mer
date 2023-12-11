import { useState, useRef, useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  userUpdateAction,
  userClearUpdated,
  userDeleteAction,
} from "../../redux/slices/user.slice";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import styles from "./EditProfile.module.css";
import Navbar from "../../components/navBar/Navbar";
import Spacer from "../../components/Spacer";
import Spinner from "../../components/spinner/Spinner";
import { Dialog } from "react-dialog-element";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

// Main Function----------------------------------------
export default function EditProfile({ attr }) {
  const dispatch = useDispatch();
  const userStore = useSelector((store) => store.users);
  const user = userStore.user;
  const navigate = useNavigate();

  // Store effect----------------------------------------
  useEffect(() => {
    if (!userStore.auth) navigate("/");

    if (userStore.updated) {
      dispatch(userClearUpdated());
      navigate(-1);
    }

    if (userStore.deleted) {
      dispatch(userClearUpdated());
      navigate("/");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.updated, userStore.deleted]);

  // Formik----------------------------------------
  const formik = useFormik({
    initialValues: {
      name: user?.name || "",
      bio: user?.bio || "",
      image: undefined,
    },
    onSubmit: (values) => {
      dispatch(userUpdateAction(values));
    },
  });

  // Bio length----------------------------------------
  const bioRef = useRef();
  const BIO_MAX_LENGTH = 100;
  const [bioLengthLeft, setBioLengthLeft] = useState(BIO_MAX_LENGTH);

  useEffect(() => {
    setBioLengthLeft(BIO_MAX_LENGTH - bioRef.current?.textContent.length);
  }, [formik.values.bio]);

  // Image Dialog----------------------------------------
  const imageReducer = (state, action) => {
    switch (action.type) {
      case "open":
        if (!action.payload && filePickerRef.current)
          filePickerRef.current.value = "";
        return {
          ...state,
          open: action.payload,
        };

      case "dataUrl":
        return {
          ...state,
          dataUrlImage: action.payload,
          open: true,
        };

      case "crop":
        return {
          ...state,
          croppedImage: action.payload,
          open: false,
        };

      default:
        return state;
    }
  };

  const filePickerRef = useRef();
  const cropperRef = useRef();
  const [imageState, imageDispatch] = useReducer(imageReducer, {
    open: false,
    dataUrlImage: undefined,
    croppedImage: undefined,
  });

  formik.values.image = imageState.croppedImage;

  const imageDialog = () => {
    return (
      <dialog className={styles.dialog_image_container} open={imageState.open}>
        <Cropper
          className={styles.dialog_image_picker}
          src={imageState.dataUrlImage}
          initialAspectRatio={1 / 1}
          aspectRatio={1 / 1}
          background={undefined}
          guides={false}
          zoomable={false}
          movable={false}
          autoCropArea={0.7}
          ref={cropperRef}
        />

        <div className={styles.btn_container}>
          <button
            className={`${styles.btn} ${styles.btn_sec}`}
            type="button"
            onClick={() => imageDispatch({ type: "open", payload: false })}
          >
            Cancel
          </button>

          <button
            className={`${styles.btn} ${styles.btn_pri}`}
            type="button"
            onClick={() => {
              cropperRef.current?.cropper
                ?.getCroppedCanvas({
                  width: 350,
                  height: 350,
                  fillColor: "#fff",
                })
                .toBlob((blob) => {
                  const croppedImage = new File([blob], `${user._id}`, {
                    type: "image/jpeg",
                  });

                  imageDispatch({ type: "crop", payload: croppedImage });
                });
            }}
          >
            Select
          </button>
        </div>
      </dialog>
    );
  };

  // Delete Dialog----------------------------------------
  const deleteReducer = (state, action) => {
    switch (action.type) {
      case "open":
        return {
          ...state,
          open: action.payload,
        };
      case "confirm":
        return {
          ...state,
          confirm: action.payload,
        };

      default:
        return state;
    }
  };

  const [deleteState, deleteDispatch] = useReducer(deleteReducer, {
    open: false,
    confirm: false,
  });

  const DELETE_CONFIRM_VALUE = "Delete";

  const deleteFormik = useFormik({
    initialValues: {
      confirm: "",
    },
    onSubmit: () => {
      dispatch(userDeleteAction({ userId: userStore.user._id }));
    },
  });

  const deleteDialog = () => {
    return (
      <Dialog
        setOpen={(open) => deleteDispatch({ type: "open", payload: open })}
        isOpen={deleteState.open}
      >
        <div>
          <form
            className={`${styles.delete_form}`}
            onSubmit={deleteFormik.handleSubmit}
          >
            <p className={`${styles.delete_label}`}>
              To confirm, type{" "}
              <span style={{ color: "red", fontWeight: "bold" }}>Delete</span>{" "}
              in the box:
            </p>

            <Spacer display="block" vertical={"0.5rem"} />

            <input
              className={`${styles.delete_input}`}
              type="text"
              value={deleteFormik.values.confirm}
              name="confirm"
              onChange={(e) => {
                if (e.target.value === DELETE_CONFIRM_VALUE)
                  deleteDispatch({ type: "confirm", payload: true });
                else deleteDispatch({ type: "confirm", payload: false });

                deleteFormik.handleChange(e);
              }}
            />

            <Spacer display="block" vertical={"2rem"} />

            <div className={styles.btn_container}>
              <button
                className={`${styles.btn} ${styles.btn_sec}`}
                onClick={() => deleteDispatch({ type: "open", payload: false })}
                type="button"
                disabled={userStore.deleteLoading}
              >
                Cancel
              </button>

              <Spacer horizontal={"0.5rem"} />

              <button
                className={`${styles.btn} ${styles.btn_pri}`}
                type="submit"
                disabled={!deleteState.confirm || userStore.deleteLoading}
              >
                {userStore.deleteLoading ? (
                  <Spinner center={false} style={{ height: "100%" }} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </form>
        </div>
      </Dialog>
    );
  };

  // Component----------------------------------------
  if (!user) return null;

  return (
    <div className={styles.container} {...attr}>
      <Navbar />

      {deleteState.open ? deleteDialog() : null}
      {imageState.open ? imageDialog() : null}

      <div className={styles.content_container}>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            src={user.profilePicture}
            alt={user.userName}
          />
          <h1 className={styles.userName}>{user.userName}</h1>
        </div>
        {/* Form---------------------------------------- */}
        <form
          className={styles.form_container}
          encType="multipart/form-data"
          onSubmit={formik.handleSubmit}
        >
          {/* Email---------------------------------------- */}
          <div className={styles.field_container}>
            <label>Email:</label>
            <Spacer display="block" vertical={"0.5rem"} />
            <input
              className={`${styles.input} ${styles.input_ro}`}
              value={user.email}
              type="text"
              title="Cant change email"
              readOnly
            />
          </div>
          {/* Name---------------------------------------- */}
          <div className={styles.field_container}>
            <label>Name:</label>
            <Spacer display="block" vertical={"0.5rem"} />
            <input
              className={styles.input}
              value={formik.values.name}
              onBlur={formik.handleBlur("name")}
              onChange={formik.handleChange("name")}
              type="text"
            />
          </div>

          {/* Bio---------------------------------------- */}
          <div className={styles.field_container}>
            <label>Bio:</label>
            <Spacer display="block" vertical={"0.5rem"} />
            <textarea
              className={styles.input}
              ref={bioRef}
              value={formik.values.bio}
              onChange={formik.handleChange("bio")}
              onBlur={formik.handleBlur("bio")}
              maxLength={BIO_MAX_LENGTH}
              rows={6}
            />
            <br />
            <span className={styles.bio_counter}>
              {bioLengthLeft} character left
            </span>
          </div>

          {/* File Picker---------------------------------------- */}
          <div className={styles.field_container}>
            <label>Profile Picture:</label>
            <Spacer display="block" vertical={"0.5rem"} />
            <input
              onBlur={formik.handleBlur("image")}
              ref={filePickerRef}
              onChange={(e) => {
                const rawFile = e.target.files[0];
                if (!rawFile) return;

                const reader = new FileReader();
                reader.readAsDataURL(rawFile);
                reader.onloadend = () => {
                  imageDispatch({ type: "dataUrl", payload: reader.result });
                };
              }}
              type="file"
              accept="image/*"
              size={1}
            />
          </div>

          {/* Buttons---------------------------------------- */}
          <div className={`${styles.field_container}`}>
            {userStore.updateError ? <p>An error happens..</p> : null}
            <span className={`${styles.btn_container}`}>
              <Spacer horizontal={"0.2rem"} />

              <button
                className={`${styles.btn} ${styles.btn_pri} ${styles.btn_alert}`}
                type="button"
                onClick={() => deleteDispatch({ type: "open", payload: true })}
              >
                Delete Account
              </button>

              <div className={styles.btn_container_dummy}></div>

              <button
                className={`${styles.btn_sec} ${styles.btn}`}
                value={"Cancel"}
                type="button"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>

              <button
                className={`${styles.btn_pri} ${styles.btn}`}
                type="submit"
              >
                {userStore.updateLoading ? (
                  <Spinner
                    center={false}
                    attr={{ style: { height: "100%" } }}
                  />
                ) : (
                  "Update Profile"
                )}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
