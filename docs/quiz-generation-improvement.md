# Quiz Generation Improvement Plan

**Project:** 72X — Empowering South African Entrepreneurs  
**Feature:** AI-Generated Learning Material Quizzes  
**Date:** April 2026  
**Status:** Under Review

---

## Problem Statement

The current quiz generation produces low-quality questions like:

> *"Sales is an important term in Marketing and Sales. True or False?"*

This happens because the AI is given a raw text dump and no guidance on how to reason about it. The model falls back to **word frequency** — it sees "sales" 47 times and generates a question about "sales". The question tests nothing. A learner who never read the material could answer it correctly.

The fallback system (used when AI fails) is even worse — it is literally a word frequency counter that generates template sentences like:

> *"______ is a key concept in [title]."*  
> *"[term] is an important concept in [title]. True or False?"*

---

## Root Cause

### 1. The prompt dumps raw text with no reasoning instruction

```
"Based on the following learning material, generate 20 quiz questions.
CONTENT: [8000 characters of raw text]"
```

The model is told *what format* to return but not *how to think* about the content. No instruction to identify concepts, no instruction to test comprehension vs. recognition.

### 2. The fallback is a word frequency counter

`extractKeyTerms()` counts how many times each word appears and picks the top 20. These become the "key concepts". This is why you get questions about the most repeated word, not the most important idea.

### 3. Content is truncated at 8000 characters

Long documents get cut off. The model only sees the beginning of the material, so questions cluster around the introduction rather than covering the full content.

---

## Two Approaches

### Option A — Fix the Prompt (Spring Boot Only)

**What changes:** One file — `QuizGenerationService.java`  
**Time to implement:** Hours  
**Infrastructure needed:** Nothing new

#### How it works

Instead of one giant prompt with all the text, the content is preprocessed in Java and sent as focused, structured prompts.

**Step 1 — Chunk the document into paragraphs**

Split the raw text into meaningful paragraphs. Filter out short or noisy chunks (headers, single lines, etc.). This ensures each question is grounded in a specific passage, not the whole document.

**Step 2 — Score each chunk for information density**

Pick the most information-dense paragraph per section — the one with the most nouns and least filler words. Simple Java string scoring, no ML needed.

**Step 3 — Send one focused prompt per chunk**

Instead of one prompt with 8000 characters, send smaller prompts like:

```
You are an educational assessment expert.

Read this specific passage:
"Customer acquisition cost (CAC) measures the total spend required
to acquire one new paying customer, including marketing and sales costs."

Generate ONE multiple choice question that:
- Tests whether the learner understands what CAC measures
- CANNOT be answered by someone who has not read this passage
- Has one clearly correct answer and three plausible wrong answers
- Is NOT a true/false about whether the term exists

Return JSON only:
{
  "question": "",
  "correct": "",
  "distractors": ["", "", ""]
}
```

**Step 4 — Collect responses and assemble the quiz**

Gather all question responses, validate them, deduplicate, and assemble the final quiz.

#### What this fixes

| Before | After |
|---|---|
| "Sales is important — True or False?" | "What does CAC measure in a marketing budget?" |
| Questions based on word frequency | Questions based on passage meaning |
| One giant prompt, unreliable JSON | Small focused prompts, reliable JSON |
| Fallback = word frequency template | Fallback = skip the chunk |
| All questions from first 8000 chars | Questions spread across full document |

#### What this cannot do

- Cannot run local ML models — still depends on OpenAI API
- Cannot fine-tune anything
- Cannot validate question quality semantically
- 20 questions = multiple API calls (cost consideration)
- Still limited by what the LLM "understands" without domain training

---

### Option B — Python Microservice

**What changes:** New service added to the architecture  
**Time to implement:** Days to weeks  
**Infrastructure needed:** Docker container, deployment pipeline

#### How it works

A separate Python/Django service that Spring Boot calls via HTTP. Spring Boot sends the document text, Python returns structured questions.

```
Spring Boot  ──POST /generate──▶  Python Service  ──▶  ML Models
     ◀──────── JSON questions ──────────────────────────────────
```

#### Inside the Python service

**Step 1 — Semantic chunking**

Uses `sentence-transformers` to group sentences by *meaning*, not just paragraph breaks. Sentences about the same concept end up in the same chunk even if they are paragraphs apart.

```python
# "Customer acquisition cost..." and "CAC is calculated by..."
# end up in the same chunk — they are semantically related
```

**Step 2 — Key concept extraction with spaCy**

Extracts named entities, noun phrases, and relationships. Understands that "CAC" and "customer acquisition cost" are the same thing. Does not rely on word frequency.

