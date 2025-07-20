# SynapseStream Migration Guide: Transitioning to v2.0  

**Version:** 2.0  
**Last Updated:** October 27, 2023  

---

## Overview  
SynapseStream v2.0 introduces architectural refinements for optimized real-time processing, including a redesigned API for neural network pipeline orchestration and enhanced stream-processing semantics. This guide provides a structured path for migrating from v1.x to v2.0, covering breaking changes, deprecated features, and mitigation strategies.  

---

## Prerequisites  
1. **SynapseStream v1.7+**: Earlier versions require incremental upgrades.  
2. **Python ≥3.9**: v2.0 drops support for Python 3.7.  
3. **Updated Dependencies**:  
   ```bash
   pip install --upgrade synapse-stream==2.0.0 numpy>=1.22.0 tensorflow>=2.12.0
   ```  

---

## Step-by-Step Migration  

### 1. API Endpoint Updates  
#### Old (v1.x)  
```python
from synapse.stream import NeuralPipeline  
pipeline = NeuralPipeline.load("model_v1", input_stream=kafka_stream)
```  

#### New (v2.0)  
```python
from synapse.stream import StreamProcessor  
processor = StreamProcessor.from_registry(  
    model_id="model_v1",  
    input_source=kafka_stream,  
    strategy="continuous"  # New execution strategy parameter  
)
```  

### 2. Configuration Schema Changes  
YAML configurations now enforce strict schema validation.  

#### v1.x Configuration  
```yaml
pipeline:  
  model: resnet50  
  batch_size: 128  
```  

#### v2.0 Configuration  
```yaml
version: 2.0  
processing:  
  model:  
    id: resnet50  
    checkpoint: latest  
  runtime:  
    batch:  
      size: 128  
      timeout_ms: 100  # New mandatory field  
```  

### 3. Event-Driven Callbacks  
The `on_failure` callback signature has changed to include contextual metadata.  

#### v1.x  
```python
def on_failure(error):  
    log_error(error)  
```  

#### v2.0  
```python
def on_failure(error, context):  
    log_error(f"Stream ID {context.stream_id} failed: {error}")  
```  

---

## Breaking Changes and Mitigation  

### Removed Features  
| Feature          | Replacement                          |  
|------------------|--------------------------------------|  
| `LegacySampler`  | `DynamicBatcher` (v2.0+)             |  
| `pipeline.run()` | `processor.execute(strategy="async")`|  

### Deprecations  
- **TensorFlow 1.x Models**: Full support ends December 2023. Retrain models using TF 2.12+.  
- **ZMQ Transport**: Replaced by gRPC-streaming for cross-language compatibility.  

---

## Helpful Tools  
### Migration Assistant Script  
Validate configuration files against v2.0 schemas:  
```bash
python -m synapse.tools.migrate --config ./old_config.yml --output ./new_config.yml
```  

### Compatibility Mode (Limited Use)  
Temporarily enable v1.x API behavior with runtime warnings:  
```python
StreamProcessor.enable_backwards_compat()  # Remove after testing  
```  

---

## Verification  
1. Execute unit tests with the `SYNAPSE_ENV=migration` flag:  
   ```bash
   SYNAPSE_ENV=migration pytest tests/ --capture=no
   ```  
2. Monitor for deprecation warnings:  
   ```python
   import warnings  
   warnings.simplefilter("error", category=SynapseDeprecationWarning)  
   ```  

---

## Troubleshooting  
**Issue**: `InvalidSchemaError` after upgrade.  
**Solution**: Run the Migration Assistant to auto-fix 80% of schema issues.  

**Issue**: Input streams disconnect randomly.  
**Solution**: Set `heartbeat_interval_ms: 30000` in `runtime` configurations.  

---

## Support  
- **Documentation**: [SynapseStream v2.0 Docs](https://synapsestream.io/v2)  
- **Slack**: `#synapse-migration` in [ML Engineers workspace](https://slack.mlengineers.io)  
- **Email**: synapse-support@company.tech (Priority SLA for migration issues)  

--- 

> [!NOTE]  
> Critical production systems should deploy v2.0 in a canary environment for 72 hours before full cutover.