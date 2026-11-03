# Editing the website's content

Everything visitors read on kybernetic.systems lives in this folder as Markdown (`.md`) and TOML
(`.toml`) files. Edit a file, save, and the page updates in `vp dev` ([http://localhost:3000](http://localhost:3000)). If a
file has a mistake, the terminal names the file and the field and says what's wrong.

## Where things are

| Folder or file             | What it controls                                             | Page                   |
| -------------------------- | ------------------------------------------------------------ | ---------------------- |
| `singletons/site.toml`     | Company name, CIN, address, phone, email, navigation, footer | Every page             |
| `singletons/home.toml`     | Home page copy                                               | `/`                    |
| `singletons/about.toml`    | About page copy                                              | `/about`               |
| `singletons/products.toml` | Products page copy                                           | `/products`            |
| `singletons/blog.toml`     | Blog index copy                                              | `/blog`                |
| `singletons/careers.toml`  | Careers page copy, hiring steps, role page labels            | `/careers`             |
| `singletons/contact.toml`  | Contact page copy                                            | `/contact`             |
| `singletons/mangrove.toml` | Mangrove product site copy                                   | the Mangrove subdomain |
| `posts/*.md`               | Blog posts                                                   | `/blog/<file name>`    |
| `roles/*.md`               | Job roles: the Careers list row and the role's own page      | `/careers/<file name>` |
| `products/*.md`            | Products                                                     | `/products`            |
| `people/*.md`              | People, with portrait and bio                                | `/about`               |
| `legal/privacy.md`         | Privacy Policy                                               | `/privacy`             |
| `legal/terms.md`           | Terms of Use                                                 | `/terms`               |

The file name of a post or role becomes its web address, so renaming the file changes the URL.

## Frontmatter

Markdown files start with a block between `---` lines, called frontmatter. It holds the fields the
page needs; everything after it is the body.

## Adding a blog post

Create `posts/<short-name>.md`:

```markdown
---
title: The post title
excerpt: One or two sentences shown in lists and search results.
publishedAt: 2026-10-01 # YYYY-MM-DD
tag: Complexity
author: adit-shah # a file name from people/
draft: true # optional; drafts don't appear on the live site
---

The first paragraph.

## A section heading

> A line starting with > becomes a pull quote.
```

## Adding or editing a role

Copy `roles/_template.md` to `roles/<role-name>.md` and fill it in. Only `title`, `status`,
`timing`, `summary` and `tags` are required; the template explains every field. Roles should have
these sections, and the build prints a warning (not an error) when one is missing: About the role ·
What you'll do · What we're looking for · Nice to have · How we work · Compensation & benefits · How
to apply.

To close a role, set `status: closed`. It disappears from the Careers list; its page stays up with
a notice so old links still work.

## Legal documents

Each `##` heading starts a numbered section. When you change the text, update `lastUpdated` (and
`version` for material changes). After counsel has reviewed a document, set:

```yaml
review:
  status: reviewed
  reviewedBy: Firm or person
  reviewedAt: 2026-11-01
```

## Product subdomains

Mangrove has its own address, <https://mangrove.kybernetic.systems/>, but it is built and deployed
with this site. The router maps the subdomain onto the `/mangrove` path, so the page is written in
`singletons/mangrove.toml` like any other page and previewed at `mangrove.localhost:3000` (or at
`localhost:3000/mangrove`) while `vp dev` is running.

Hosting has to send both names to the same build: serve `dist/client` for `kybernetic.systems`, and
for `mangrove.kybernetic.systems` serve the same directory with every request rewritten to
`/mangrove<path>`. Adding another product means adding it to `src/lib/subdomain.ts`, a route under
`src/routes/`, and a prerender entry in `vite.config.ts`.

## Placeholders

Write company details as placeholders so they're kept in one place (`singletons/site.toml`):

`{site.legalName}` · `{site.shortName}` · `{site.email}` · `{site.phone}` · `{site.cin}` ·
`{site.registeredOffice}`

## What's still a placeholder

Content marked `copyStatus: placeholder`, `bioStatus: placeholder` or
`review.status: pending-counsel` is published normally, and shows a "Dev only" badge in `vp dev` and
Storybook. List everything still pending with:

```sh
vp run content:status
```

## Markdown quick reference

| Write              | Get                               |
| ------------------ | --------------------------------- |
| `*italic*`         | _italic_ (brass on some headings) |
| `**bold**`         | **bold**                          |
| `[text](/privacy)` | a link                            |
| `- item`           | a bulleted list                   |
| `## Heading`       | a section heading                 |
| `> quote`          | a pull quote (blog posts)         |
