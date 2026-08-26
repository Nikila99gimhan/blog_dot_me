---
title: "DevOps & Cloud Architecture"
date: 2026-08-26
tags: [devops, kubernetes, azure, aks, tls, gitops]
description: "Production blueprints, Kubernetes networking, TLS lifecycle management, and cloud-native platform infrastructure."
draft: false
---

# DevOps & Cloud Infrastructure

> [!note]
> Deep-dives into Kubernetes networking, Layer 7 ingress, TLS certificate automation, and production cluster architecture. Real-world patterns designed for platform reliability.

```bash
$ tree ~/devops --sort=date
```

<div class="hero-grid">

<a href="/devops/azure-application-gateway-for-containers" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/devops/azure-appgw</span>
    </div>
    <span class="hero-badge badge-active">DEEP DIVE</span>
  </div>
  <div class="hero-card-title">Azure Application Gateway for Containers</div>
  <div class="hero-card-desc">Layer 7 traffic orchestration on AKS with Application Gateway for Containers, Gateway API custom resources, and automated TLS offloading. Includes 5 architecture diagrams.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">aks</span>
      <span class="tag-link">gateway-api</span>
      <span class="tag-link">azure</span>
    </div>
    <span class="hero-card-action">Read Blueprint →</span>
  </div>
</a>

<a href="/devops/kubernetes-tls-certificate-management" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/devops/k8s-tls</span>
    </div>
    <span class="hero-badge badge-blueprint">ARCHITECTURE</span>
  </div>
  <div class="hero-card-title">Kubernetes TLS Certificate Management</div>
  <div class="hero-card-desc">How cluster certificates work under the hood: control plane mTLS, cert-manager automation, Let's Encrypt ACME challenges, and zero-downtime secret rotation.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">tls</span>
      <span class="tag-link">cert-manager</span>
      <span class="tag-link">security</span>
    </div>
    <span class="hero-card-action">Read Blueprint →</span>
  </div>
</a>

<a href="/devops/kubernetes-v1-37-sneak-peek" class="hero-card">
  <div class="hero-card-header">
    <div class="hero-card-dots">
      <span class="dot-red"></span>
      <span class="dot-yellow"></span>
      <span class="dot-green"></span>
      <span class="hero-card-path">~/devops/k8s-v1.37</span>
    </div>
    <span class="hero-badge badge-active">NEW</span>
  </div>
  <div class="hero-card-title">Kubernetes v1.37 Sneak Peek</div>
  <div class="hero-card-desc">What platform engineers should actually care about in Kubernetes v1.37: in-place pod resizing GA, Dynamic Resource Allocation (DRA) enhancements, and security controls.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">k8s-1.37</span>
      <span class="tag-link">platform</span>
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
      <span class="hero-card-path">~/devops/gitops-mesh</span>
    </div>
    <span class="hero-badge badge-upcoming">UPCOMING</span>
  </div>
  <div class="hero-card-title">Multi-Cluster GitOps & Cilium Mesh</div>
  <div class="hero-card-desc">Declarative multi-region cluster fleet management with ArgoCD ApplicationSets, Cilium ClusterMesh, and zero-trust service-to-service encryption.</div>
  <div class="hero-card-footer">
    <div class="hero-card-tags">
      <span class="tag-link">argocd</span>
      <span class="tag-link">cilium</span>
      <span class="tag-link">gitops</span>
    </div>
    <span class="hero-card-action" style="opacity: 0.6;">In Progress · Stay Tuned</span>
  </div>
</div>

</div>
