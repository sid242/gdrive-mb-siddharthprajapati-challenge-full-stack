import { lazy } from "react";
import "./App.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "../clientConfig";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getDriveData } from "./services";
import { driveTableColumns } from "./constant/table";
import SvgIcon from "./assets/SvgIcon";

const Table = lazy(() => import("./components/Table"));
const Login = lazy(() => import("./components/Login"));

function App() {
  const [clientId, setClientId] = useState(GOOGLE_CLIENT_ID ?? "");
  const [driveData, setDriveData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const handleLoading = (value) => setIsLoading(value);

  const handleDriveData = (data) => {
    setDriveData((prev) => [...prev, ...data.data.files]);
    setNextPageToken(data.data.nextPageToken);
  };

  const doGetDriveData = async (
    pageSize,
    pageToken,
    handleLoading,
    handleData
  ) => {
    await getDriveData(pageSize, pageToken, handleLoading, handleData);
  };

  useEffect(() => {
    if (userInfo?.googleAccessToken) {
      handleLoading(true);
      doGetDriveData(10, "", handleLoading, handleDriveData);
    }

    return () => {
      setDriveData([]);
      setNextPageToken("");
    };
  }, [userInfo?.googleAccessToken]);

  const tableData = driveData?.map((item) => {
    return {
      id: item?.id,
      name: item?.name,
      mimeType: item?.mimeType,
      size: `${(parseInt(item?.size, 10) / 1024).toFixed(2, 0)} KB`,
    };
  });

  const loadMoreData = () => {
    if (userInfo?.googleAccessToken) {
      handleLoading(true);
      doGetDriveData(10, nextPageToken, handleLoading, handleDriveData);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="container m-auto">
        <h2 className="mb-4">Google Drive</h2>
        {clientId && <Login />}
        {userInfo?.googleAccessToken ? (
          <Table
            columns={driveTableColumns}
            data={tableData}
            total={50}
            loading={isLoading}
            loadMoreData={loadMoreData}
          />
        ) : (
          <>
            <h3 className="mt-5">
              To view your google drive data please click on google login
            </h3>
            <SvgIcon type="data-icon" className="w-[600px] h-[500px]" />
          </>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
