# SynapseStream Development Environment Setup

## Prerequisites
- **Python**: 3.10 or newer (recommended: 3.11.5)
- **CUDA Toolkit**: 12.1+ (NVIDIA GPU required for hardware acceleration)
- **NVIDIA Container Toolkit**: 1.14.1+ (Docker GPU support)
- **System Packages** (Debian/Ubuntu):
  ```bash
  sudo apt install build-essential cmake libopenblas-dev liblapack-dev nvidia-cuda-toolkit
  ```

## Environment Configuration

### Python Virtual Environment
```bash
# Conda (recommended)
conda create -n synapse python=3.11.5
conda activate synapse

# Alternative: venv
python3.11 -m venv .venv
source .venv/bin/activate
```

### Package Installation
```bash
pip install -U pip wheel setuptools
pip install -e .[dev]
```

*Note:* Optional dependencies include:
- `.[docs]`: Documentation tools
- `.[benchmarks]`: Performance testing
- `.[gpu]`: CUDA-accelerated components

## Docker Setup
```bash
# Build with GPU support
docker build -t synapsestream:dev --build-arg CUDA_VERSION=12.1.1 .

# Run interactive container with GPU
docker run -it --gpus all -v $(pwd):/app synapsestream:dev /bin/bash
```

## Initial Configuration
Create `.env` file in project root:
```ini
SYNAPSE_LOG_LEVEL=DEBUG
DATA_STREAM_BUFFER_SIZE=65536
MODEL_CACHE_DIR=./.model_cache
```

## Verification Tests
```bash
# Core functionality
pytest tests/core -v

# GPU-accelerated components (requires NVIDIA GPU)
pytest tests/integration -m "gpu" -v

# Stream processing validation
python -m synapse.validate --test-pipeline
```

## Development Workflow

### Key Directories
- `src/synapse/core`: Stream processing primitives
- `src/synapse/nn`: Neural network modules
- `tests/stress`: Performance/load testing

### Pre-commit Hooks
```bash
pre-commit install
pre-commit run --all-files
```

### Documentation Building
```bash
cd docs
make clean && make html
```

## Configuration Reference
| Environment Variable        | Default      | Description                          |
|-----------------------------|--------------|--------------------------------------|
| `SYNAPSE_LOG_LEVEL`         | INFO         | Logger verbosity (DEBUG/INFO/WARN)   |
| `MODEL_UPDATE_INTERVAL`     | 300          | Model refresh interval (seconds)     |
| `DATA_PIPELINE_TIMEOUT`     | 30           | Stream processing timeout (seconds)  |
| `GPU_MEMORY_FRACTION`       | 0.8          | GPU memory allocation ratio          |

*Note:* For GDPR compliance, ensure `DATA_CACHE_DIR` points to secure storage when handling personal data.