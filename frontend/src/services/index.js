import API from "./axios";

export const getDriveData = async (
  pageSize = 10,
  pageToken,
  handleLoading,
  handleData
) => {
  try {
    const response = await API.post("api/v1/gdrive", { pageSize, pageToken });
    handleData(response.data);
  } catch (error) {
    console.log("ERROR", error?.response?.data?.errors);
  } finally {
    handleLoading(false);
  }
};
