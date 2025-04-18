# SynapseStream Installation Guide

## Prerequisites
Before installing SynapseStream, ensure your system meets these requirements:

- **Operating System**:  
  Linux (Ubuntu 20.04+/CentOS 7+) / macOS 10.15+ / Windows (WSL 2 recommended)  
- **Python**: Version 3.8 or higher  
- **Package Manager**: `pip` (v21.0+) or `conda` (v4.10+)  
- **System Libraries**:  
  ```bash
  # Ubuntu/Debian
  sudo apt-get install build-essential libopenblas-dev

  # CentOS/RHEL
  sudo yum groupinstall "Development Tools" && sudo yum install openblas-devel
  ```

---

## Installation Methods

### PyPI (Recommended)
Install the latest stable release via pip:

```bash
pip install synapse-stream[gpu]==1.0.0  # GPU acceleration (requires CUDA 11.7+)
pip install synapse-stream==1.0.0       # CPU-only installation
```

### Conda
For Anaconda/Miniconda users:

```bash
conda create -n synapse_env python=3.9
conda activate synapse_env
conda install -c synapseai synapse-stream -c pytorch -c nvidia
```

### Source Installation
For developers or custom builds:

1. Clone the repository:
   ```bash
   git clone https://github.com/synapseai/SynapseStream.git
   cd SynapseStream
   ```

2. Install build dependencies:
   ```bash
   pip install -r requirements/build.txt
   ```

3. Compile with optimizations:
   ```bash
   USE_CUDA=1 python setup.py install  # Enable GPU support
   # OR
   python setup.py install             # CPU-only build
   ```

---

## Post-Installation Verification

Confirm successful installation with Python:

```python
import synapse_stream as ss
print(f"SynapseStream v{ss.__version__}")
print("Acceleration Backend:", ss.get_accelerator_name())
```

Expected output:
```
SynapseStream v1.0.0
Acceleration Backend: CUDA 12.1  # Varies based on install configuration
```

---

## Docker Quick Start

Pre-configured container for production deployments:

```bash
docker pull synapseai/synapsestream:1.0.0-cuda12.1
docker run -it --gpus all synapseai/synapsestream:1.0.0-cuda12.1 \
  python -c "import synapse_stream; print(synapse_stream.test_throughput())"
```

---

## Troubleshooting

### Common Issues
1. **CUDA Errors**:  
   Verify NVIDIA driver compatibility:
   ```bash
   nvidia-smi --query-gpu=driver_version --format=csv
   ```
   Install matching CUDA toolkit version [following official guidelines](https://developer.nvidia.com/cuda-toolkit-archive).

2. **Missing BLAS Libraries**:  
   Reinstall system packages and rebuild:
   ```bash
   sudo apt-get install libopenblas-openmp-dev  # Ubuntu/Debian
   pip install --no-cache-dir --force-reinstall synapse-stream
   ```

3. **Python Environment Conflicts**:  
   Use isolated environments:
   ```bash
   python -m venv synapse_venv
   source synapse_venv/bin/activate
   ```

---
*For advanced configuration, proceed to the [Deployment Guide](/guides/deployment/kubernetes.md).*