"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      let msg = error.message.toLowerCase();
      if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
        window.alert("비밀번호가 정확하지 않습니다.");
      } else if (msg.includes("user not found") || msg.includes("no user found")) {
        window.alert("등록된 계정이 아닙니다.");
      } else if (msg.includes("email not confirmed") || msg.includes("email not confirmed")) {
        window.alert("아직 메일 승인이 완료되지 않았습니다.");
      } else {
        window.alert(error.message);
      }
      setLoading(false);
      return;
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF9E6] px-4">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#8B4513] mb-6">로그인</h1>
        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
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
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <button
          className="w-full mt-4 py-2 rounded-lg bg-[#FFF9E6] border border-[#F5E6CC] text-[#8B4513] font-semibold hover:bg-[#F5E6CC] transition-colors duration-200"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </button>
        <button
          className="w-full mt-2 py-2 rounded-lg bg-[#F5E6CC] border border-[#F5E6CC] text-[#8B4513] font-semibold hover:bg-[#FFF9E6] transition-colors duration-200"
          onClick={() => router.push("/")}
        >
          뒤로가기
        </button>
        {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
      </div>
    </div>
  );
} 