# R² Isn't the Finish Line: Shipping an XGBoost Model with CI/CD

*Nhlanhla "Murci" Mokoena · August 2026 · From the [Real Estate Price Predictor](https://github.com/Murci20965/real_estate_price_predictor) project*

---

My real-estate price model reaches **R² = 0.9037 with RMSE = 0.1341 on unseen test data**. For a
long time I would have called that "done." This project is about everything that happens after
the metric — because a model that lives in a notebook predicts nothing for anybody.

## The gap between a good model and a real system

Gradient boosting (XGBoost) did the statistical heavy lifting: it handles tabular data's messy
non-linearities and interactions with minimal ceremony, which is why it remains the sane default
for this class of problem. But the model artifact is maybe a tenth of the repository. The rest is
the machinery that makes it dependable:

- **A FastAPI inference service** wraps the model in a versioned HTTP contract, so "using the
  model" means calling an endpoint, not importing a pickle and praying the pandas versions match.
- **Docker** freezes the entire runtime — Python, libraries, model file — into one reproducible
  image. The training environment and the serving environment can no longer drift apart silently.
- **GitHub Actions CI/CD** runs the pipeline on every push. If a change breaks the build or the
  tests, I find out in minutes, from a log, instead of weeks later, from a user.

## Why bother, for a portfolio project?

Because the habits are the product. The workflow — train, evaluate, containerise, test, deploy —
is identical at any scale; only the numbers get bigger. Practising it on a project I fully own
means I've hit the real failure modes (dependency drift, environment mismatch, "it worked
yesterday") in a place where they're cheap.

The deeper lesson: **evaluation metrics describe the model, not the system.** R² says nothing
about whether the service starts, whether the same preprocessing runs in training and serving, or
whether the next commit quietly breaks inference. Those properties come from engineering, and
they're the ones users actually experience.

## The checklist I now apply to every ML project

1. Metrics on *unseen* data, reported honestly — no test-set leakage, no cherry-picking.
2. An API contract in front of the model, with validation on inputs.
3. One container that runs anywhere.
4. CI that would catch the embarrassing failure before anyone else sees it.

**Plain-language version:** getting a model to score well is like baking one great cake. Shipping
a model is opening a bakery — same recipe every time, ovens that behave, and someone checking
quality before anything reaches the counter. This project was me building the bakery, not just
the cake.
