/* eslint-disable no-console */
export function catchAsyn(fn: any) {
  return async function (data: any) {
    let response;
    try {
      response = await fn(data);
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;

      console.log(err);
      if (err === "Not authorized as an admin") {
        document.location.href = "/login";
        // console.log("kick no");
      }
      throw new Error(err);
    }
    return response;
  };
}
