---
title: "TIL: Git Worktrees are Underrated"
date: 2026-06-10
tags: [til, git, productivity, cli]
description: "Git worktrees let you check out multiple branches simultaneously in separate directories — no more stashing or switching."
draft: false
---

**TIL** that `git worktree` lets you have multiple branches checked out at the same time in different directories.

## The Problem

You're deep in a feature branch. A critical bug lands on `main`. You have to either:
- `git stash` everything, switch branch, fix it, come back, `git stash pop`
- Clone the repo again to a second directory

Both are annoying.

## The Solution: `git worktree`

```bash
# Add a new worktree for the hotfix
git worktree add ../myapp-hotfix main

# Now you have:
# ./myapp          ← your feature branch (unchanged)
# ./myapp-hotfix   ← main branch, ready to work

cd ../myapp-hotfix
# make your fix, commit, push
git commit -am "fix: critical prod bug"
git push
```

When done:

```bash
# Back in your main repo dir
cd ../myapp

# Remove the worktree
git worktree remove ../myapp-hotfix

# Or prune stale entries
git worktree prune
```

## List All Worktrees

```bash
git worktree list
# /Users/me/myapp          abc1234 [feature/my-feature]
# /Users/me/myapp-hotfix   def5678 [main]
```

## Use Case: PR Reviews

```bash
# Check out a colleague's PR branch for review
git fetch origin pull/42/head:pr-42
git worktree add /tmp/pr-42-review pr-42

# Review in a separate window, no context switch
cd /tmp/pr-42-review
# ... read code, run tests ...

# Clean up
git worktree remove /tmp/pr-42-review
git branch -d pr-42
```

## Caveats

> [!warning]
> - You **cannot** check out the same branch in two worktrees simultaneously.
> - Each worktree shares the `.git` folder of the main repo — they're lightweight.
> - Node modules, build artifacts etc. are per-worktree, so you'll need to `npm install` in each.

## TL;DR

```bash
git worktree add <path> <branch>   # create
git worktree list                  # list all
git worktree remove <path>         # remove
git worktree prune                 # clean stale refs
```

This is now permanently in my toolkit. Should've known about it years ago.
