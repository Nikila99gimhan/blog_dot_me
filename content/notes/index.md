---
title: "Engineering Notes & Blueprints"
date: 2026-08-26
tags: [notes, blueprints, architecture, ray, github-actions, azure]
description: "Long-form technical blueprints, system architectures, and deep dives on platform engineering topics."
draft: false
---

# Engineering Notes & Blueprints

> [!note]
> Long-form technical blueprints, production system walkthroughs, and deep dives on platform engineering, distributed computing, and developer platform infrastructure.

```bash
$ tree ~/notes --sort=date
```

<div class="hero-grid">

<a href="/notes/anyscale-on-azure" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/notes/anyscale-azure</span>
    </div>
    <span class="hero-badge badge-blueprint">BLUEPRINT</span>
  </div>
  <div class="hero-card-title">Anyscale on Azure</div>
  <div class="hero-card-desc">Architecting enterprise-grade distributed Ray compute platforms on Azure with Private Link isolation, managed identities, and integration with AKS workload clusters.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">ray</span>
      <span class="tag-link">azure</span>
      <span class="tag-link">ai-infra</span>
    </div>
    <span class="hero-card-action">Read Blueprint →</span>
  </div>
</a>

<a href="/notes/arc-github-runners-platform-as-a-service" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/notes/arc-paas</span>
    </div>
    <span class="hero-badge badge-blueprint">BLUEPRINT</span>
  </div>
  <div class="hero-card-title">ARC: GitHub Runners Platform as a Service</div>
  <div class="hero-card-desc">Designing an internal CI PaaS using Actions Runner Controller (ARC) on Kubernetes. Covers autoscaling runner scale sets, ephemeral security boundaries, and Docker-in-Docker caching.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">github-actions</span>
      <span class="tag-link">arc</span>
      <span class="tag-link">paas</span>
    </div>
    <span class="hero-card-action">Read Blueprint →</span>
  </div>
</a>

<div class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/notes/crossplane-control-planes</span>
    </div>
    <span class="hero-badge badge-upcoming">UPCOMING</span>
  </div>
  <div class="hero-card-title">Zero-Trust Control Planes with Crossplane</div>
  <div class="hero-card-desc">Composing custom cloud infrastructure APIs, Compositions, policy validation via Kyverno, and self-service database/compute provisioning via Kubernetes CRDs.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">crossplane</span>
      <span class="tag-link">control-plane</span>
      <span class="tag-link">iac</span>
    </div>
    <span class="hero-card-action" style="opacity: 0.6;">Drafting · Stay Tuned</span>
  </div>
</div>

</div>
