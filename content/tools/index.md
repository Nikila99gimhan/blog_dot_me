---
title: "Tools & Platform Stack"
date: 2026-08-26
tags: [tools, cli, dotfiles, kubernetes, terraform, terminal]
description: "The CLI tools, terminal utilities, infrastructure frameworks, and configs behind my daily platform engineering workflow."
draft: false
---

# Tools & Daily Platform Stack

> [!note]
> The curated toolchain, CLI utilities, and dotfile configurations that power my daily platform engineering workflow. Fast, keyboard-first, and built for cloud-native productivity.

```bash
$ cat ~/tools/manifest.yaml
```

<div class="hero-grid">

<div class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/tools/k8s-ecosystem</span>
    </div>
    <span class="hero-badge badge-active">TOOLCHAIN</span>
  </div>
  <div class="hero-card-title">Kubernetes Cluster Navigation & Logs</div>
  <div class="hero-card-desc"><code>k9s</code> (terminal UI for live cluster management), <code>kubectx</code> + <code>kubens</code> (instant context switching), and <code>stern</code> (multi-pod streaming log tailing with regex matching).</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">k9s</span>
      <span class="tag-link">stern</span>
      <span class="tag-link">kubectl</span>
    </div>
    <span class="hero-card-action">Daily Driver</span>
  </div>
</div>

<div class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/tools/iac-orchestration</span>
    </div>
    <span class="hero-badge badge-blueprint">IAC STACK</span>
  </div>
  <div class="hero-card-title">Infrastructure as Code & Security</div>
  <div class="hero-card-desc"><code>terraform</code> & <code>opentofu</code> for declarative cloud resources, <code>terragrunt</code> for DRY module hierarchies, and <code>tflint</code> + <code>trivy</code> for pre-commit policy enforcement.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">terraform</span>
      <span class="tag-link">opentofu</span>
      <span class="tag-link">terragrunt</span>
    </div>
    <span class="hero-card-action">Daily Driver</span>
  </div>
</div>

<div class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/tools/containers-ebpf</span>
    </div>
    <span class="hero-badge badge-active">RUNTIME</span>
  </div>
  <div class="hero-card-title">Container Inspection & eBPF Networking</div>
  <div class="hero-card-desc"><code>dive</code> (interactive image layer exploration & size optimization), <code>cilium-cli</code> (eBPF network diagnostics), and <code>crictl</code> (low-level node container runtime debugging).</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">dive</span>
      <span class="tag-link">cilium</span>
      <span class="tag-link">containerd</span>
    </div>
    <span class="hero-card-action">Daily Driver</span>
  </div>
</div>

<div class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/tools/terminal-dotfiles</span>
    </div>
    <span class="hero-badge badge-upcoming">DOTFILES</span>
  </div>
  <div class="hero-card-title">Terminal Environment & Productivity</div>
  <div class="hero-card-desc"><code>mise</code> (polyglot runtime version manager), <code>starship</code> (sub-millisecond shell prompt), <code>tmux</code> (session persistence), and <code>fzf</code> (fuzzy shell history).</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">mise</span>
      <span class="tag-link">starship</span>
      <span class="tag-link">tmux</span>
    </div>
    <span class="hero-card-action">Configs Coming Soon</span>
  </div>
</div>

</div>
