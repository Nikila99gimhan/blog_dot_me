---
title: "TIL: Helm's --atomic flag does an automatic rollback on failure"
date: 2026-08-26
tags: [helm, kubernetes, til, devops]
description: "helm upgrade --atomic waits for the rollout and automatically rolls back to the previous release if the upgrade fails. Useful but has a sharp edge."
draft: false
---

I spent too long manually running `helm rollback` after failed upgrades. `--atomic` handles this automatically — and it's been in Helm since v2.

## What it does

```bash
helm upgrade my-release ./chart --atomic --timeout 5m
```

`--atomic` combines two behaviours:

1. **Waits** for all resources to reach a ready state (same as `--wait`)
2. **Rolls back** to the previous release automatically if the timeout is hit or any resource fails

Without `--atomic`, a failed upgrade leaves the release in a `failed` state and you have to manually run `helm rollback`.

## The sharp edge: it deletes on install failure

If you're running `helm upgrade --install` (install if not exists, upgrade otherwise) and this is the **first install**, `--atomic` will **delete the entire release** on failure instead of rolling back. There's nothing to roll back to.

```bash
helm upgrade --install my-release ./chart --atomic --timeout 3m
# First run, chart fails to deploy:
# → Release is deleted entirely, not rolled back
```

> [!warning]
> On first installs, `--atomic` is destructive. The release and all its resources are purged. If you need the failed state for debugging, don't use `--atomic` on first installs.

## Checking what Helm rolled back to

After a rollback, check the release history:

```bash
helm history my-release
```

```
REVISION  STATUS      CHART           DESCRIPTION
1         superseded  my-chart-1.2.0  Install complete
2         failed      my-chart-1.3.0  Upgrade failed
3         deployed    my-chart-1.2.0  Rollback to 1
```

The `--atomic` rollback creates a new revision — it doesn't restore in place. Your revision counter keeps incrementing.

## When to use it

| Scenario | Use `--atomic`? |
|---|---|
| CI/CD pipeline, upgrade of existing release | ✅ Yes — auto-rollback on failure |
| First-time install in CI | ❌ No — deletes on failure, nothing to debug |
| Manual local upgrade | Maybe — depends if you want to inspect failure |
| Canary / blue-green with manual cutover | ❌ No — you want to control rollback |

> [!tip]
> Pair `--atomic` with `--cleanup-on-fail` to also clean up new resources that were created during the failed upgrade but shouldn't persist after rollback.
