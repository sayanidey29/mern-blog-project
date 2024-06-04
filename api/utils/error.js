//CUSTOME ERROR CREATION FUNCTION
export const errorHandler = (statusCode, message) => {
  const error = new Error();
  //   console.log("error object before input", error);
  error.statusCode = statusCode;
  error.message = message;
  //   console.log("error object after input", error);
  return error;
};
