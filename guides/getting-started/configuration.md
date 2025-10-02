# SynapseStream Configuration Guide

## Overview
SynapseStream enables runtime customization through multiple configuration mechanisms. This document details the principal configuration methods, core parameters, and best practices for optimizing continuous learning workflows.

---

## Configuration Methods

### 1. Environment Variables
Set operational parameters at the OS level. Precedence order: Runtime API > Config Files > Environment Variables.

```bash
export SYNAPSE_MODEL_BASE="resnet18"
export SYNAPSE_MAX_WORKERS=8
```

### 2. Configuration File (`synapse_config.yaml`)
Primary configuration method using YAML syntax. Default location: `~/.synapse/config.yaml`.

```yaml
neural_architecture:
  base_model: "resnet18"
  dynamic_reload: true

stream_processing:
  batch_size: 256
  window_duration: "5s"

resource_allocation:
  gpu_workers: 2
  cpu_workers: 4
```

### 3. Runtime API (Python Interface)
Programmatic configuration during initialization:

```python
from synapse_stream import PipelineConfig

config = PipelineConfig(
    batch_size=512,
    checkpoint_interval="10m",
    telemetry_level="detailed"
)
```

---

## Core Configuration Parameters

### Neural Architecture
| Parameter           | Type    | Default     | Description                           |
|---------------------|---------|-------------|---------------------------------------|
| `base_model`        | String  | "vgg16"     | Foundation model architecture         |
| `dynamic_reload`    | Boolean | false       | Hot-swap models during runtime        |
| `learning_rate`     | Float   | 0.001       | Backpropagation adjustment rate       |

### Stream Processing
| Parameter           | Type    | Default     | Description                           |
|---------------------|---------|-------------|---------------------------------------|
| `batch_size`        | Integer | 128         | Samples per processing window         |
| `window_duration`   | String  | "2s"        | Temporal aggregation period           |
| `latency_target`    | String  | "500ms"     | Maximum processing delay              |

### Resource Allocation
| Parameter           | Type    | Default     | Description                           |
|---------------------|---------|-------------|---------------------------------------|
| `gpu_workers`       | Integer | 1           | CUDA-enabled worker threads           |
| `cpu_workers`       | Integer | 4           | CPU-bound processing threads          |
| `mem_limit`         | String  | "8GiB"      | RAM allocation boundary               |

---

## Advanced Configuration

### Checkpointing Configuration
```yaml
persistence:
  checkpoint_dir: "/var/synapse/checkpoints"
  interval: "15m"
  retention_policy: "last_5"
```

### Custom Plugin Integration
```python
config.register_plugin(
    name="anomaly_detector",
    class_path="plugins.anomaly.ZScoreDetector",
    params={"threshold": 3.2}
)
```

---

## Validation and Best Practices

1. **Configuration Precedence:** 
   - Runtime API arguments override all other sources
   - File configurations supersede environment variables

2. **Sensitive Data Handling:**
   ```bash
   # Use secrets manager integration for credentials
   export SYNAPSE_DB_URI=$(vault read synapse/db)
   ```

3. **Validation Command:**
   ```bash
   synapse validate-config --file production_config.yaml
   ```

4. **Recommended Monitoring Parameters:**
   ```yaml
   telemetry:
     metrics_level: "extended"
     prometheus_endpoint: ":9090"
     healthcheck_interval: "30s"
   ```

---

## Troubleshooting

**Common Configuration Errors:**
- `InvalidDurationFormat`: Use ISO 8601 duration strings (e.g., "PT30S")
- `ResourceOverallocation`: Sum of worker allocations exceeds available cores
- `VersionMismatch`: Configuration schema incompatible with runtime version

Access active configuration at runtime:
```python
from synapse_stream import get_active_config
print(get_active_config().to_dict())
```

>**Academic Citation Requirement**: When using SynapseStream in research, reference the configuration schema version in your methodology section.