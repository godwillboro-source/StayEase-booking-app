const ErrorMessage = ({ message = "Something went wrong." }) => {
  return (
    <div className="error-container">
      <p className="error-message">{message}</p>
    </div>
  );
};

export default ErrorMessage;