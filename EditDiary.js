import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function EditDiary() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(''); // 날짜 상태 추가
  const [error, setError] = useState(null);
  const { id } = useParams(); // URL에서 일기 ID 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const diaryDoc = await getDoc(doc(db, 'diaries', id)); // 해당 ID의 일기 가져오기
        if (diaryDoc.exists()) {
          setContent(diaryDoc.data().content); // 기존 일기 내용 설정
          const diaryDate = diaryDoc.data().createdAt?.seconds
            ? new Date(diaryDoc.data().createdAt.seconds * 1000).toISOString().split('T')[0]
            : ''; // 기존 날짜를 ISO 형식으로 변환하여 'YYYY-MM-DD' 형식으로 설정
          setDate(diaryDate); // 날짜 설정
        } else {
          setError('일기를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('일기 조회 오류:', error);
        setError('일기를 불러오는 데 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDiary();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    try {
      await updateDoc(doc(db, 'diaries', id), {
        content, // 수정된 내용으로 업데이트
        createdAt: new Date(date), // 수정된 날짜로 업데이트
      });
      alert('일기가 수정되었습니다!');
      navigate('/MyDiaries'); // 수정 후 내 일기 목록으로 돌아가기
    } catch (error) {
      console.error('일기 수정 오류:', error);
      setError('일기 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>일기 수정</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="수정할 일기를 입력하세요..."
            required
            style={{ width: '100%', height: '150px' }}
          />
          <div style={{ marginTop: '10px' }}>
            <label>
              날짜:
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{ padding: '10px', marginTop: '10px' }}
              />
            </label>
          </div>
          <button type="submit">수정 완료</button>
        </form>
      )}
    </div>
  );
}

export default EditDiary;
