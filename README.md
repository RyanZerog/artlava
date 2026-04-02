This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Local development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Local static preview

Build a local-root version and preview it:

```bash
npm run preview:local
```

This generates `.next-local/` and serves it at `http://localhost:3000/`.

### GitHub Pages preview

Build a GitHub Pages version and preview it locally:

```bash
npm run preview:pages
```

This generates `.next-pages/` and serves it at `http://localhost:3000/artlava/`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on GitHub Pages

This project is already configured for GitHub Pages:

1. Create a GitHub repository and push this project to the `main` branch.
2. In GitHub, open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push a new commit to `main`.

After the workflow finishes, GitHub Pages will publish the static site automatically.

### Build outputs are separated

```bash
npm run build:local
npm run build:pages
```

- `build:local` → `.next-local/`
- `build:pages` → `.next-pages/`

This avoids mixing your local preview build with the GitHub Pages build.
