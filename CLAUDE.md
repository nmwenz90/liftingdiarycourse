# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 application (App Router) built with TypeScript 5, React 19, and Tailwind CSS 4. Currently in early development stage — bootstrapped with create-next-app.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm start        # Start production server (run build first)
npm run lint     # ESLint with Next.js + TypeScript rules
```

No test framework is configured yet.

## Architecture

- **App Router**: All pages/layouts live in `src/app/` using Next.js App Router conventions (server components by default)
- **Path alias**: `@/*` maps to `./src/*`
- **Styling**: Tailwind CSS 4 via PostCSS; global styles in `src/app/globals.css` with CSS custom properties for theming and dark mode via `prefers-color-scheme`
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google` with CSS variables `--font-geist-sans` and `--font-geist-mono`
- **ESLint**: v9 flat config format (`eslint.config.mjs`) extending `eslint-config-next` (core web vitals + TypeScript)
- **TypeScript**: Strict mode enabled, bundler module resolution
