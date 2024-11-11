# SynapseStream Pull Request Process

Contributions to SynapseStream follow a structured peer review process designed to maintain code quality while respecting contributors' time. This document outlines the complete workflow from initial submission through merge.

## 1. Prerequisites
Before submitting a pull request (PR):
- Confirm you've signed our [Contributor License Agreement](https://example.com/cla)
- Ensure your local fork is synchronized with `main`:
  ```bash
  git remote add upstream https://github.com/synapsestream/core.git
  git fetch upstream
  git rebase upstream/main
  ```
- Verify compliance with:
  - [Coding Standards](https://github.com/synapsestream/core/blob/main/guides/contributing/coding-standards.md)
  - [Architecture Guidelines](https://github.com/synapsestream/core/blob/main/guides/architecture/principles.md)

## 2. Branch Management
Follow our branch naming convention:
```
{type}/{issue-id}-{short-description}
```
Accepted types:
- `feat/`: New functionality
- `fix/`: Bug resolution
- `perf/`: Performance enhancements
- `docs/`: Documentation updates

Example:
```bash
git checkout -b feat/syn-422-stream-optimization
```

## 3. Submission Requirements
Create PRs through GitHub's interface with all checkboxes below completed:

### [REQUIRED] Validation Checklist
- [ ] Unit tests cover all critical paths
- [ ] Integration tests pass against live data streams
- [ ] Benchmarks demonstrate no performance regression
- [ ] Documentation reflects changes (see [Doc Guidelines](https://github.com/synapsestream/core/blob/main/guides/documentation/style-guide.md))
- [ ] CHANGELOG.md updated using [Keep a Changelog](https://keepachangelog.com/) format

### Template Compliance
PR descriptions must follow this structure:
```markdown
## Problem Statement
[Detailed context explaining the issue being addressed]

## Technical Approach
- Algorithmic changes
- Architectural impact analysis
- Tradeoff considerations

## Verification Methodology
1. Testing environments (include stream simulation parameters)
2. Performance metrics before/after
3. Edge case handling demonstration

Related Issues: closes #123, relates #456
```

## 4. Review Process
### 4.1 Automated Checks
PRs trigger:
- Static analysis (SonarQube profile `synapse-stream`)
- Build verification (Jenkins pipeline `synapse-pr-validation`)
- Real-time stream simulation (AWS Kinesis test harness)

### 4.2 Human Review
1. **Triage**: Maintainers assign reviewers within 24 business hours
2. **First-Pass Review** (48h target):
   - At least two approvals required from:
     - 1 system architect
     - 1 domain expert
   - Reviewers validate:
     - Architectural coherence
     - Streaming implications (backpressure handling, throughput impact)
     - API compatibility
3. **Revision Cycle**:
   - Contributors address feedback through atomic commits
   - Force-pushing permitted during active iteration
   - Use `git fixup` for review adjustments

## 5. Approval & Merging
### Merge Authorization
- Requires two maintainer approvals after CI passes
- Approval checklist:
  - [ ] No streaming deadlock potential
  - [ ] Memory management verified
  - [ ] Handle hot-path optimizations
  - [ ] Satisfies all acceptance criteria

### Merge Procedure
```bash
git fetch origin
git rebase -i upstream/main
git push origin {branch-name} --force-with-lease
```
- **Squash Requirement**: All PR commits squashed into one meaningful message
- **Merge Style**: Rebase merging only (linear history preservation)
- **Post-Merge**: CI performs full regression suite before deployment

## 6. Post-Merge Operations
1. Automated version tagging follows [SemVer](https://semver.org/) rules
2. Nightly builds incorporate changes into our performance baseline
3. Documentation deployment via CI to [docs.synapsestream.io](https://docs.synapsestream.io)

## 7. Continuous Integration Reference
![PR Workflow Diagram](https://github.com/synapsestream/core/blob/main/docs/assets/pr-workflow.png)
*Figure 1: End-to-end pull request validation pipeline*

For exceptional circumstances requiring expedited review, contact integrations-team@synapsestream.io with the subject "PR Expedite: [PR#]".