---
title: "Today I Learned (TIL)"
date: 2026-08-26
tags: [til, kubernetes, helm, cli, debugging]
description: "Today I Learned — bite-sized discoveries, debugging wins, and sharp edges in daily platform engineering."
draft: false
---

# Today I Learned

> [!note]
> Short, focused posts. Things that would have saved me an hour if I'd read them first — tool tricks, config quirks, debugging wins, and sharp edges in tools I use every day.

```bash
$ ls -lt ~/til
```

<div class="hero-grid">

<a href="/til/kubectl-explain-recursive" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/til/kubectl-explain</span>
    </div>
    <span class="hero-badge badge-active">CLI TRICK</span>
  </div>
  <div class="hero-card-title">kubectl explain is a full API reference</div>
  <div class="hero-card-desc">How <code>kubectl explain --recursive</code> dumps the entire nested schema tree for any resource or CRD. Pipe to grep or diff across cluster upgrades without opening docs.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">kubernetes</span>
      <span class="tag-link">kubectl</span>
      <span class="tag-link">cli</span>
    </div>
    <span class="hero-card-action">Read TIL →</span>
  </div>
</a>

<a href="/til/helm-atomic-flag" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/til/helm-atomic</span>
    </div>
    <span class="hero-badge badge-blueprint">GOTCHA</span>
  </div>
  <div class="hero-card-title">Helm --atomic does automatic rollback</div>
  <div class="hero-card-desc">Understanding Helm's <code>--atomic</code> behavior: automated failure rollback, incremental revision counters, and the critical first-install delete gotcha.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">helm</span>
      <span class="tag-link">kubernetes</span>
      <span class="tag-link">devops</span>
    </div>
    <span class="hero-card-action">Read TIL →</span>
  </div>
</a>

<a href="/til/crictl-node-debugging" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/til/crictl-debugging</span>
    </div>
    <span class="hero-badge badge-active">DEBUGGING</span>
  </div>
  <div class="hero-card-title">crictl is kubectl for the node</div>
  <div class="hero-card-desc">Talking directly to containerd and CRI-O runtimes on Kubernetes nodes. How to inspect stopped containers, pull logs, and exec into pods when the API server is unreachable.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">containers</span>
      <span class="tag-link">crictl</span>
      <span class="tag-link">debugging</span>
    </div>
    <span class="hero-card-action">Read TIL →</span>
  </div>
</a>

</div>
