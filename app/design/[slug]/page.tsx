import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { designItems, getDesignBySlug } from "@/lib/design-data";
import { withBasePath } from "@/lib/paths";
import styles from "./page.module.scss";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return designItems.map((item) => ({ slug: item.slug }));
}

export default async function DesignDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const design = getDesignBySlug(slug);

  if (!design) {
    notFound();
  }

  const relatedItems = designItems.filter((item) => item.slug !== slug).slice(0, 4);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.backLink}>
            返回首页
          </Link>
          <Link href="/settings?section=profile" className={styles.profileLink}>
            修改个人信息
          </Link>
        </header>

        <section className={styles.hero}>
          <div className={styles.visualWrap}>
            <Image
              src={withBasePath(design.imagePath)}
              alt={design.title}
              width={560}
              height={Math.max(400, Math.round((560 / 226) * design.imageHeight))}
              className={styles.visual}
            />
          </div>

          <div className={styles.heroInfo}>
            <p className={styles.category}>{design.category}</p>
            <h1>{design.title}</h1>
            <p className={styles.summary}>{design.summary}</p>
            <p className={styles.description}>{design.description}</p>

            <dl className={styles.metaList}>
              <div>
                <dt>作者</dt>
                <dd>{design.author}</dd>
              </div>
              <div>
                <dt>来源</dt>
                <dd>{design.source}</dd>
              </div>
              <div>
                <dt>收藏分类</dt>
                <dd>{design.board}</dd>
              </div>
            </dl>

            <div className={styles.tagRow}>
              {design.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.relatedSection}>
          <div className={styles.relatedHeader}>
            <h2>继续浏览其他方案</h2>
            <Link href="/" className={styles.backLink}>
              查看全部
            </Link>
          </div>

          <div className={styles.relatedGrid}>
            {relatedItems.map((item) => (
              <Link key={item.slug} href={`/design/${item.slug}`} className={styles.relatedCard}>
                <Image
                  src={withBasePath(item.imagePath)}
                  alt={item.title}
                  width={226}
                  height={item.imageHeight}
                  className={styles.relatedImage}
                />
                <div className={styles.relatedMeta}>
                  <h3>{item.title}</h3>
                  <p>{item.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
