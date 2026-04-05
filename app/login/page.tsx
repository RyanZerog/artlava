"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsGearIcon } from "@/components/settings-gear-icon";
import { cssBackgroundUrl } from "@/lib/paths";
import styles from "./page.module.scss";

type NavKey = "home" | "profile" | "create" | "bell" | "message";

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
  { key: "home", label: "首页", ref: iconRefs.home },
  { key: "profile", label: "工作台", ref: iconRefs.profile },
  { key: "create", label: "创作", ref: iconRefs.create },
  { key: "bell", label: "提醒", ref: iconRefs.bell },
  { key: "message", label: "消息", ref: iconRefs.message },
];

const assetUrl = (imageRef: string) => `${ASSET_BASE}/${imageRef}.png`;

function ExistingAccountIcon() {
  return (
    <svg className={styles.accountIcon} viewBox="0 0 68 68" aria-hidden="true" focusable="false">
      <circle cx="34" cy="34" r="34" fill="#2599E0" />
      <circle cx="31.5" cy="25.5" r="8.5" fill="none" stroke="#fff" strokeWidth="3.5" />
      <path d="M20 44.5c2.3-7 8.4-11.3 15.7-11.3 4.9 0 9.4 1.8 12.4 5" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M47.5 33.5v15" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M40 41h15" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

function PersonalAccountIcon() {
  return (
    <svg className={styles.accountIcon} viewBox="0 0 68 68" aria-hidden="true" focusable="false">
      <circle cx="34" cy="34" r="34" fill="#D92B8C" />
      <circle cx="34" cy="34" r="22" fill="none" stroke="#fff" strokeWidth="4" />
      <path d="M34 24v20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 34h20" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function EnterpriseAccountIcon() {
  return (
    <svg className={styles.accountIcon} viewBox="0 0 68 68" aria-hidden="true" focusable="false">
      <circle cx="34" cy="34" r="34" fill="#0B57A5" />
      <rect x="18" y="20" width="32" height="28" rx="4.5" fill="none" stroke="#fff" strokeWidth="3.5" />
      <circle cx="28" cy="32" r="2.5" fill="#fff" />
      <path d="M35 31.5h8.5" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M25 41.5h18.5" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavKey | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 2200);
  };

  const handleNavClick = (key: NavKey) => {
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

    if (key === "bell") {
      router.push("/updates");
      return;
    }

    if (key === "message") {
      router.push("/messages");
    }
  };

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
              onClick={() => handleNavClick(item.key)}
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
          onClick={() => showToast("设置功能待开发")}
        >
          <SettingsGearIcon className={styles.settingsIcon} />
        </button>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.topHeader}>
          <div className={styles.searchBox}>
            <button type="button" className={styles.searchTrigger} aria-label="执行搜索">
              <span
                className={styles.searchIcon}
                style={{ backgroundImage: cssBackgroundUrl(assetUrl(iconRefs.search)) }}
                aria-hidden="true"
              />
            </button>
            <input
              className={styles.searchInput}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="搜索你想要的设计方案"
              aria-label="搜索你想要的设计方案"
            />
          </div>

          <div className={styles.headerActions}>
            <button type="button" className={styles.loginEntryButton} onClick={() => router.push("/login")}>
              登录
            </button>
            <button
              type="button"
              className={styles.avatarButton}
              aria-label="个人菜单"
              onClick={() => router.push("/settings")}
            />
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
              <button type="button" className={styles.mutedButton}>
                登录帐户
              </button>
            </article>

            <article className={styles.accountCard}>
              <PersonalAccountIcon />
              <h2>新建个人帐户</h2>
              <p>使用其他电子邮箱创建帐户</p>
              <button type="button" className={styles.primaryButton}>
                创建
              </button>
            </article>

            <article className={styles.accountCard}>
              <EnterpriseAccountIcon />
              <h2>新建免费企业帐户</h2>
              <div className={styles.enterpriseFeatures}>
                <p>解锁工具以助力：</p>
                <ul className={styles.featureList}>
                  <li>发展受众</li>
                  <li>吸引流量</li>
                  <li>销售更多产品</li>
                </ul>
              </div>
              <button type="button" className={styles.mutedButton}>
                创建
              </button>
            </article>
          </section>

          <section className={styles.accountHint}>
            <h3>管理你的帐户</h3>
            <p>在设置中，随时更改你的帐户和个人信息。</p>
          </section>
        </main>
      </div>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
