---
title: "GitHub Actions Reusable Workflows"
date: 2026-06-15
tags: [github-actions, cicd, devops, automation]
description: "Stop copy-pasting CI pipelines. Learn how to write reusable GitHub Actions workflows that your whole org can share."
draft: false
---

If you've managed more than a handful of repos, you've probably copy-pasted your CI pipeline at least once. Reusable workflows fix that.

## The Problem

Every repo ends up with some variation of:

```yaml
# .github/workflows/ci.yml (copy-pasted in 20 repos 😬)
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm test
```

When you need to change something — say, upgrade Node — you now have 20 PRs to open.

## Reusable Workflow — Caller/Callee Model

GitHub Actions has a `workflow_call` trigger that makes a workflow callable from other workflows.

### The Reusable Workflow (callee)

Create this in a **shared** repo, e.g. `org/shared-workflows`:

```yaml
# .github/workflows/node-ci.yml
name: Node.js CI (Reusable)

on:
  workflow_call:
    inputs:
      node-version:
        required: false
        type: string
        default: "20"
      working-directory:
        required: false
        type: string
        default: "."
    secrets:
      NPM_TOKEN:
        required: false

jobs:
  test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ${{ inputs.working-directory }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: npm

      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build
```

### Calling the Workflow (caller)

In any consumer repo:

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    uses: org/shared-workflows/.github/workflows/node-ci.yml@main
    with:
      node-version: "20"
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

That's it. One line to pull in the whole pipeline.

## Passing Outputs Between Jobs

```yaml
# Reusable workflow that outputs a value
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}
    steps:
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
```

```yaml
# Caller consuming the output
jobs:
  build:
    uses: org/shared-workflows/.github/workflows/docker-build.yml@main

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - run: echo "Deploying ${{ needs.build.outputs.image-tag }}"
```

## Matrix Strategy in Reusable Workflows

```yaml
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node: ["18", "20", "22"]
    uses: org/shared-workflows/.github/workflows/node-ci.yml@main
    with:
      node-version: ${{ matrix.node }}
```

> [!warning]
> You can't directly pass matrix values into `uses:` — you need a wrapper job. See the [GitHub docs](https://docs.github.com/en/actions/sharing-automations/reusing-workflows) for the current workaround.

## Tips & Gotchas

```bash
# Test locally before pushing with act
brew install act
act push --workflows .github/workflows/ci.yml
```

| Gotcha | Fix |
|---|---|
| Secrets aren't inherited automatically | Pass explicitly with `secrets: inherit` |
| Can't use `env:` at top level in callee | Use `inputs` instead |
| Matrix + `workflow_call` quirk | Use intermediate job |
| Ref must be a commit SHA, tag, or branch | Pin to a tag for stability |

## Full Docker Build + Push Example

```yaml
# .github/workflows/docker.yml (reusable)
on:
  workflow_call:
    inputs:
      image-name:
        required: true
        type: string
      dockerfile:
        required: false
        type: string
        default: Dockerfile
    secrets:
      REGISTRY_TOKEN:
        required: true

jobs:
  build-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.REGISTRY_TOKEN }}

      - uses: docker/metadata-action@v5
        id: meta
        with:
          images: ghcr.io/${{ inputs.image-name }}
          tags: |
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=sha,prefix=sha-

      - uses: docker/build-push-action@v5
        with:
          context: .
          file: ${{ inputs.dockerfile }}
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

## Related Posts

- [[devops/kubernetes-zero-to-prod|Kubernetes: Zero to Prod]]
- [[tools/dotfiles-setup|My Dotfiles Setup]]
