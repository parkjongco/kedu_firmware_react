import axios from 'axios';


export default function AuthTest() {
    axios.defaults.withCredentials = true;

    const session = sessionStorage;
    
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    axios.get(`${serverUrl}:18000/auth/vaildation`, { params : { 
        usersSeq : session.getItem('usersSeq') ,
        loginID : session.getItem('loginID') ,
        usersName : session.getItem('usersName') ,
        employeeId : session.getItem('employeeId') ,
        rank : session.getItem('rank') ,
        isAdmin : session.getItem('isAdmin') 
     }})
    .then(response => {
        console.log(response);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

  return (
    <>
    </>
  );
};
