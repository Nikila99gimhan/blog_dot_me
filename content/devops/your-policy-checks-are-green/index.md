---
title: "Your Policy Checks Are Green. Your Impact Is Still Unknown."
date: 2026-10-04
tags: [devops, platform-engineering, governance, github-copilot, agentic-workflows, infrastructure-as-code, terraform, bicep]
description: "Green CI can leave downstream compatibility unassessed. Why critical shared repositories need consumer impact review, and where governed investigation with GitHub Copilot and MCP can help."
draft: false
---

![Your policy checks are green. Your impact is still unknown.](./policy-green-impact-unknown-cover.jpg)

The build passes. Lint passes. Security scans pass. Your policy checks are green.

That means the evaluated configuration passed the checks that ran. It may still leave downstream compatibility unassessed.

For a shared infrastructure repository, that distinction matters. A change can satisfy your subnet allowlist, your identity policy and your deployment standards while breaking an assumption in the application that consumes it.

Before I approve a change like that, I want to know what the green result covers. Did we assess the shared module against its test fixtures? Did we also assess the consumers, their selected versions and their production configuration?

This first article is about that gap. I want to explain why critical repositories deserve consumer impact review, what makes that review difficult, and where a governed AI investigator can make a useful contribution. In Part 2, I will build the engineering path using GitHub Copilot, GitHub workflows and Model Context Protocol (MCP) tools.

## One shared repository becomes many production dependencies

Let's take a familiar platform engineering setup.

An organization maintains custom Terraform modules, Bicep modules and Helm charts centrally. Application teams consume them from shared repositories or artifact registries instead of implementing the same infrastructure patterns independently.

The platform team maintains the common definitions. Payments, Ordering, Customer APIs and Analytics apply those definitions in different subscriptions, accounts and regions.

Some consumers inherit the defaults. Others override them. Some upgrade immediately; others follow a release window. The same module ends up carrying different operational assumptions.

Helm has a similar relationship through shared dependencies and library charts. A parent chart includes dependencies as subcharts; a library chart supplies reusable template definitions. A change to those definitions can affect the manifests rendered by several application charts. [1]

The benefit of reuse comes with an obligation: understand what a shared change means for the systems that use it.

## An approved subnet can still break Payments

Consider an illustrative Azure scenario. These are example configurations, not findings from a live environment.

A shared module places a database private endpoint in a subnet. A proposed release changes its default from subnet A, `10.40.10.0/24`, to subnet B, `10.40.20.0/24`.

Both subnets are approved. Public access remains disabled. The module builds, and the evaluated policy rules pass.

Payments inherits this default. Its candidate infrastructure plan proposes replacing the private endpoint in subnet B.

Now add the consumer context: Payments' database traffic passes through an enterprise firewall. Its existing network rule permits the required database traffic to destination addresses in `10.40.10.0/24`. There is no corresponding allowance for subnet B.

For this example, routing and private-endpoint network policies are configured to keep traffic to either subnet on that inspected path. That is an explicit architecture assumption; private endpoint traffic does not automatically pass through a firewall. Azure supports inspection patterns with the necessary routing configuration. [8][9]

If Payments adopts the release and deploys the replacement, the endpoint receives an address from subnet B. Once DNS resolves the database name to that new address, the application sends traffic to `10.40.20.0/24`. If the firewall policy remains unchanged, that traffic is denied.

Payments loses database connectivity.

The subnet is permitted by policy. The consumer's connectivity contract has still been broken.

The missing relationship was between the module's placement decision and the firewall configuration maintained elsewhere. A module policy check that never evaluated that relationship could pass correctly.

Other consumers need different conclusions:

| Consumer | Configuration in this example | Direct impact of the candidate |
| --- | --- | --- |
| Payments | Adopts the candidate and inherits the default | Endpoint replacement introduces a destination range its existing firewall rule does not permit |
| Ordering | Production retains the previous immutable release | Does not inherit this module change yet |
| Customer APIs | Adopts the candidate but explicitly selects subnet A | Overrides this default; other candidate changes still need review |
| Analytics | Known consumer, but current configuration is unavailable | Impact remains unknown until the owner supplies evidence |

