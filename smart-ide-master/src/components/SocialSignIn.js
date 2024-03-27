import React, { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import Tilt from "react-parallax-tilt";

const SocialSignIn = () => {
  const { signInWith } = UserAuth();
  const [error, setError] = useState("");

  const signIn = async (e) => {
    setError("");
    try {
      await signInWith(e.target.id === "google");
    } catch (e) {
      setError(JSON.stringify(e, undefined, 2));
    }
  };

  return (
    <main>
      {error && <pre>error</pre>}
      <Tilt
        className="tilt"
        perspective={2000}
        glareEnable={true}
        glareMaxOpacity={0.45}
        glareColor="#ffffff"
        glareBorderRadius="2.5dvmin"
      >
        <div className="inner-element">
          <h1>Sign In</h1>
          <section>
            <img
              id="google"
              src="https://upload.wikimedia.org/wikipedia/commons/archive/5/53/20200429221626%21Google_%22G%22_Logo.svg"
              onClick={signIn}
              alt="google"
            />
            <img
              id="github"
              src="https://upload.wikimedia.org/wikipedia/commons/9/95/Font_Awesome_5_brands_github.svg"
              onClick={signIn}
              alt="github"
            />
          </section>
        </div>
      </Tilt>
    </main>
  );
};

export default SocialSignIn;
