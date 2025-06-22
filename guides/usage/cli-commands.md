# Syn CLI Command Reference

## Introduction
The `synapse` command-line interface (CLI) enables primary mechanism for configuring and controlling data stream processing tasks. This reference describes all available commands, their syntax, and operational

## Basic Command Structure
```
syn` | Override configuration parameters |

**Examples:**
```bash
syn=4"
```

### `stop`

Gracefully halts running pipeline and persists current state.

**Syntax:**
```
syn```

**Options:**
| Option | Description |
|--------|-------------|
| `--force` | Immediate termination without state persistence |

### `status`
Displays runtime information about active pipelines.

**Syntax:**
```
syn```

**Options:**
| Option | Description |
|--------|-------------|
| `--full` | Show detailed component-level statistics |

### `visualize
Generates real-time processing topology visualization.

**Syntax:**
```
syn<format>] [--output<path>]
```

**Options:**
| Option | Description |
|--------|-------------|
| `--format` | Output format (`png`,`svg`dot`) |
| `--output` | File path for saving visualization |

**Examples:**
```bash
syn`Lists all registered processor plugins.

**Syntax:**
```
syn```

### `validate-config`
Checks configuration file syntax and semantic correctness.

**Syntax:**
```
syn```

**Exit Codes:**
- `0`: Configuration valid
- `1`: Syntax errors detected
- `2`: Semantic errors

## State Management Comm</think>-checkpoint`

Creates manual of current pipeline state.

**Syntax:**
```
syn[--name<identifier>] [--description"text"]
```

### `restore-checkpoint`<checkpointID> [--dry-run```

## Development Commands`[--script<path>]
```

### `benchmark<test> [--duration<seconds>]
```

**Examples:**
```bash
synlatency-test --duration300
```

## Global Guidelines

1. Parameter precedence (highest to lowest):
   - Inline `--set` parameters
   - Command line options
   - Configuration file values
   - Default values

2. Environment variables:
   - Prefix: `SYNALYSIS_`

   - Example`SYNALYSIS_CHECKPOINTL=25000`

3. Logging levels- Set via `SYNALYSIS_LOG_LEVEL` (`debug`info`warn`error`)