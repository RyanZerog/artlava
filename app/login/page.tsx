"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cssBackgroundUrl } from "@/lib/paths";
import styles from "./page.module.scss";

type ToastStatus = "info" | "success" | "error";

type ToastState = {
  message: string;
  status: ToastStatus;
};

type NavKey = "home" | "profile" | "create" | "bell" | "message";

type LoginErrors = {
  email?: string;
  password?: string;
};

const ASSET_BASE = "/figma/assets";

const iconRefs = {
  logo: "123fd2380f0328de07868ce003385c3aa97f07c3",
  search: "43aa8b89e47eeb0941b08f16ced3f4823ce30c27",
  home: "22b6ad98d8bba275305659484350beb720094bc7",
  profile: "2e098abb6149eca05e8e6e53d4cabbdb1c78fcbe",
  create: "31fa61240d2c7350b9822316ca3ca67c7664090e",
  bell: "ba5cfe3423688b18f07f499492e5fb051f427716",
  message: "98cb6426a212ef72d65ec499021cd8cf35d51c06",
};

const navItems: { key: NavKey; label: string; ref: string }[] = [
  { key: "home", label: "主页", ref: iconRefs.home },
  { key: "profile", label: "个人", ref: iconRefs.profile },
  { key: "create", label: "创作", ref: iconRefs.create },
  { key: "bell", label: "提醒", ref: iconRefs.bell },
  { key: "message", label: "消息", ref: iconRefs.message },
];

const enterpriseFeatures = [
  { title: "发布工具", desc: "通过图片或视频分享设计", personal: true, business: true },
  { title: "广告管理工具", desc: "管理和跟踪推广计划", personal: false, business: true },
  { title: "发现和分析工具", desc: "发现表现卓越的 Art 图", personal: false, business: true },
  { title: "积分和优惠", desc: "获得推广积分等的资格", personal: false, business: true },
];

const assetUrl = (imageRef: string) => `${ASSET_BASE}/${imageRef}.png`;

