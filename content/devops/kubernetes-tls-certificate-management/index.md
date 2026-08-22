---
title: "Kubernetes TLS Certificate Management: How Cluster Certificates Work"
date: 2026-08-22
tags: [kubernetes, tls, pki, certificates, kubeadm, etcd, cluster-security]
description: "A practical deep dive into Kubernetes TLS certificate management, covering the certificate authorities, component certificates, communication paths, and the commands you need to inspect and manage cluster PKI."
draft: false
---

Walk into any self-managed Kubernetes cluster and sooner or later you end up staring at `/etc/kubernetes/pki`, wondering which certificate belongs to which component and why the API server seems to need so many of them.

That confusion is normal.

Kubernetes certificate management looks complicated at first because multiple components talk to each other in different directions, and TLS identity changes depending on who is acting as the client and who is acting as the server.

This article gives you the mental model that makes it click. We will cover the main certificate authorities, the certificates needed when provisioning a cluster from scratch, how those certificates are used between components, and the commands you can use to inspect and manage them.

## The simple mental model

The easiest way to think about Kubernetes certificates is this:

> [!important]
> If a component **receives HTTPS traffic**, it needs a **server certificate**.  
> If a component **initiates a connection**, it may need a **client certificate**.

Some components do both.

The best example is `kube-apiserver`:

- it acts as a **server** when `kubectl`, kubelet, scheduler, and controller manager connect to it
- it acts as a **client** when it connects to **etcd**
- it also acts as a **client** when it connects back to the **kubelet**

That is why the API server needs more than one certificate pair.

![Kubernetes TLS communication map — who talks to whom and which certificates are involved](./kubernetes-tls-communication-map.png)

## TLS, PKI, and identity in Kubernetes

Kubernetes uses TLS for two main reasons:

1. **Encryption** — traffic is protected in transit
2. **Identity verification** — each side can prove who it is

Kubernetes commonly uses **X.509 certificates**.

```text
.crt = public certificate
.key = private key
```

The certificate is public identity.  
The private key proves ownership of that identity.

The most sensitive key in the cluster is the **CA private key**, because that key can sign new trusted certificates.

In mutual TLS, both sides can authenticate each other:

- the **server** presents a server certificate
- the **client** may also present a client certificate
- each side validates the certificate chain against a trusted CA

Kubernetes then separates **authentication** from **authorization**:

```text
TLS certificate proves identity
RBAC decides permission
```

For client certificate authentication, the certificate subject becomes important:

```text
CN = Kubernetes username
O  = Kubernetes group
```

For example:

```text
CN=system:node:worker-01
O=system:nodes
```

That is how a kubelet identifies itself to the API server.

## The certificate authorities in a Kubernetes cluster

In a kubeadm-style cluster, PKI files are typically stored under:

```bash
/etc/kubernetes/pki
```

The main certificate authorities and signing keys are:

| CA / Key Pair | Purpose |
|---|---|
| `ca.crt`, `ca.key` | Main Kubernetes CA. Signs most Kubernetes component certificates. |
| `etcd/ca.crt`, `etcd/ca.key` | Dedicated etcd CA. Signs etcd server, peer, and etcd client certificates. |
| `front-proxy-ca.crt`, `front-proxy-ca.key` | Used by the API aggregation layer. |
| `sa.pub`, `sa.key` | Signs ServiceAccount tokens. Not normal TLS traffic. |

> [!note]
> The ServiceAccount signing key pair is usually stored with the cluster PKI, but it is **not** a normal TLS certificate pair. It signs and verifies ServiceAccount tokens.

![Kubernetes PKI layout — the main certificate authorities and what they sign](./kubernetes-pki-layout.png)

## What certificates do you need when provisioning a cluster from scratch?

If you are provisioning a control plane from scratch, these are the main certificate areas you need to account for.

### 1. Kubernetes CA

This is the root of trust for normal Kubernetes component certificates.

It signs certificates used by:

- `kube-apiserver`
- `kube-scheduler`
- `kube-controller-manager`
- admin access
- kubelet client identity
- API server to kubelet client identity

### 2. etcd CA

This CA is used only for etcd-related trust.

It signs:

- etcd server certificate
- etcd peer certificate
- etcd healthcheck client certificate
- API server to etcd client certificate

### 3. front-proxy CA

This is used by the Kubernetes API aggregation layer.

### 4. ServiceAccount signing keys

