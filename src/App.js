<<<<<<< HEAD
<<<<<<< HEAD
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Approval from './component/approval/approval';
function App() {
    return(
        <Approval></Approval>
    );
}

export default App;
=======
=======
>>>>>>> a574bd1c6534669858ef6abc79f40da945378dbf
import React from 'react';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';



import './App.css';

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="container">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default App;
>>>>>>> 9f815757b006796e7c8873034f5308ce52bf2f2d
=======
export default App;
>>>>>>> a574bd1c6534669858ef6abc79f40da945378dbf
