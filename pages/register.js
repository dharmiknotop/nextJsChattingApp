import styles from "../styles/register.module.scss";
import { useEffect, useState } from "react";
import inputValidation from "../src/commonFiles/inputValidation";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { authUserAtom } from "../src/recoil/recoil";
import Image from "next/image";
import { RiAlertFill } from "react-icons/ri";

const Register = () => {
  const router = useRouter();

  const [requestPostData, setRequestPostData] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const [showBtn, setShowBtn] = useState(true);

  const [selectedImage, setSelectedImage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formDataError, setFormDataError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useRecoilState(authUserAtom);

  const uploadDetails = () => {
    if (!validateForm()) {
      return;
    }

    register();
  };

  const validateForm = async () => {
    let hasError = false;

    let tempError = {
      name: "",
      email: "",
      password: "",
    };

    // tempError.name = inputValidation.isInputEmpty(formData.name);
    // if (tempError.name !== "") {
    //   hasError = true;
    //   setShowBtn(false);
    // }

    // tempError.email = inputValidation.isInputEmailValid(formData.email);
    // if (tempError.email !== "") {
    //   hasError = true;
    //   setShowBtn(false);
    // }

    // tempError.password = inputValidation.isInputPasswordValid(
    //   formData.password
    // );
    // if (tempError.password !== "") {
    //   hasError = true;
    //   setShowBtn(false);
    // }
    setFormDataError({
      ...tempError,
    });

    return hasError;
  };

  const register = async () => {
    setRequestPostData({
      loading: true,
      success: "",
      error: "",
    });

    let logoUrl;

    if (selectedImage) {
      logoUrl = await getImageUrl();
    }

    try {
      const res = await axios.post(
        `api/auth/register`,
        { ...formData, logoUrl },
        {
          withCredentials: true,
        }
      );
      setUser({
        id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        logoUrl: res.data.data.logoUrl,
      });

      setRequestPostData({
        loading: false,
        success: "sign up done succesfully.",
        error: "",
      });

      router.push("/");
    } catch (error) {
      console.log("error: ", error);
      setRequestPostData({
        loading: false,
        success: "",
        error: "Some unexpected error occur.",
      });
    }
  };

  const getImageUrl = async () => {
    const form = new FormData();

    form.append("file", selectedImage);
    form.append("upload_preset", "weChat");
    form.append("cloud_name", "dflwrsxue");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dflwrsxue/image/upload`,
      { method: "POST", body: form }
    );
    const res2 = await res.json();

    return res2.url;
  };

  const logInWithDefaultUser = async () => {
    setRequestPostData({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const res = await axios.post(
        `api/auth/login`,
        {
          name: "Default User",
          email: "Default User",
          password: "Default User",
        },
        {
          withCredentials: true,
        }
      );
      setUser({
        id: res.data.data._id,
        name: res.data.data.name,
        email: res.data.data.email,
        logoUrl: res.data.data.logoUrl,
        isLoggedIn: "true",
      });

      console.log(res.data.data);

      setRequestPostData({
        loading: true,
        success: "sign up done succesfully.",
        error: "",
      });

      console.log(user);

      router.push("/");
      setRequestPostData({
        loading: false,
        success: "sign up done succesfully.",
        error: "",
      });
    } catch (error) {
      console.log("error: ", error);
      if (error.response) {
        setRequestPostData({
          loading: false,
          success: "",
          error: error.response.data.message,
        });
      } else {
        setRequestPostData({
          loading: false,
          success: "",
          error: "Something went wrong",
        });
      }
    }
  };

  return (
    <div className={styles.s}>
      <div className={styles.s__registerContainer}>
        <h2 className={styles.s__title}>Sign up to your account</h2>
        <h3 className={styles.s__subTitle}>
          Create a account to chat with the world.
        </h3>
        <div className={styles.s__inputContainer}>
          <label>Name</label>
          <input
            type="text"
            onChange={(val) => {
              setShowBtn(true);
              setFormData({
                ...formData,
                name: val.target.value,
              });
            }}
          />

          {formDataError.name !== "" && (
            <span className={styles.errorMessage}>Please Enter Name</span>
          )}
        </div>
        <div className={styles.s__inputContainer}>
          <label>Email</label>
          <input
            type="text"
            onChange={(val) => {
              setShowBtn(true);
              setFormData({
                ...formData,
                email: val.target.value,
              });
            }}
          />
          {formDataError.email !== "" && (
            <span className={styles.errorMessage}>
              Please Enter Valid Email
            </span>
          )}
        </div>
        <div className={styles.s__inputContainer}>
          <label>Password</label>
          <input
            type="text"
            onChange={(val) => {
              setShowBtn(true);
              setFormData({
                ...formData,
                password: val.target.value,
              });
            }}
          />
          {formDataError.password !== "" && (
            <span className={styles.errorMessage}>
              Please Enter Valid password
            </span>
          )}
        </div>
        <div className="mt-2">
          <label>User Logo</label>
          <input
            type="file"
            accept=".jpg,.png,.jpeg"
            onChange={(e) => {
              setSelectedImage(e.target.files[0]);
            }}
            className="mt-2"
          />
          {formDataError.email !== "" && (
            <span className={styles.errorMessage}>
              Please Enter Valid Email
            </span>
          )}
        </div>
        {requestPostData.loading && (
          <div className="text-center pt-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        )}
        {!requestPostData.loading && requestPostData.error !== "" && (
          <div className={`${styles.errorMessageContainer}`}>
            <div className={`${styles.errorMessageContainer__errorMessage}`}>
              <RiAlertFill className="me-2" />
              {requestPostData.error}
            </div>
          </div>
        )}

        {!requestPostData.loading && requestPostData.success !== "" && (
          <div className="text-center pt-2">
            <div className="text-success">{requestPostData.success}</div>
          </div>
        )}
        <div className={styles.s__btnContainer}>
          <button
            className={`${
              formData.name !== "" &&
              formData.email !== "" &&
              formData.password !== "" &&
              showBtn
                ? styles.s__activeBtn
                : styles.s__notActiveBtn
            }`}
            onClick={() => {
              uploadDetails();
            }}
          >
            {" "}
            get started
          </button>
          <button
            className={`${styles.s__defaultUserBtn}`}
            onClick={() => {
              logInWithDefaultUser();
            }}
          >
            Default User
          </button>
        </div>
        <span className={`${styles.s__alreadyHaveAnAccTxt}`}>
          Have an account ?{" "}
          <Link href="/login">
            <a> Log In</a>
          </Link>
        </span>
      </div>

      <div className={styles.s2__backgroundImgContainer}>
        <Image
          className={styles.s2__backgroundImg}
          src="/img/register/backgroundImg.png"
          alt=""
          layout="fill"
        />{" "}
        <h5 className={styles.s2__backgroundImgContainer__title}>
          Get started with account
        </h5>
        <h6 className={styles.s2__backgroundImgContainer__subTitle}>
          Communication has never been this
          <br /> easy, you re just one click far to use this.
          <br />
          log in if already registered.
        </h6>
        <Link href="/login">
          <a>
            <div className={styles.s2__backgroundImgContainer__logInTxt}>
              Log in to your account
              <div className={styles.s2__underline}></div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Register;
