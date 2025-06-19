import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function LoginModal({ show, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!show) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      let msg = error.message.toLowerCase();
      if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
        setError("비밀번호가 정확하지 않습니다.");
      } else if (msg.includes("user not found") || msg.includes("no user found")) {
        setError("등록된 계정이 아닙니다.");
      } else if (msg.includes("email not confirmed")) {
        setError("아직 메일 승인이 완료되지 않았습니다.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    } else {
      setLoading(false);
      setError("");
      onLoginSuccess && onLoginSuccess();
      onClose();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) {
      setError("구글 로그인에 실패했습니다.");
      setLoading(false);
      return;
    }
    // 구글 로그인은 리다이렉트됨. 리다이렉트 후 users 테이블에 row가 없으면 닉네임 입력으로 이동
    // onAuthStateChange에서 처리 필요
  };

  // 구글 로그인 후 세션이 바뀌면 users 테이블에 row가 있는지 확인
  // 이 effect는 모달이 열릴 때마다 동작
  // (onAuthStateChange는 app/page.js에서 이미 사용 중이므로, 여기서는 모달 내에서만 처리)
  // 실제로는 app/page.js에서 세션 변화 감지 후 분기하는 것이 더 안전함

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm font-gmarket" onClick={onClose}>
      <div className="relative bg-[#F3FBFF] rounded-[10px] border-2 border-[#BEE3ED] shadow-2xl px-6 pt-8 pb-6 w-[260px] max-w-xs flex flex-col items-center animate-scaleIn" style={{position:'relative'}} onClick={e => { e.stopPropagation(); }}>
        <button
          className="absolute -top-5 -right-5 w-8 h-8 flex items-center justify-center text-xl text-[#5CA6C7] bg-[#E6F6FB] border border-[#BEE3ED] rounded-full hover:bg-[#D2F0FF] hover:text-[#3B7EA1] focus:outline-none transition-colors duration-150 shadow-md z-30"
          onClick={onClose}
          aria-label="닫기"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-[#3B7EA1] mb-7 mt-2 text-center font-gmarket">로그인</h2>
        <form onSubmit={handleLogin} className="w-5/6 flex flex-col space-y-4 mb-7 font-gmarket">
          <input
            type="email"
            placeholder="이메일"
            className="w-full px-3 py-2 rounded-lg border border-[#BEE3ED] focus:outline-none focus:ring-2 focus:ring-[#5CA6C7] text-sm bg-[#fff] font-gmarket"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full px-3 py-2 rounded-lg border border-[#BEE3ED] focus:outline-none focus:ring-2 focus:ring-[#5CA6C7] text-sm bg-[#fff] font-gmarket"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-[#5CA6C7] text-white hover:bg-[#3B7EA1] border border-[#BEE3ED] transition-colors duration-200 text-sm font-bold font-gmarket shadow-sm"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="w-5/6 flex flex-col gap-3 mb-2 font-gmarket">
          <button
            className="w-full py-2 rounded-lg bg-[#E6F6FB] text-[#3B7EA1] font-bold hover:bg-[#D2F0FF] border border-[#BEE3ED] transition-colors duration-200 flex items-center justify-center gap-2 text-sm font-gmarket shadow-sm"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 48 48" className="inline-block mr-2"><g><path fill="#4285F4" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.3-5.7 7-11.3 7-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.5 29.5 3.5 24 3.5 12.7 3.5 3.5 12.7 3.5 24S12.7 44.5 24 44.5c11 0 20.5-8.5 20.5-20.5 0-1.4-.1-2.7-.4-4z"/><path fill="#34A853" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.1-6.1C34.5 5.5 29.5 3.5 24 3.5c-7.2 0-13.4 3.1-17.7 8.1z"/><path fill="#FBBC05" d="M24 44.5c5.5 0 10.5-1.9 14.4-5.2l-6.6-5.4c-2 1.4-4.5 2.1-7.8 2.1-5.6 0-10.3-3.7-12-8.7l-6.6 5.1C7.7 40.7 15.3 44.5 24 44.5z"/><path fill="#EA4335" d="M43.6 20.5h-1.9V20H24v8h11.3c-.7 2-2.1 3.7-4 4.9l6.6 5.4c1.9-1.8 3.4-4 4.1-6.6.4-1.3.6-2.7.6-4.2 0-1.4-.1-2.7-.4-4z"/></g></svg>
            Google로 로그인
          </button>
          <button
            type="button"
            className="w-full text-center text-sm text-[#5CA6C7] hover:underline font-gmarket bg-transparent border-none shadow-none p-0 m-0"
            style={{ background: 'none', border: 'none', boxShadow: 'none' }}
            onClick={() => {
              onClose();
              router.push("/signup/email");
            }}
          >
            회원가입
          </button>
        </div>
        {error && <div className="mt-4 text-red-500 text-sm text-center font-gmarket">{error}</div>}
      </div>
    </div>
  );
} 