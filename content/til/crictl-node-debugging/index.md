---
title: "TIL: crictl is kubectl for the node — debug containers without the API server"
date: 2026-08-26
tags: [kubernetes, containers, crictl, debugging, til]
description: "crictl talks directly to the container runtime on a node — no API server, no kubelet required. Essential for debugging nodes where kubectl won't reach."
draft: false
---

When a node is NotReady, `kubectl exec` and `kubectl logs` stop working. The API server can't reach the node, so you lose your normal debugging surface. `crictl` is the escape hatch — it talks directly to the CRI (Container Runtime Interface) socket on the node.

## What crictl is

`crictl` is the CLI client for the [CRI spec](https://github.com/kubernetes/cri-api). It's runtime-agnostic — works with containerd, CRI-O, or any CRI-compliant runtime. On most Kubernetes nodes it's already installed.

```bash
# SSH into the node first
ssh user@node-ip

crictl --help
```

## The commands you'll actually use

### List running pods and containers

```bash
# List all pods on this node
crictl pods

# List all containers (running + stopped)
crictl ps -a

# Find containers for a specific pod
crictl ps --pod <pod-id>
```

### Inspect a container

```bash
# Get container details (image, mounts, env vars, state)
crictl inspect <container-id>

# Get pod-level details
crictl inspectp <pod-id>
```

### Pull logs without kubectl

```bash
crictl logs <container-id>

# Follow logs live
crictl logs -f <container-id>

# Last N lines
crictl logs --tail=50 <container-id>
```

### Exec into a running container

```bash
crictl exec -it <container-id> /bin/sh
```

> [!note]
> This bypasses the API server entirely. You're talking directly to containerd or CRI-O. It works even if kubelet is down.

## Debugging a crashlooping container

The typical scenario: a container is crashlooping and the log window is tiny. `kubectl logs --previous` only shows the last terminated instance. On the node:

```bash
# Find the container (even if stopped)
crictl ps -a | grep <your-container-name>

# Get its ID, then pull full logs
crictl logs <container-id>
```

> [!tip]
> `crictl ps -a` shows all containers including stopped ones — much better than `kubectl get pods` which only shows the latest state.

## The config file if the socket path is wrong

By default `crictl` looks for the socket at `/run/containerd/containerd.sock`. On some distros it's different:

```bash
# Create /etc/crictl.yaml
cat <<EOF > /etc/crictl.yaml
runtime-endpoint: unix:///run/containerd/containerd.sock
image-endpoint: unix:///run/containerd/containerd.sock
timeout: 10
debug: false
EOF
```

Or pass it inline:

```bash
crictl --runtime-endpoint unix:///run/containerd/containerd.sock pods
```

## Image management on the node

```bash
# List images pulled on this node
crictl images

# Pull an image directly (useful for pre-warming nodes)
crictl pull nginx:alpine

# Remove an unused image
crictl rmi <image-id>
```

> [!warning]
> Images pulled via `crictl pull` are not tracked by Kubernetes. They won't be garbage collected by kubelet's image GC if they're not referenced by a pod spec. Manual cleanup required.

## When to use crictl vs kubectl

| Situation | Tool |
|---|---|
| Normal pod debugging | `kubectl` |
| Node is NotReady | `crictl` via SSH |
| kubelet is down | `crictl` |
| API server is unreachable | `crictl` |
| Inspecting raw container state | `crictl inspect` |
| Checking images on a specific node | `crictl images` |
