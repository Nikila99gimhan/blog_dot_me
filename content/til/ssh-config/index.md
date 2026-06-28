---
title: "TIL: SSH Config Makes Life Easier"
date: 2026-06-08
tags: [til, ssh, devops, cli]
description: "Using ~/.ssh/config to manage multiple SSH hosts with aliases, jump hosts, and per-host settings."
draft: false
---

**TIL** how much nicer `~/.ssh/config` makes SSH-heavy workflows.

## Before

```bash
ssh -i ~/.ssh/prod_key.pem -p 2222 -J bastion.example.com ubuntu@10.0.0.42
```

Nobody remembers that.

## After

```bash
ssh prod-api
```

## The Config File

```
# ~/.ssh/config

# Global settings
ServerAliveInterval 60
ServerAliveCountMax 3

# Bastion / Jump host
Host bastion
    HostName bastion.example.com
    User ec2-user
    IdentityFile ~/.ssh/aws_key.pem

# Production API (via bastion)
Host prod-api
    HostName 10.0.0.42
    User ubuntu
    Port 2222
    IdentityFile ~/.ssh/prod_key.pem
    ProxyJump bastion

# Dev server
Host dev
    HostName dev.example.com
    User nikila
    IdentityFile ~/.ssh/dev_key
    ForwardAgent yes

# All hosts in *.internal — use the jump host
Host *.internal
    ProxyJump bastion
    User ubuntu
    IdentityFile ~/.ssh/aws_key.pem

# GitHub — useful for multiple accounts
Host github-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/personal_rsa

Host github-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/work_rsa
```

## Key Directives

```bash
HostName       # actual address to connect to
User           # username
Port           # SSH port (default 22)
IdentityFile   # path to private key
ProxyJump      # jump through this host first
ForwardAgent   # forward local SSH agent
StrictHostKeyChecking no   # (⚠️ use carefully)
LocalForward   # tunnel local port to remote
```

## Port Forwarding Shortcut

```
Host tunnel-db
    HostName db.internal
    User ubuntu
    ProxyJump bastion
    LocalForward 5433 localhost:5432
```

```bash
ssh tunnel-db   # connects AND opens tunnel
psql -h localhost -p 5433 -U postgres   # ← reaches remote DB
```

## Multiple GitHub Accounts

```bash
# For personal projects
git remote set-url origin git@github-personal:yourusername/repo.git

# For work projects
git remote set-url origin git@github-work:yourorg/repo.git
```

Permissions:

```bash
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/*_key*
```

This single file saves me typing hundreds of characters per day.