There may also be indirect impact. If Ordering calls Payments during checkout, it can experience failed transactions even while its own infrastructure stays on the old release. That runtime relationship needs separate evidence. A module consumer list alone cannot establish it.

![A shared module change reaches consumers through adoption and deployment, with different outcomes for each consumer.](./shared-module-impact.svg)

A merge alone does not change live resources. Exposure follows resolution, adoption and deployment. Recovery follows those consumers too: reverting the shared source does not automatically restore resources already changed by their deployments.

## The tools can be right while the review is incomplete

I would be careful about describing this as a failure of open-source scanners or policy engines.

A linter can validate the syntax. A security scanner can find the patterns it recognizes. A policy engine can enforce the rules and inputs it receives. Each can do its job correctly.

The gap appears when nobody connects the module diff, the consumer's effective inputs, its deployed version and its operational dependencies into one assessment.

We should close repeatable parts of that gap with deterministic controls. Consumer tests, rendered-manifest comparisons, infrastructure plans and connectivity checks are all useful. If a compatibility requirement can be expressed and tested reliably, encode it.

Preview coverage also needs attention. Bicep what-if can leave parts of a deployment unevaluated or exclude resources when analysis short-circuits. Those gaps belong in the review result. A successful preview operation does not establish that every relevant resource was assessed. [2]

This is familiar change impact analysis and consumer compatibility review. The problem predates AI. What this series explores is how to make that work more consistent when the evidence is fragmented across an enterprise.

## What makes a repository critical?

Criticality follows the consequences of a change. A repository with a few files can sit underneath a large part of production.

I would look for these properties:

- **Many consumers:** one definition influences several services, teams or deployment scopes.
- **Privileged configuration:** changes affect identity, networking, access boundaries or deployment authority.
- **Shared failure domains:** several consumers can inherit the same incompatible behavior during a coordinated upgrade.
- **Important production dependencies:** failure affects transaction processing, customer access or another essential service.
- **Difficult recovery:** correcting the shared source still requires consumer deployments, resource restoration or coordinated action across owners.

A repository becomes especially sensitive when several of these properties overlap. That is where I would require impact evidence before approving a shared release, followed by review of each consumer's actual adoption.

## Versioning controls adoption. Compatibility still needs evidence.

Version every shared component and make release adoption deliberate. I agree with that approach.

A consumer pinned to an unchanged, immutable old release does not receive a candidate simply because it was merged. A moving branch reference creates a different exposure path: a later resolution can retrieve changed content without an explicit version bump in the consumer.

Terraform supports version constraints for registry modules and Git references for Git-sourced modules. Bicep registry references include a tag. Published release content must also be protected against unintended replacement. [3][4]

One Terraform detail matters here: `.terraform.lock.hcl` currently tracks provider selections, not remote module selections. Committing that file does not, by itself, pin every shared module. [5]

Even with disciplined versioning, someone eventually proposes the Payments upgrade. The question then becomes whether that selected release works with Payments' effective configuration.

The version identifies the release. It does not establish compatibility with the firewall rule.

## The work currently falls on people

To assess this change, a reviewer has to find the consumers, resolve their actual module versions, inspect overrides, locate owners and read the relevant plans.

Then the reviewer has to follow the dependencies beyond the module repository. In our example, that means finding the Payments network contract and the firewall configuration owned by another team. Is the document current? Does the rule export describe the same region? Has an exception already changed the effective policy?

A note saying “use the approved endpoint subnet” is not enough if the plan now selects a different approved subnet.

This is the human work behind the review: reconciling records that were written at different times, by different teams, for different purposes. A reviewer can spend substantial effort establishing which assumptions still hold before making the actual decision.

Undocumented dependencies and outdated compatibility records can become technical debt when nobody maintains them. The missing information in a particular review is an evidence gap. The services and regions that could be affected define the potential blast radius.

