#!/bin/bash

# Create a namespace for your ingress resources
kubectl create namespace ingress-basic

# Use Helm to deploy an NGINX ingress controller (to same namespace as ingress resource)
helm install stable/nginx-ingress --set controller.replicaCount=2
