"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function TestPage() {
  const [status, setStatus] = useState('테스트 중...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus('Supabase 연결 테스트 중...');
        
        // 1. 기본 연결 테스트
        const { data, error: sessionError } = await supabase.auth.getSession();
        console.log('세션 테스트 결과:', { data, error: sessionError });
        
        if (sessionError) {
          throw new Error(`세션 오류: ${sessionError.message}`);
        }
        
        setStatus('연결 성공! 세션 정보: ' + JSON.stringify(data, null, 2));
        
      } catch (err) {
        console.error('Supabase 연결 오류:', err);
        setError(err.message);
        setStatus('연결 실패');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF9E6] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-[#8B4513] mb-4">Supabase 연결 테스트</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">상태: {status}</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>오류:</strong> {error}
            </div>
          )}
          
          <div className="mt-4">
            <h3 className="font-semibold mb-2">환경 변수 확인:</h3>
            <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '설정됨' : '설정되지 않음'}</p>
            <p>Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 