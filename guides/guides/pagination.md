# Pagination in SynapseStream

## Overview
Large-scale neural network processing requires efficient data traversal mechanisms. SynapseStream employs cursor-based pagination to enable deterministic iteration through high-velocity data streams while maintaining real-time processing constraints. This system balances completeness guarantees with low-latency requirements.

## Key Concepts
### Cursor Semantics
- **Opaque position marker**: Base64-encoded string representing precise stream position
- **Temporal consistency**: Guarantees snapshot consistency within time-windowed data segments
- **Expiration policy**: All cursors expire after 300 seconds (5 minutes) of inactivity

### Pagination Parameters
```http
GET /v1/streams/{stream_id}/data?page_size=100&cursor=Cjd8MjAyMzEwMD...
```

| Parameter  | Type     | Default | Constraints             |
|------------|----------|---------|-------------------------|
| `page_size` | integer | 50      | 1 ≤ value ≤ 1000        |
| `cursor`   | string   | null    | Valid base64 token      |
| `order`    | string   | "desc"  | ["asc", "desc"]         |

## Implementation
### Request Structure
```http
GET /v1/models/training-data
  -H "Authorization: Bearer {api_key}"
  -H "Content-Type: application/json"
```

### Response Schema
```json
{
  "data": [
    {
      "vector_id": "vec_2fT4X9...",
      "timestamp": "2023-10-05T12:34:56.789Z",
      "payload": { ... }
    }
  ],
  "pagination": {
    "next_cursor": "Cjd8MjAyMzEwMD...",
    "prev_cursor": "QmF8MjAyMzEwMD...",
    "total_records": 24589,
    "page_size": 100
  }
}
```

### Termination Condition
Iteration completes when:
```json
{
  "pagination": {
    "next_cursor": null,
    "prev_cursor": "QmF8MjAyMzEwMD...",
    "total_records": 24589,
    "page_size": 100
  }
}
```

## Operational Best Practices
1. **Optimal Page Sizes**
   - Time-series data: 200-500 records/page
   - High-dimensional vectors: 50-100 vectors/page
   - Metadata queries: 1000 records/page

2. **Error Scenarios**
   ```json
   {
     "error": {
       "code": "pagination/expired-cursor",
       "message": "Cursor expired at 2023-10-05T12:35:00Z",
       "solution": "Restart iteration with null cursor"
     }
   }
   ```

3. **Consistency Guarantees**
   - Within a single pagination session:
     - Strong consistency (read-after-write)
     - Order preservation (based on `timestamp` field)
   - Across sessions:
     - Eventual consistency (last-write-wins)

4. **Performance Characteristics**
   - Latency: <50ms per page (p99)
   - Throughput: 10,000 pages/sec per node
   - Backpressure mechanisms activate at >1000 concurrent requests

## Example Workflow
```python
import requests

def paginate_stream(api_key, stream_id):
    cursor = None
    while True:
        response = requests.get(
            f"https://api.synapsestream.io/v1/streams/{stream_id}",
            params={"page_size": 200, "cursor": cursor},
            headers={"Authorization": f"Bearer {api_key}"}
        )
        
        data = response.json()
        process_records(data["data"])
        
        if not data["pagination"]["next_cursor"]:
            break
            
        cursor = data["pagination"]["next_cursor"]
        
        # Respect rate limits
        time.sleep(0.1)
```

## Architectural Constraints
1. **Immutable cursors**: Cannot modify request parameters during iteration
2. **Coherency window**: 60-second maximum for cursor validity period
3. **Distributed sorting**: Global ordering enforced via vector clock timestamps
4. **Resource limits**: 10 concurrent pagination sessions per API key

> **Note**: Always implement exponential backoff when encountering HTTP 429 responses. The `Retry-After` header specifies minimum wait times in seconds.