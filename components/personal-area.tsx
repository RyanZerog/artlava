"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SettingsGearIcon } from "@/components/settings-gear-icon";
import { cssBackgroundUrl, withBasePath } from "@/lib/paths";
import {
  ASSET_BASE,
  boardGroups as defaultBoardGroups,
  collageProjects as defaultCollageProjects,
  contacts,
  createTypes,
  designItems,
  iconRefs,
  navItems,
  notificationItems,
  settingsDefaultProfile,
  settingSections,
  type Contact,
  type CreateType,
  type DesignItem,
  type NavKey,
  type SettingSection,
  type WorkspacePanelKey,
  type WorkspaceTabKey,
  workspaceTabs,
} from "@/lib/design-data";
import styles from "./personal-area.module.scss";

type PersonalAreaProps = {
  initialPanel: WorkspacePanelKey;
};

type ProfileFormState = {
  nickname: string;
  email: string;
  bio: string;
};

const assetUrl = (imageRef: string) => `${ASSET_BASE}/${imageRef}.png`;

const defaultCreateImages = [
  "b134f096e092b7e73f9b0986b92365aac1eb718a",
  "7cf293613b0712332499c72f042b278df4cd8b6f",
  "e205a80024c2746469b9d7faccc4f73f4926961c",
] as const;

function panelRoute(panel: WorkspacePanelKey) {
  if (panel === "none") {
    return "/workspace";
  }

  if (panel === "create") {
    return "/create";
  }

  if (panel === "notifications") {
    return "/updates";
  }

  if (panel === "messages") {
    return "/messages";
  }

  return "/settings";
}

function navRoute(key: NavKey) {
  if (key === "home") {
    return "/";
  }

  if (key === "profile") {
    return "/workspace";
  }

  if (key === "create") {
    return "/create";
  }

  if (key === "bell") {
    return "/updates";
  }

  return "/messages";
}

function panelFromNav(key: NavKey): WorkspacePanelKey {
  if (key === "create") {
    return "create";
  }

  if (key === "bell") {
    return "notifications";
  }

  if (key === "message") {
    return "messages";
  }

  return "none";
}

