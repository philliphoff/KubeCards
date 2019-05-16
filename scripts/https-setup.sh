#!/bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"

# Install the cert-manager CRDs. We must do this before installing the Helm
# chart in the next step for `release-0.8` of cert-manager:
kubectl apply -f https://raw.githubusercontent.com/jetstack/cert-manager/release-0.8/deploy/manifests/00-crds.yaml

# Create cert-manager namespace and issuer
helm install ../charts/kube-cards-cert-manager

## Add the Jetstack Helm repository
helm repo add jetstack https://charts.jetstack.io

## Updating the repo just incase it already existed
helm repo update

## Install the cert-manager helm chart
helm install --name cert-manager --namespace cert-manager jetstack/cert-manager