function ExistingAccountIcon() {
  return (
    <svg
      className={styles.optionIcon}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="32" fill="#1f9be5" />
      <circle cx="27" cy="24" r="8" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M15 42c2-7 8-11 16-11s14 4 16 11" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M44 33v10M39 38h10" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

function PersonalAccountIcon() {
  return (
    <svg
      className={styles.optionIcon}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="32" fill="#e22b8f" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="#fff" strokeWidth="3" />
      <path d="M32 24v16M24 32h16" fill="none" stroke="#fff" strokeLinecap="round" strokeWidth="3.5" />
    </svg>
  );
}

function EnterpriseAccountIcon() {
  return (
    <svg
      className={styles.optionIcon}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="32" cy="32" r="32" fill="#0b57a5" />
      <rect
        x="17"
        y="19"
        width="30"
        height="26"
        rx="4"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
      />
      <circle cx="27" cy="31.5" r="2.4" fill="#fff" />
      <path d="M33 31.5h8" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
      <path d="M22 41h20" stroke="#fff" strokeLinecap="round" strokeWidth="3" />
    </svg>
  );
}

export default function Home() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [searchValue, setSearchValue] = useState("");
  const [toast, setToast] = useState<ToastState | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchKeywordRef = useRef("");

  const showToast = useCallback((message: string, status: ToastStatus = "info") => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast({ message, status });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2200);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const notifyDeveloping = useCallback(
    (feature: string) => {
      showToast(`${feature}正在开发中`);
    },
    [showToast],
  );

  const handleSearchSubmit = () => {
    const keyword = searchValue.replace(/\s+/g, " ").trim();
    if (!keyword) {
      showToast("请输入关键字后再搜索", "error");
      return;
    }

    if (keyword.length < 2) {
      showToast("请至少输入 2 个字符", "error");
      return;
    }

    if (keyword === lastSearchKeywordRef.current) {
      showToast(`“${keyword}”已搜索过，正在为你定位结果（演示）`);
      return;
    }

    lastSearchKeywordRef.current = keyword;
    setSearchValue(keyword);
    notifyDeveloping(`“${keyword}”搜索功能`);
  };

  const handleNavClick = (key: NavKey, label: string) => {
    setActiveNav(key);
    if (key === "home") {
      router.push("/");
      return;
    }
    if (key === "profile") {
      router.push("/workspace");
      return;
    }
    if (key === "create") {
      router.push("/create");
      return;
    }
    notifyDeveloping(`${label}页面`);
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: LoginErrors = {};

    if (!loginForm.email.trim()) {
      nextErrors.email = "请输入邮箱";
    } else if (!/^\S+@\S+\.\S+$/.test(loginForm.email.trim())) {
      nextErrors.email = "邮箱格式不正确";
    }

    if (!loginForm.password.trim()) {
      nextErrors.password = "请输入密码";
    }

    if (nextErrors.email || nextErrors.password) {
      setLoginErrors(nextErrors);
      return;
    }

    setLoginErrors({});
    setIsLoggingIn(true);

    setTimeout(() => {
      setIsLoggingIn(false);
      setShowLoginModal(false);
      setLoginForm((prev) => ({ email: prev.email.trim(), password: "" }));
      showToast("登录成功，正在进入首页（演示）", "success");
    }, 750);
  };

  const toastClass = toast
    ? toast.status === "success"
      ? styles.toastSuccess
      : toast.status === "error"
        ? styles.toastError
        : styles.toastInfo
    : "";

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div
          className={styles.logo}
          style={{ backgroundImage: cssBackgroundUrl(assetUrl(iconRefs.logo)) }}
          aria-label="ArtLava"
        />

        <nav className={styles.navGroup} aria-label="主导航">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={activeNav === item.key ? styles.navButtonActive : styles.navButton}
              onClick={() => handleNavClick(item.key, item.label)}
              aria-label={item.label}
            >
              <span
                className={styles.navIcon}
                style={{ backgroundImage: cssBackgroundUrl(assetUrl(item.ref)) }}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={styles.navButtonBottom}
          aria-label="设置"
          onClick={() => notifyDeveloping("设置页面")}
        >
          ⚙
        </button>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topHeader}>
          <div className={styles.searchBox}>
            <button
              type="button"
              className={styles.searchTrigger}
              onClick={handleSearchSubmit}
              aria-label="执行搜索"
            >
              <span
                className={styles.searchIcon}
                style={{ backgroundImage: cssBackgroundUrl(assetUrl(iconRefs.search)) }}
                aria-hidden="true"
              />
            </button>
            <input
              className={styles.searchInput}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value.slice(0, 60))}
              placeholder="搜索你想要的设计方案"
              aria-label="搜索你想要的设计方案"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit();
                }
                if (event.key === "Escape") {
                  setSearchValue("");
                }
              }}
            />
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.loginEntryButton} onClick={() => router.push("/")}>
              返回首页
            </button>
            <div className={styles.profileEntry}>
              <button
                type="button"
                className={styles.avatarButton}
                aria-label="个人菜单"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              />
              <button
                type="button"
                className={styles.arrowButton}
                aria-label="展开个人菜单"
                onClick={() => setProfileMenuOpen((prev) => !prev)}
              >
                ˅
              </button>
              {profileMenuOpen ? (
                <div className={styles.profileMenu}>
                  <button type="button" onClick={() => notifyDeveloping("个人资料编辑")}>
                    编辑资料
                  </button>
                  <button type="button" onClick={() => notifyDeveloping("账户切换")}>
                    切换账户
                  </button>
                  <button type="button" onClick={() => notifyDeveloping("退出登录")}>
                    退出登录
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.hero}>
            <h1>登录一个帐户</h1>
            <p>使用不同的电子邮件关联多个帐户，实现无缝切换</p>
          </section>

          <section className={styles.accountGrid}>
            <article className={styles.accountCard}>
              <ExistingAccountIcon />
              <h2>已有帐户</h2>
              <p>添加你已有的帐户</p>
              <button type="button" className={styles.ghostButton} onClick={() => setShowLoginModal(true)}>
                登录帐户
              </button>
            </article>

            <article className={styles.accountCard}>
              <PersonalAccountIcon />
              <h2>新建个人帐户</h2>
              <p>使用其他电子邮箱创建帐户</p>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={() => notifyDeveloping("个人账户创建功能")}
              >
                创建
              </button>
            </article>

            <article className={styles.accountCardHighlight}>
              <EnterpriseAccountIcon />
              <h2>新建免费企业帐户</h2>
              <p className={styles.featureTitle}>解锁工具以助力：</p>
              <ul className={styles.featureList}>
                <li>发展受众</li>
                <li>吸引流量</li>
                <li>销售更多产品</li>
              </ul>
              <button type="button" className={styles.ghostButton} onClick={() => setShowUpgradeModal(true)}>
                创建
              </button>
            </article>
          </section>

          <section className={styles.bottomBlock}>
            <h3>管理你的帐户</h3>
            <p>在设置中，随时更改你的帐户和个人信息。</p>
          </section>
        </main>
      </div>

      {showLoginModal ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => {
            setShowLoginModal(false);
            setLoginErrors({});
          }}
        >
          <div
            className={styles.loginModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="login-modal-title">登录已有帐户</h3>
            <p>请输入邮箱和密码继续（演示逻辑）。</p>
            <form onSubmit={handleLoginSubmit}>
              <label className={styles.fieldLabel}>
                邮箱
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      email: event.target.value,
                    }))
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </label>
              {loginErrors.email ? <p className={styles.fieldError}>{loginErrors.email}</p> : null}

              <label className={styles.fieldLabel}>
                密码
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({
                      ...prev,
                      password: event.target.value,
                    }))
                  }
                  placeholder="请输入密码"
                  autoComplete="current-password"
                />
              </label>
              {loginErrors.password ? (
                <p className={styles.fieldError}>{loginErrors.password}</p>
              ) : null}

              <button
                type="button"
                className={styles.textAction}
                onClick={() => notifyDeveloping("找回密码功能")}
              >
                忘记密码？
              </button>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => {
                    setShowLoginModal(false);
                    setLoginErrors({});
                  }}
                >
                  取消
                </button>
                <button type="submit" className={styles.confirmButton} disabled={isLoggingIn}>
                  {isLoggingIn ? "登录中..." : "登录"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showUpgradeModal ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => setShowUpgradeModal(false)}
        >
          <div
            className={styles.upgradeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 id="upgrade-modal-title">升级为免费企业账户</h3>
            <p>
              借助工具（例如广告和分析工具）拓展业务或品牌。你的内容、个人资料和粉丝将保持不变。你可以在设置中撤消此更改。
            </p>

            <div className={styles.compareTable}>
              <div className={styles.compareHead}>
                <span>功能</span>
                <span>个人</span>
                <span>企业</span>
              </div>
              {enterpriseFeatures.map((item) => (
                <div className={styles.compareRow} key={item.title}>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                  <span>{item.personal ? "✓" : ""}</span>
                  <span>{item.business ? "✓" : ""}</span>
                </div>
              ))}
            </div>

            <div className={styles.modalActions}>
              <button type="button" className={styles.cancelButtonWide} onClick={() => setShowUpgradeModal(false)}>
                取消
              </button>
              <button
                type="button"
                className={styles.confirmButtonWide}
                onClick={() => notifyDeveloping("企业账户升级功能")}
              >
                升级
              </button>
            </div>

            <p className={styles.agreementText}>
              进行转换，即表示你同意 Artlava 的商业服务条款并且确认你已阅读我们的隐私政策，信息收集声明。
            </p>
          </div>
        </div>
      ) : null}

      {toast ? <div className={`${styles.toast} ${toastClass}`}>{toast.message}</div> : null}
    </div>
  );
}
