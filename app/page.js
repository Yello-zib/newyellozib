"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import LoginModal from "./components/LoginModal";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const menuItems = [
    { name: "HOME", path: "/" },
    { name: "PRODUCTS", path: "/products" },
    { name: "PEEKYDAY", path: "/peekyday" },
    { name: "GUESTBOOK", path: "/guestbook" },
    { name: "ABOUT", path: "/about" },
    { name: "ORDER", path: "/order" },
  ];

  useEffect(() => {
    const getUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        setIsLoggedIn(false);
        setNickname("");
        setUserId("");
        setLoading(false);
        return;
      }
      setIsLoggedIn(true);
      setUserId(session.user.id);
      const { data, error } = await supabase
        .from("users")
        .select("nickname")
        .eq("id", session.user.id)
        .single();
      console.log("users 테이블 조회 결과:", data, error);
      if (data && data.nickname) {
        setNickname(data.nickname);
        console.log("닉네임:", data.nickname);
      } else {
        setNickname("");
        console.log("닉네임 없음 또는 빈 값");
        if (session.user?.email && session.user?.id) {
          if (!window.location.pathname.startsWith("/signup/nickname")) {
            window.location.href = `/signup/nickname?google=1`;
            return;
          }
        }
      }
      setLoading(false);
    };

    getUserInfo();

    // 세션 변화 감지
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getUserInfo();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9E6]">
        <div className="text-lg text-[#8B4513] font-bold">로딩 중...</div>
      </div>
    );
  }

  // 로그아웃 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setNickname("");
    router.push("/");
  };

  return (
    <main className="min-h-screen w-full bg-[#FFF9E6] flex flex-col items-center justify-center px-0 py-0 overflow-x-hidden">
      {/* 웰컴 메시지 섹션 */}
      <div className="w-full max-w-[600px] text-center mb-10 animate-fadeIn bg-transparent">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#8B4513] mb-6 font-gmarket whitespace-nowrap">
          {isLoggedIn && nickname
            ? <span className="font-gmarket">{`반가워요, ${nickname}님!`}</span>
            : (
              <span className="font-gmarket">
                <span className="font-futura">YELLO.zib</span>에 오신 것을 환영합니다!
              </span>
            )
          }
        </h1>
        <p className="text-[#D2691E] text-3xl sm:text-4xl md:text-5xl tracking-wider italic drop-shadow-sm font-futura mb-4">
          &quot;keep your own moment!&quot;
        </p>
      </div>

      {/* 로그인/로그아웃 버튼 (이동) */}
      <div className="w-full max-w-[600px] flex justify-center items-center gap-4 mb-8">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg shadow hover:bg-[#D2691E] transition-colors duration-300 font-semibold hidden"
          >
            로그아웃
          </button>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-[#8B4513] text-white rounded-lg shadow hover:bg-[#D2691E] transition-colors duration-300 font-semibold hidden"
          >
            로그인
          </button>
        )}
      </div>

      {/* 로그인 모달 */}
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          // 로그인 성공 시 세션 갱신을 위해 새로고침
          window.location.reload();
        }}
      />

      {/* 메인 하우스 일러스트 컨테이너 */}
      <div className="relative w-full max-w-[600px] aspect-[1080/1350] mb-10 bg-transparent">
        {/* 배경 이미지 */}
        <Image
          src="/images/house.png"
          alt="Yello's Zib House"
          fill
          className="object-contain"
          priority
        />
        
        {/* 굴뚝 - 메뉴 */}
        <div
          className="absolute w-[14.8%] h-[25.8%] top-[12.3%] left-[17.4%] z-30 pointer-events-auto group cursor-pointer"
          onClick={() => setShowMenu(true)}
          title="메뉴 열기"
        >
          <Image
            src="/images/chimney.png"
            alt="굴뚝"
            fill
            className="w-full h-full object-contain group-hover:hidden translate-y-[17%] pointer-events-none"
          />
          <Image
            src="/images/chimney-hover.png"
            alt="굴뚝 (호버)"
            fill
            className="w-full h-full object-contain hidden group-hover:block translate-y-[1%] pointer-events-none"
          />
        </div>

        {/* 창문 - 일력 */}
        <div className="absolute w-[24.1%] h-[19.3%] top-[38.2%] left-[38.8%] z-10">
          <Link
            href="/peekyday"
            className="relative w-full h-full group cursor-pointer block"
            title="오늘의 일력 보기"
          >
            <Image
              src="/images/window.png"
              alt="창문"
              fill
              className="w-full h-full object-contain group-hover:hidden"
            />
            <Image
              src="/images/window-hover.png"
              alt="창문 (호버)"
              fill
              className="w-full h-full object-contain hidden group-hover:block"
            />
          </Link>
        </div>

        {/* 문 - 소개 */}
        <div className="absolute w-[26.6%] h-[24.4%] top-[60.5%] left-[38.8%] z-10">
          <Link
            href="/about"
            className="relative w-full h-full group cursor-pointer block"
            title="브랜드 소개"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src="/images/door.png"
                alt="문"
                width={100}
                height={100}
                className="w-[95%] h-[95%] object-contain group-hover:hidden -translate-x-[5%] -translate-y-[5%]"
              />
              <Image
                src="/images/door-hover.png"
                alt="문 (호버)"
                fill
                className="w-full h-full object-contain hidden group-hover:block"
              />
            </div>
          </Link>
        </div>

        {/* 우체통 - 문의 */}
        <div className="absolute w-[25.5%] h-[22.4%] top-[61.3%] left-[68.0%] z-10">
          <Link
            href="/contact"
            className="relative w-full h-full group cursor-pointer block"
            title="문의하기"
          >
            <Image
              src="/images/mailbox.png"
              alt="우체통"
              fill
              className="w-full h-full object-contain group-hover:hidden"
            />
            <Image
              src="/images/mailbox-hover.png"
              alt="우체통 (호버)"
              fill
              className="w-full h-full object-contain hidden group-hover:block"
            />
          </Link>
        </div>
      </div>

      {/* 푸터 섹션 */}
      <footer className="w-full max-w-[600px] mt-10 text-center bg-transparent">
        <div className="flex flex-col items-center gap-4 mb-4">
          <div className="flex flex-row justify-center items-center gap-6">
            <Link
              href="https://instagram.com/yello.zib"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#8B4513] hover:text-[#D2691E] transition-colors duration-300"
            >
              Instagram
            </Link>
            <Link
              href="https://blog.naver.com/yello.zib"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[#8B4513] hover:text-[#D2691E] transition-colors duration-300"
            >
              Blog
            </Link>
          </div>
        </div>
        <div className="text-[#c1a78f] text-xs">
          <p>Copyright © {new Date().getFullYear()} YELLO.zib. All rights reserved.</p>
          <p className="mt-1">Powered by Next.js</p>
        </div>
      </footer>

      {/* 메뉴 오버레이 */}
      {showMenu && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
          onClick={() => setShowMenu(false)}
        >
          <div
            className="relative bg-[#F5E6CC] rounded-[10px] border-2 border-[#3D2B1F] shadow-2xl px-6 pt-8 pb-6 w-[230px] max-w-xs z-[10000] animate-scaleIn"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col w-full items-center mt-2 mb-6 gap-y-4 text-center justify-center">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="w-full text-center mx-auto text-[#8B4513] hover:text-[#D2691E] transition-all duration-200 p-4 text-lg font-bold cursor-pointer hover:bg-[#FFF9E6] rounded-xl hover:scale-105 active:scale-95 shadow-md no-underline hover:underline"
                  onClick={() => setShowMenu(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="flex justify-center items-center w-full mt-6 px-2">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-center mx-auto px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#D2691E] transition-colors duration-300 text-lg font-bold font-futura"
                >
                  LOGOUT
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowMenu(false);
                    setShowLoginModal(true);
                  }}
                  className="w-full text-center mx-auto px-4 py-2 bg-[#8B4513] text-white rounded-lg hover:bg-[#D2691E] transition-colors duration-300 text-lg font-bold font-futura"
                >
                  LOGIN
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
