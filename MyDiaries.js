// MyDiaries.js
import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function MyDiaries() {
  const [diaries, setDiaries] = useState([]); // 일기 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiaries = async () => {
      if (!auth.currentUser) return; // 로그인한 사용자만 조회 가능

      setLoading(true);
      setError(null);

      try {
        // Firestore에서 현재 사용자의 일기 가져오기
        const q = query(
          collection(db, 'diaries'),
          where('userId', '==', auth.currentUser.uid), // 로그인한 사용자 아이디와 일치하는 일기만 가져오기
          orderBy('createdAt', 'desc') // 최신 일기부터 정렬
        );

        const querySnapshot = await getDocs(q);
        const diariesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setDiaries(diariesList); // 가져온 일기 목록 상태에 저장
      } catch (error) {
        console.error('일기 조회 오류:', error);
        setError('일기를 불러오는 데 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiaries();
  }, []); // 컴포넌트가 마운트될 때 한번만 실행

  const handleEdit = (id) => {
    navigate(`/edit-diary/${id}`); // 수정 페이지로 이동
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('이 일기를 삭제하시겠습니까?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'diaries', id)); // Firestore에서 해당 일기 삭제
        setDiaries(diaries.filter(diary => diary.id !== id)); // 상태에서 해당 일기 삭제
        alert('일기가 삭제되었습니다!');
      } catch (error) {
        console.error('일기 삭제 오류:', error);
        setError('일기 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>내 일기 목록</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : diaries.length === 0 ? (
        <p style={{ color: 'gray' }}>작성한 일기가 없습니다.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          {diaries.map((diary) => (
            <li
              key={diary.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                {/* 일기 내용 길이 제한 */}
                {diary.content.length > 100 ? `${diary.content.slice(0, 100)}...` : diary.content}
              </p>
              <small style={{ color: '#888' }}>
                {new Date(diary.createdAt.seconds * 1000).toLocaleDateString()}
              </small>
              <div style={{ marginTop: '10px' }}>
                <button onClick={() => handleEdit(diary.id)}>수정</button>
                <button onClick={() => handleDelete(diary.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyDiaries;