export function PersonalArea({ initialPanel }: PersonalAreaProps) {
  const router = useRouter();
  const [panel, setPanel] = useState<WorkspacePanelKey>(initialPanel);
  const [activeTab, setActiveTab] = useState<WorkspaceTabKey>("art");
  const [searchValue, setSearchValue] = useState("");
  const [artItems, setArtItems] = useState<DesignItem[]>(designItems);
  const [boardItems, setBoardItems] = useState(defaultBoardGroups);
  const [collages, setCollages] = useState(defaultCollageProjects);
  const [selectedCreateType, setSelectedCreateType] = useState<CreateType["key"]>("art");
  const [draftTitle, setDraftTitle] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<number>(contacts[0]?.id ?? 0);
  const [settingsSection, setSettingsSection] = useState<SettingSection["key"]>("profile");
  const [profileForm, setProfileForm] = useState<ProfileFormState>(settingsDefaultProfile);
  const [toast, setToast] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("全部");
  const toastTimerRef = useRef<number | null>(null);

  const activeNav: NavKey =
    panel === "create"
      ? "create"
      : panel === "notifications"
        ? "bell"
        : panel === "messages"
          ? "message"
          : "profile";

  const visibleArtItems = useMemo(() => {
    const keyword = searchValue.replace(/\s+/g, " ").trim().toLowerCase();

    return artItems.filter((item) => {
      const byCategory = activeCategory === "全部" || item.category === activeCategory;
      if (!byCategory) {
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
  }, [activeCategory, artItems, searchValue]);

  const visibleBoards = useMemo(() => {
    const keyword = searchValue.replace(/\s+/g, " ").trim().toLowerCase();
    if (!keyword) {
      return boardItems;
    }

    return boardItems.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [boardItems, searchValue]);

  const visibleCollages = useMemo(() => {
    const keyword = searchValue.replace(/\s+/g, " ").trim().toLowerCase();
    if (!keyword) {
      return collages;
    }

    return collages.filter(
      (item) =>
        item.title.toLowerCase().includes(keyword) ||
        item.mood.toLowerCase().includes(keyword),
    );
  }, [collages, searchValue]);

  const categories = useMemo(() => {
    return ["全部", ...new Set(artItems.map((item) => item.category))];
  }, [artItems]);

  const selectedContact: Contact | undefined = contacts.find((item) => item.id === selectedContactId);

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

  const navigatePanel = (nextPanel: WorkspacePanelKey) => {
    setPanel(nextPanel);
    router.push(panelRoute(nextPanel));
  };

  const handleNavClick = (key: NavKey) => {
    setPanel(panelFromNav(key));
    router.push(navRoute(key));
  };

  const handleQuickAction = () => {
    if (activeTab === "boards") {
      navigatePanel("create");
      setSelectedCreateType("board");
      return;
    }

    if (activeTab === "collages") {
      navigatePanel("create");
      setSelectedCreateType("collage");
      return;
    }

    navigatePanel("create");
    setSelectedCreateType("art");
  };

  const handleCreateSubmit = () => {
    const title = draftTitle.replace(/\s+/g, " ").trim();
    if (!title) {
      showToast("请输入标题后再创建");
      return;
    }

    if (selectedCreateType === "board") {
      setBoardItems((current) => [
        {
          name: title,
          count: "0 份方案",
          imageRefs: [...defaultCreateImages],
        },
        ...current,
      ]);
      setDraftTitle("");
      setActiveTab("boards");
      showToast(`已创建收藏分类“${title}”`);
      return;
    }

    if (selectedCreateType === "collage") {
      setCollages((current) => [
        {
          id: Date.now(),
          title,
          mood: "拼贴 / 草稿 / 待发布",
          imageRef: defaultCreateImages[0],
          published: false,
        },
        ...current,
      ]);
      setDraftTitle("");
      setActiveTab("collages");
      showToast(`已创建拼贴“${title}”`);
      return;
    }

    setArtItems((current) => [
      {
        id: Date.now(),
        slug: `draft-${Date.now()}`,
        title,
        source: "我的上传",
        imagePath: "/figma/home/4-6.png",
        imageHeight: 262,
        summary: "用户新上传的设计方案",
        description: "这是一个通过上传设计方案入口创建的演示条目，可继续进入详情页查看。",
        category: "我的上传",
        board: "我的设计",
        author: profileForm.nickname,
        tags: ["上传", "草稿"],
      },
      ...current,
    ]);
    setDraftTitle("");
    setActiveTab("art");
    showToast(`已上传 Art 图“${title}”`);
  };

  const handlePublishCollage = (id: number) => {
    setCollages((current) =>
      current.map((item) => (item.id === id ? { ...item, published: true } : item)),
    );
    showToast("拼贴已发布");
  };

  const renderSidePanel = () => {
    if (panel === "none") {
      return null;
    }

    if (panel === "create") {
      return (
        <aside className={styles.sidePanel}>
          <header className={styles.panelHeader}>
            <p>上传设计方案</p>
            <button type="button" onClick={() => navigatePanel("none")} aria-label="关闭">
              ×
            </button>
          </header>

          <section className={styles.cardStack}>
            {createTypes.map((item) => (
              <button
                key={item.key}
                type="button"
                className={
                  selectedCreateType === item.key ? styles.actionCardActive : styles.actionCard
                }
                onClick={() => setSelectedCreateType(item.key)}
              >
                <div className={styles.actionCardIcon}>
                  {item.key === "art" ? "A" : item.key === "board" ? "图" : "拼"}
                </div>
                <div className={styles.actionCardText}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </button>
            ))}
          </section>

          <section className={styles.panelForm}>
            <h4>{createTypes.find((item) => item.key === selectedCreateType)?.actionLabel}</h4>
            <input
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value.slice(0, 40))}
              placeholder={
                selectedCreateType === "art"
                  ? "输入设计方案标题"
                  : selectedCreateType === "board"
                    ? "输入收藏分类名称"
                    : "输入拼贴项目名称"
              }
            />
            <button type="button" className={styles.primaryActionButton} onClick={handleCreateSubmit}>
              {createTypes.find((item) => item.key === selectedCreateType)?.actionLabel}
            </button>
          </section>
        </aside>
      );
    }

    if (panel === "notifications") {
      return (
        <aside className={styles.sidePanel}>
          <header className={styles.panelHeader}>
            <p>更新通知</p>
            <button type="button" onClick={() => navigatePanel("none")} aria-label="关闭">
              ×
            </button>
          </header>

          <section className={styles.cardStack}>
            {notificationItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={styles.noticeCard}
                onClick={() => router.push(`/design/${item.slug}`)}
              >
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </button>
            ))}
          </section>
        </aside>
      );
    }

    if (panel === "messages") {
      return (
        <aside className={styles.sidePanel}>
          <header className={styles.panelHeader}>
            <p>聊天信息</p>
            <button type="button" onClick={() => navigatePanel("none")} aria-label="关闭">
              ×
            </button>
          </header>

          <section className={styles.chatPanel}>
            <div className={styles.contactList}>
              {contacts.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={selectedContactId === item.id ? styles.contactActive : styles.contactItem}
                  onClick={() => setSelectedContactId(item.id)}
                >
                  <strong>{item.name}</strong>
                  <span>{item.preview}</span>
                </button>
              ))}
            </div>

            <div className={styles.chatThread}>
              <div className={styles.threadHeader}>
                <h3>{selectedContact?.name}</h3>
                <p>{selectedContact?.role}</p>
              </div>
              <div className={styles.messageList}>
                {selectedContact?.messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      message.from === "me" ? styles.messageBubbleSelf : styles.messageBubble
                    }
                  >
                    {message.text}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </aside>
      );
    }

    return (
      <aside className={styles.sidePanel}>
        <header className={styles.panelHeader}>
          <p>设置与支持</p>
          <button type="button" onClick={() => navigatePanel("none")} aria-label="关闭">
            ×
          </button>
        </header>

        <section className={styles.settingsLayout}>
          <div className={styles.settingsMenu}>
            {settingSections.map((item) => (
              <button
                key={item.key}
                type="button"
                className={
                  settingsSection === item.key ? styles.settingItemActive : styles.settingItem
                }
                onClick={() => setSettingsSection(item.key)}
              >
                <strong>{item.title}</strong>
                <span>{item.desc}</span>
              </button>
            ))}
          </div>

          <div className={styles.settingsDetail}>
            {settingsSection === "profile" ? (
              <>
                <h3>修改个人信息</h3>
                <label>
                  昵称
                  <input
                    value={profileForm.nickname}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        nickname: event.target.value.slice(0, 20),
                      }))
                    }
                  />
                </label>
                <label>
                  邮箱
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        email: event.target.value.slice(0, 40),
                      }))
                    }
                  />
                </label>
                <label>
                  简介
                  <textarea
                    rows={4}
                    value={profileForm.bio}
                    onChange={(event) =>
                      setProfileForm((current) => ({
                        ...current,
                        bio: event.target.value.slice(0, 120),
                      }))
                    }
                  />
                </label>
                <button
                  type="button"
                  className={styles.primaryActionButton}
                  onClick={() => showToast("个人信息已保存")}
                >
                  保存资料
                </button>
              </>
            ) : null}

            {settingsSection === "preferences" ? (
              <>
                <h3>偏好设置</h3>
                <div className={styles.preferenceRow}>
                  <span>首页优先展示收藏分类</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.preferenceRow}>
                  <span>接收新方案发布提醒</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className={styles.preferenceRow}>
                  <span>自动按分类整理收藏</span>
                  <input type="checkbox" />
                </div>
              </>
            ) : null}

            {settingsSection === "support" ? (
              <>
                <h3>设置与支持</h3>
                <button type="button" className={styles.supportLink} onClick={() => showToast("已打开常见问题")}>
                  常见问题
                </button>
                <button type="button" className={styles.supportLink} onClick={() => showToast("已打开反馈入口")}>
                  问题反馈
                </button>
                <button type="button" className={styles.supportLink} onClick={() => showToast("已打开联系支持")}>
                  联系支持
                </button>
              </>
            ) : null}
          </div>
        </section>
      </aside>
    );
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
          aria-label="设置与支持"
          onClick={() => showToast("设置与支持待开发")}
        >
          <SettingsGearIcon className={styles.settingsIcon} />
        </button>
      </aside>

      {renderSidePanel()}

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
              onChange={(event) => setSearchValue(event.target.value.slice(0, 60))}
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
              aria-label="修改个人信息"
              onClick={() => {
                setSettingsSection("profile");
                setPanel("settings");
                router.push("/settings");
              }}
            />
          </div>
        </header>

        <main className={styles.mainContent}>
          <section className={styles.heroSection}>
            <div className={styles.heroHeader}>
              <div>
                <h1>你喜欢的设计</h1>
                <p className={styles.heroDesc}>
                  在一个地方整理收藏、图板和拼贴，并根据你的个人逻辑继续扩展。
                </p>
              </div>

              <article className={styles.profileCard}>
                <div className={styles.avatar} />
                <div className={styles.profileText}>
                  <p className={styles.profileName}>{profileForm.nickname}</p>
                  <p className={styles.profileMeta}>{visibleArtItems.length} 份收藏</p>
                </div>
                <button
                  type="button"
                  className={styles.profileButton}
                  onClick={() => {
                    setSettingsSection("profile");
                    setPanel("settings");
                    router.push("/settings");
                  }}
                >
                  设置个人资料
                </button>
              </article>
            </div>

            <div className={styles.tabs}>
              {workspaceTabs.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={activeTab === item.key ? styles.tabActive : styles.tab}
                  onClick={() => setActiveTab(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className={styles.tabDescription}>
              {workspaceTabs.find((item) => item.key === activeTab)?.subtitle}
            </p>

            <div className={styles.filterBar}>
              <div className={styles.filterLeft}>
                <span className={styles.filterIcon} />
                <button type="button" className={styles.filterButton}>
                  {activeTab === "art" ? "收藏方案" : activeTab === "boards" ? "收藏分类" : "拼贴项目"}
                </button>
              </div>
              <button type="button" className={styles.createButton} onClick={handleQuickAction}>
                {activeTab === "art" ? "上传" : activeTab === "boards" ? "新建分类" : "发布拼贴"}
              </button>
            </div>
          </section>

          {activeTab === "art" ? (
            <section className={styles.sectionBlock}>
              <div className={styles.categoryRow}>
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={activeCategory === item ? styles.categoryChipActive : styles.categoryChip}
                    onClick={() => setActiveCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className={styles.designGrid}>
                {visibleArtItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.designCard}
                    onClick={() => router.push(`/design/${item.slug}`)}
                  >
                    <div className={styles.designVisualWrap}>
                      <Image
                        src={withBasePath(item.imagePath)}
                        alt={item.title}
                        width={226}
                        height={item.imageHeight}
                        className={styles.designVisual}
                      />
                    </div>
                    <div className={styles.designMeta}>
                      <h3>{item.title}</h3>
                      <p>{item.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "boards" ? (
            <section className={styles.sectionBlock}>
              <div className={styles.boardGrid}>
                {visibleBoards.map((board) => (
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
                    </div>
                    <h3>{board.name}</h3>
                    <p>{board.count}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "collages" ? (
            <section className={styles.sectionBlock}>
              <div className={styles.collageGrid}>
                {visibleCollages.map((item) => (
                  <article className={styles.collageCard} key={item.id}>
                    <div
                      className={styles.collageVisual}
                      style={{ backgroundImage: cssBackgroundUrl(assetUrl(item.imageRef)) }}
                    />
                    <div className={styles.collageMeta}>
                      <h3>{item.title}</h3>
                      <p>{item.mood}</p>
                    </div>
                    <button
                      type="button"
                      className={item.published ? styles.mutedActionButton : styles.primaryActionButton}
                      disabled={item.published}
                      onClick={() => handlePublishCollage(item.id)}
                    >
                      {item.published ? "已发布" : "发布"}
                    </button>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>

      {toast ? <div className={styles.toast}>{toast}</div> : null}
    </div>
  );
}
