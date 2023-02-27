import Wrapper from "../assets/wrappers/RegisterPage";
import { Logo, FormRow, Alert } from "../components";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/appContext";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: "",
  email: "",
  password: "",
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);

  const { isLoading, showAlert, displayAlert, user, setUpUser } =
    useAppContext();
  const navigate = useNavigate();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  // global context and useNavigate later

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = { name, email, password };
    if (isMember) {
      setUpUser({
        currentUser,
        endPoint: "login",
        alertText: "Correct credentials! Redirecting...",
      });
    } else {
      setUpUser({
        currentUser,
        endPoint: "register",
        alertText: "User Created! Redirecting...",
      });
    }
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? "Login" : "Register"}</h3>
        {showAlert && <Alert />}
        {/*name input*/}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            value={values.name}
            handleChange={handleChange}
          />
        )}
        {/*email input*/}
        <FormRow
          type="email"
          name="email"
          value={values.email}
          handleChange={handleChange}
        />
        {/*password input*/}
        <FormRow
          type="password"
          name="password"
          value={values.password}
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          submit
        </button>
        <button
            type="button"
            onClick={() => {
              setUpUser({
                currentUser: {email:'testUser@test.com', password: 'secret'},
                endPoint: "login",
                alertText: "Login succesfull! Redirecting...",
              });
            }}
            className="btn btn-block btn-hipster"
          >{isLoading? 'loading...': 'demo app'}
          </button>
        <p>
          {values.isMember ? "Not a member yet?" : "Already a member?"}

          <button type="button" onClick={toggleMember} className="member-btn">
            {values.isMember ? "Register" : "Login"}
          </button>
          
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
