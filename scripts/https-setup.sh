
# Install the cert-manager CRDs. We must do this before installing the Helm
# chart in the next step for `release-0.8` of cert-manager:
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml

# Create cert-manager namespace
kubectl create namespace cert-manager

## IMPORTANT: if the cert-manager namespace **already exists**, you MUST ensure
## it has an additional label on it in order for the deployment to succeed
kubectl label namespace cert-manager certmanager.k8s.io/disable-validation="true"

## Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io
## Updating the repo just incase it already existed
helm repo update

## Install the cert-manager helm chart
helm install --name cert-manager --namespace cert-manager jetstack/cert-manager

# Create issuer
kubectl apply -f ../charts/cluster-issuer.yaml
