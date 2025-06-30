# AI Models Guide - Khetika Ordering System

## 🤖 Available Models Comparison

### **1. GPT-4o Mini (Currently Used) ⭐ RECOMMENDED**
```json
{
  "model": "gpt-4o-mini",
  "rate_limits": {
    "TPM": "15,000 tokens per minute",
    "RPM": "500 requests per minute", 
    "RPD": "10,000 requests per day"
  },
  "cost": {
    "input": "$0.00015 per 1K tokens",
    "output": "$0.0006 per 1K tokens"
  },
  "best_for": "Most use cases, great balance of performance and limits",
  "quality": "Very good reasoning and response quality"
}
```

### **2. GPT-4o (Premium)**
```json
{
  "model": "gpt-4o",
  "rate_limits": {
    "TPM": "10,000 tokens per minute",
    "RPM": "500 requests per minute",
    "RPD": "5,000 requests per day"
  },
  "cost": {
    "input": "$0.0025 per 1K tokens",
    "output": "$0.01 per 1K tokens"
  },
  "best_for": "Advanced reasoning, complex tasks, highest quality",
  "quality": "Excellent reasoning and response quality"
}
```

### **3. GPT-3.5 Turbo (Legacy)**
```json
{
  "model": "gpt-3.5-turbo",
  "rate_limits": {
    "TPM": "40,000 tokens per minute",
    "RPM": "3 requests per minute",
    "RPD": "200 requests per day"
  },
  "cost": {
    "input": "$0.0005 per 1K tokens",
    "output": "$0.0015 per 1K tokens"
  },
  "best_for": "Simple tasks, legacy compatibility",
  "quality": "Good for basic tasks"
}
```

### **4. Claude 3 Haiku (Alternative)**
```json
{
  "model": "claude-3-haiku-20240307",
  "rate_limits": {
    "TPM": "50,000 tokens per minute",
    "RPM": "1,000 requests per minute",
    "RPD": "100,000 requests per day"
  },
  "cost": {
    "input": "$0.00025 per 1K tokens",
    "output": "$0.00125 per 1K tokens"
  },
  "best_for": "High volume, cost-effective, fast responses",
  "quality": "Good quality, very fast"
}
```

## 📊 Model Comparison Table

| Model | TPM | RPM | RPD | Input Cost | Output Cost | Quality | Best For |
|-------|-----|-----|-----|------------|-------------|---------|----------|
| **GPT-4o Mini** | 15,000 | 500 | 10,000 | $0.00015 | $0.0006 | ⭐⭐⭐⭐ | General use |
| **GPT-4o** | 10,000 | 500 | 5,000 | $0.0025 | $0.01 | ⭐⭐⭐⭐⭐ | Premium tasks |
| **GPT-3.5 Turbo** | 40,000 | 3 | 200 | $0.0005 | $0.0015 | ⭐⭐⭐ | Legacy |
| **Claude Haiku** | 50,000 | 1,000 | 100,000 | $0.00025 | $0.00125 | ⭐⭐⭐⭐ | High volume |

## 🔧 How to Switch Models

### **Option 1: Change in Code**
Edit `app/api/chat/route.ts` line 108:
```typescript
model: 'gpt-4o-mini', // Change this line
```

### **Option 2: Environment Variable**
Add to your `.env.local`:
```env
OPENAI_MODEL=gpt-4o-mini
```

Then update the code:
```typescript
model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
```

## 💰 Cost Analysis

### **Typical Chat Session (500 tokens)**
- **GPT-4o Mini:** ~$0.000375 (375 microcents)
- **GPT-4o:** ~$0.00625 (6.25 cents)
- **GPT-3.5 Turbo:** ~$0.001 (1 cent)
- **Claude Haiku:** ~$0.00075 (0.75 cents)

### **Monthly Usage (10,000 requests)**
- **GPT-4o Mini:** ~$7.50
- **GPT-4o:** ~$125
- **GPT-3.5 Turbo:** ~$20
- **Claude Haiku:** ~$15

## 🎯 Recommendations

### **For Khetika Ordering System:**

1. **Start with GPT-4o Mini** ⭐
   - Best balance of quality and cost
   - Good rate limits for business use
   - Reliable performance

2. **Upgrade to GPT-4o** if you need:
   - Better reasoning for complex queries
   - Higher quality responses
   - Advanced problem-solving

3. **Consider Claude Haiku** if you need:
   - Very high volume (100K+ requests/day)
   - Faster response times
   - Cost optimization

## 🚀 Implementation

### **Current Setup (GPT-4o Mini):**
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [...],
  temperature: 0.7,
  max_tokens: 500,
})
```

### **With Environment Variable:**
```typescript
const response = await openai.chat.completions.create({
  model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  messages: [...],
  temperature: 0.7,
  max_tokens: 500,
})
```

## 📈 Monitoring Usage

### **Check Your Usage:**
1. Go to: https://platform.openai.com/usage
2. Monitor your token consumption
3. Track costs and rate limits

### **Set Up Alerts:**
- Configure billing alerts in OpenAI dashboard
- Monitor rate limit usage
- Set up cost thresholds

## 🔒 Security Notes

- **Never commit API keys** to Git
- Use environment variables in production
- Monitor API usage regularly
- Set up billing alerts

## 📞 Support

- **OpenAI Docs:** https://platform.openai.com/docs
- **Rate Limits:** https://platform.openai.com/docs/guides/rate-limits
- **Pricing:** https://openai.com/pricing

---

**Current Configuration:** Using GPT-4o Mini with 15,000 TPM, 500 RPM, and 10,000 RPD limits. 