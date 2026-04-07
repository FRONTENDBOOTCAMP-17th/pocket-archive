export function Register() {
  return `
    <main class="w-screen min-h-screen flex flex-col items-center justify-center gap-5" style="background: linear-gradient(135deg, #FEF2F2 0%, #FFF 50%, #FFF7ED 100%)">

      <!-- icon & header -->
      <div class="flex flex-col items-center gap-2">
        <svg width="64" height="64" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 39.992C0 17.905 17.905 0 39.992 0C62.079 0 79.984 17.905 79.984 39.992C79.984 62.079 62.079 79.984 39.992 79.984C17.905 79.984 0 62.079 0 39.992Z" fill="#00BBA7"/>
          <path d="M28.4172 52.5605V19.5605H43.4172V22.5605H31.4172V37.5605H43.4172V40.5605H31.4172V52.5605H28.4172ZM43.4172 37.5605V34.5605H46.4172V37.5605H43.4172ZM43.4172 22.5605H46.4172V25.5605H43.4172V22.5605ZM46.4172 34.5605V25.5605H49.4172V34.5605H46.4172Z" fill="white"/>
        </svg>
        <h1 class="text-xl font-bold text-[#1a3a35]">포켓 아카이브</h1>
        <p class="text-xs text-[#5a8a82] tracking-widest text-center">포켓몬 트레이너 커뮤니티에<br class="hidden max-[315px]:block"> 오신 것을 환영합니다!</p>
      </div>

      <!-- register box -->
      <div class="bg-white rounded-xl border-t-8 border-b-8 border-[#00BBA7] shadow-[0_8px_32px_rgba(0,187,167,0.15)] flex flex-col items-start gap-6 w-md max-[501px]:w-[calc(100vw-32px)] max-[501px]:h-auto max-[501px]:px-5 max-[501px]:pb-6" style="padding:32px;">

        <h2 class="text-2xl font-bold text-[#00BBA7] mb-1">회원가입</h2>

        <form name="registerForm" class="w-full flex flex-col gap-4">
          <!-- nickname -->
          <div style="display:flex; height:96px; flex-direction:column; align-items:flex-start; gap:8px; flex-shrink:0; align-self:stretch;">
            <p class="text-s">닉네임</p>
            <div style="display:flex; flex-direction:row; align-items:center; gap:8px; width:100%;">
              <input
                type="text"
                id="register_nickname"
                name="register_nickname"
                placeholder="닉네임을 입력하세요"
                class="w-full h-12 bg-[#f4faf9] border border-[#d0eeea] rounded-lg mb-3 text-sm text-[#1a3a35] placeholder-[#aac8c3] outline-none focus:border-[#00BBA7] transition-colors" style="padding-left: 12px; padding-right: 16px;"
              />
              <button type="button" id="checkNicknameBtn"
                class="transition-colors cursor-pointer"
                style="display: inline-flex; height: 48px; padding: 9px 25px 8px 24px; justify-content: center; align-items: center; border-radius: 10px; border: 1px solid #00BBA7; background: rgba(255, 255, 255, 0.10); color: #0A0A0A; text-align: center; font-size: 12px; font-weight: 400; line-height: 24px; white-space: nowrap;">
                중복확인
              </button>
           </div>
          </div>

          <!-- ID -->
          <div style="display:flex; height:96px; flex-direction:column; align-items:flex-start; gap:8px; flex-shrink:0; align-self:stretch;">
            <p class="text-s">아이디</p>
            <div style="display:flex; flex-direction:row; align-items:center; gap:8px; width:100%;">
              <input
                type="text"
                id="register_id"
                name="register_id"
                placeholder="아이디를 입력하세요"
                class="w-full h-12 bg-[#f4faf9] border border-[#d0eeea] rounded-lg mb-3 text-sm text-[#1a3a35] placeholder-[#aac8c3] outline-none focus:border-[#00BBA7] transition-colors" style="padding-left: 12px; padding-right: 16px;"
              />
              <button type="button" id="checkIdBtn"
                class="transition-colors cursor-pointer"
                style="display: inline-flex; height: 48px; padding: 9px 25px 8px 24px; justify-content: center; align-items: center; border-radius: 10px; border: 1px solid #00BBA7; background: rgba(255, 255, 255, 0.10); color: #0A0A0A; text-align: center; font-size: 12px; font-weight: 400; line-height: 24px; white-space: nowrap;">
                중복확인
              </button>
            </div>
          </div>

          <!-- Password -->
          <div style="display:flex; height:96px; flex-direction:column; align-items:flex-start; gap:8px; flex-shrink:0; align-self:stretch;">
            <p class="text-s">비밀번호</p>
            <div class="relative mb-3 w-full">
              <input
                type="password"
                id="register_password"
                name="register_password"
                placeholder="비밀번호를 입력하세요"
                class="w-full h-12 bg-[#f4faf9] border border-[#d0eeea] rounded-lg pr-11 text-sm text-[#1a3a35] placeholder-[#aac8c3] outline-none focus:border-[#00BBA7] transition-colors" style="padding-left: 12px;"
              />
              <button type="button" id="eye" aria-label="비밀번호 표시"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#aac8c3] hover:text-[#00BBA7] transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                  <line id="eye-slash" x1="4" y1="4" x2="20" y2="20" stroke-dasharray="24" stroke-dashoffset="24" style="transition: stroke-dashoffset 0.2s;"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Password confirm -->
          <div style="display:flex; height:96px; flex-direction:column; align-items:flex-start; gap:8px; flex-shrink:0; align-self:stretch;">
            <p class="text-s">비밀번호 확인</p>
            <div class="relative mb-3 w-full">
              <input
                type="password"
                id="register_password_confirm"
                name="register_password_confirm"
                placeholder="비밀번호를 다시 입력하세요"
                class="w-full h-12 bg-[#f4faf9] border border-[#d0eeea] rounded-lg pr-11 text-sm text-[#1a3a35] placeholder-[#aac8c3] outline-none focus:border-[#00BBA7] transition-colors" style="padding-left: 12px;"
              />
              <button type="button" id="eye2" aria-label="비밀번호 확인 표시"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-[#aac8c3] hover:text-[#00BBA7] transition-colors cursor-pointer bg-transparent border-0 p-0 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                  <line id="eye-slash2" x1="4" y1="4" x2="20" y2="20" stroke-dasharray="24" stroke-dashoffset="24" style="transition: stroke-dashoffset 0.2s;"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error message -->
          <p id="register-msg" class="hidden text-s text-red-500 bg-red-50 rounded-md px-3 py-2 mb-3"></p>

          <!-- Register button -->
          <button disabled type="submit"
            class="w-full h-12 bg-[#00BBA7] hover:bg-[#009e8d] text-white rounded-full text-base font-bold transition-colors cursor-pointer border-0 mb-5"
            id="signupBtn">
            회원가입
          </button>

          <!-- Back to login -->
          <div class="flex items-center justify-center gap-2 text-sm">
            <p class="text-[#8a9a98] m-0">이미 계정이 있으신가요?</p>
            <button
              
              type="button"
              class="bg-transparent border-0 text-[#00BBA7] hover:text-[#009e8d] text-sm underline cursor-pointer p-0"
              id="loginBtn">
              로그인
            </button>
          </div>
        </form>
      </div>

      <!-- footer -->
      <p class="text-xs text-[#8a9a98]">포켓몬 마스터가 되는 여정을 시작하세요!</p>

    </main>
  `;
}
let validNickname = true;
let validId = true;

