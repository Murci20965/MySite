# Transfer Learning on a Budget: Pneumonia Detection with ResNet50

*Nhlanhla "Murci" Mokoena · August 2026 · From the [Medical Image Classifier](https://github.com/Murci20965/medical_image_classifier) project*

---

I built a chest X-ray classifier that separates pneumonia from normal scans at **82.85% test
accuracy** — with **0.96 recall and 0.91 precision** for pneumonia. The interesting part isn't
the architecture. It's the two decisions behind it: borrowing knowledge instead of training from
scratch, and choosing *which way* to be wrong.

## Transfer learning: start from someone else's million images

Training a convolutional network from scratch needs data and compute I don't have — and doesn't
need to happen. **ResNet50 pretrained on ImageNet** already knows edges, textures, gradients and
shapes; the early layers of vision models are remarkably general. I keep that visual foundation
and retrain the top of the network on X-rays, so my labelled medical images teach the model only
what's genuinely domain-specific.

This is the highest-leverage technique in applied deep learning: most real problems are
fine-tuning problems wearing a "train a model" costume.

## Recall over precision — a deliberate imbalance

In medical screening, the two error types are not symmetric:

- A **false positive** (flagging a healthy lung) costs a follow-up review by a human.
- A **false negative** (missing pneumonia) costs a patient their diagnosis.

So the model is tuned toward **recall (0.96)**: it catches 96% of pneumonia cases, accepting
somewhat more false alarms (precision 0.91) as the price. Headline accuracy blurs this trade-off
away — which is exactly why "what should the confusion matrix look like?" is a *product*
question, answered by the use case, before it's a modelling question.

## The MLOps wrapper

Same discipline as every project I ship: a **FastAPI** inference service exposes the model over
HTTP, an interactive UI lets non-technical users drop in an image and see the verdict, and
**Docker** makes the whole thing reproducible on any machine. From training and evaluation through
to a deployment-ready application — the pipeline is the deliverable, the model is one component
inside it.

## Honest limits

This is a portfolio system, not a medical device: single public dataset, no clinical validation,
no regulatory review. Its purpose is to demonstrate the *shape* of responsible applied ML —
pretrained backbone, use-case-driven metrics, reproducible serving — on a problem where the
stakes make the reasoning vivid.

**Plain-language version:** instead of teaching a computer to see from zero, I started with one
that already understood pictures and taught it the last mile: what pneumonia looks like on an
X-ray. Then I tuned it to behave like a careful doctor — better to double-check a healthy patient
than to miss a sick one — and packaged it so anyone can run it with one command.
