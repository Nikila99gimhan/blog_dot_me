---
title: "TIL: kubectl explain is a full API reference in your terminal"
date: 2026-08-26
tags: [kubernetes, kubectl, til, cli]
description: "kubectl explain --recursive reveals the entire resource schema without leaving your terminal. Faster than googling the Kubernetes API docs."
draft: false
---

Most people use `kubectl explain` once, get a top-level field description, and forget about it. Turns out it's a full interactive API reference if you know the right flags.

## The basic form everyone knows

```bash
kubectl explain pod.spec
```

Returns a description of `spec` and its immediate child fields. Useful, but shallow.

## The flag that makes it actually useful: `--recursive`

```bash
kubectl explain pod.spec --recursive
```

This dumps the **entire nested field tree** — every path, every type, every subfield — in one shot. No need to run `kubectl explain` repeatedly to drill down.

```
FIELDS:
   activeDeadlineSeconds        <integer>
   affinity     <Object>
      nodeAffinity       <Object>
         preferredDuringSchedulingIgnoredDuringExecution      <[]Object>
            preference   <Object>
               matchExpressions     <[]Object>
                  key        <string>
                  operator   <string>
                  values     <[]string>
...
```

You can pipe this into `grep` to find a field you half-remember:

```bash
kubectl explain pod.spec --recursive | grep -i "tolerations"
```

## Discovering API groups you didn't know existed

```bash
kubectl api-resources --verbs=list --namespaced -o name
```

Pair this with `kubectl explain` on any resource to see what fields the cluster actually supports — including CRDs installed by your operators.

```bash
kubectl explain prometheusrule.spec
```

> [!tip]
> If a field shows `<[]Object>`, always follow it with `kubectl explain <resource>.<path>.<field>` — that's where the interesting nesting lives.

## Checking API version drift

When you upgrade a cluster, fields get added, deprecated, or moved. `kubectl explain` reflects the **live API version of your current cluster**, so diffing the output between two clusters reveals drift:

```bash
kubectl explain deployment.spec.template.spec.containers --recursive > before.txt
# switch context to new cluster
kubectl explain deployment.spec.template.spec.containers --recursive > after.txt
diff before.txt after.txt
```

> [!note]
> This is more reliable than reading the Kubernetes changelog for catching deprecations that affect your specific manifests.

## The shortcut nobody mentions

You don't need to type the full resource name. `kubectl explain` accepts the same short names as `kubectl get`:

```bash
kubectl explain deploy.spec    # same as kubectl explain deployment.spec
kubectl explain svc.spec       # same as kubectl explain service.spec
kubectl explain cm.data        # ConfigMap
```
