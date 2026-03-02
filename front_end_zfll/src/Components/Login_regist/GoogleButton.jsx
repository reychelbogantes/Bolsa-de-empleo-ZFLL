const GoogleButton = () => {
  return (
    <button
      type="button"
      className="google-btn"
      onClick={() =>
        (window.location.href =
          "http://localhost:8000/api/auth/google/login/")
      }
    >
      Continuar con Google
    </button>
  );
};

export default GoogleButton;