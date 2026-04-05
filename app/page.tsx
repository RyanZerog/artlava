"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsGearIcon } from "@/components/settings-gear-icon";
import { cssBackgroundUrl, withBasePath } from "@/lib/paths";
import { designItems, iconRefs, navItems, type NavKey } from "@/lib/design-data";
import styles from "./page.module.scss";

const ASSET_BASE = "/figma/assets";

export default function Home() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavKey>("home");
  const [searchValue, setSearchValue] = useState("");
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const visibleItems = useMemo(() => {
    const keyword = searchValue.replace(/\s+/g, " ").trim().toLowerCase();

    return designItems.filter((item) => {
      if (hiddenIds.includes(item.id)) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return (
        item.title.toLowerCase().includes(keyword) ||
        item.category.toLowerCase().includes(keyword) ||
        item.tags.join(" ").toLowerCase().includes(keyword)
      );
    });
  }, [hiddenIds, searchValue]);

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

    router.push("/messages");
  };

  const handleHideItem = (id: number, title: string) => {
    setHiddenIds((current) => [...current, id]);
    setOpenMenuId(null);
    showToast(`已减少“${title}”的类似推荐`);
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
              onClick={() => handleNavClick(item.key)}
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
                style={{ backgroundImage: cssBackgroundUrl(`${ASSET_BASE}/${iconRefs.search}.png`) }}
                aria-hidden="true"
              />
            </button>
            <input
              className={styles.searchInput}
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value.slice(0, 60))}
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
              aria-label="修改个人信息"
              onClick={() => router.push("/settings?section=profile")}
            />
          </div>
        </header>

        <main className={styles.mainContent}>
          {visibleItems.length > 0 ? (
            <section className={styles.masonry}>
              {visibleItems.map((item) => (
                <article className={styles.card} key={item.id}>
                  <div
                    className={styles.cardLink}
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/design/${item.slug}`)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        router.push(`/design/${item.slug}`);
                      }
                    }}
                  >
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
                        <div className={styles.moreWrap}>
                          <button
                            type="button"
                            className={styles.moreButton}
                            aria-label={`${item.title} 更多`}
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenMenuId((current) => (current === item.id ? null : item.id));
                            }}
                          >
                            ...
                          </button>
                          {openMenuId === item.id ? (
                            <div className={styles.moreMenu} onClick={(event) => event.stopPropagation()}>
                              <button
                                type="button"
                                className={styles.moreMenuButton}
                                onClick={() => handleHideItem(item.id, item.title)}
                              >
                                不感兴趣
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <section className={styles.emptyState}>
              <h2>没有找到匹配的设计方案</h2>
              <p>试试换一个关键词，或者回到默认浏览状态。</p>
              <button type="button" className={styles.resetButton} onClick={() => setSearchValue("")}>
                清空搜索
              </button>
            </section>
          )}
        </main>
      </div>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
