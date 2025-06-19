"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupEmailPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    // 이메일, 비밀번호를 쿼리스트링으로 전달 (보안상 실제 서비스에서는 state 관리 권장)
    router.push(`/signup/nickname?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF9E6] px-4">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#8B4513] mb-6">회원가입 - 1단계</h1>
        <form onSubmit={handleNext} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-4 py-2 rounded-lg border border-[#F5E6CC] focus:outline-none focus:ring-2 focus:ring-[#D2691E] text-base"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-4 py-2 rounded-lg border border-[#F5E6CC] focus:outline-none focus:ring-2 focus:ring-[#D2691E] text-base"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#8B4513] text-white font-bold hover:bg-[#D2691E] transition-colors duration-200 mt-2"
          >
            다음
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
      </div>
    </div>
  );
} 