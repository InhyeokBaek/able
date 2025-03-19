// 일기 작성 기능
import React, { useState } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp,  } from 'firebase/firestore';

function Diary() {
  const [content, setContent] = useState('');
  const [date, setDate] = useState(''); // 날짜 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return; // 내용이 없으면 제출하지 않음

    setLoading(true); // 제출 시작 시 로딩 상태로 변경
    setError(null); // 이전 에러 상태 초기화

    try {
      await addDoc(collection(db, 'diaries'), {
        content,
        createdAt: date ? new Date(date) : serverTimestamp(), // 날짜가 있으면 사용자가 지정한 날짜, 없으면 서버 시간 사용
        userId: auth.currentUser?.uid,
      });
      setContent(''); // 제출 후 텍스트 초기화
      setDate(''); // 날짜 초기화
      alert('일기가 저장되었습니다!'); // 저장 성공 알림
    } catch (error) {
      console.error('일기 저장 오류:', error);
      setError('일기를 저장하는 데 오류가 발생했습니다. 다시 시도해주세요.'); // 에러 메시지 설정
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  return (
    <div>
      <h2>일기 작성</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="오늘의 일기를 작성하세요..."
          required
          style={{ width: '70%', height: '200px', padding: '10px', marginBottom: '10px' }}
        />
         <div>
          <label>
            날짜:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ padding: '10px', marginBottom: '10px', marginTop: '10px' }}
            />
          </label>
        </div>
        <div>
          <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white' }}>
            {loading ? '저장 중...' : '저장'}
          </button>
        </div>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 메시지 표시 */}
    </div>
  );
}

export default Diary;