```python
# Extracts: "customer acquisition cost", "total marketing spend", "conversion rate"
# NOT: "cost cost cost cost" from frequency counting
```

**Step 3 — Question generation with fine-tuned T5**

Uses `t5-base` fine-tuned on the SQuAD (Stanford Question Answering Dataset). This model was trained specifically on reading comprehension — given a passage and an answer, it generates the question that leads to that answer.

```python
# Input:  passage + answer concept
# Output: a comprehension question about that concept
# Trained on 100,000+ reading comprehension examples
```

**Step 4 — Distractor generation**

Uses WordNet or a second model to generate plausible wrong answers. For a question about CAC, distractors are other financial metrics — not random words.

**Step 5 — Quality filtering**

Semantic similarity check: is the question actually answerable from the passage? Filters out questions that are too easy, too vague, or duplicates before returning them.

#### What this adds over the Spring fix

| Capability | Spring Fix | Python Service |
|---|---|---|
| Local ML models (no API cost) | ❌ | ✅ |
| Fine-tuned for reading comprehension | ❌ | ✅ |
| Semantic concept understanding | ❌ | ✅ |
| Quality validation before returning | ❌ | ✅ |
| Works offline, no rate limits | ❌ | ✅ |
| Can be improved over time | Limited | ✅ Fine-tunable |

#### Architecture with microservices (your side project pattern)

This is the same reasoning you applied to your side project:

> *"Use the right tool for each job. NestJS for APIs, Python for ML, Go for search."*

Applied to 72X:

```
┌─────────────────┐     ┌──────────────────────┐
│  Spring Boot    │────▶│  Python/Django       │
│  (main API)     │     │  (quiz microservice) │
│                 │◀────│                      │
└─────────────────┘     └──────────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    ▼             ▼             ▼
               spaCy NLP      T5 Model     sentence-
               (concepts)   (questions)  transformers
                                         (chunking)
```

In Docker Compose:

```yaml
services:
  springboot-api:
    # existing backend
  python-quiz:
    # new quiz microservice
    # Spring Boot calls http://python-quiz:8000/generate
  postgres:
    # shared database
```

---

## Comparison

| Factor | Spring Prompt Fix | Python Microservice |
|---|---|---|
| Time to implement | Hours | Days to weeks |
| New infrastructure | None | New service + Docker |
| Question quality | Good | Excellent |
| API cost | Still per-call | Near zero after setup |
| Works offline | No | Yes |
| Fine-tunable | No | Yes |
| Maintenance overhead | Low | Medium |
| Right for 72X right now | ✅ Yes | ⏳ Plan for later |

---

## Recommendation

### Phase 1 — Now (Spring prompt fix)

Fix `QuizGenerationService.java`:
- Replace the single raw-text prompt with chunked, focused prompts
- Add a system instruction that forces comprehension questions
- Replace the word-frequency fallback with a "skip chunk" fallback
- Spread questions across the full document, not just the first 8000 characters

**Expected outcome:** Questions go from word-recognition to comprehension-based. The "sales is important — True or False?" problem is eliminated.

### Phase 2 — When Docker infrastructure is in place

Build the Python quiz microservice:
- Django REST API with a `/generate` endpoint
- spaCy for concept extraction
- T5-base fine-tuned on SQuAD for question generation
- Quality filtering before returning questions
- Spring Boot calls it via HTTP — no changes to the frontend

**Expected outcome:** Questions are semantically grounded, validated, and generated without OpenAI API dependency.

---

## Files Affected

### Phase 1
- `72X_Applicants_Backend/src/main/java/_X/Applicants/Backend/service/QuizGenerationService.java`
  - `generateQuestionsWithAI()` — replace prompt
  - `generateFallbackQuestions()` — replace word-frequency logic
  - `extractKeyTerms()` — replace or remove

### Phase 2 (new files)
- `quiz-service/` — new Python/Django project
- `quiz-service/Dockerfile`
- `docker-compose.yml` — add `python-quiz` service
- `QuizGenerationService.java` — add HTTP call to Python service with Spring fallback

---

## References

- [SQuAD Dataset](https://rajpurkar.github.io/SQuAD-explorer/) — Stanford Question Answering Dataset used to fine-tune T5
- [Hugging Face T5](https://huggingface.co/t5-base) — Base model for question generation
- [spaCy](https://spacy.io/) — NLP library for concept extraction
- [sentence-transformers](https://www.sbert.net/) — Semantic chunking and similarity scoring
- Current implementation: `QuizGenerationService.java` (2467 lines)
