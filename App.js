// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import Signup from './Signup';
import Login from './Login';
import Diary from './Diary';
import { Link } from 'react-router-dom';
import MyDiaries from './MyDiaries';
import EditDiary from './EditDiary';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/'; // 🔹 로그아웃 후 홈으로 이동
  };

  return (
    <Router>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>{user ? `환영합니다, ${user.email}! 🎉` : '웰컴 홈페이지'}</h1>
        {!user ? (
          <>
            <p>
              <a href="/login">로그인</a> 또는 <a href="/signup">회원가입</a>하세요.
            </p>
          </>
        ) : (
          <>
            <button onClick={handleLogout}>로그아웃</button>
            <p>
            <Link to="/diary">📖 일기 작성</Link>
            </p>
            <p>
            <Link to="/MyDiaries">📖내 일기 확인</Link>
            </p>
          </>
        )}
      </div>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/diary" element={user ? <Diary /> : <Navigate to="/login" />} />
        <Route path="/mydiaries" element={user ? <MyDiaries /> : <Navigate to="/login" />} /> {/* 내 일기 확인 페이지 추가 */}
         <Route path="/edit-diary/:id" element={user ? <EditDiary /> : <Navigate to="/login" />} /> {/* 수정 페이지 라우트 추가 */}
      </Routes>
    </Router>
  );
}

export default App;
