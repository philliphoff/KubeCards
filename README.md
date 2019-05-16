# KubeCards

## Deployment

### Via Helm to AKS with RBAC

To deploy to an AKS cluster with RBAC using Helm, you must:

  1. Create a service account with appropriate cluster permissions to be used by the Tiller service.

  ```
  > kubectl create -f charts/tiller-service-account.yaml
  ```

  2. Install the Tiller service configured to use the service account.

  ```
  > helm init --service-account tiller
  ```

  3. Setup certificate management.

  ```
  > ./scripts/https-setup.sh
  ```

  4. Install the application.

  ```
  > helm install charts/kube-cards
  ```