I would keep those distinctions clear. They tell us whether we need better documentation, more complete evaluation, or a tighter rollout boundary. An AI-generated report cannot remove those obligations.

## Where an AI investigator earns its place

The existence of risk is not enough to justify AI.

If the consumer inventory, candidate subnet and effective firewall policy are available as structured data, a deterministic evaluator can check whether the destination range is permitted. We do not need a language model to compare address ranges.

The stronger case appears earlier in the review: finding the relevant assumption in scattered documentation, reconciling it with a plan change, noticing that a rule export belongs to an older deployment, and asking the specific follow-up that resolves the uncertainty.

That work often involves prose, inconsistent terminology and incomplete contracts. It can be expensive to encode every document relationship as a separate rule. A governed investigator may help interpret the available context and turn it into a focused review question.

I would keep collection deterministic wherever practical: resolve versions and inputs, collect plans and configuration records, identify owners, and record coverage. Give Copilot that prepared evidence first. Let it request additional permitted context only when needed.

MCP tools can expose those records within a controlled scope. The server and its credentials must enforce access to the permitted repositories and artifacts. MCP is an access mechanism; it does not automatically provide organization-wide discovery or authorization. [6]

For our example, suppose the investigator has three illustrative records:

| Record | What it establishes |
| --- | --- |
| Candidate Payments plan | Proposes replacing the endpoint in subnet B |
| Payments network contract | Documents an inspected database path and an allowance for subnet A |
| Previous firewall export | Shows the subnet A allowance, but predates the candidate review |

A useful contribution would look like this:

> **Compatibility concern:** the candidate Payments plan selects `10.40.20.0/24`, while the Payments network contract documents database access through a firewall allowance for `10.40.10.0/24`. The available firewall export also covers the old range, but it is stale and cannot establish the current effective policy.
>
> **Question for the network owner:** does the effective firewall policy permit Payments' database traffic to subnet B in the target region? Supply the current rule evidence and validate the candidate connection path before approving adoption.

The actual report would link each statement to its plan, contract and export. It should also identify the affected scope and the owner who can resolve the question.

This contribution connects a resource change to an operational assumption. It explains why the available records are insufficient and directs the reviewer to the missing evidence.

Once current configuration is collected, a deterministic check can evaluate the allowance. If it confirms a deny, report that finding. Until then, describe a supported compatibility concern rather than an observed outage.

## Successful CI must still enter the review path

An investigator triggered only by CI failure would miss this example. Every ordinary check passed.

For critical shared repositories, I would use trusted deterministic rules to identify changes that require impact review: defaults, interfaces, networking, identity and deployment scope. Required consumer coverage should also be checked.

Critical candidates enter that path even when CI is green. The classifier identifies the need for review; the investigator helps interpret the context where that extra work is useful.

A complete inventory and comprehensive consumer tests may already answer the question. In that case, running an agent needs an additional, demonstrated benefit. Where records are fragmented, the investigation should make consequential relationships and unresolved questions easier to review.

![Critical changes receive impact review even after ordinary checks pass. Copilot interprets evidence; a deterministic gate and owners control progression.](./governed-impact-review.svg)

## Governed means someone owns the decision

Permissions are part of governance. Responsibility is another part.

The investigator should read authorized evidence without inheriting deployment authority. Cloud previews can be produced by a separate controlled evaluator. Repository text, logs and tool responses must remain untrusted inputs; instructions inside them must not expand access or redirect outputs.

GitHub Agentic Workflows documents a separation between agent execution with read-level access and external writes handled through controlled output stages. Correct credentials and configuration are still required. [7]

But a tightly controlled agent can still produce an incorrect interpretation. Consequential findings need validation by the people accountable for the affected systems.

In our example, the network owner validates the firewall finding. The Payments owner validates the consumer behavior and readiness for adoption. The shared module maintainer decides whether the release meets its compatibility and documentation requirements. Any acceptance of unresolved risk belongs to the designated change authority under the organization's process, with its scope and conditions recorded.

