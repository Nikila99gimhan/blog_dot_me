---
title: "Kubernetes: Zero to Prod"
date: 2026-06-20
tags: [kubernetes, devops, containers, k8s]
description: "A practical walkthrough of getting a real application running on Kubernetes — from local minikube to production-grade cluster."
draft: false
---

Getting a real app running on Kubernetes involves more than just writing a `Deployment` YAML. This post walks through the full journey from scratch.

## Prerequisites

```bash
# Install tools
brew install kubectl helm minikube

# Verify versions
kubectl version --client
helm version
minikube version
```

## Step 1 — Start a local cluster

```bash
minikube start --driver=docker --cpus=4 --memory=8192

# Verify nodes are ready
kubectl get nodes
# NAME       STATUS   ROLES           AGE   VERSION
# minikube   Ready    control-plane   10s   v1.29.0
```

## Step 2 — Write your first Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
        - name: myapp
          image: nginx:1.25-alpine
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "50m"
            limits:
              memory: "128Mi"
              cpu: "100m"
```

```bash
kubectl apply -f deployment.yaml

# Watch rollout
kubectl rollout status deployment/myapp
# Waiting for deployment "myapp" rollout to finish: 0 of 3 updated replicas are available...
# deployment "myapp" successfully rolled out
```

## Step 3 — Expose with a Service

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
spec:
  selector:
    app: myapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

```bash
kubectl apply -f service.yaml
kubectl get svc myapp-svc
```

## Step 4 — Add an Ingress

```bash
# Enable ingress addon in minikube
minikube addons enable ingress
```

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: myapp-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: myapp.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: myapp-svc
                port:
                  number: 80
```

```bash
kubectl apply -f ingress.yaml

# Add to /etc/hosts
echo "$(minikube ip) myapp.local" | sudo tee -a /etc/hosts

# Test
curl http://myapp.local
```

## Step 5 — ConfigMaps & Secrets

> [!tip]
> Never hardcode config in your container image. Use ConfigMaps for non-sensitive values and Secrets for credentials.

```bash
# ConfigMap
kubectl create configmap app-config \
  --from-literal=ENV=production \
  --from-literal=LOG_LEVEL=info

# Secret (base64 encoded automatically)
kubectl create secret generic app-secret \
  --from-literal=DB_PASSWORD=supersecret
```

## Step 6 — Health Checks

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Step 7 — HorizontalPodAutoscaler

```bash
kubectl autoscale deployment myapp \
  --cpu-percent=70 \
  --min=2 \
  --max=10

kubectl get hpa
```

## Useful Commands Cheatsheet

```bash
# Get everything in namespace
kubectl get all -n myapp

# Describe a pod
kubectl describe pod <pod-name>

# Live logs
kubectl logs -f deployment/myapp

# Exec into a container
kubectl exec -it deployment/myapp -- sh

# Port-forward for local testing
kubectl port-forward svc/myapp-svc 8080:80

# Roll out a new image
kubectl set image deployment/myapp myapp=nginx:1.26-alpine

# Roll back
kubectl rollout undo deployment/myapp

# Delete everything
kubectl delete -f .
```

## What's Next?

- Set up [[devops/github-actions-reusable-workflows|CI/CD with GitHub Actions]]
- Add Helm charts for packaging
- Configure RBAC and network policies
- Set up monitoring with Prometheus + Grafana