These are used to sign ServiceAccount tokens and are logically separate from component TLS.

## Core component certificates

### kube-apiserver

The API server is the center of the cluster. Almost every major component talks to it.

As a **server**, it needs:

```text
apiserver.crt
apiserver.key
```

This is the certificate presented when clients connect to the Kubernetes API.

That certificate must include correct **Subject Alternative Names**.

Common SANs include:

```text
kubernetes
kubernetes.default
kubernetes.default.svc
kubernetes.default.svc.cluster.local
control-plane hostname
control-plane IP
load balancer DNS/IP
127.0.0.1
```

As a **client**, the API server also needs additional certificates.

To connect to etcd:

```text
apiserver-etcd-client.crt
apiserver-etcd-client.key
```

To connect to kubelet:

```text
apiserver-kubelet-client.crt
apiserver-kubelet-client.key
```

That is the piece many people miss: the API server is not only a server.

![Why the API server needs multiple certificates](./api-server-multiple-certificates.png)

### etcd

etcd stores cluster state, so its certificate layout matters a lot.

It commonly needs these certificate sets.

For serving client traffic:

```text
etcd/server.crt
etcd/server.key
```

For peer-to-peer communication between etcd members:

```text
etcd/peer.crt
etcd/peer.key
```

For health checks:

```text
etcd/healthcheck-client.crt
etcd/healthcheck-client.key
```

The API server does not connect anonymously to etcd.  
It uses `apiserver-etcd-client.crt` and `apiserver-etcd-client.key`, signed by the **etcd CA**.

### kubelet

The kubelet also works in both directions.

When the **kubelet talks to the API server**, it uses a **client certificate**:

```text
/var/lib/kubelet/pki/kubelet-client-current.pem
```

This usually identifies the node as something like:

```text
CN=system:node:<node-name>
O=system:nodes
```

When the **API server talks back to the kubelet** for operations like logs, exec, attach, port-forward, or metrics, the kubelet acts as a **server**.

For that, it needs:

```text
/var/lib/kubelet/pki/kubelet.crt
/var/lib/kubelet/pki/kubelet.key
```

A good memory hook:

```text
kubelet client cert = kubelet -> API server
kubelet server cert = API server -> kubelet
```

### admin, scheduler, controller manager, and kube-proxy

These mostly act as **clients** to the API server.

| Component | Credential | Purpose |
|---|---|
| admin / kubectl | `admin.conf` | Administrative access to the API server |
| kube-scheduler | `scheduler.conf` | Scheduler communicates with the API server |
| kube-controller-manager | `controller-manager.conf` | Controller manager communicates with the API server |
| kube-proxy | kube-proxy kubeconfig / cert | Watches cluster state through the API server |

> [!tip]
> Scheduler and controller manager do **not** normally talk directly to etcd.  
> They go through the API server.

## Full communication map

The communication flow looks like this conceptually:

```text
kubectl/admin -> kube-apiserver
kube-scheduler -> kube-apiserver
kube-controller-manager -> kube-apiserver
kube-proxy -> kube-apiserver
kubelet -> kube-apiserver

kube-apiserver -> etcd
kube-apiserver -> kubelet

etcd member -> etcd member
```

If you understand that direction map, certificate mapping becomes much easier.

## How to think about any Kubernetes certificate

Do not start by memorizing filenames.

Start with the communication path and ask four questions:

1. Who is calling whom?
2. Who is the server?
3. Who is the client?
4. Which CA should be trusted?

![How to reason about any Kubernetes certificate — a 4-step thinking model](./certificate-reasoning-cheat-sheet.png)

Then map it like this:

```text
client -> server
server needs server cert
client may need client cert
client must trust server CA
server must trust client CA if mTLS is enabled
```

Example:

```text
kube-apiserver -> etcd
client = kube-apiserver
server = etcd
client cert = apiserver-etcd-client.crt/key
server cert = etcd/server.crt/key
CA = etcd CA
```

Another example:

```text
kubelet -> kube-apiserver
client = kubelet
server = kube-apiserver
client cert = kubelet-client-current.pem
server cert = apiserver.crt/key
CA = Kubernetes CA
```

> [!important]
> This direction-first method is far more reliable than trying to memorize random filenames in isolation.

## Practical commands to inspect certificates

When working with cluster certificates, these are the most useful inspection commands.

Check expiration of kubeadm-managed certs:

