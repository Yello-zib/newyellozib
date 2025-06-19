"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

const steps = [
  { name: "이메일", type: "email", key: "email", placeholder: "이메일" },
  { name: "비밀번호", type: "password", key: "password", placeholder: "비밀번호" },
  { name: "닉네임", type: "text", key: "nickname", placeholder: "닉네임" },
];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    email: "",
    password: "",
    nickname: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const router = useRouter();

  useEffect(() => {
    inputRefs[step].current?.focus();
  }, [step]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    setForm({ ...form, [steps[idx].key]: e.target.value });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Enter" && form[steps[idx].key]) {
      if (idx < steps.length - 1) {
        setStep(idx + 1);
      }
    }
  };

  const handleBlur = (idx: number) => {
    if (form[steps[idx].key] && idx < steps.length - 1) {
      setStep(idx + 1);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // 1. Supabase auth 회원가입
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });
    if (signUpError) {
      if (
        signUpError.message?.toLowerCase().includes("already registered") ||
        signUpError.message?.toLowerCase().includes("user already exists") ||
        signUpError.message?.toLowerCase().includes("email address is already in use")
      ) {
        setError("이미 가입된 계정입니다!");
      } else {
        setError(signUpError.message);
      }
      setLoading(false);
      return;
    }
    // 2. users 테이블에 추가 정보 저장
    const userId = data.user?.id;
    const userEmail = data.user?.email;
    if (userId && userEmail) {
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        email: userEmail,
        nickname: form.nickname,
      });
      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }
    console.log("users 테이블 조회 결과:", data, error);
    setSuccess("가입 확인 이메일을 보냈습니다");
    setLoading(false);
    setTimeout(() => router.push("/login"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF9E6] px-4">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-[#8B4513] mb-6">회원가입</h1>
        <form onSubmit={handleSignup} className="w-full flex flex-col gap-4">
          {steps.map((s, idx) => (
            <input
              key={s.key}
              type={s.type}
              placeholder={s.placeholder}
              className={`w-full px-4 py-2 rounded-lg border border-[#F5E6CC] focus:outline-none focus:ring-2 focus:ring-[#D2691E] text-base transition-all ${step === idx ? 'bg-[#FFF9E6]' : 'bg-white'}`}
              value={form[s.key]}
              onChange={e => handleChange(e, idx)}
              onKeyDown={e => handleKeyDown(e, idx)}
              onBlur={() => handleBlur(idx)}
              ref={inputRefs[idx]}
              required
              autoFocus={step === idx}
              disabled={loading}
            />
          ))}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#8B4513] text-white font-bold hover:bg-[#D2691E] transition-colors duration-200 mt-2"
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
        {error && <div className="mt-4 text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="mt-4 text-green-600 text-sm text-center">{success}</div>}
        <button
          className="w-full mt-4 py-2 rounded-lg bg-[#FFF9E6] border border-[#F5E6CC] text-[#8B4513] font-semibold hover:bg-[#F5E6CC] transition-colors duration-200"
          onClick={() => router.push("/login")}
        >
          로그인으로 돌아가기
        </button>
      </div>
    </div>
  );
} 