The report informs those decisions. It does not make them on the owners' behalf.

Evidence must be associated with the evaluated candidate and consumer revisions. A candidate SHA identifies the commit; recording it alone does not establish a signed attestation. Relevant changes require fresh evaluation, and approval protections must be configured so reviews of an earlier candidate cannot silently authorize a changed one.

A required check should enforce evidence coverage and required approvals for the current candidate. A generated pull request comment cannot enforce that requirement by itself. Missing required evidence should hold the review for resolution or an explicitly authorized exception. Consumer deployment controls still govern the eventual rollout.

## What I want a green result to tell me

For a critical shared repository, I want to see the compliance result alongside the consumer impact assessment: what changed, who would adopt it, which assumptions were evaluated, and what still needs an owner's decision.

Governed investigation with Copilot and MCP may help bring that assessment together. Its value is clearer reasoning across fragmented evidence, with findings that reviewers can verify and controls that enforce their decisions.

I would judge it by whether it surfaces important relationships earlier and reduces the work of reconstructing context. That benefit needs to justify its runtime, tool usage and operating cost.

Part 2 will turn this into an engineering workflow: classify critical changes, collect authorized evidence, expose bounded context through MCP, run the Copilot investigator, and connect the result to an enforced review gate.

For now, take one shared module your organization depends on. If its default changed tomorrow, could you show which consumers would inherit it and which production assumptions would need review?

That is the question the green ticks may still leave open.

## Explore the scenario

Switch between the risk path, consumer evidence and governed review below. The interactive workbench demonstrates the proposed pattern:

<div class="interactive-diagram-container" style="margin: 2.5rem 0 1.5rem 0; width: 100%;">
  <iframe 
    src="./shared-module-impact-interactive.html" 
    title="Shared module impact: green checks, consumer evidence and governed review" 
    loading="lazy" 
    sandbox="allow-scripts allow-same-origin" 
    allow="fullscreen"
    allowfullscreen
    style="width: 100%; aspect-ratio: 16 / 9.4; min-height: 560px; border: 1px solid var(--lightgray, #d8e0ea); border-radius: 8px; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
  ></iframe>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem; font-size: 0.85rem; color: var(--gray, #59697b);">
    <span>💡 <em>Interactive Architecture Workbench:</em> Click any component to inspect its contracts, press 1-2-3 for view switching, or Space to step through.</span>
    <a href="./shared-module-impact-interactive.html" target="_blank" rel="noopener" style="font-weight: 600; text-decoration: underline;">Open full screen ↗</a>
  </div>
</div>

## References

1. [Helm: Library charts](https://helm.sh/docs/v3/topics/library_charts/) and [chart dependencies](https://helm.sh/docs/topics/charts/).
2. [Microsoft Learn: Bicep what-if, including analysis limitations](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if).
3. [HashiCorp: Using modules, registry versions and Git references](https://developer.hashicorp.com/terraform/language/modules/configuration).
4. [Microsoft Learn: Bicep modules and registry references](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/modules).
5. [HashiCorp: Dependency lock file and its scope](https://developer.hashicorp.com/terraform/language/files/dependency-lock).
6. [GitHub Agentic Workflows: Using MCP servers](https://github.github.com/gh-aw/guides/mcps/).
7. [GitHub Agentic Workflows: Security architecture and permission separation](https://github.github.com/gh-aw/introduction/architecture/).
8. [Microsoft Learn: Private endpoint addressing and network policies](https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview).
9. [Microsoft Learn: Inspecting private endpoint traffic with Azure Firewall](https://learn.microsoft.com/en-us/azure/private-link/inspect-traffic-with-azure-firewall).

## Related Posts

- [[devops/kubernetes-v1-37-sneak-peek|Kubernetes v1.37 Sneak Peek: What Platform Engineers Should Actually Care About]]
- [[devops/azure-application-gateway-for-containers|Azure Application Gateway for Containers]]
- [[devops/kubernetes-tls-certificate-management|Kubernetes TLS Certificate Management: How Cluster Certificates Work]]
