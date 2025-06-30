# AI Models Guide - Khetika Ordering System

## 🤖 Available Models Comparison

### **1. GPT-4o Mini (Currently Used) ⭐ RECOMMENDED**
- **Rate Limits:** 15,000 TPM, 500 RPM, 10,000 RPD
- **Cost:** $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
- **Best for:** Most use cases, great balance of performance and limits
- **Quality:** Very good reasoning and response quality

### **2. GPT-4o (Premium)**
- **Rate Limits:** 10,000 TPM, 500 RPM, 5,000 RPD
- **Cost:** $0.0025 per 1K input tokens, $0.01 per 1K output tokens
- **Best for:** Advanced reasoning, complex tasks, highest quality
- **Quality:** Excellent reasoning and response quality

### **3. GPT-3.5 Turbo (Legacy)**
- **Rate Limits:** 40,000 TPM, 3 RPM, 200 RPD
- **Cost:** $0.0005 per 1K input tokens, $0.0015 per 1K output tokens
- **Best for:** Simple tasks, legacy compatibility
- **Quality:** Good for basic tasks

### **4. Claude 3 Haiku (Alternative)**
- **Rate Limits:** 50,000 TPM, 1,000 RPM, 100,000 RPD
- **Cost:** $0.00025 per 1K input tokens, $0.00125 per 1K output tokens
- **Best for:** High volume, cost-effective, fast responses
- **Quality:** Good quality, very fast

## 📊 Model Comparison Table

| Model | TPM | RPM | RPD | Input Cost | Output Cost | Quality | Best For |
|-------|-----|-----|-----|------------|-------------|---------|----------|
| **GPT-4o Mini** | 15,000 | 500 | 10,000 | $0.00015 | $0.0006 | ⭐⭐⭐⭐ | General use |
| **GPT-4o** | 10,000 | 500 | 5,000 | $0.0025 | $0.01 | ⭐⭐⭐⭐⭐ | Premium tasks |
| **GPT-3.5 Turbo** | 40,000 | 3 | 200 | $0.0005 | $0.0015 | ⭐⭐⭐ | Legacy |
| **Claude Haiku** | 50,000 | 1,000 | 100,000 | $0.00025 | $0.00125 | ⭐⭐⭐⭐ | High volume |

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

## 🔧 How to Switch Models

### **Option 1: Change in Code**
Edit `app/api/chat/route.ts`:
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

## 📈 Monitoring Usage

### **Check Your Usage:**
1. Go to: https://platform.openai.com/usage
2. Monitor your token consumption
3. Track costs and rate limits

---

**Current Configuration:** Using GPT-4o Mini with 15,000 TPM, 500 RPM, and 10,000 RPD limits. 