```bash
kubeadm certs check-expiration
```

Inspect a certificate in full:

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout
```

Check only expiry:

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -enddate
```

Check issuer:

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -issuer
```

Check subject:

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -subject
```

Check SANs:

```bash
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -text -noout | grep -A1 "Subject Alternative Name"
```

Inspect the kubelet client certificate:

```bash
openssl x509 -in /var/lib/kubelet/pki/kubelet-client-current.pem -text -noout
```

List kubelet PKI files:

```bash
ls -l /var/lib/kubelet/pki/
```

## kubeadm commands for generation and renewal

If you are using kubeadm, these commands matter the most.

Generate all certificates during initialization:

```bash
kubeadm init phase certs all
```

Generate only the API server certificate:

```bash
kubeadm init phase certs apiserver
```

Generate the API server client certificate for kubelet communication:

```bash
kubeadm init phase certs apiserver-kubelet-client
```

Generate etcd-related certificates:

```bash
kubeadm init phase certs etcd-server
kubeadm init phase certs etcd-peer
kubeadm init phase certs etcd-healthcheck-client
kubeadm init phase certs apiserver-etcd-client
```

Renew all kubeadm-managed certificates:

```bash
kubeadm certs renew all
```

Renew specific certificates:

```bash
kubeadm certs renew apiserver
kubeadm certs renew apiserver-kubelet-client
kubeadm certs renew apiserver-etcd-client
```

Generate kubeconfig files:

```bash
kubeadm init phase kubeconfig admin
kubeadm init phase kubeconfig scheduler
kubeadm init phase kubeconfig controller-manager
```

## Static pod manifests and certificate flags

In kubeadm clusters, control plane components usually run as **static pods**.

Their manifests are typically stored in:

```bash
/etc/kubernetes/manifests/
```

Important files:

```bash
/etc/kubernetes/manifests/kube-apiserver.yaml
/etc/kubernetes/manifests/etcd.yaml
/etc/kubernetes/manifests/kube-scheduler.yaml
/etc/kubernetes/manifests/kube-controller-manager.yaml
```

Useful API server flags:

```text
--client-ca-file
--tls-cert-file
--tls-private-key-file
--etcd-cafile
--etcd-certfile
--etcd-keyfile
--kubelet-client-certificate
--kubelet-client-key
--requestheader-client-ca-file
--proxy-client-cert-file
--proxy-client-key-file
--service-account-key-file
--service-account-signing-key-file
```

Useful etcd flags:

```text
--cert-file
--key-file
--client-cert-auth
--trusted-ca-file
--peer-cert-file
--peer-key-file
--peer-client-cert-auth
--peer-trusted-ca-file
```

> [!tip]
> If you are ever unsure which certificate a component is actually using, check the static pod manifest flags first. They tell the truth.

## Common gotchas

### Missing SANs on the API server certificate

If the API server certificate does not contain the right DNS names or IPs, clients will fail TLS validation.

This often happens when:

- the control plane endpoint changes
- a load balancer DNS name is introduced later
- the cluster was initialized with incomplete SAN values

### Confusing ServiceAccount keys with TLS certs

`sa.key` and `sa.pub` are important, but they are not serving certificates.

They sign tokens. They do not secure component-to-component HTTPS traffic the same way `apiserver.crt` or `etcd/server.crt` do.

### Forgetting that kubelet has two roles

People often remember only the kubelet client certificate.

But kubelet also needs a serving certificate because the API server connects back to it.

### Mixing the Kubernetes CA and etcd CA

This is a big conceptual mistake.

- Kubernetes component trust is usually signed by the **main Kubernetes CA**
- etcd trust is signed by the **etcd CA**

Those are different trust domains.

## Summary

Kubernetes certificate management becomes much easier once you stop treating it as a list of filenames and start treating it as a set of communication paths.

The main ideas are:

- Kubernetes uses PKI and X.509 certificates for encryption and identity
- the main Kubernetes CA signs normal control plane and client certificates
- the etcd CA signs etcd-related certificates
- the API server needs both a serving certificate and multiple client certificates
- kubelet also has both a client identity and a serving identity
- the cleanest way to reason about any certificate is to identify the **client**, the **server**, and the **trusted CA**

If you can answer those three things for a connection path, most Kubernetes TLS questions become straightforward.

## Related Posts

- [[devops/azure-application-gateway-for-containers|Azure Application Gateway for Containers]]
