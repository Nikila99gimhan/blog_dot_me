---
title: "Work"
seoTitle: "Work — Architecture Blueprints, Deep Dives & Demos by Nikila Fernando"
description: "Architecture blueprints, technical deep dives, and public demos by Nikila Fernando covering Kubernetes, Azure, GitHub Actions platforms, and governed agentic CI."
draft: false
---

Architecture blueprints, technical deep dives, and public demos I've written and published on this site.

> [!note] Role and scope
> These are published blueprints, architecture notes, and demos. They describe designs, patterns, and implementations I've written about or demonstrated. They are not client case studies, and no client names or outcomes are implied. To talk about a project, [start a conversation](https://www.linkedin.com/in/nikilafernando/).

## Architecture blueprints & notes

<div class="ph-cards">

<article class="ph-card">
  <p class="ph-card-label">Architecture blueprint</p>
  <h3 class="ph-card-title"><a href="/notes/arc-github-runners-platform-as-a-service/">ARC GitHub Runners as a Platform Service</a></h3>
  <p class="ph-card-desc">A blueprint for running GitHub Actions self-hosted runners as a centralized platform service on Amazon EKS — ephemeral pods, IRSA two-hop trust, multi-tenant namespaces, and zero long-lived credentials.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>GitHub Actions</li><li>ARC</li><li>Kubernetes</li><li>EKS</li><li>IRSA</li></ul>
  <span class="ph-card-action" aria-hidden="true">Explore the blueprint →</span>
</article>

<article class="ph-card">
  <p class="ph-card-label">Architecture notes</p>
  <h3 class="ph-card-title"><a href="/notes/anyscale-on-azure/">Anyscale on Azure</a></h3>
  <p class="ph-card-desc">Notes on Anyscale landing natively on Azure Kubernetes Service: Managed Ray, distributed workloads, and agentic AI on AKS.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>Ray</li><li>AKS</li><li>Azure</li><li>AI workloads</li></ul>
  <span class="ph-card-action" aria-hidden="true">Explore the architecture →</span>
</article>

</div>

## Architecture deep dives

<div class="ph-cards">

<article class="ph-card">
  <p class="ph-card-label">Kubernetes networking</p>
  <h3 class="ph-card-title"><a href="/devops/azure-application-gateway-for-containers/">Layer 7 Traffic on AKS with Application Gateway for Containers</a></h3>
  <p class="ph-card-desc">How Application Gateway for Containers handles routing, TLS, and canary releases on AKS through Kubernetes-native APIs.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>AKS</li><li>Gateway API</li><li>AGC</li></ul>
  <span class="ph-card-action" aria-hidden="true">Read the deep dive →</span>
</article>

<article class="ph-card">
  <p class="ph-card-label">Governance architecture</p>
  <h3 class="ph-card-title"><a href="/devops/your-policy-checks-are-green/">Your Policy Checks Are Green. Your Impact Is Still Unknown.</a></h3>
  <p class="ph-card-desc">Consumer impact review for shared Terraform/Bicep modules and Helm charts, with an interactive architecture workbench.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>Terraform</li><li>Bicep</li><li>GitHub Copilot</li><li>MCP</li></ul>
  <span class="ph-card-action" aria-hidden="true">Read the deep dive →</span>
</article>

<article class="ph-card">
  <p class="ph-card-label">Agent execution</p>
  <h3 class="ph-card-title"><a href="/devops/azure-container-apps-sandboxes/">Your Agent Needs a Boundary: Azure Container Apps Sandboxes</a></h3>
  <p class="ph-card-desc">Why agents need an enforced execution boundary, what Azure Container Apps Sandboxes provides, and how it compares with NVIDIA OpenShell.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>Azure Container Apps</li><li>Agentic AI</li><li>Security</li></ul>
  <span class="ph-card-action" aria-hidden="true">Read the deep dive →</span>
</article>

<article class="ph-card">
  <p class="ph-card-label">Cluster security</p>
  <h3 class="ph-card-title"><a href="/devops/kubernetes-tls-certificate-management/">Kubernetes TLS Certificate Management</a></h3>
  <p class="ph-card-desc">Certificate authorities, component certificates, communication paths, and the commands to inspect and manage cluster PKI.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>Kubernetes</li><li>TLS</li><li>PKI</li></ul>
  <span class="ph-card-action" aria-hidden="true">Read the deep dive →</span>
</article>

</div>

## Demos & talks

<div class="ph-cards">

<article class="ph-card">
  <p class="ph-card-label">Public demo repository</p>
  <h3 class="ph-card-title"><a href="https://github.com/Nikila99gimhan/session-beyond-failed-ci" target="_blank" rel="noopener noreferrer">session-beyond-failed-ci</a></h3>
  <p class="ph-card-desc">The demo repository from my GitHub Dev Days 2026 session: GitHub Agentic Workflow definitions, Bicep fixtures, a shared module safety gate, and a local Policy MCP server.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>gh-aw</li><li>Bicep</li><li>MCP</li></ul>
  <span class="ph-card-action" aria-hidden="true">View on GitHub ↗</span>
</article>

<article class="ph-card">
  <p class="ph-card-label">Talk · slides</p>
  <h3 class="ph-card-title"><a href="/tech-talks/governed-investigation-copilot-mcp/">When CI Fails: Governed Investigation with GitHub Copilot and MCP</a></h3>
  <p class="ph-card-desc">Session recap, 22-slide deck, event photos, and architecture from GitHub Dev Days 2026 at Microsoft Sri Lanka.</p>
  <ul class="ph-card-tech" aria-label="Technologies"><li>GitHub Copilot</li><li>GitHub Actions</li><li>MCP</li></ul>
  <span class="ph-card-action" aria-hidden="true">View the session →</span>
</article>

</div>

More writing lives on the [[blog|Blog]], and every session is listed under [[tech-talks/index|Talks]].
