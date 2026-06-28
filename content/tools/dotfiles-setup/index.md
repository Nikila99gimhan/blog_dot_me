---
title: "My Dotfiles Setup with GNU Stow"
date: 2026-06-05
tags: [tools, dotfiles, shell, productivity, linux]
description: "Managing dotfiles across multiple machines using GNU Stow — a symlink farm manager that keeps everything clean and version-controlled."
draft: false
---

Managing dotfiles is one of those things every developer puts off until they get a new machine and spend a whole day reconfiguring everything. Here's how I solved it with GNU Stow.

## Why GNU Stow?

Stow is a **symlink farm manager**. It takes a directory and creates symlinks in a target directory (default: `$HOME`). The key insight:

- Your dotfiles live in a single Git repo
- Stow creates symlinks from `~` into that repo
- Change anything, commit it — same state everywhere

## Directory Structure

```
~/.dotfiles/
├── zsh/
│   └── .zshrc
├── nvim/
│   └── .config/
│       └── nvim/
│           ├── init.lua
│           └── lua/
├── tmux/
│   └── .tmux.conf
├── git/
│   └── .gitconfig
└── starship/
    └── .config/
        └── starship.toml
```

Each top-level folder is a **Stow package**. Everything inside mirrors your `$HOME` structure.

## Installation

```bash
# macOS
brew install stow

# Ubuntu/Debian
apt install stow

# Arch
pacman -S stow
```

## Initial Setup

```bash
# Clone your dotfiles
git clone https://github.com/yourusername/dotfiles ~/.dotfiles
cd ~/.dotfiles

# Stow a package (creates symlinks in $HOME)
stow zsh      # symlinks ~/.zshrc -> ~/.dotfiles/zsh/.zshrc
stow nvim     # symlinks ~/.config/nvim -> ~/.dotfiles/nvim/.config/nvim
stow tmux git starship  # multiple at once

# Dry run first (see what would happen)
stow --simulate zsh
```

## Key Commands

```bash
# Stow a package
stow <package>

# Unstow (remove symlinks)
stow -D <package>

# Restow (unstow + stow — useful after restructuring)
stow -R <package>

# Stow to a different target
stow --target=/usr/local zsh

# Verbose mode
stow -v <package>
```

## My `.zshrc` Highlights

```bash
# ~/.dotfiles/zsh/.zshrc

# -- Path --
export PATH="$HOME/.local/bin:$HOME/go/bin:/opt/homebrew/bin:$PATH"

# -- Editor --
export EDITOR="nvim"
export VISUAL="nvim"

# -- Aliases --
alias k="kubectl"
alias kgp="kubectl get pods"
alias kgs="kubectl get svc"
alias kg="kubectl get"
alias kd="kubectl describe"
alias kl="kubectl logs -f"
alias tf="terraform"
alias dc="docker compose"

# -- Kubernetes context helper --
kctx() { kubectl config use-context "$1"; }
kns()  { kubectl config set-context --current --namespace="$1"; }

# -- Git shortcuts --
alias gs="git status"
alias gp="git push"
alias gl="git pull"
alias gco="git checkout"
alias gcb="git checkout -b"
alias glog="git log --oneline --graph --decorate"

# -- Tools --
eval "$(starship init zsh)"
eval "$(zoxide init zsh)"
source <(kubectl completion zsh)
source <(helm completion zsh)
```

## My Tmux Config

```bash
# ~/.dotfiles/tmux/.tmux.conf

# Remap prefix to Ctrl+a
unbind C-b
set-option -g prefix C-a
bind-key C-a send-prefix

# Split panes
bind | split-window -h -c "#{pane_current_path}"
bind - split-window -v -c "#{pane_current_path}"

# Vim-style pane navigation
bind h select-pane -L
bind j select-pane -D
bind k select-pane -U
bind l select-pane -R

# Enable mouse
set -g mouse on

# Status bar
set -g status-style bg=colour235,fg=colour136
set -g status-left "#[fg=colour166]#S "
set -g status-right "#[fg=colour136]%H:%M #[fg=colour166]%d-%b"

# Start windows from 1
set -g base-index 1
setw -g pane-base-index 1

# Reload config
bind r source-file ~/.tmux.conf \; display "Reloaded!"
```

## Starship Prompt

```toml
# ~/.dotfiles/starship/.config/starship.toml
format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$kubernetes\
$cmd_duration\
$line_break\
$character"""

[character]
success_symbol = "[❯](bold green)"
error_symbol   = "[❯](bold red)"

[directory]
style = "bold cyan"
truncation_length = 3

[git_branch]
symbol = " "
style  = "bold yellow"

[kubernetes]
disabled = false
style    = "bold blue"
symbol   = "☸ "

[cmd_duration]
min_time = 500
format   = "took [$duration](bold yellow)"
```

## Deploying to a New Machine

```bash
#!/bin/bash
# bootstrap.sh — run this on any new machine

set -euo pipefail

echo "Installing Homebrew..."
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

echo "Installing packages..."
brew bundle --file=~/.dotfiles/Brewfile

echo "Stowing dotfiles..."
cd ~/.dotfiles
for pkg in zsh nvim tmux git starship; do
  stow "$pkg"
done

echo "Done! Restart your shell."
```

## Brewfile

```ruby
# ~/.dotfiles/Brewfile
tap "homebrew/cask"

brew "git"
brew "neovim"
brew "tmux"
brew "stow"
brew "starship"
brew "zoxide"
brew "fzf"
brew "ripgrep"
brew "bat"
brew "eza"
brew "kubectl"
brew "helm"
brew "terraform"
brew "docker"

cask "warp"
cask "raycast"
```

Whole machine setup in under 10 minutes. That's the goal.
