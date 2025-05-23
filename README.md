# MERN Stack Kubernetes Deployment

This repository contains Kubernetes manifests for deploying a production-ready MERN stack application.

## Prerequisites

- Kubernetes cluster
- kubectl configured to access your cluster
- Docker images pushed to your registry:
  - yourdockerhub/mern-backend:v1
  - yourdockerhub/mern-frontend:v1

## Deployment Steps

1. Create the namespace:
```bash
kubectl apply -f k8s/namespace.yaml
```

2. Deploy MongoDB:
```bash
kubectl apply -f k8s/mongodb/
```

3. Deploy Backend:
```bash
kubectl apply -f k8s/backend/
```

4. Deploy Frontend:
```bash
kubectl apply -f k8s/frontend/
```

## Verification Steps

1. Check all resources:
```bash
kubectl get pods,svc,pvc -n mern-stack
```

2. Check MongoDB is running:
```bash
kubectl get pods -n mern-stack -l app=mongodb
```

3. Check Backend logs (including sidecar):
```bash
# Get the backend pod name
kubectl get pods -n mern-stack -l app=backend
# Check main container logs
kubectl logs -n mern-stack <backend-pod-name> -c backend
# Check sidecar logs
kubectl logs -n mern-stack <backend-pod-name> -c sidecar
```

4. Access the application:
- The frontend will be available at: `http://<node-ip>:30007`

## Rolling Updates

To update the frontend to v2:
```bash
kubectl set image deployment/frontend frontend=yourdockerhub/mern-frontend:v2 -n mern-stack
```

Monitor the rollout:
```bash
kubectl rollout status deployment/frontend -n mern-stack
```

Rollback if needed:
```bash
kubectl rollout undo deployment/frontend -n mern-stack
```

## Architecture

- MongoDB: Internal service (mongodb-service:27017)
- Backend: Internal service (backend-service:5000)
- Frontend: NodePort service (30007)
- Persistence: 1Gi PVC for MongoDB
- Security: Secrets for MongoDB credentials and connection string
- Configuration: ConfigMap for frontend API URL
- Monitoring: Sidecar container for backend logs 