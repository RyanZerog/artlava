"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cssBackgroundUrl, withBasePath } from "@/lib/paths";
import styles from "./page.module.scss";

type NavKey = "home" | "profile" | "create" | "bell" | "message";

type GalleryItem = {
  id: number;
  imagePath: string;
  imageHeight: number;
  title: string;
  source: string;
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
  { key: "home", label: "首页", ref: iconRefs.home },
  { key: "profile", label: "工作台", ref: iconRefs.profile },
  { key: "create", label: "创作", ref: iconRefs.create },
  { key: "bell", label: "提醒", ref: iconRefs.bell },
  { key: "message", label: "消息", ref: iconRefs.message },
];

const galleryItems: GalleryItem[] = [
  { id: 1, imagePath: "/figma/home/4-6.png", imageHeight: 262, title: "电瓶车设计", source: "..." },
  { id: 2, imagePath: "/figma/home/4-16.png", imageHeight: 226, title: "木船设计", source: "Vecteezy" },
  { id: 3, imagePath: "/figma/home/4-29.png", imageHeight: 237, title: "背包设计图", source: "..." },
  { id: 4, imagePath: "/figma/home/4-47.png", imageHeight: 451, title: "动画设计图", source: "..." },
  { id: 5, imagePath: "/figma/home/4-57.png", imageHeight: 451, title: "地砖设计图", source: "..." },
  { id: 6, imagePath: "/figma/home/4-67.png", imageHeight: 401, title: "椅子设计图", source: "..." },
  { id: 7, imagePath: "/figma/home/4-78.png", imageHeight: 339, title: "吊顶设计图", source: "..." },
  { id: 8, imagePath: "/figma/home/4-88.png", imageHeight: 367, title: "木雕设计图", source: "..." },
  { id: 9, imagePath: "/figma/home/4-98.png", imageHeight: 440, title: "书架设计图", source: "..." },
  { id: 10, imagePath: "/figma/home/4-108.png", imageHeight: 169, title: "动画设计", source: "..." },
  { id: 11, imagePath: "/figma/home/4-120.png", imageHeight: 401, title: "图标设计图", source: "..." },
  { id: 12, imagePath: "/figma/home/4-130.png", imageHeight: 434, title: "图标设计图", source: "..." },
  { id: 13, imagePath: "/figma/home/4-140.png", imageHeight: 226, title: "室内设计图", source: "..." },
  { id: 14, imagePath: "/figma/home/4-150.png", imageHeight: 401, title: "植物设计图", source: "..." },
  { id: 15, imagePath: "/figma/home/4-160.png", imageHeight: 402, title: "艺术品设计图", source: "..." },
  { id: 16, imagePath: "/figma/home/4-171.png", imageHeight: 301, title: "沙发设计图", source: "..." },
  { id: 17, imagePath: "/figma/home/4-180.png", imageHeight: 280, title: "杯子设计图", source: "..." },
  { id: 18, imagePath: "/figma/home/4-190.png", imageHeight: 428, title: "纹理设计图", source: "..." },
  { id: 19, imagePath: "/figma/home/4-200.png", imageHeight: 531, title: "园林设计图", source: "..." },
];

export default function Home() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [searchValue, setSearchValue] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSearchKeywordRef = useRef("");

  const showToast = useCallback((message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    setToast(message);
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

  const handleNavClick = (key: NavKey, label: string) => {
    setActiveNav(key);
    if (key === "profile") {
      router.push("/workspace");
      return;
    }
    if (key === "create") {
      router.push("/create");
      return;
    }
    if (key !== "home") {
      showToast(`${label}功能正在开发中`);
    }
  };

  const handleSearch = () => {
    const keyword = searchValue.replace(/\s+/g, " ").trim();
    if (!keyword) {
      showToast("请输入关键字后再搜索");
      return;
    }

    if (keyword.length < 2) {
      showToast("请至少输入 2 个字符");
      return;
    }

    if (keyword === lastSearchKeywordRef.current) {
      showToast(`“${keyword}”已搜索过，正在为你定位结果（演示）`);
      return;
    }

    lastSearchKeywordRef.current = keyword;
    setSearchValue(keyword);
    showToast(`“${keyword}”搜索功能正在开发中`);
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div
          className={styles.logo}
          style={{ backgroundImage: cssBackgroundUrl(`${ASSET_BASE}/${iconRefs.logo}.png`) }}
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
                style={{ backgroundImage: cssBackgroundUrl(`${ASSET_BASE}/${item.ref}.png`) }}
                aria-hidden="true"
              />
            </button>
          ))}
        </nav>

        <button
          type="button"
          className={styles.navButtonBottom}
          aria-label="设置"
          onClick={() => showToast("设置功能正在开发中")}
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
              onClick={handleSearch}
              aria-label="执行搜索"
            >
              <span
                className={styles.searchIcon}
                style={{ backgroundImage: cssBackgroundUrl(`${ASSET_BASE}/${iconRefs.search}.png`) }}
                aria-hidden="true"
              />
            </button>
            <input
              className={styles.searchInput}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value.slice(0, 60))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearch();
                }
                if (event.key === "Escape") {
                  setSearchValue("");
                }
              }}
              placeholder="搜索你想要的设计方案"
              aria-label="搜索你想要的设计方案"
            />
          </div>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.loginEntryButton}
              onClick={() => router.push("/login")}
            >
              登录
            </button>
            <button
              type="button"
              className={styles.avatarButton}
              aria-label="个人菜单"
              onClick={() => showToast("个人菜单正在开发中")}
            />
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.masonry}>
            {galleryItems.map((item) => (
              <article className={styles.card} key={item.id}>
                <Image
                  className={styles.cardImage}
                  src={withBasePath(item.imagePath)}
                  alt={item.title}
                  width={226}
                  height={item.imageHeight}
                  loading="lazy"
                />
                <div className={styles.cardMeta}>
                  <p className={styles.cardTitle}>{item.title}</p>
                  <div className={styles.cardInfo}>
                    <span>{item.source}</span>
                    <button
                      type="button"
                      className={styles.moreButton}
                      aria-label={`${item.title} 更多`}
                      onClick={() => showToast(`${item.title}详情正在开发中`)}
                    >
                      ...
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
