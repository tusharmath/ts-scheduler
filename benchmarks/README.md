# Benchmarks

## Nested

```bash
node benchmarks/MeasureNestedAsap.js
asap x 1,170 ops/sec ±1.82% (78 runs sampled)
```

## Parallel

```bash
node benchmarks/MeasureParallel.js
parallel x 1,133 ops/sec ±3.03% (80 runs sampled)
```

## Cancellations

```bash
node benchmarks/MeasureCancellation.js
cancel x 206,648 ops/sec ±43.97% (67 runs sampled)
```
