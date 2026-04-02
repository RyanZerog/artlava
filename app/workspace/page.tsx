"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cssBackgroundUrl } from "@/lib/paths";
import styles from "./page.module.scss";

type BoardGroup = {
  name: string;
  count: string;
  imageRefs: [string, string, string];
};

type MasonryItem = {
  id: number;
  height: number;
  imageRef: string;
};

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
  { key: "home", label: "主页", ref: iconRefs.home },
  { key: "profile", label: "个人", ref: iconRefs.profile },
  { key: "create", label: "创作", ref: iconRefs.create },
  { key: "bell", label: "提醒", ref: iconRefs.bell },
  { key: "message", label: "消息", ref: iconRefs.message },
];

const boardGroups: BoardGroup[] = [
  {
    name: "动画设计",
    count: "10 份方案",
    imageRefs: [
      "b134f096e092b7e73f9b0986b92365aac1eb718a",
      "babdb8df9b95577178eea74e7fe38d26a0729a56",
      "9e6e441b2e32841414e86942fce9cc40eb797c02",
    ],
  },
  {
    name: "植物设计",
    count: "8 份方案",
    imageRefs: [
      "7cf293613b0712332499c72f042b278df4cd8b6f",
      "55c60c688ef9400a68ebc622f65700c83918e282",
      "d8b0f1dc4bf9cba464d972b0ccb202ed41f91e68",
    ],
  },
  {
    name: "昆虫设计",
    count: "6 份方案",
    imageRefs: [
      "00d975cafd9054da61cb53db190ec14d2a23c013",
      "5834f8a2d490ee156b12863301b099daae5c3f6d",
      "3043a62f66f05a71b491c73c95f6f38c7fa02f41",
    ],
  },
  {
    name: "纹理设计",
    count: "4 份方案",
    imageRefs: [
      "e205a80024c2746469b9d7faccc4f73f4926961c",
      "05a94270c3729c4898ebe7a6afbc3ae0512ecb0a",
      "80113469eff209fe5b12e0943db35174694c2c46",
    ],
  },
];

const masonryItems: MasonryItem[] = [
  { id: 1, height: 318, imageRef: "b3d7187289051f03b92d55f350dcbb2247b6495e" },
  { id: 2, height: 81, imageRef: "4c86bb73e28b5ee150d2719eccd3762d71f3adab" },
  { id: 3, height: 187, imageRef: "bef15545d60b72b543866fd41a79a41ea333d7ed" },
  { id: 4, height: 339, imageRef: "64c16ce140b11873131d6603cb927b064134aff4" },
  { id: 5, height: 150, imageRef: "58207a117af6b94b49e25b09a919ba055578b1fc" },
  { id: 6, height: 226, imageRef: "b016c4f39d38b7b25f5237518e96f2f347db2796" },
  { id: 7, height: 168, imageRef: "0164145e485a0c4264841e8126ad0d6064ade173" },
  { id: 8, height: 176, imageRef: "0890391c5c15cb84276fbfeef7a607fff567a404" },
  { id: 9, height: 156, imageRef: "7ff1a9aebbae36531f2890cfdd31cb8840da071e" },
  { id: 10, height: 226, imageRef: "6902fc44b63dcc577ea81378256bb5f5b02e4baa" },
  { id: 11, height: 75, imageRef: "4fe02078fef130f98ff329894a81a3f8882dc982" },
  { id: 12, height: 110, imageRef: "8bd8e61e77b3490ca19f53743b77fe62cdc6654b" },
  { id: 13, height: 169, imageRef: "0ff918dd9b7e249517946a461580c45e9c230dce" },
  { id: 14, height: 177, imageRef: "322c81fdc08d52732cb12cff8ae341c214ff135f" },
  { id: 15, height: 158, imageRef: "811ba9517566f2bce7f76af54f69d80e8b06145a" },
  { id: 16, height: 228, imageRef: "715d8906359e38011945f1fedd18deb873153cd5" },
  { id: 17, height: 301, imageRef: "39b8807ba8d4fb5d0d0ea9c9d59c0365bc98dcea" },
  { id: 18, height: 118, imageRef: "4564316433950bce0b766eb557847b6fb9c4b51b" },
  { id: 19, height: 158, imageRef: "127dcae598f7e2dc8beed7f5589a9587001dbe5b" },
  { id: 20, height: 165, imageRef: "6606cc4581c20cb58c6c10a48e9fdc4ae5359771" },
  { id: 21, height: 226, imageRef: "6048d5c641aab3710439bd3adb91dc50d738f4da" },
  { id: 22, height: 189, imageRef: "1820ad7f5e1411c55ad61de39b34776bec60725e" },
  { id: 23, height: 350, imageRef: "7157d76020b473bd5d5a1f080db249aeee2e03a7" },
];

