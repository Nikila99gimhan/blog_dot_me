---
title: "Docker Networking Deep Dive"
date: 2026-05-28
tags: [docker, networking, devops, containers]
description: "Everything you need to know about Docker networking: bridge, host, overlay networks, DNS resolution, and common gotchas."
draft: false
---

Docker networking confuses a lot of people. This post breaks it down from first principles.

## The Default Bridge Network

When you install Docker, it creates a default bridge network called `bridge` (or `docker0`):

```bash
# List all networks
docker network ls
# NETWORK ID     NAME      DRIVER    SCOPE
# abc123def456   bridge    bridge    local
# xyz789ghi012   host      host      local
# 000000000000   none      null      local

# Inspect the default bridge
docker network inspect bridge
```

By default, containers on the same bridge can communicate **by IP**, but **not by name**.

```bash
# Start two containers
docker run -d --name web nginx
docker run -d --name db postgres

# web CANNOT reach db by name — only by IP
docker exec web ping db  # ❌ fails
docker exec web ping 172.17.0.2  # ✅ works (if that's db's IP)
```

## User-Defined Bridge Networks

Create your own bridge and containers get DNS resolution for free:

```bash
# Create a custom network
docker network create myapp-net

# Run containers on it
docker run -d --name web --network myapp-net nginx
docker run -d --name db  --network myapp-net postgres

# Now DNS works!
docker exec web ping db  # ✅ works by name
```

This is the **right way** to network containers in development.

## Docker Compose Networking

Docker Compose automatically creates a user-defined network per project:

```yaml
# docker-compose.yml
services:
  web:
    image: nginx
    ports:
      - "8080:80"

  api:
    build: ./api
    environment:
      DB_HOST: db  # use service name as hostname

  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
```

```bash
docker compose up -d

# All services are on the same network automatically
# api can reach db at hostname "db"
# web can reach api at hostname "api"
```

## Network Drivers

| Driver | Use Case | DNS | Scope |
|---|---|---|---|
| `bridge` | Default, single host | ✅ (user-defined) | Local |
| `host` | Remove network isolation | N/A | Local |
| `overlay` | Multi-host (Docker Swarm / K8s) | ✅ | Swarm |
| `macvlan` | Container needs its own MAC | Limited | Local |
| `none` | No networking | ❌ | Local |

## Host Network

```bash
# Container shares the host's network namespace
docker run --network host nginx

# nginx now listens on the HOST's port 80
# No port mapping needed (or possible)
curl localhost  # hits nginx directly
```

> [!warning]
> On macOS, `--network host` doesn't work as expected because Docker runs inside a VM. It only truly works on Linux.

## Port Mapping Explained

```bash
# -p HOST_PORT:CONTAINER_PORT
docker run -p 8080:80 nginx

# Bind to a specific interface
docker run -p 127.0.0.1:8080:80 nginx  # localhost only

# Random host port
docker run -p 80 nginx
docker port <container> 80  # find what port was assigned
```

## DNS in Docker

Docker embeds a DNS server at `127.0.0.11` inside every container:

```bash
docker run -it --network myapp-net alpine sh

# Inside the container:
cat /etc/resolv.conf
# nameserver 127.0.0.11
# options ndots:0

nslookup db
# Server:    127.0.0.11
# Address 1: 127.0.0.11
# Name: db
# Address 1: 172.18.0.3 db.myapp-net
```

## Overlay Networks (Multi-Host)

For Docker Swarm:

```bash
# Initialize swarm
docker swarm init

# Create an overlay network
docker network create --driver overlay myapp-overlay

# Deploy a service on it
docker service create \
  --name api \
  --network myapp-overlay \
  --replicas 3 \
  myapp:latest
```

Overlay networks use VXLAN encapsulation to route traffic across hosts.

## Debugging Network Issues

```bash
# Inspect a container's network settings
docker inspect <container> | jq '.[0].NetworkSettings'

# Check which network a container is on
docker inspect <container> | jq '.[0].NetworkSettings.Networks'

# Connect a running container to another network
docker network connect myapp-net mycontainer

# Disconnect
docker network disconnect myapp-net mycontainer

# Use netshoot for debugging
docker run -it --network container:<target-container> \
  nicolaka/netshoot

# Inside netshoot:
curl -v http://api:3000/health
tcpdump -i eth0 port 5432
ss -tlnp
```

## Common Gotchas

> [!note]
> **"Connection refused" on localhost inside container**: You're trying to reach a service on the host from inside a container. Use `host.docker.internal` (Docker Desktop) or the host's IP (`172.17.0.1` on Linux) instead of `localhost`.

```bash
# From inside a container, reach host service
curl http://host.docker.internal:3000   # Docker Desktop (Mac/Win)
curl http://172.17.0.1:3000             # Linux
```

> [!note]
> **Port already in use**: Check what's binding the port:

```bash
lsof -i :8080
# or
ss -tlnp | grep 8080
```

## Clean Up

```bash
# Remove unused networks
docker network prune

# Remove a specific network (must have no connected containers)
docker network rm myapp-net

# See network usage
docker network inspect myapp-net | jq '.[0].Containers'
```

## Related

- [[devops/kubernetes-zero-to-prod|Kubernetes: Zero to Prod]] — K8s networking is a whole other world
- [[tools/dotfiles-setup|Dotfiles Setup]] — includes Docker aliases
