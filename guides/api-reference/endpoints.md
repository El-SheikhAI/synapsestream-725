# SynapseStream REST API Endpoints Reference

## Introduction
SynapseStream provides a RESTful API for real-time neural network processing operations. All endpoints return JSON responses and require `application/json` Content-Type headers. Base path: `/api/v1`.

---

## Stream Management Endpoints

### Create Data Stream
`POST /streams`

Registers a new data stream source for processing.

**Request Body:**
```json
{
  "name": "sensor_data_2023",
  "description": "IoT sensor readings from factory floor",
  "sourceType": "kafka",
  "config": {
    "bootstrapServers": "kafka01:9092",
    "topic": "sensor-telemetry",
    "groupId": "synapse-processor"
  }
}
```

**Success Response (201 Created):**
```json
{
  "id": "strm_9f8s7d6f5g4e",
  "createdAt": "2023-09-15T14:23:18Z",
  "status": "active"
}
```

### Retrieve Stream List
`GET /streams`

Lists all registered data streams.

**Query Parameters:**
| Parameter | Type    | Description              |
|-----------|---------|--------------------------|
| `status`  | string  | Filter by active/inactive|

**Success Response (200 OK):**
```json
{
  "streams": [
    {
      "id": "strm_9f8s7d6f5g4e",
      "name": "sensor_data_2023",
      "sourceType": "kafka",
      "status": "active"
    }
  ]
}
```

---

## Model Management Endpoints

### Register Neural Model
`POST /models`

Deploys a new neural network model to the processing framework.

**Request Body:**
```json
{
  "name": "defect_detection_v5",
  "framework": "tensorflow_2.12",
  "modelType": "convolutional_gru",
  "artifactLocation": "s3://models/defect-detection-v5.zip",
  "inputSchema": {
    "features": ["temperature", "vibration_x", "pressure"],
    "windowSize": 30
  }
}
```

**Success Response (201 Created):**
```json
{
  "modelId": "nn_c7d65f4e3b2a",
  "validationStatus": "pending",
  "deploymentUrl": "/api/v1/models/nn_c7d65f4e3b2a"
}
```

### Get Model Inference Endpoint
`GET /models/{modelId}/endpoint`

Retrieves the real-time prediction URL for a validated model.

**Success Response (200 OK):**
```json
{
  "inferenceEndpoint": "/api/v1/inference/nn_c7d65f4e3b2a",
  "throughput": "8500 req/sec",
  "lastActive": "2023-09-15T14:35:02Z"
}
```

---

## Inference Endpoints

### Execute Real-Time Prediction
`POST /inference/{modelId}`

Processes input data through deployed neural networks.

**Request Body:**
```json
{
  "streamId": "strm_9f8s7d6f5g4e",
  "dataWindow": [
    {"temperature": 45.2, "vibration_x": 0.12, "pressure": 1.45},
    {"temperature": 46.1, "vibration_x": 0.14, "pressure": 1.43}
  ]
}
```

**Success Response (200 OK):**
```json
{
  "modelId": "nn_c7d65f4e3b2a",
  "predictions": [0.87, 0.92],
  "anomalyFlags": [false, true],
  "processingLatency": 15.4
}
```

---

## Training Endpoints

### Initiate Continuous Learning
`POST /training/tasks`

Starts an incremental training job on streaming data.

**Request Body:**
```json
{
  "name": "retrain_defect_model",
  "modelId": "nn_c7d65f4e3b2a",
  "dataStreamIds": ["strm_9f8s7d6f5g4e"],
  "parameters": {
    "learningRate": 0.001,
    "batchSize": 256,
    "validationSplit": 0.15
  }
}
```

**Success Response (202 Accepted):**
```json
{
  "taskId": "trn_3a4b5c6d7e8f",
  "statusUrl": "/api/v1/training/tasks/trn_3a4b5c6d7e8f",
  "estimatedCompletion": "2023-09-15T15:30:00Z"
}
```

---

## System Monitoring Endpoints

### Health Check
`GET /health`

Returns operational status of the SynapseStream system.

**Response:**
```json
{
  "status": "operational",
  "components": {
    "streamProcessor": "online",
    "modelServer": "online",
    "trainingService": "degraded"
  },
  "version": "2.3.1"
}
```

### Performance Metrics
`GET /metrics`

Provides real-time system performance statistics.

**Query Parameters:**
| Parameter     | Type    | Description                    |
|---------------|---------|--------------------------------|
| `granularity` | string  | Time window: 1m,5m,15m(default)|

**Success Response (200 OK):**
```json
{
  "throughput": {
    "inference": 2450,
    "training": 18
  },
  "latency": {
    "p95": 42.3,
    "p99": 67.8
  },
  "resourceUtilization": {
    "cpu": 63.2,
    "gpu": 88.1,
    "memory": 45.6
  }
}
```