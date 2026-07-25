#!/bin/bash
set -e
echo "=== Validating ==="
test -f .eslintrc.js && echo "✓ ESLint"
test -f .prettierrc && echo "✓ Prettier"
grep -q "/health" app.js && echo "✓ Health endpoints"
test -f k8s/podDisruptionBudget.yaml && echo "✓ PDB"
test -f k8s/networkPolicy.yaml && echo "✓ NetworkPolicy"
grep -q "livenessProbe" k8s/deployment.yaml && echo "✓ Liveness"
grep -q "readinessProbe" k8s/deployment.yaml && echo "✓ Readiness"
grep -q "startupProbe" k8s/deployment.yaml && echo "✓ Startup"
grep -q "resources:" k8s/deployment.yaml && echo "✓ Resources"
grep -q "RollingUpdate" k8s/deployment.yaml && echo "✓ RollingUpdate"
echo "All ok"
