const addUser = async () => {
    if (!newUserName.trim()) {
      console.error('User name is required to add a new user');
      return;
    }
  
    const newUser = {
      users_name: newUserName, // 사용자 이름만 전송
    };
  
    try {
      const response = await fetch('http://192.168.1.11/users', {
        method: 'POST',
        credentials: 'include', // 세션 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to add user: ${errorText}`);
      }
  
      console.log('User added successfully');
      setNewUserName(''); // 입력 필드 초기화
      
      // 사용자 목록 갱신
      const updatedResponse = await fetch('http://192.168.1.11/users/all', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (updatedResponse.ok) {
        const users = await updatedResponse.json();
        const names = users.map(user => user.users_name);
        setUserNames(names);
      } else {
        console.error('Failed to refresh user list');
      }
    } catch (error) {
      console.error('Error adding user: ', error);
    }
  };
  