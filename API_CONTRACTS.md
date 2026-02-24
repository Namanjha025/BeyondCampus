# BeyondCampus API Contracts

## Proxy Routes (Ready for UI Integration)

### 1. POST /api/twins/{twin_id}/trainer/messages

**Purpose**: Train an AI twin with user conversations

**Authentication**: Required (Bearer token)

**Request Body**:
```json
{
  "notebook_id": "notebook_123", // Optional: topic grouping
  "chapter_id": "chapter_456",   // Optional: sub-topic  
  "thread_id": "thread_789",     // Required: conversation thread
  "text": "I'm Naman, an AI Architect at SMU. I help students with AI career guidance."
}
```

**Success Response** (200):
```json
{
  "ai_text": "That's fascinating! Tell me more about your experience at SMU and what specific AI guidance you provide to students.",
  "correlation_id": "uuid-1234-5678",
  "latency_ms": 1250
}
```

**Error Response** (401/404/500):
```json
{
  "error": "Authentication required",
  "correlation_id": "uuid-1234-5678"
}
```

---

### 2. POST /api/twins/{twin_id}/chat/messages

**Purpose**: Chat with a published AI twin

**Authentication**: Optional (public twins allow anonymous chat)

**Request Body**:
```json
{
  "text": "What advice do you have for getting into AI?",
  "notebook_id": "ai-guidance",     // Optional: focus on specific knowledge
  "chapter_id": "career-advice",    // Optional: specific sub-topic
  "viewer_thread_id": "chat_abc123" // Optional: maintains conversation context
}
```

**Success Response** (200):
```json
{
  "ai_text": "Based on my experience at SMU, I'd recommend starting with foundational math and programming skills...",
  "citations": [
    {
      "type": "notebook",
      "notebook_id": "ai-guidance", 
      "title": "AI Career Guidance",
      "chapter_id": "career-advice"
    }
  ],
  "correlation_id": "uuid-5678-9012",
  "latency_ms": 950
}
```

**Error Response** (404/403/500):
```json
{
  "error": "Twin not available for chat",
  "correlation_id": "uuid-5678-9012"  
}
```

---

## Management Routes

### 3. POST /api/twins

**Purpose**: Create a new AI twin

**Authentication**: Required

**Request Body**:
```json
{
  "twinName": "Naman Jha",
  "tagline": "AI Architect at SMU", 
  "personality": "Helpful and encouraging mentor",
  "tone": "friendly, professional",
  "links": [
    {"title": "LinkedIn", "url": "https://linkedin.com/in/naman"}
  ]
}
```

**Success Response** (200):
```json
{
  "success": true,
  "twin": {
    "id": "twin_uuid_123",
    "twin_name": "Naman Jha",
    "status": "TRAINING",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "trainingUrl": "/users/user_123/train?twinId=twin_uuid_123"
}
```

---

### 4. POST /api/twins/{twin_id}/sessions

**Purpose**: Create a training/chat session with specific topic IDs

**Authentication**: Required (twin owner only)

**Request Body**:
```json
{
  "type": "trainer",              // Required: "trainer" or "chat"
  "notebook_id": "career-guide",  // Optional: will generate if missing
  "chapter_id": "smu-experience", // Optional: will generate if missing  
  "thread_id": "thread_custom"    // Optional: will generate if missing
}
```

**Success Response** (200):
```json
{
  "session_id": "session_uuid_456",
  "twin_id": "twin_uuid_123", 
  "type": "trainer",
  "notebook_id": "career-guide",
  "chapter_id": "smu-experience",
  "thread_id": "thread_custom",
  "created_at": "2024-01-15T10:35:00Z"
}
```

---

## Usage Flow

### Training Flow:
1. `POST /api/twins` → Create twin
2. `POST /api/twins/{id}/sessions` → Create training session  
3. `POST /api/twins/{id}/trainer/messages` → Multiple training conversations
4. `POST /api/twins/publish` → Publish twin

### Chat Flow:
1. Find published twin via explore page
2. `POST /api/twins/{id}/chat/messages` → Chat with twin
3. Optional: `POST /api/twins/{id}/sessions` → Create persistent chat thread

---

## Environment Variables Required

```bash
# Add to .env.local
TRAINER_SERVICE_URL=http://localhost:8123
CHAT_SERVICE_URL=http://localhost:8124  
AI_SHARED_TOKEN=your-shared-secret-here
```

---

## Observability Features

- **Correlation ID**: Every request gets a UUID for tracing
- **Latency Tracking**: All responses include latency_ms
- **Session Tracking**: All interactions logged to twin_sessions table
- **Error Context**: Structured error responses with correlation IDs

This API is ready for immediate frontend integration and end-to-end testing!