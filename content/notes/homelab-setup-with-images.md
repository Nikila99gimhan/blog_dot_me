---
title: "Building a Dev Home Lab — with Images"
date: 2026-06-27
tags: [homelab, kubernetes, devops, setup, images]
description: "A complete guide to building a developer home lab with a bare-metal Kubernetes cluster — and a showcase of every image layout pattern available in Quartz."
draft: false
---

This post does two things: walks you through my home lab setup, and **demonstrates every way you can place images** in a Quartz 4.0 blog post.

> [!note]
> This article is also a reference for image layouts. Jump to any section to see the specific placement pattern.

---

## The Setup

My home lab runs a 3-node bare-metal Kubernetes cluster on old Intel NUCs. Everything is managed via GitOps with Argo CD.

Here's the full network topology:

---

## Image Layouts

### 1. Full-Width Image (default)

Just a standard markdown image — renders at full content-column width with the alt text as a caption below.

```markdown
![Home lab network topology](images/homelab-topology.png)
```

![Home lab network topology — MacBook → Router → 3 K8s nodes + NAS](images/homelab-topology.png)

---

### 2. Image with No Caption

Wrap in an HTML `<figure>` with no `<figcaption>` — or simply drop the alt text:

```markdown
![](images/cicd-pipeline.png)
```

![](images/cicd-pipeline.png)

---

### 3. Centered Image at Custom Width

Use an HTML `<div>` to center and size an image. Good for diagrams that don't need full width:

```html
<div style="text-align: center; margin: 2rem 0;">
  <img src="images/cicd-pipeline.png" 
       alt="CI/CD pipeline" 
       style="max-width: 700px; width: 100%; border-radius: 8px;" />
  <p style="font-size: 0.85em; opacity: 0.7; margin-top: 0.5rem;">
    ↑ The full CI/CD pipeline — from commit to production
  </p>
</div>
```

<div style="text-align: center; margin: 2rem 0;">
  <img src="images/cicd-pipeline.png" alt="CI/CD pipeline" style="max-width: 700px; width: 100%; border-radius: 8px;" />
  <p style="font-size: 0.85em; opacity: 0.7; margin-top: 0.5rem;">↑ The full CI/CD pipeline — from commit to production</p>
</div>

---

### 4. Float Right (text wraps around image)

Great for a screenshot or diagram that lives beside descriptive text. The text naturally wraps around the floated image.

```html
<img src="images/homelab-topology.png" 
     alt="Network topology" 
     style="float: right; margin: 0 0 1rem 2rem; width: 340px; border-radius: 8px;" />
```

<img src="images/homelab-topology.png" alt="Network topology" style="float: right; margin: 0 0 1rem 2rem; width: 340px; border-radius: 8px;" />

**The hardware** I'm running:

- **3× Intel NUC 12** — each with 32GB RAM, 1TB NVMe
- **1× Synology NAS** — 20TB raw storage, serves NFS for persistent volumes
- **Netgear switch** — 2.5GbE links between nodes
- **UPS** — because bare-metal doesn't auto-failover power

Each NUC runs **Ubuntu 22.04 LTS** with kubeadm bootstrapped. `node-1` is the control plane, `node-2` and `node-3` are workers.

The NAS provides NFS storage which is exposed in Kubernetes via a `StorageClass` backed by the `nfs-subdir-external-provisioner` Helm chart.

<div style="clear: both;"></div>

---

### 5. Float Left (text wraps left side)

```html
<img src="images/workstation-terminal.png" 
     alt="Workstation terminal" 
     style="float: left; margin: 0 2rem 1rem 0; width: 340px; border-radius: 8px;" />
```

<img src="images/workstation-terminal.png" alt="Workstation terminal" style="float: left; margin: 0 2rem 1rem 0; width: 340px; border-radius: 8px;" />

**My daily driver** is a MacBook Pro M3 Max, but all real work happens in tmux with this layout:

- **Left pane** — Neovim (primary editor, ~60% width)
- **Top right** — `kubectl` / shell commands
- **Bottom right** — `docker compose logs -f` or test runner

I use the `warp` terminal on macOS, but the tmux config works identically over SSH into any Linux box.

The statusbar at the bottom shows session name, window index, and timestamp — enough context without being noisy.

<div style="clear: both;"></div>

---

### 6. Side-by-Side Images (50/50 split)

Use flexbox to place two images next to each other:

```html
<div style="display: flex; gap: 1.5rem; margin: 2rem 0; align-items: flex-start;">
  <figure style="flex: 1; margin: 0;">
    <img src="images/homelab-topology.png" style="width: 100%; border-radius: 8px;" />
    <figcaption style="text-align: center; font-size: 0.82em; opacity: 0.7; margin-top: 0.4rem;">
      Network topology
    </figcaption>
  </figure>
  <figure style="flex: 1; margin: 0;">
    <img src="images/workstation-terminal.png" style="width: 100%; border-radius: 8px;" />
    <figcaption style="text-align: center; font-size: 0.82em; opacity: 0.7; margin-top: 0.4rem;">
      Tmux workspace
    </figcaption>
  </figure>
</div>
```

<div style="display: flex; gap: 1.5rem; margin: 2rem 0; align-items: flex-start;">
  <figure style="flex: 1; margin: 0;">
    <img src="images/homelab-topology.png" style="width: 100%; border-radius: 8px;" />
    <figcaption style="text-align: center; font-size: 0.82em; opacity: 0.7; margin-top: 0.4rem;">Network topology</figcaption>
  </figure>
  <figure style="flex: 1; margin: 0;">
    <img src="images/workstation-terminal.png" style="width: 100%; border-radius: 8px;" />
    <figcaption style="text-align: center; font-size: 0.82em; opacity: 0.7; margin-top: 0.4rem;">Tmux workspace</figcaption>
  </figure>
</div>

---

### 7. Image in a Callout / Info Box

You can put an image inside an Obsidian-style callout:

```markdown
> [!note] Architecture Overview
> ![CI/CD pipeline diagram](images/cicd-pipeline.png)
> The pipeline runs entirely in GitHub Actions — no self-hosted runners needed.
```

> [!note] Architecture Overview
> ![CI/CD pipeline diagram](images/cicd-pipeline.png)
> The pipeline runs entirely in GitHub Actions — no self-hosted runners needed.

---

### 8. Bordered / Shadowed Image

Add a subtle border and shadow for screenshots to make them stand out:

```html
<img src="images/workstation-terminal.png" 
     alt="Terminal screenshot" 
     style="width: 100%; border-radius: 10px; 
            border: 1px solid rgba(57, 255, 20, 0.2); 
            box-shadow: 0 0 30px rgba(57, 255, 20, 0.08);" />
```

<img src="images/workstation-terminal.png" alt="Terminal screenshot" style="width: 100%; border-radius: 10px; border: 1px solid rgba(57, 255, 20, 0.2); box-shadow: 0 0 30px rgba(57, 255, 20, 0.08);" />

---

### 9. Small Inline Thumbnail

A tiny image that sits inline with text — useful for logos or icons:

```html
This runs on <img src="images/homelab-topology.png" 
  style="height: 1.4em; vertical-align: middle; border-radius: 3px;" 
  alt="homelab" /> 
bare metal Kubernetes.
```

This diagram <img src="images/homelab-topology.png" style="height: 2.5em; vertical-align: middle; border-radius: 3px;" alt="homelab" /> represents my home lab setup in full.

---

## Image Placement — Quick Reference

| Layout | Markdown/HTML | Best for |
|---|---|---|
| Full width | `![caption](images/file.png)` | Hero images, diagrams |
| No caption | `![](images/file.png)` | Clean visuals |
| Centered + sized | `<div style="text-align:center"><img width="N">` | Diagrams |
| Float right | `<img style="float:right; width:Npx">` | Screenshot beside text |
| Float left | `<img style="float:left; width:Npx">` | Screenshot beside text |
| Side by side | Flexbox `div` with two `<figure>` | Comparisons |
| In callout | `> [!note]\n> ![](...)` | Highlighted diagram |
| Bordered | `<img style="border:1px solid; box-shadow:...">` | Screenshots |
| Inline thumbnail | `<img style="height:1.4em; vertical-align:middle">` | Logos/icons |

> [!tip]
> Place all images in `content/images/` and reference them as `images/filename.png` — Quartz resolves them relative to the content root, so this works from any nested post.

---

## The Software Stack

```bash
# What's running on the cluster
kubectl get namespaces
# NAME              STATUS   AGE
# argocd            Active   45d   ← GitOps
# cert-manager      Active   45d   ← TLS certs
# monitoring        Active   45d   ← Prometheus + Grafana
# ingress-nginx     Active   45d   ← Ingress controller
# longhorn-system   Active   20d   ← Distributed storage
# default           Active   45d
```

```bash
# Check ArgoCD apps
argocd app list
# NAME          CLUSTER    NAMESPACE  STATUS  HEALTH
# blog-dot-me   in-cluster  default   Synced  Healthy
# monitoring    in-cluster  monitoring Synced  Healthy
# cert-manager  in-cluster  cert-manager Synced Healthy
```

## Related

- [[devops/kubernetes-zero-to-prod|Kubernetes: Zero to Prod]]
- [[tools/dotfiles-setup|My Dotfiles Setup]]