const assetUrl = (imageRef: string) => `${ASSET_BASE}/${imageRef}.png`;

export default function WorkspacePage() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavKey>("profile");
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

  const handleNavClick = (key: NavKey) => {
    setActiveNav(key);
    if (key === "home") {
      router.push("/");
      return;
    }
    if (key === "create") {
      router.push("/create");
      return;
    }
    if (key !== "profile") {
      const navLabel = navItems.find((item) => item.key === key)?.label ?? "该页面";
      showToast(`${navLabel}功能正在开发中`);
    }
  };

  const handleSearchSubmit = () => {
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
          style={{ backgroundImage: cssBackgroundUrl(assetUrl(iconRefs.logo)) }}
          aria-label="ArtLava"
        />

        <div className={styles.navGroup}>
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={activeNav === item.key ? styles.navButtonActive : styles.navButton}
              aria-label={item.label}
              onClick={() => handleNavClick(item.key)}
            >
              <span
                className={styles.navIcon}
                style={{ backgroundImage: cssBackgroundUrl(assetUrl(item.ref)) }}
              />
            </button>
          ))}
        </div>

        <button type="button" className={styles.navButtonBottom} aria-label="设置">
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
              />
            </button>
            <input
              className={styles.searchInput}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value.slice(0, 60))}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleSearchSubmit();
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
          <section className={styles.heroSection}>
            <div className={styles.heroHeader}>
              <h1>你喜欢的设计方案</h1>
              <article className={styles.profileCard}>
                <div className={styles.avatar} />
                <div className={styles.profileText}>
                  <p className={styles.profileName}>昵称</p>
                  <p className={styles.profileMeta}>0 关注</p>
                </div>
                <button type="button" className={styles.profileButton}>
                  设置个人资料
                </button>
              </article>
            </div>

            <div className={styles.tabs}>
              <button type="button" className={styles.tab}>
                Art 图
              </button>
              <button type="button" className={styles.tabActive}>
                图板
              </button>
              <button type="button" className={styles.tab}>
                拼贴
              </button>
            </div>

            <div className={styles.filterBar}>
              <div className={styles.filterLeft}>
                <span className={styles.filterIcon} />
                <button type="button" className={styles.filterButton}>
                  组
                </button>
              </div>
              <button type="button" className={styles.createButton}>
                创建
              </button>
            </div>
          </section>

          <section className={styles.organizeSection}>
            <div
              className={styles.organizeImage}
              style={{
                backgroundImage: cssBackgroundUrl(
                  "/figma/assets/93264ca0000ea8e5d49e0e1e4e483ef8f95df628.png",
                ),
              }}
            />
            <h2>整理你的设计方案</h2>
            <p>
              Art 图是灵感的火花，图板则是它们的栖身之所。创建图板，按你喜欢的方式整理 Art 图。
            </p>
            <button type="button" className={styles.primaryAction}>
              创建图板
            </button>
          </section>

          <section className={styles.boardsSection}>
            <h2>随时了解启发你灵感的内容</h2>
            <p>图板可以让你将自己收藏的方案整理到收藏合辑中。从下方的分组开始，或自行创建你自己的分组。</p>
            <div className={styles.boardGrid}>
              {boardGroups.map((board) => (
                <article className={styles.boardCard} key={board.name}>
                  <div className={styles.boardPreview}>
                    <div
                      className={styles.previewMain}
                      style={{ backgroundImage: cssBackgroundUrl(assetUrl(board.imageRefs[0])) }}
                    />
                    <div className={styles.previewStack}>
                      <div
                        className={styles.previewSmall}
                        style={{ backgroundImage: cssBackgroundUrl(assetUrl(board.imageRefs[1])) }}
                      />
                      <div
                        className={styles.previewSmall}
                        style={{ backgroundImage: cssBackgroundUrl(assetUrl(board.imageRefs[2])) }}
                      />
                    </div>
                    <button type="button" className={styles.previewCreate}>
                      创建
                    </button>
                  </div>
                  <h3>{board.name}</h3>
                  <p>{board.count}</p>
                </article>
              ))}
            </div>
          </section>

          <section className={styles.gallerySection}>
            <div className={styles.galleryHeader}>
              <h2>未整理的设计方案</h2>
              <button type="button" className={styles.organizeButton}>
                整理
              </button>
            </div>

            <div className={styles.masonry}>
              {masonryItems.map((item) => (
                <article className={styles.masonryCard} key={item.id}>
                  <div
                    className={styles.masonryVisual}
                    style={{
                      height: `${item.height}px`,
                      backgroundImage: cssBackgroundUrl(assetUrl(item.imageRef)),
                    }}
                  />
                  <div className={styles.masonryMeta}>
                    <span />
                    <span />
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