export function initRegister() {
  const pwd = document.getElementById("register_password");
  const eye = document.getElementById("eye");
  const pwd2 = document.getElementById("register_password_confirm");
  const eye2 = document.getElementById("eye2");
  const id = document.getElementById("register_id");
  const nickname = document.getElementById("register_nickname");

  eye.addEventListener("click", function () {
    eye.classList.toggle("active");
    pwd.type = pwd.type === "password" ? "text" : "password";

    const slash = document.getElementById("eye-slash");
    slash.style.strokeDashoffset = eye.classList.contains("active")
      ? "0"
      : "24";
  });

  eye2.addEventListener("click", function () {
    eye2.classList.toggle("active");
    pwd2.type = pwd2.type === "password" ? "text" : "password";

    const slash2 = document.getElementById("eye-slash2");
    slash2.style.strokeDashoffset = eye2.classList.contains("active")
      ? "0"
      : "24";
  });

  document.registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    checkRegister();
  });

  document.getElementById("loginBtn").addEventListener("click", function () {
    history.pushState(null, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });

  document
    .getElementById("checkNicknameBtn")
    .addEventListener("click", async function () {
      const nickname = document.getElementById("register_nickname");
      try {
        const res = await fetch(
          `https://api.fullstackfamily.com/api/pocket-archive/v1/user/check-nickname?nickname=${nickname.value}`,
          {
            method: "GET",
          },
        );
        const result = await res.json();
        validNickname = result.data.exists;
      } catch (error) {
        console.error(error);
      }
      updateButtonState();
    });

  document
    .getElementById("checkIdBtn")
    .addEventListener("click", async function () {
      const id = document.getElementById("register_id");
      try {
        const res = await fetch(
          `https://api.fullstackfamily.com/api/pocket-archive/v1/user/check-login-id?loginId=${id.value}`,
          {
            method: "GET",
          },
        );
        const result = await res.json();
        validId = result.data.exists;
      } catch (error) {
        console.error(error);
      }
      updateButtonState();
    });
  document
    .getElementById("signupBtn")
    .addEventListener("click", async function signup() {
      try {
        const res = await fetch(
          `https://api.fullstackfamily.com/api/pocket-archive/v1/user/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              loginId: id.value,
              nickname: nickname.value,
              password: pwd.value,
            }),
          },
        );
        const result = await res.json();
      } catch (error) {
        console.error(error);
      }
    });
}
function updateButtonState() {
  const signupBtn = document.getElementById("signupBtn");
  if (validNickname === false && validId === false) {
    signupBtn.disabled = false;
  } else {
    signupBtn.disabled = true;
  }
}
async function signup() {}

// Form Validation
function checkRegister() {
  var nickname = document.registerForm.register_nickname;
  var register_id = document.registerForm.register_id;
  var password = document.registerForm.register_password;
  var passwordConfirm = document.registerForm.register_password_confirm;
  var msg = document.getElementById("register-msg");

  if (nickname.value === "") {
    msg.style.display = "block";
    msg.innerHTML = "닉네임을 입력해주세요";
    nickname.focus();
    return false;
  } else {
    msg.innerHTML = "";
  }

  if (register_id.value === "") {
    msg.style.display = "block";
    msg.innerHTML = "아이디를 입력해주세요";
    register_id.focus();
    return false;
  } else {
    msg.innerHTML = "";
  }

  if (password.value === "") {
    msg.style.display = "block";
    msg.innerHTML = "비밀번호를 입력해주세요";
    password.focus();
    return false;
  } else {
    msg.innerHTML = "";
  }

  if (passwordConfirm.value === "") {
    msg.style.display = "block";
    msg.innerHTML = "비밀번호 확인을 입력해주세요";
    passwordConfirm.focus();
    return false;
  }

  if (password.value !== passwordConfirm.value) {
    msg.style.display = "block";
    msg.innerHTML = "비밀번호가 일치하지 않습니다";
    passwordConfirm.focus();
    return false;
  }

  msg.innerHTML = "";
}
