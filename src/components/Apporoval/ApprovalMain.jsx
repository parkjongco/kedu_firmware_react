import Header from "../Header/Header";
import SideBar from "../Sidebar/Sidebar";
import ApprovalModal from "./ApprovalModal/ApprovalModal";
import ApprovalMainContents from "./ApprovalMainContent/ApprovalMainContents";
import MainContent from "../MainContent/MainContent";

const Approval = () => {
    return (
      <div className="app">
        <Header />
        <div className="container">
          <SideBar />
          <ApprovalMainContents/>
        </div>
      </div>
    );
  };

export default Approval;