# SynapseStream SDK Reference

## Introduction
The SynapseStream SDK provides programmatic interfaces for configuring neural processing pipelines, ingesting streaming data, and executing continuous learning workflows. This reference documents the core modules, classes, and methods available in v2.3.0.

---

## Core Modules

### 1. StreamIngestion
Handlers for real-time data acquisition and preprocessing.

#### **DataStreamConnector** `class`
Configures connections to streaming sources.

**Parameters:**
- `protocol` (str): Connection protocol (`kafka`, `mqtt`, `websocket`)
- `uri` (str): Endpoint address (host:port)
- `credentials` (dict): Authentication tokens
- `buffer_size` (int): Input buffer capacity (default=10000)

**Methods:**
```python
connect() -> ConnectionStatus
# Establishes connection to data source

stream() -> AsyncIterator[RawData]
# Yields raw data chunks from the stream
```

---

#### **StreamParser** `class`
Transforms raw data into tensors.

**Methods:**
```python
parse_from_bytes(data: bytes) -> TensorBatch
# Converts binary payload to shaped tensors

parse_from_json(data: str) -> TensorBatch
# Extracts tensors from JSON structures
```

**Example:**
```python
parser = StreamParser(schema=input_schema)
connector = DataStreamConnector(protocol="kafka", uri="kafka.synapse:9092")
async for raw in connector.stream():
    batch = parser.parse_from_bytes(raw)
```

---

### 2. Processing
Neural network pipeline construction and execution.

#### **NeuralPipeline** `class**
Configures processing graphs with feedback loops.

**Methods:**
```python
add_layer(layer: NNLayer, position: int) -> None
# Inserts processing layer at specified index

remove_layer(layer_id: str) -> bool
# Deletes layer by identifier

compile_pipeline() -> Topology
# Validates and optimizes processing graph
```

---

#### **ProcessingNode** `class`
Runtime executor for neural pipelines.

**Methods:**
```python
attach_source(connector: DataStreamConnector) -> None
# Binds input data source

attach_sink(sink: ModelSink) -> None
# Connects output handler
```

---

### 3. ModelManagement
Live model operations and version control.

#### **ModelRegistry** `class**
Central repository for model versions.

**Methods:**
```python
deploy_model(weights: Weights, metadata: dict) -> VersionHash
# Publishes new model version

rollback_version(version: VersionHash) -> bool
# Reverts to previous model state
```

---

#### **LiveModel** `class**
Runtime inference container.

**Methods:**
```python
load_context(context: ModelContext) -> None
# Initializes inference environment

infer(input: TensorBatch) -> (TensorBatch, Metrics)
# Executes predictions with performance tracking
```

---

### 4. Monitoring
Real-time observability tools.

#### **TelemetryCollector** `class**
Performance metrics aggregation.

**Metrics Tracked:**
- Throughput (events/sec)
- P99 Latency (ms)
- Model Loss
- Memory Utilization

**Methods:**
```python
start_collecting() -> None
# Activates metric aggregation

get_metrics() -> SystemTelemetry
# Returns current performance snapshot
```

---

#### **AlertManager** `class**
Threshold-based notifications.

**Methods:**
```python
register_condition(
    metric: str, 
    condition: Condition, 
    callback: AlertHandler
) -> str
# Creates monitoring rule
```

**Example:**
```python
def handle_throughput_alert(metric, value):
    print(f"Throughput dropped to {value}")

alert_mgr.register_condition(
    metric="throughput",
    condition=lambda x: x < 1000,
    callback=handle_throughput_alert
)
```

---

### 5. Utilities
Common support functions.

#### **ConfigLoader** `class**
Environment configuration handler.

**Methods:**
```python
load_from_env() -> dict
# Imports settings from environment variables

load_from_file(path: str) -> dict
# Reads configuration from YAML/JSON
```

---

#### **ConfigValidator** `class**
Schema-based configuration verification.

**Methods:**
```python
validate(config: dict, schema: ConfigSchema) -> (bool, ValidationReport)
# Checks configuration against schema
```

---

## Error Reference

| Code               | Description                          | Remediation                          |
|--------------------|--------------------------------------|--------------------------------------|
| `CONNECTION_ERROR` | Data stream source unreachable       | Verify credentials/network policies  |
| `PARSING_ERROR`    | Invalid input tensor conversion      | Check data schema alignment          |
| `MODEL_DEPLOY_ERR` | Version conflict during deployment   | Retry with force_push=True flag      |
| `GRAPH_COMPILE_ERR`| Invalid pipeline topology            | Validate layer connections with debug_graph() |

---

## Quickstart Example

```python
from synapse import StreamIngestion, Processing, ModelManagement

# Configure data source
connector = StreamIngestion.DataStreamConnector(
    protocol="websocket",
    uri="data.synapse:8080/stream"
)

# Build processing pipeline
pipeline = Processing.NeuralPipeline()
pipeline.add_layer(LSTMLayer(units=128), position=0)
pipeline.add_layer(AttentionLayer(), position=1)
pipeline.compile()

# Deploy model
registry = ModelManagement.ModelRegistry()
version = registry.deploy_model(
    weights="model_v4.weights",
    metadata={"owner": "ml-team-alpha"}
)

# Execute processing stream
model = ModelManagement.LiveModel()
model.load_context(version)
async for data in connector.stream():
    parsed = StreamParser.parse_from_json(data)
    processed, metrics = model.infer(parsed)
```

---

_See also:  
- [Architecture Overview](/guides/core-concepts/architecture.md)  
- [Performance Tuning Guide](/guides/advanced/performance.md)_